from fastapi import FastAPI, Query
from typing import List
import fastf1
import pandas as pd
import os
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Enable cache
BASE_DIR = os.path.dirname(__file__)
CACHE_DIR = os.path.abspath(os.path.join(BASE_DIR, '..', 'cache'))
fastf1.Cache.enable_cache(CACHE_DIR)


@app.get("/")
def home():
    return {"message": "F1 PitStratify API running!"}


@app.get("/api/pitstops")
def get_pitstops(year: int = Query(...), track: str = Query(...)):
    try:
        session = fastf1.get_session(year, track, 'R')
        session.load()

        laps = session.laps
        pit_stops = laps[laps['PitInTime'].notna()]
        pit_stops = pit_stops[['Driver', 'LapNumber', 'PitInTime', 'Compound']]

        # Optional: convert timestamps to strings for JSON compatibility
        pit_stops['PitInTime'] = pit_stops['PitInTime'].astype(str)

        # Convert to list of dicts
        data = pit_stops.to_dict(orient="records")
        return {"track": track, "year": year, "total_pitstops": len(data), "data": data}

    except Exception as e:
        return {"error": str(e)}

@app.get("/api/track_difficulty")
def get_track_difficulty(year: int = Query(...), track: str = Query(...)):
    try:
        session = fastf1.get_session(year, track, 'R')
        session.load()

        # --- Metric 1: Avg Pit Stops ---
        laps = session.laps
        pit_stops = laps[laps['PitInTime'].notna()]
        drivers = session.drivers
        avg_pitstops_per_driver = round(len(pit_stops) / len(drivers), 2)

        # --- Metric 2: Retirements (Drivers with no laps finished) ---
        completed_laps = laps.groupby('Driver')['LapNumber'].max()
        num_retirements = sum(completed_laps < laps['LapNumber'].max())

        # --- Metric 3: Safety Car Deployments ---
        track_status = session.track_status
        prev_status = track_status['Status'].shift(1, fill_value='0')
        sc_periods = ((track_status['Status'].isin(['4', '5'])) & (~prev_status.isin(['4', '5']))).sum()

        # --- Metric 4: Weather Variability (Temperature std deviation) ---
        weather = session.weather_data
        weather_variability = round(weather['AirTemp'].std(), 2)

        difficulty_score = round(
            avg_pitstops_per_driver * 2.0 +
            num_retirements * 1.5 +
            sc_periods * 2.0 +
            weather_variability * 1.0,
            2
            )

        return {
            "track": track,
            "year": year,
            "avg_pitstops_per_driver": avg_pitstops_per_driver,
            "num_retirements": int(num_retirements),
            "safety_car_deployments": int(sc_periods),
            "weather_variability": weather_variability,
            "difficulty_score": difficulty_score
        }

    except Exception as e:
        return {"error": str(e)}

from pydantic import BaseModel
from app.ml import model as pit_model  # import your prediction logic

class PredictionRequest(BaseModel):
    driver: str
    team: str
    track: str
    start_grid: int
    temp: float
    humidity: float

@app.post("/api/predict_pitstops")
def predict_pitstops(payload: PredictionRequest):
    try:
        predicted = pit_model.predict_pitstops(
            driver=payload.driver,
            team=payload.team,
            track=payload.track,
            start_grid=payload.start_grid,
            temp=payload.temp,
            humidity=payload.humidity
        )
        return {"predicted_pitstops": predicted}
    except Exception as e:
        return {"error": str(e)}
