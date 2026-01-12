from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.db.session import engine, Base
from app.routers import auth, restaurants, votes

@asynccontextmanager
async def lifespan(app: FastAPI):
    # App Startup: Create Tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # App Shutdown
    await engine.dispose()

app = FastAPI(
    title="Lunch Menu Voting API",
    version="1.0.0",
    lifespan=lifespan
)

app.include_router(auth.router)
app.include_router(restaurants.router)
app.include_router(votes.router)

@app.get("/")
async def root():
    return {"message": "Welcome to Lunch Voting System API"}