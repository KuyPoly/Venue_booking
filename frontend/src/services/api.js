import config from '../config/config';

// Base API URL from environment or fallback to localhost
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || config.api.baseURL;

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// API service object
const api = {
  // Base URL
  baseURL: API_BASE_URL,

  // Venues
  getVenues: (category = null) => {
    const url = category 
      ? `${API_BASE_URL}/venues?category=${category}`
      : `${API_BASE_URL}/venues`;
    return fetch(url);
  },

  getVenue: (id) => fetch(`${API_BASE_URL}/venues/${id}`),

  // Categories
  getCategories: () => fetch(`${API_BASE_URL}/categories`),

  // Favorites
  getFavorites: () => fetch(`${API_BASE_URL}/favorites`, {
    headers: getAuthHeaders()
  }),

  addFavorite: (venue_id) => fetch(`${API_BASE_URL}/favorites`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify({ hallId: venue_id })
  }),

  removeFavorite: (venueId) => fetch(`${API_BASE_URL}/favorites/${venueId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  }),

  // Bookings
  createBooking: (bookingData) => fetch(`${API_BASE_URL}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(bookingData)
  }),

  getBooking: (id) => fetch(`${API_BASE_URL}/bookings/${id}`, {
    headers: getAuthHeaders()
  }),

  getBookingHistory: () => fetch(`${API_BASE_URL}/bookings/history`, {
    headers: getAuthHeaders()
  }),

  // Payments
  createPayment: (paymentData) => fetch(`${API_BASE_URL}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(paymentData)
  }),

  // Profile
  getProfile: () => fetch(`${API_BASE_URL}/profile/profile`, {
    headers: getAuthHeaders()
  }),

  updateProfile: (profileData) => fetch(`${API_BASE_URL}/profile/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(profileData)
  }),

  // Auth
  login: (credentials) => fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  }),

  register: (userData) => fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  }),

  getAuthProfile: () => fetch(`${API_BASE_URL}/api/auth/profile`, {
    headers: getAuthHeaders()
  }),

  becomeOwner: (agreementData) => fetch(`${API_BASE_URL}/api/auth/become-owner`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(agreementData)
  }),

  // Owner/Dashboard APIs
  getListings: () => fetch(`${API_BASE_URL}/api/listings`, {
    headers: getAuthHeaders()
  }),

  getBookingStats: () => fetch(`${API_BASE_URL}/api/dashboard/stats`, {
    headers: getAuthHeaders()
  }),

  getBookingRequests: () => fetch(`${API_BASE_URL}/booking/requests`, {
    headers: getAuthHeaders()
  }),

  getWeeklyEarnings: () => fetch(`${API_BASE_URL}/earnings/weekly`, {
    headers: getAuthHeaders()
  }),

  getPayoutHistory: () => fetch(`${API_BASE_URL}/payouts/history`, {
    headers: getAuthHeaders()
  }),

  getActivities: () => fetch(`${API_BASE_URL}/activities`, {
    headers: getAuthHeaders()
  }),

  getWalletInfo: () => fetch(`${API_BASE_URL}/api/wallet`, {
    headers: getAuthHeaders()
  }),

  // Listing management
  getOwnerListings: () => fetch(`${API_BASE_URL}/api/listings`, {
    headers: getAuthHeaders()
  }),

  createListing: (listingData) => fetch(`${API_BASE_URL}/api/listings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(listingData)
  }),

  updateListing: (listingId, listingData) => fetch(`${API_BASE_URL}/api/listings/${listingId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(listingData)
  }),

  deleteListing: (listingId) => fetch(`${API_BASE_URL}/api/listings/${listingId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  }),

  // Booking management
  getOwnerBookings: () => fetch(`${API_BASE_URL}/booking`, {
    headers: getAuthHeaders()
  }),

  updateBookingStatus: (bookingId, action) => fetch(`${API_BASE_URL}/booking-management/${bookingId}/${action}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    }
  })
};

export default api;
