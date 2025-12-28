/**
 * API Service for Backend Communication
 * Handles all HTTP requests to the backend server
 */

const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api'  // Development
  : 'http://your-production-url.com/api'; // Production

/**
 * Generic API request function
 */
async function apiRequest(endpoint, method = 'GET', body = null) {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

/**
 * Authentication API
 */
export const authAPI = {
  /**
   * Login user with email and password
   */
  login: async (email, password) => {
    return apiRequest('/login', 'POST', { email, password });
  },
};

/**
 * Route API
 */
export const routeAPI = {
  /**
   * Get route information between source and destination
   */
  getRoutes: async (source, destination) => {
    return apiRequest('/getRoutes', 'POST', { source, destination });
  },
};

/**
 * Bus API
 */
export const busAPI = {
  /**
   * Get available bus options for a route
   */
  getBusOptions: async (source, destination) => {
    return apiRequest('/getBusOptions', 'POST', { source, destination });
  },
};

/**
 * Taxi API
 */
export const taxiAPI = {
  /**
   * Get available taxi options for a route
   */
  getTaxiOptions: async (source, destination) => {
    return apiRequest('/getTaxiOptions', 'POST', { source, destination });
  },
};

/**
 * Hybrid Optimization API
 */
export const hybridAPI = {
  /**
   * Get hybrid route recommendation
   */
  getHybridRecommendation: async (source, destination) => {
    return apiRequest('/getHybridRecommendation', 'POST', { source, destination });
  },
};

export default {
  authAPI,
  routeAPI,
  busAPI,
  taxiAPI,
  hybridAPI,
};

