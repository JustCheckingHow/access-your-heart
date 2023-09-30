from pydantic import BaseModel


class Skill(BaseModel):
    name: str


class Profession(BaseModel):
    name: str


class SkillsResponse(BaseModel):
    skills: list[Skill]


class ProfessionsResponse(BaseModel):
    professions: list[Profession]


class Hobby(BaseModel):
    name: str


class HobbiesResponse(BaseModel):
    hobbies: list[Hobby]


class ProfessionForHobbiesBody(HobbiesResponse):
    pass


class City(BaseModel):
    name: str


class CitiesResponse(BaseModel):
    cities: list[City]


class QueryBody(BaseModel):
    query: str


class KierunekResult(BaseModel):
    kierunek: str
    przedmiot: str
    syllabus: str
    score: float


class FreeSearchResponse(BaseModel):
    results: list[KierunekResult]
