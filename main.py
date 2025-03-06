from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Float, Integer
from sqlalchemy.orm import sessionmaker, declarative_base

# SQLite for local development (use PostgreSQL for production)
DATABASE_URL = "sqlite:///./votes.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

app = FastAPI()

# Database Model
class Vote(Base):
    __tablename__ = "votes"
    id = Column(Integer, primary_key=True, index=True)
    temperature = Column(Float, nullable=False)

Base.metadata.create_all(bind=engine)

# Pydantic Model
class VoteCreate(BaseModel):
    temperature: float

@app.post("/vote/")
def submit_vote(vote: VoteCreate):
    db = SessionLocal()
    new_vote = Vote(temperature=vote.temperature)
    db.add(new_vote)
    db.commit()
    db.refresh(new_vote)
    db.close()
    return {"message": "Vote recorded", "temperature": new_vote.temperature}

@app.get("/average/")
def get_average_temp():
    db = SessionLocal()
    avg_temp = db.query(Vote.temperature).all()
    db.close()
    if not avg_temp:
        raise HTTPException(status_code=404, detail="No votes recorded yet")
    avg = sum(t[0] for t in avg_temp) / len(avg_temp)
    return {"average_temperature": round(avg, 1)}



import random
from fastapi import FastAPI

app = FastAPI()

@app.get("/temperature")
def get_temperature():
    simulated_temp = round(random.uniform(18.0, 25.0), 2)
    return {"temperature": simulated_temp}
