from pydantic import BaseModel


class Skill(BaseModel):
    name: str


class SkillsResponse(BaseModel):
    skills: list[Skill]
