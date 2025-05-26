import joblib
import os
import pandas as pd

# Load saved model and encoders
MODEL_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../model'))

model = joblib.load(os.path.join(MODEL_DIR, "pitstop_model.pkl"))
le_driver = joblib.load(os.path.join(MODEL_DIR, "le_driver.pkl"))
le_team = joblib.load(os.path.join(MODEL_DIR, "le_team.pkl"))
le_track = joblib.load(os.path.join(MODEL_DIR, "le_track.pkl"))

def predict_pitstops(driver: str, team: str, track: str, start_grid: int, temp: float, humidity: float) -> float:
    try:
        df = pd.DataFrame([{
            'StartGrid': start_grid,
            'AvgTemp': temp,
            'AvgHumidity': humidity,
            'DriverEncoded': le_driver.transform([driver])[0],
            'TeamEncoded': le_team.transform([team])[0],
            'TrackEncoded': le_track.transform([track])[0]
        }])
        prediction = model.predict(df)[0]
        return round(prediction, 2)
    except Exception as e:
        raise ValueError(f"Prediction failed: {e}")
