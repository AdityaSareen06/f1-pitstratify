import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000';

export const predictPitstops = async (data) => {
  const res = await axios.post(`${API_BASE}/api/predict_pitstops`, data);
  return res.data;
};

export const getTrackDifficulty = async (year, track) => {
  const res = await axios.get(`${API_BASE}/api/track_difficulty`, {
    params: { year, track }
  });
  return res.data;
};

