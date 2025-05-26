import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
import joblib
import os

# Load dataset
df = pd.read_csv("training_data.csv")

# Encode categorical features
le_driver = LabelEncoder()
le_team = LabelEncoder()
le_track = LabelEncoder()

df['DriverEncoded'] = le_driver.fit_transform(df['Driver'])
df['TeamEncoded'] = le_team.fit_transform(df['Team'])
df['TrackEncoded'] = le_track.fit_transform(df['Track'])

# Select features and target
features = ['StartGrid', 'AvgTemp', 'AvgHumidity', 'DriverEncoded', 'TeamEncoded', 'TrackEncoded']
X = df[features]
y = df['NumPitStops']

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
mse = mean_squared_error(y_test, y_pred)
print(f"✅ Model trained. MSE: {round(mse, 3)}")

# Save model and encoders
joblib.dump(model, "model/pitstop_model.pkl")
joblib.dump(le_driver, "model/le_driver.pkl")
joblib.dump(le_team, "model/le_team.pkl")
joblib.dump(le_track, "model/le_track.pkl")
