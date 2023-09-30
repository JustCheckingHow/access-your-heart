from pydantic import BaseModel


class SkillResponse(BaseModel):
    name: str
