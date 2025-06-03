import React from 'react';

const tracks = ['Australia', 'Azerbaijan', 'Bahrain', 'Jeddah', 'Miami'];

const TrackGrid = ({ onSelect }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '2rem 4rem',  // 2rem row gap, 4rem column gap
      padding: '2rem',
      justifyItems: 'center',
    }}>
      {tracks.map((track) => (
        <div
          key={track}
          onClick={() => onSelect(track)}
          style={{
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <img
            src={`/tracks/${track.toLowerCase()}.png`}
            alt={track}
            style={{
              width: '200px',
              height: 'auto',
              borderRadius: '10px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
            }}
          />
          <p style={{ marginTop: '0.5rem', fontWeight: '500' }}>{track}</p>
        </div>
      ))}
    </div>
  );
};

export default TrackGrid;
