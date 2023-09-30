from fastapi import FastAPI

from backend.app.models import SkillResponse

app = FastAPI()


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
    return [
        SkillResponse(name=skill)
        for skill in SKILLS
        if skill.lower().startswith(skill_name.lower())
    ]
