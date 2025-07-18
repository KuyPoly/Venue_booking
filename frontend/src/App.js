import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Navbar from './component/nav/navbar';
import Footer from './component/footer/footer';
import Signup from './component/auth/Signup';
import Login from './component/auth/Login';
import Home from './page/Homepage/Home';


function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          {/* Add more routes like homepage, search, etc. */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
