import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import { AuthProvider } from './context/AuthContext';

// Add debug logging
console.log('App.js loaded successfully');
console.log('Environment:', {
  NODE_ENV: process.env.NODE_ENV,
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL
});

// Import components with error boundary
let Navbar, Footer, Home, LoginModal, SignupModal;
try {
  Navbar = require('./component/nav/navbar').default;
  Footer = require('./component/footer/footer').default;
  Home = require('./page/Homepage/Home').default;
  LoginModal = require('./component/LoginModal/LoginModal').default;
  SignupModal = require('./component/SignupModal/SignupModal').default;
  console.log('Core components loaded successfully');
} catch (error) {
  console.error('Error loading core components:', error);
}

// Test component for debugging
const TestComponent = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h1>🎉 React App is Working!</h1>
    <p>Environment: {process.env.NODE_ENV}</p>
    <p>API URL: {process.env.REACT_APP_API_BASE_URL || 'Not set'}</p>
    <p>Build working successfully!</p>
  </div>
);

// Simplified App for debugging
function App() {
  console.log('App component rendering...');
  
  // Return simplified version first for debugging
  if (process.env.NODE_ENV === 'production') {
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

  // Original App logic for development

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
            
            <Route path="/about" element={
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
                <About />
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

            <Route path="/dashboard/wallet" element={
              <DashboardLayout>
                <Wallet />
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
                <Setting />
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