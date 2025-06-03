import React, { useState } from 'react';
import TrackGrid from './components/TrackGrid';
import TrackDifficultyChart from './components/TrackDifficultyChart';
import TestPitstop from './components/TestPitstop';

function App() {
  const [selectedTrack, setSelectedTrack] = useState(null);

  return (
    <div style={{ padding: '20px' }}>
      <h1>F1 PitStratify</h1>

      {!selectedTrack ? (
        <>
          <h2>Select a Track</h2>
          <TrackGrid onSelect={setSelectedTrack} />
        </>
      ) : (
        <>
          <TrackDifficultyChart track={selectedTrack} year={2023} />
          <hr />
          <TestPitstop defaultTrack={selectedTrack} />
        </>
      )}
    </div>
  );
}

export default App;
