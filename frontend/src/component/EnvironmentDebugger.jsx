import React from 'react';

const EnvironmentDebugger = () => {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const allEnvVars = Object.keys(process.env).filter(key => key.startsWith('REACT_APP_'));

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f8f9fa', 
      border: '1px solid #dee2e6',
      borderRadius: '8px',
      margin: '20px',
      fontFamily: 'monospace'
    }}>
      <h3>🔍 Environment Variables Debug</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <strong>Google Maps API Key Status:</strong>
        <div style={{ 
          padding: '8px', 
          backgroundColor: apiKey ? '#d4edda' : '#f8d7da',
          color: apiKey ? '#155724' : '#721c24',
          borderRadius: '4px',
          marginTop: '5px'
        }}>
          {apiKey ? `✅ Found: ${apiKey.substring(0, 20)}...` : '❌ Not found'}
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <strong>All REACT_APP_ Environment Variables:</strong>
        <div style={{ 
          backgroundColor: '#fff', 
          padding: '10px', 
          borderRadius: '4px',
          marginTop: '5px',
          maxHeight: '200px',
          overflowY: 'auto'
        }}>
          {allEnvVars.length > 0 ? (
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              {allEnvVars.map(key => (
                <li key={key}>
                  <strong>{key}:</strong> {process.env[key]?.substring(0, 50)}
                  {process.env[key]?.length > 50 ? '...' : ''}
                </li>
              ))}
            </ul>
          ) : (
            <div style={{ color: '#721c24' }}>No REACT_APP_ environment variables found</div>
          )}
        </div>
      </div>

      <div style={{ fontSize: '14px', color: '#6c757d' }}>
        <strong>Troubleshooting:</strong>
        <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
          <li>Make sure <code>.env</code> file is in the <code>frontend/</code> directory</li>
          <li>Restart the React development server after adding .env</li>
          <li>Environment variable must start with <code>REACT_APP_</code></li>
          <li>No spaces around the = sign in .env file</li>
        </ul>
      </div>
    </div>
  );
};

export default EnvironmentDebugger;
