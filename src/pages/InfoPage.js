import React from 'react';

const InfoPage = ({ onNavigate }) => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Code Wallet Information</h1>
      <p>Version: 1.0.0</p>
      <p>A desktop application for managing code fragments</p>
      <button 
        className="btn btn-secondary"
        onClick={() => onNavigate('fragments')}
      >
        Back to Fragments
      </button>
    </div>
  );
};

export default InfoPage;