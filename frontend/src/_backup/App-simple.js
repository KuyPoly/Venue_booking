import React from 'react';
import './App.css';

// Simple test component to check if React is working
function SimpleTest() {
  console.log('SimpleTest component rendered');
  return (
    <div style={{ padding: '20px', fontSize: '24px', color: 'red' }}>
      <h1>React App is Working!</h1>
      <p>Environment: {process.env.NODE_ENV}</p>
      <p>API URL: {process.env.REACT_APP_API_BASE_URL}</p>
      <p>Time: {new Date().toLocaleString()}</p>
    </div>
  );
}

function App() {
  console.log('App component rendered');
  return (
    <div className="App">
      <SimpleTest />
    </div>
  );
}

export default App;
