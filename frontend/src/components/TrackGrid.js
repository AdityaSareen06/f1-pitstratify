import React from 'react';
import { motion } from 'framer-motion';

const tracks = ['Australia', 'Azerbaijan', 'Bahrain', 'Jeddah', 'Miami'];

const TrackGrid = ({ onSelect }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '2rem 4rem',
        padding: '2rem',
        justifyItems: 'center',
      }}
    >
      {tracks.map((track) => (
        <motion.div
          key={track}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300 }}
          onClick={() => onSelect(track)}
          style={{
            cursor: 'pointer',
            textAlign: 'center',
          }}
        >
          <motion.img
            src={`/tracks/${track.toLowerCase()}.png`}
            alt={track}
            style={{
              width: '500px',
              height: 'auto',
              borderRadius: '10px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          />
          <p style={{ marginTop: '0.5rem', fontWeight: '500' }}>{track}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default TrackGrid;
