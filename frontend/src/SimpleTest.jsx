import React from 'react';

// Simple test component to check if React is working
function SimpleTest() {
  console.log('SimpleTest component rendered');
  return (
    <div style={{ padding: '20px', fontSize: '24px', color: 'red' }}>
      <h1>React App is Working!</h1>
      <p>Environment: {process.env.NODE_ENV}</p>
      <p>API URL: {process.env.REACT_APP_API_BASE_URL}</p>
    </div>
  );
}

export default SimpleTest;
