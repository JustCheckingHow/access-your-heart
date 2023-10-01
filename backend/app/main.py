from itertools import groupby
from typing import Literal

import openai
from fastapi import Body, FastAPI
from pydantic import BaseModel
from starlette.middleware.cors import CORSMiddleware

from app.consts import HOBBIES, PROFESSIONS, SKILLS
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

es = create_es_instance(use_pass=False)

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
        professions=[Profession(name=profession) for profession in PROFESSIONS]
    )


@app.get("/cities")
async def cities():
    """Return a list of cities."""
    return CitiesResponse(
        cities=[
            City(name="San Francisco"),
            City(name="New York"),
            City(name="Los Angeles"),
        ]
    )


@app.post("/search")
async def main_search(input_query: QueryBody = Body(...)):
    """Return a list of courses for a given query."""
    res = []
    for sub_result in simple_query(es=es, query_input=input_query.query):
        res.append(
            {
                **sub_result["_source"],
                "score": sub_result["_score"],
            }
        )
    # deduplicate results
    final_results = []
    for _, group in groupby(sorted(res, key=lambda x: x["name"]), lambda x: x["name"]):
        final_results.append(list(group)[0])
    return {"results": final_results}


@app.post("/facet-search")
async def facet_search(input_query: FacetedQueryBody = Body(...)):
    """Return a list of courses for a given query."""
    res = []
    for sub_result in faceted_search(es=es, body=input_query):
        res.append(
            {
                **sub_result["_source"],
                "score": sub_result["_score"],
            }
        )
    final_results = []
    for _, group in groupby(sorted(res, key=lambda x: x["name"]), lambda x: x["name"]):
        final_results.append(list(group)[0])
    return {"results": final_results}


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    body: str


class ChatHistory(BaseModel):
    history: list[ChatMessage]


@app.post("/chat")
async def chat(body: ChatHistory = Body(...)):
    """Return a list of courses for a given query."""
    PROMPT = """
    Jesteś pomicnym asystentem wspomamagającym wybór kierunku studiów.
    Musisz wspomoc użytkownika w wyborze kierunku studiów oraz w zrozumieniu dlaczego wybrany kierunek jest najlepszy.

    MUSISZ się dowiiedzieć:
    - jakie ma zainteresowania
    - jakie ma umiejętności
    - jakie ma doświadczenie
    - jakie ma hobby
    - jakie ma preferencje co do miasta
    - jakie ma preferencje co do zarobków
    - jakie ma preferencje co do czasu pracy
    - jakie ma preferencje co do czasu wolnego

    Na podstawie tych informacji musisz zasuugerować mu w jakim kierunku powinien się rozwijać.
    """
    messages = [
        {"role": "system", "content": PROMPT},
        *({"role": message.role, "content": message.body} for message in body.history),
    ]
    completion = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=messages)
    return ChatMessage(role="assistant", body=completion.choices[0].message.content)
