from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship

from .db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    scores = relationship("Score", back_populates="user", cascade="all, delete-orphan")
    quiz_votes = relationship("QuizVote", back_populates="user", cascade="all, delete-orphan")
    timer_history = relationship("TimerHistory", back_populates="user", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<User id={self.id} username='{self.username}' email='{self.email}'>"


class Score(Base):
    __tablename__ = "scores"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    game_name = Column(String(50), nullable=False, index=True)
    score = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="scores")

    def __repr__(self) -> str:
        return f"<Score id={self.id} game='{self.game_name}' score={self.score}>"



class QuizQuestion(Base):
    __tablename__ = "quiz_questions"

    id = Column(Integer, primary_key=True, index=True)
    question = Column(String(255), nullable=False)
    option_a = Column(String(100), nullable=False)
    option_b = Column(String(100), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    votes = relationship("QuizVote", back_populates="question", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<QuizQuestion id={self.id} question='{self.question}'>"


class QuizVote(Base):
    __tablename__ = "quiz_votes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    question_id = Column(Integer, ForeignKey("quiz_questions.id", ondelete="CASCADE"), nullable=False, index=True)
    chosen_option = Column(String(1), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="quiz_votes")
    question = relationship("QuizQuestion", back_populates="votes")

    def __repr__(self) -> str:
        return f"<QuizVote id={self.id} question_id={self.question_id} option='{self.chosen_option}'>"


class WikiPage(Base):
    __tablename__ = "wiki_pages"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False, unique=True, index=True)
    slug = Column(String(150), nullable=False, unique=True, index=True)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


    def __repr__(self) -> str:
        return f"<WikiPage id={self.id} slug='{self.slug}'>"


class TimerHistory(Base):
    __tablename__ = "timer_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    started_at = Column(DateTime(timezone=True), nullable=False)
    ended_at = Column(DateTime(timezone=True), nullable=True)
    duration_seconds = Column(Integer, nullable=True)

    user = relationship("User", back_populates="timer_history")

    def __repr__(self) -> str:
        return f"<TimerHistory id={self.id} user_id={self.user_id}>"