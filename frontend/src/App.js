import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import { AuthProvider } from './context/AuthContext';
import Navbar from './component/nav/navbar';
import Footer from './component/footer/footer';
import Signup from './component/auth/Signup';
import Home from './page/Homepage/Home';
import RoomDetails from './page/RoomDetails/RoomDetails';
import VenuesList from './page/VenuesList/VenuesList';
import LoginModal from './component/LoginModal/LoginModal';
import SignupModal from './component/SignupModal/SignupModal';
import Favorites from './page/Favorites/Favorites';
import Listing from './page/Listing/Listing';
import VenueSearch from './page/VenueSearch/VenueSearch';
// Dashboard components
import Dashboard from './page/Dashboard/Dashboard';
import Booking from './page/Booking/booking';
// Owner management components
import OwnerListings from './page/Listing/OwnerList';
import Sidebar from './component/Owner/Sidebar';
import Topbar from './component/Owner/Topbar';
import BookingHistory from './page/BookingHistory/BookingHistory';
import BookingDetails from './page/BookingDetails/BookingDetails';
import DebugInputTest from './components/DebugInputTest';
import Profile from './page/Profile/profile';
import Setting from './page/OwnerSetting/setting';

// Import the Profile and Setting components we created
import ProfileComponent from './Profile';
import SettingComponent from './Setting';

// Dashboard Layout without navbar/footer
function DashboardLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Topbar />
        <main style={{ 
          flex: 1, 
          marginLeft: '250px', 
          marginTop: '64px',
          padding: '32px 40px',
          backgroundColor: '#f7f7f7',
          minHeight: 'calc(100vh - 64px)'
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}

// Regular Layout with navbar/footer
function RegularLayout({ children, isLoginModalOpen, isSignupModalOpen, openLoginModal, openSignupModal, closeLoginModal, closeSignupModal, handleSwitchToSignup, handleSwitchToLogin }) {
  return (
    <>
      <Navbar openLoginModal={openLoginModal} openSignupModal={openSignupModal} />
      {children}
      <Footer />
      {isLoginModalOpen && <LoginModal onClose={closeLoginModal} onSwitchToSignup={handleSwitchToSignup} />}
      {isSignupModalOpen && <SignupModal onClose={closeSignupModal} onSwitchToLogin={handleSwitchToLogin} />}
    </>
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
          <Routes>
            {/* Public Routes with Regular Layout */}
            <Route path="/" element={
              <RegularLayout 
                isLoginModalOpen={isLoginModalOpen}
                isSignupModalOpen={isSignupModalOpen}
                openLoginModal={openLoginModal}
                openSignupModal={openSignupModal}
                closeLoginModal={closeLoginModal}
                closeSignupModal={closeSignupModal}
                handleSwitchToSignup={handleSwitchToSignup}
                handleSwitchToLogin={handleSwitchToLogin}
              >
                <Home />
              </RegularLayout>
            } />
            
            <Route path="/signup" element={
              <RegularLayout 
                isLoginModalOpen={isLoginModalOpen}
                isSignupModalOpen={isSignupModalOpen}
                openLoginModal={openLoginModal}
                openSignupModal={openSignupModal}
                closeLoginModal={closeLoginModal}
                closeSignupModal={closeSignupModal}
                handleSwitchToSignup={handleSwitchToSignup}
                handleSwitchToLogin={handleSwitchToLogin}
              >
                <Signup />
              </RegularLayout>
            } />
            
            <Route path="/room/:id" element={
              <RegularLayout 
                isLoginModalOpen={isLoginModalOpen}
                isSignupModalOpen={isSignupModalOpen}
                openLoginModal={openLoginModal}
                openSignupModal={openSignupModal}
                closeLoginModal={closeLoginModal}
                closeSignupModal={closeSignupModal}
                handleSwitchToSignup={handleSwitchToSignup}
                handleSwitchToLogin={handleSwitchToLogin}
              >
                <RoomDetails />
              </RegularLayout>
            } />
            
            <Route path="/venues" element={
              <RegularLayout 
                isLoginModalOpen={isLoginModalOpen}
                isSignupModalOpen={isSignupModalOpen}
                openLoginModal={openLoginModal}
                openSignupModal={openSignupModal}
                closeLoginModal={closeLoginModal}
                closeSignupModal={closeSignupModal}
                handleSwitchToSignup={handleSwitchToSignup}
                handleSwitchToLogin={handleSwitchToLogin}
              >
                <VenuesList />
              </RegularLayout>
            } />
            
            <Route path="/favorites" element={
              <RegularLayout 
                isLoginModalOpen={isLoginModalOpen}
                isSignupModalOpen={isSignupModalOpen}
                openLoginModal={openLoginModal}
                openSignupModal={openSignupModal}
                closeLoginModal={closeLoginModal}
                closeSignupModal={closeSignupModal}
                handleSwitchToSignup={handleSwitchToSignup}
                handleSwitchToLogin={handleSwitchToLogin}
              >
                <Favorites />
              </RegularLayout>
            } />
            
            <Route path="/be-owner" element={
              <RegularLayout 
                isLoginModalOpen={isLoginModalOpen}
                isSignupModalOpen={isSignupModalOpen}
                openLoginModal={openLoginModal}
                openSignupModal={openSignupModal}
                closeLoginModal={closeLoginModal}
                closeSignupModal={closeSignupModal}
                handleSwitchToSignup={handleSwitchToSignup}
                handleSwitchToLogin={handleSwitchToLogin}
              >
                <Listing />
              </RegularLayout>
            } />
            
            <Route path="/booking-history" element={
              <RegularLayout 
                isLoginModalOpen={isLoginModalOpen}
                isSignupModalOpen={isSignupModalOpen}
                openLoginModal={openLoginModal}
                openSignupModal={openSignupModal}
                closeLoginModal={closeLoginModal}
                closeSignupModal={closeSignupModal}
                handleSwitchToSignup={handleSwitchToSignup}
                handleSwitchToLogin={handleSwitchToLogin}
              >
                <BookingHistory />
              </RegularLayout>
            } />
            
            <Route path="/booking/:id" element={
              <RegularLayout 
                isLoginModalOpen={isLoginModalOpen}
                isSignupModalOpen={isSignupModalOpen}
                openLoginModal={openLoginModal}
                openSignupModal={openSignupModal}
                closeLoginModal={closeLoginModal}
                closeSignupModal={closeSignupModal}
                handleSwitchToSignup={handleSwitchToSignup}
                handleSwitchToLogin={handleSwitchToLogin}
              >
                <BookingDetails />
              </RegularLayout>
            } />
            
            <Route path="/venuesearch" element={
              <RegularLayout 
                isLoginModalOpen={isLoginModalOpen}
                isSignupModalOpen={isSignupModalOpen}
                openLoginModal={openLoginModal}
                openSignupModal={openSignupModal}
                closeLoginModal={closeLoginModal}
                closeSignupModal={closeSignupModal}
                handleSwitchToSignup={handleSwitchToSignup}
                handleSwitchToLogin={handleSwitchToLogin}
              >
                <VenueSearch />
              </RegularLayout>
            } />
            
            {/* Owner Dashboard Routes - No navbar/footer, only sidebar and topbar */}
            <Route path="/my-venue" element={
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            }/>
            
            <Route path="/dashboard" element={
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            }/>
            
            <Route path="/dashboard/bookings" element={
              <DashboardLayout>
                <Booking />
              </DashboardLayout>
            }/>
            
            <Route path="/dashboard/listings" element={
              <DashboardLayout>
                <OwnerListings />
              </DashboardLayout>
            }/>
            
            {/* Profile and Setting routes using DashboardLayout */}
            <Route path="/dashboard/profile" element={
              <DashboardLayout>
                <ProfileComponent />
              </DashboardLayout>
            }/>
            
            <Route path="/dashboard/setting" element={
              <DashboardLayout>
                <SettingComponent />
              </DashboardLayout>
            }/>
            
            <Route path="/debug-input" element={
              <div style={{ padding: '20px' }}>
                <DebugInputTest />
              </div>
            }/>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 