// utils/auth.js

/**
 * Make an authenticated API request with JWT token
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options
 * @returns {Promise<Response>} - Fetch response
 */
export const authenticatedFetch = async (url, options = {}) => {
  const token = localStorage.getItem('access');
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`
  };
  
  // Don't set Content-Type for FormData
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }
  
  const config = {
    ...options,
    headers
  };
  
  const response = await fetch(url, config);
  
  // If token is expired, redirect to login
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    window.location.href = '/login';
    return null;
  }
  
  return response;
};

/**
 * Check if the user is authenticated
 * @returns {boolean} - True if authenticated
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('userId');
  return !!token;
};

/**
 * Get the current user ID
 * @returns {number|null} - User ID or null if not authenticated
 */
export const getCurrentUserId = () => {
  const userId = localStorage.getItem('userId');
  return userId ? parseInt(userId) : null;
};

/**
 * Logout the current user
 */
export const logout = () => {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  window.location.href = '/login';
};