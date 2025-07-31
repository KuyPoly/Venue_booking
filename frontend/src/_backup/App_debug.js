import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import './App.css';
import { AuthProvider } from './context/AuthContext';

// Simple test component for debugging
const TestComponent = () => (
  <div style={{ 
    padding: '40px', 
    textAlign: 'center', 
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f0f2f5',
    minHeight: '100vh'
  }}>
    <div style={{
      backgroundColor: 'white',
      padding: '40px',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h1 style={{ color: '#1a73e8', marginBottom: '20px' }}>🎉 Venue Booking App</h1>
      <p style={{ fontSize: '18px', marginBottom: '15px' }}>✅ React App is working successfully!</p>
      <p style={{ marginBottom: '10px' }}>🌍 Environment: {process.env.NODE_ENV}</p>
      <p style={{ marginBottom: '10px' }}>🔗 API URL: {process.env.REACT_APP_API_BASE_URL || 'Not configured'}</p>
      <p style={{ color: '#666', fontSize: '14px', marginTop: '30px' }}>
        Deployment is working! Full features will be restored once debugging is complete.
      </p>
    </div>
  </div>
);

function App() {
  console.log('App component rendering...');
  console.log('Environment variables:', {
    NODE_ENV: process.env.NODE_ENV,
    API_BASE_URL: process.env.REACT_APP_API_BASE_URL
  });

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <TestComponent />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
