from fastapi import Body, FastAPI
from starlette.middleware.cors import CORSMiddleware

from app.models import (
    CitiesResponse,
    City,
    FreeSearchResponse,
    HobbiesResponse,
    Hobby,
    KierunekResult,
    Profession,
    ProfessionForHobbiesBody,
    ProfessionsResponse,
    QueryBody,
    Skill,
    SkillsResponse,
)
from backend.app.queries import create_es_instance, simple_query

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


SKILLS = [
    "Python",
    "Java",
    "JavaScript",
    "C++",
    "Ruby",
    "Rust",
    "Go",
    "Kotlin",
]


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


PROFESSIONS = [
    "Software Engineer",
    "DevOps Engineer",
    "Site Reliability Engineer",
    "Data Engineer",
    "Data Scientist",
    "Machine Learning Engineer",
    "Product Manager",
]


@app.get("/professions")
async def professions():
    """Return a list of professions."""
    return ProfessionsResponse(
        professions=[Profession(name=profession) for profession in PROFESSIONS]
    )


HOBBIES = [
    "Biking",
    "Hiking",
    "Swimming",
    "Running",
    "Reading",
    "Writing",
    "Drawing",
    "Painting",
]


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
            KierunekResult(
                kierunek=sub_result["_source"]["kierunek"],
                przedmiot=sub_result["_source"]["przedmiot"],
                syllabus=sub_result["_source"]["syllabus"],
                score=sub_result["_score"],
            )
        )
    return FreeSearchResponse(res)
