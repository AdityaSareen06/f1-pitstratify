import React, { useState, useEffect } from 'react';
import { predictPitstops } from '../api';

const driverTeamMap = {
  "Max Verstappen": "Red Bull Racing",
  "Sergio Perez": "Red Bull Racing",
  "Fernando Alonso": "Aston Martin",
  "Carlos Sainz": "Ferrari",
  "Lewis Hamilton": "Mercedes",
  "Lance Stroll": "Aston Martin",
  "George Russell": "Mercedes",
  "Valtteri Bottas": "Alfa Romeo",
  "Pierre Gasly": "Alpine",
  "Alexander Albon": "Williams",
  "Yuki Tsunoda": "AlphaTauri",
  "Logan Sargeant": "Williams",
  "Kevin Magnussen": "Haas",
  "Nyck De Vries": "AlphaTauri",
  "Nico Hulkenberg": "Haas",
  "Guanyu Zhou": "Alfa Romeo",
  "Lando Norris": "McLaren",
  "Esteban Ocon": "Alpine",
  "Charles Leclerc": "Ferrari",
  "Oscar Piastri": "McLaren"
};

const TestPitstop = ({ defaultTrack }) => {
  const [formData, setFormData] = useState({
    driver: '',
    team: '',
    track: defaultTrack || '',
    start_grid: '',
    temp: '',
    humidity: ''
  });

  const [result, setResult] = useState(null);

  useEffect(() => {
    setFormData(prev => ({ ...prev, track: defaultTrack || '' }));
  }, [defaultTrack]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "driver") {
      const selectedTeam = driverTeamMap[value] || '';
      setFormData(prev => ({
        ...prev,
        driver: value,
        team: selectedTeam
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        start_grid: parseInt(formData.start_grid),
        temp: parseFloat(formData.temp),
        humidity: parseFloat(formData.humidity),
      };
      const res = await predictPitstops(payload);
      setResult(res.predicted_pitstops);
    } catch (err) {
      console.error('Prediction failed:', err);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <h2>Predict Pitstops</h2>
      <form onSubmit={handleSubmit}>
        <label>Driver:</label><br />
        <select name="driver" value={formData.driver} onChange={handleChange} required>
          <option value="">Select Driver</option>
          {Object.keys(driverTeamMap).map((driver) => (
            <option key={driver} value={driver}>{driver}</option>
          ))}
        </select><br />

        <label>Team:</label><br />
        <input name="team" value={formData.team} readOnly placeholder="Team" /><br />

        <label>Track:</label><br />
        <input name="track" value={formData.track} readOnly placeholder="Track" /><br />

        <label>Start Grid:</label><br />
        <input name="start_grid" placeholder="Start Grid" type="number" onChange={handleChange} required /><br />

        <label>Temperature (°C):</label><br />
        <input name="temp" placeholder="Temperature" type="number" step="0.1" onChange={handleChange} required /><br />

        <label>Humidity (%):</label><br />
        <input name="humidity" placeholder="Humidity" type="number" step="0.1" onChange={handleChange} required /><br />

        <button type="submit">Predict</button>
      </form>

      {result !== null && (
        <p>
          <strong>Predicted Pitstops:</strong> {parseFloat(result).toFixed(2)}
        </p>
      )}
    </div>
  );
};

export default TestPitstop;
