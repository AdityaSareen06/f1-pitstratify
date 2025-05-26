import fastf1
from fastf1 import plotting

fastf1.Cache.enable_cache('../cache')

# Load Bahrain 2023 Race
session = fastf1.get_session(2023, 'Bahrain', 'R')
session.load()

# --- Driver Names ---
drivers = session.drivers
for driver_num in drivers:
    info = session.get_driver(driver_num)
    print(f"{driver_num} → {info['Abbreviation']} - {info['FullName']}")

# --- Pit Stops Data ---
laps = session.laps
pit_stops = laps[laps['PitInTime'].notna()]

print(f"\nTotal pit stops: {len(pit_stops)}")

# Show a few samples
print(pit_stops[['Driver', 'LapNumber', 'PitInTime', 'PitOutTime', 'Compound']].head())
