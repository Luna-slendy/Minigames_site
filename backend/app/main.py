from fastapi import Depends, FastAPI
from sqlalchemy import text
from sqlalchemy.orm import Session

from .db import Base, engine, get_db
from . import models

from . import schemas

app = FastAPI(title="Minigames Site API")


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {"message": "Minigames Site API is running"}


@app.get("/ping")
def ping():
    return {"ok": True}


@app.get("/db-check")
def db_check(db: Session = Depends(get_db)):
    db.execute(text("SELECT 1"))
    return {"database": "connected"}

@app.post("/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(
        (models.User.email == user.email) |
        (models.User.username == user.username)
    ).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email or username already used")

    new_user = models.User(
        email=user.email,
        username=user.username,
        password_hash=user.password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@app.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(
        models.User.email == user.email
    ).first()

    if not existing_user:
        raise HTTPException(status_code=404, detail="You are not found")

    if existing_user.password_hash != user.password:
        raise HTTPException(status_code=400, detail="Incorrect password")

    return {
        "message": "Success",
        "user": {
            "id": existing_user.id,
            "email": existing_user.email,
            "username": existing_user.username
        }
    }