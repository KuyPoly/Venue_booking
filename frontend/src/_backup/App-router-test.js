import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';

// Simple components to test if basic routing works
function Home() {
  return <div style={{ padding: '20px' }}><h1>Home Page</h1></div>;
}

function About() {
  return <div style={{ padding: '20px' }}><h1>About Page</h1></div>;
}

function TestNavbar() {
  return (
    <nav style={{ padding: '10px', backgroundColor: '#f0f0f0' }}>
      <a href="/" style={{ margin: '0 10px' }}>Home</a>
      <a href="/about" style={{ margin: '0 10px' }}>About</a>
    </nav>
  );
}

function App() {
  console.log('App component rendered');
  
  return (
    <Router>
      <div className="App">
        <TestNavbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
