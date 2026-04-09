from pydantic import BaseModel, EmailStr
from typing import Optional


# ----------------------
# USER
# ----------------------

class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    username: str

    class Config:
        from_attributes = True


# ----------------------
# SCORE
# ----------------------

class ScoreCreate(BaseModel):
    game_name: str
    score: int


class ScoreResponse(BaseModel):
    id: int
    user_id: int
    game_name: str
    score: int

    class Config:
        from_attributes = True


# ----------------------
# QUIZ
# ----------------------

class QuizQuestionCreate(BaseModel):
    question: str
    option_a: str
    option_b: str


class QuizQuestionResponse(BaseModel):
    id: int
    question: str
    option_a: str
    option_b: str

    class Config:
        from_attributes = True


class QuizVote(BaseModel):
    question_id: int
    chosen_option: str


# ----------------------
# WIKI
# ----------------------

class WikiPageCreate(BaseModel):
    title: str
    content: str
    slug: str


class WikiPageResponse(BaseModel):
    id: int
    title: str
    content: str
    slug: str

    class Config:
        from_attributes = True