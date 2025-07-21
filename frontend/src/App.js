import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import { AuthProvider } from './context/AuthContext';
import Navbar from './component/nav/navbar';
import Footer from './component/footer/footer';
import Signup from './component/auth/Signup';
// import Login from './component/auth/Login';
import Home from './page/Homepage/Home';
import RoomDetails from './page/RoomDetails/RoomDetails';
import VenuesList from './page/VenuesList/VenuesList';
import LoginModal from './component/LoginModal/LoginModal';
import SignupModal from './component/SignupModal/SignupModal';
import Favorites from './page/Favorites/Favorites';
import Listing from './page/Listing/Listing';
// import Dashboard from './page/Owner/Dashboard';
import Dashboard from './page/Dashboard/Dashboard';
import Booking from './page/Booking/booking';
import Messages from './page/Message/message';
import Sidebar from './component/Owner/Sidebar';
import Topbar from './component/Owner/Topbar';
import BookingHistory from './page/BookingHistory/BookingHistory';
import BookingDetails from './page/BookingDetails/BookingDetails';


function DashboardLayout({ children }) {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Topbar />
        {children}
      </div>
    </div>
  );
}

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

  const handleSwitchToSignup = () => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(true);
  };
  const handleSwitchToLogin = () => {
    setIsSignupModalOpen(false);
    setIsLoginModalOpen(true);
  };

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar openLoginModal={openLoginModal} openSignupModal={openSignupModal} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            {/* <Route path="/login" element={<Login />} /> */}
            <Route path="/room/:id" element={<RoomDetails />} />
            <Route path="/venues" element={<VenuesList />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/booking-history" element={<BookingHistory />} />
            <Route path="/booking/:id" element={<BookingDetails />} />
            <Route path="/be-owner" element={<Listing />} />
            <Route path="/dashboard" element={
                    <DashboardLayout>
                    <Dashboard />
                    </DashboardLayout>}/>
            <Route path="/dashboard/bookings" element={
                    <DashboardLayout>
                    <Booking />
                    </DashboardLayout>}/>
            <Route path="/dashboard/messages" element={
                    <DashboardLayout>
                    <Messages />
                    </DashboardLayout>}/>
          </Routes>
          <Footer />
          {isLoginModalOpen && <LoginModal onClose={closeLoginModal} onSwitchToSignup={handleSwitchToSignup} />}
          {isSignupModalOpen && <SignupModal onClose={closeSignupModal} onSwitchToLogin={handleSwitchToLogin} />}
        </div>
      </Router>
    </AuthProvider>
  );

  
}

export default App;
