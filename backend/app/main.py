from itertools import groupby
from typing import Literal

import openai
from fastapi import Body, FastAPI
from pydantic import BaseModel
from starlette.middleware.cors import CORSMiddleware

from app.consts import CITIES, HOBBIES, PROFESSIONS, SKILLS
from app.models import (
    CitiesResponse,
    City,
    FacetedQueryBody,
    HobbiesResponse,
    Hobby,
    Profession,
    ProfessionForHobbiesBody,
    ProfessionsResponse,
    QueryBody,
    Skill,
    SkillsResponse,
)
from app.queries import create_es_instance, faceted_search, simple_query

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


es = create_es_instance(use_pass=False)


@app.get("/skills")
async def skills(skill_name: str = ""):
    """Return a list of skills."""
    return SkillsResponse(
        skills=[
            Skill(name=skill)
            for skill in SKILLS
            if skill.lower().startswith(skill_name.lower())
        ]
    )


@app.get("/professions")
async def professions():
    """Return a list of professions."""
    return ProfessionsResponse(
        professions=[Profession(name=profession) for profession in PROFESSIONS]
    )


@app.get("/hobbies")
async def hobbies():
    """Return a list of hobbies."""
    return HobbiesResponse(hobbies=[Hobby(name=hobby) for hobby in HOBBIES])


@app.post("/professions-for-hobbies")
async def professions_for_hobbies(data: ProfessionForHobbiesBody = Body(...)):
    """Return a list of professions for a given list of hobbies."""
    return ProfessionsResponse(
        professions=list(
            itertools.chain.from_iterable(
                [PROFESSIONS[hobby] for hobby in data.hobbies]
                for hobby in data.hobbies
                if hobby in PROFESSIONS
            )
        )
    )


@app.get("/cities")
async def cities():
    """Return a list of cities."""
    return CitiesResponse(cities=[City(name=name) for name in CITIES])


@app.post("/search")
async def main_search(input_query: QueryBody = Body(...)):
    """Return a list of courses for a given query."""
    res = [
        {
            **sub_result["_source"],
            "score": sub_result["_score"],
            "highlighted": sub_result["highlight"]["syllabus"][0],
        }
        for sub_result in simple_query(es=es, query_input=input_query.query)
    ]
    final_results = [
        list(group)[0]
        for _, group in groupby(
            sorted(res, key=lambda x: x["name"]), lambda x: x["name"]
        )
    ]
    return {"results": final_results}


@app.post("/facet-search")
async def facet_search(input_query: FacetedQueryBody = Body(...)):
    """Return a list of courses for a given query."""
    res = [
        {
            **sub_result["_source"],
            "score": sub_result["_score"],
            "highlighted": sub_result["highlight"]["syllabus"][0],
        }
        for sub_result in faceted_search(es=es, body=input_query)
    ]
    final_results = [
        list(group)[0]
        for _, group in groupby(
            sorted(res, key=lambda x: x["name"]), lambda x: x["name"]
        )
    ]
    return {"results": final_results}


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    body: str


class ChatUserData(BaseModel):
    skills: list[str]
    professions: list[str]


class ChatHistory(BaseModel):
    history: list[ChatMessage]
    user_data: ChatUserData


@app.post("/chat")
async def chat(body: ChatHistory = Body(...)):
    """Return a list of courses for a given query."""
    PROMPT = f"""
    Jesteś pomicnym asystentem wspomamagającym wybór kierunku studiów.
    Musisz wspomoc użytkownika w wyborze kierunku studiów oraz w zrozumieniu dlaczego wybrany kierunek jest najlepszy.

    Użytkownik zaznaczył, że ma następujące umiejętności: {', '.join(body.user_data.skills)}
    Użytkownik zaznaczył, że ma następujące zainteresowania zawodowe: {', '.join(body.user_data.professions)}

    MUSISZ się dowiiedzieć:
    - jakie ma doświadczenie
    - czego oczekuje od studiów
    - jakie ma zainteresowania
    - jakie ma umiejętności
    - czym chciałby się zajmować w przyszłości

    Jeżeli uważasz, że umiętności lub zainteresowania użytkownika nie odpowiadają podanym przez niego
    zainteresowaniom zawodowym, możesz zaproponować mu inne zainteresowania zawodowe.

    Na podstawie tych informacji musisz zasugerować mu w jakim kierunku powinien się rozwijać.
    Zacznij rozmowę od propozycji wsparcia użytkownika w wyborze kierunku studiów. Bądż uprzejmy i pomocny.
    Wypowiadaj się w sposób krótki i zwięzły
    """
    messages = [
        {"role": "system", "content": PROMPT},
        *({"role": message.role, "content": message.body} for message in body.history),
    ]
    completion = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=messages)
    return ChatMessage(role="assistant", body=completion.choices[0].message.content)
