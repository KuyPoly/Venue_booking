// Configuration file for the application
const config = {
  // Google Maps API Configuration
  googleMaps: {
    apiKey: 'AIzaSyAMFMbWxpHcei0Tp_X3E2QeZyc6z1obhMo',
    libraries: ['places'],
    defaultCenter: {
      lat: 11.5564, // Phnom Penh, Cambodia - change as needed
      lng: 104.9282
    }
  },
  
  // API Configuration
  api: {
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'
  },
  
  // App Configuration
  app: {
    name: 'Venue Booking System',
    version: '1.0.0'
  }
};

export default config;
