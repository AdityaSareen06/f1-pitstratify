import React, { useEffect, useState } from 'react';
import { getTrackDifficulty } from '../api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
} from 'recharts';

const TrackDifficultyChart = ({ track, year = 2023 }) => {
  const [data, setData] = useState([]);
  const [difficultyScore, setDifficultyScore] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getTrackDifficulty(year, track);
        const formatted = [
          { name: 'Avg Pitstops', value: res.avg_pitstops_per_driver },
          { name: 'Retirements', value: res.num_retirements },
          { name: 'Safety Cars', value: res.safety_car_deployments },
          { name: 'Weather Variability', value: res.weather_variability },
        ];
        setData(formatted);
        setDifficultyScore(res.difficulty_score);
      } catch (err) {
        console.error('Failed to load track difficulty:', err);
      }
    }

    if (track) {
      fetchData();
    }
  }, [track, year]);

  if (!track) return null;

  return (
    <div style={{ width: '100%', maxWidth: 700, height: 350, margin: 'auto' }}>
      <h3 style={{ textAlign: 'center' }}>
        Track Difficulty: {track} ({year})
      </h3>
      {difficultyScore !== null && (
        <p style={{ textAlign: 'center', fontWeight: 'bold' }}>
          Overall Difficulty Score: {difficultyScore}
        </p>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart layout="vertical" data={data} margin={{ top: 10, right: 30, left: 80, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8">
            <LabelList dataKey="value" position="right" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrackDifficultyChart;
