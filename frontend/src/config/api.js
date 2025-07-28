// config/api.js
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://venuebooking-production.up.railway.app';

console.log('API Configuration:', {
  env: process.env.REACT_APP_API_BASE_URL,
  fallback: 'https://venuebooking-production.up.railway.app',
  final: API_BASE_URL
});

export { API_BASE_URL };

export const API_ENDPOINTS = {
  // Auth endpoints
  PROFILE: `${API_BASE_URL}/profile`,
  
  // Venue endpoints
  VENUES: `${API_BASE_URL}/venues`,
  CATEGORIES: `${API_BASE_URL}/categories`,
  
  // Booking endpoints
  BOOKINGS: `${API_BASE_URL}/bookings`,
  PAYMENTS: `${API_BASE_URL}/payments`,
  
  // Favorites endpoints
  FAVORITES: `${API_BASE_URL}/favorites`,
  
  // Listing endpoints
  LISTINGS: `${API_BASE_URL}/api/listings`,
  
  // Profile endpoints
  USER_PROFILE: `${API_BASE_URL}/api/profile/profile`,
  
  // Settings endpoints
  SETTINGS: `${API_BASE_URL}/api/setting/Setting`,
  CHANGE_PASSWORD: `${API_BASE_URL}/api/setting/Setting/change-password`,
  
  // Wallet endpoints
  WALLET: `${API_BASE_URL}/api/wallet`
};

export default API_BASE_URL;
