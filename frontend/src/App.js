import React, { useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Navbar from './component/nav/navbar'
import Footer from './component/footer/footer';

function App() {
  return(
    <Router>
      <div className="App">
        <Navbar/>
        {/* Your page content/routes will go here */}
        <Footer/>
      </div>
    </Router>
  )
}

export default App
