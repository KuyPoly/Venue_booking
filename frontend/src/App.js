import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000')
      .then(response => {
        setMessage(response.data);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Fullstack App</h1>
        <p>Message from backend: {message}</p>
      </header>
    </div>
  );
}

export default App;