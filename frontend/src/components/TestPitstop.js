import React, { useState } from 'react';
import { predictPitstops } from '../api';

const driverToTeam = {
  'Lewis Hamilton': 'Mercedes',
  'Max Verstappen': 'Red Bull',
  'Charles Leclerc': 'Ferrari',
  'Carlos Sainz': 'Ferrari',
  'George Russell': 'Mercedes',
  'Lando Norris': 'McLaren',
  'Fernando Alonso': 'Aston Martin',
  'Sergio Perez': 'Red Bull',
  'Yuki Tsunoda': 'AlphaTauri',
  'Pierre Gasly': 'Alpine',
  'Esteban Ocon': 'Alpine',
  'Oscar Piastri': 'McLaren',
};

const inputStyle = {
  width: '100%',
  padding: '0.5rem',
  border: '1px solid #ccc',
  borderRadius: '4px',
  fontSize: '1rem',
};

const buttonStyle = {
  padding: '0.75rem',
  fontSize: '1rem',
  backgroundColor: '#3498db',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'driver') {
      const team = driverToTeam[value] || '';
      setFormData((prev) => ({ ...prev, driver: value, team }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
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
    <div style={{ width: '100%' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3>Predict Pitstops</h3>

        <div>
          <label>Driver:</label>
          <select name="driver" value={formData.driver} onChange={handleChange} style={inputStyle}>
            <option value="">Select Driver</option>
            {Object.keys(driverToTeam).map(driver => (
              <option key={driver} value={driver}>{driver}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Team:</label>
          <input name="team" value={formData.team} readOnly style={inputStyle} />
        </div>

        <div>
          <label>Track:</label>
          <input name="track" value={formData.track} readOnly style={inputStyle} />
        </div>

        <input name="start_grid" placeholder="Start Grid" type="number" onChange={handleChange} style={inputStyle} />
        <input name="temp" placeholder="Temperature (°C)" type="number" step="0.1" onChange={handleChange} style={inputStyle} />
        <input name="humidity" placeholder="Humidity (%)" type="number" step="0.1" onChange={handleChange} style={inputStyle} />

        <button type="submit" style={buttonStyle}>Predict</button>
      </form>

      {result !== null && (
        <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>
          Predicted Pitstops: {parseFloat(result).toFixed(2)}
        </p>
      )}
    </div>
  );
};

export default TestPitstop;
