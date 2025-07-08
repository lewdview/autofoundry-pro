import React from 'react';

const TestApp: React.FC = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#333' }}>AutoFoundry Frontend Test</h1>
      <p>If you can see this, the React app is working!</p>
      <div style={{ 
        background: 'linear-gradient(135deg, #ff7e5f, #feb47b)', 
        padding: '20px', 
        borderRadius: '10px',
        color: 'white',
        marginTop: '20px'
      }}>
        <h2>Glass Effect Test</h2>
        <p>This should have a beautiful gradient background.</p>
      </div>
    </div>
  );
};

export default TestApp;
