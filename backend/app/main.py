from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from backend.app.models import Skill, SkillsResponse

app = FastAPI()

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
