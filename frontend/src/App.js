import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Navbar from './component/nav/navbar';
import Footer from './component/footer/footer';
import Signup from './component/auth/Signup';
// import Login from './component/auth/Login';
import Home from './page/Homepage/Home';
import RoomDetails from './page/RoomDetails/RoomDetails';
import LoginModal from './components/LoginModal';
import SignupModal from './components/SignupModal';

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const openSignupModal = () => {
    setIsSignupModalOpen(true);
  };

  const closeSignupModal = () => {
    setIsSignupModalOpen(false);
  };

  return (
    <Router>
      <div className="App">
        <Navbar openLoginModal={openLoginModal} openSignupModal={openSignupModal} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          {/* <Route path="/login" element={<Login />} /> */}
          <Route path="/room/:id" element={<RoomDetails />} />
        </Routes>
        <Footer />
        {isLoginModalOpen && <LoginModal onClose={closeLoginModal} />}
        {isSignupModalOpen && <SignupModal onClose={closeSignupModal} />}
      </div>
    </Router>
  );
}

export default App;
