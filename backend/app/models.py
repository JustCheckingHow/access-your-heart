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
