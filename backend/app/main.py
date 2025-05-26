# backend/app/main.py

from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"message": "F1 Pit Stratify API running!"}
