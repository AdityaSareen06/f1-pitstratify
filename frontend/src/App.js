import React, { useState } from 'react';
import TrackGrid from './components/TrackGrid';
import TrackDifficultyChart from './components/TrackDifficultyChart';
import TestPitstop from './components/TestPitstop';

const App = () => {
  const [selectedTrack, setSelectedTrack] = useState(null);

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      padding: '2rem',
      backgroundColor: '#f5f7fa',
      minHeight: '100vh'
    }}>
      <h1
        onClick={() => window.location.reload()} 
        style={{
        cursor: 'pointer',
        textAlign: 'center',
        fontSize: '2.5rem',
        marginBottom: '2rem',
        color: '#2c3e50'
      }}>
        F1 PitStratify
      </h1>

      {!selectedTrack ? (
        <>
          <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: '#34495e' }}>Select a Track</h2>
          <TrackGrid onSelect={setSelectedTrack} />
        </>
      ) : (
        <>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2rem'
          }}>
            <TrackDifficultyChart track={selectedTrack} />
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <div style={{
              width: '100%',
              maxWidth: '700px',
              background: '#ffffff',
              padding: '2rem 3rem',
              borderRadius: '10px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              marginTop: '-1rem'
            }}>

              <TestPitstop defaultTrack={selectedTrack} />
            </div>
            <button
              onClick={() => setSelectedTrack(null)}
              style={{
                backgroundColor: '#e74c3c',
                color: '#fff',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              ⬅ Back to Track Selection
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
