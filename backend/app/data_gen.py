import fastf1
import pandas as pd
import os

# Enable cache
fastf1.Cache.enable_cache(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'cache')))

def collect_race_data(year: int, track: str):
    try:
        session = fastf1.get_session(year, track, 'R')
        session.load()

        laps = session.laps
        weather = session.weather_data
        drivers = session.drivers

        driver_data = []

        for driver_num in drivers:
            try:
                driver_info = session.get_driver(driver_num)
                abbrev = driver_info['Abbreviation']
                full_name = driver_info['FullName']
                team = driver_info['TeamName']

                driver_laps = laps[laps['Driver'] == abbrev]
                if len(driver_laps) == 0:
                    continue

                num_pitstops = driver_laps['PitInTime'].notna().sum()
                try:
                    result_row = session.results[session.results['Abbreviation'] == abbrev].iloc[0]
                    start_pos = result_row['GridPosition']
                except:
                    print(f"⚠️ Grid position not found for {abbrev}")
                    continue
                avg_temp = weather['AirTemp'].mean()
                avg_humidity = weather['Humidity'].mean()

                driver_data.append({
                    'Year': year,
                    'Track': track,
                    'Driver': full_name,
                    'Team': team,
                    'StartGrid': int(start_pos),
                    'AvgTemp': round(avg_temp, 2),
                    'AvgHumidity': round(avg_humidity, 2),
                    'NumPitStops': int(num_pitstops)
                })

            except Exception as driver_error:
                print(f"Skipping driver {driver_num}: {driver_error}")

        print(f"✅ Collected {len(driver_data)} records for {track} {year}")
        return driver_data

    except Exception as e:
        print(f"❌ Error for {track} {year}: {e}")
        return []

# === Collect for multiple races ===
all_data = []
tracks = ['Bahrain', 'Jeddah', 'Australia', 'Azerbaijan', 'Miami']

for track in tracks:
    print(f"\n=== {track.upper()} ===")
    race_data = collect_race_data(2023, track)
    all_data.extend(race_data)

# Save to CSV
if all_data:
    df = pd.DataFrame(all_data)
    df.to_csv("training_data.csv", index=False)
    print("📁 training_data.csv generated successfully.")
else:
    print("⚠️ No data collected. CSV not created.")
