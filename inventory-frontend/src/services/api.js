import axios from 'axios';
import { config } from '../config/config';

// Create axios instance
const api = axios.create({
  baseURL: config.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management - single source of truth
let accessToken = null;
let refreshToken = null;
let isRefreshing = false;
let refreshSubscribers = [];

// Subscribe to token refresh
function subscribeTokenRefresh(callback) {
  refreshSubscribers.push(callback);
}

// Notify all subscribers when token is refreshed
function onTokenRefreshed(token) {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
}

// Set tokens (called by auth service)
export function setTokens(access, refresh) {
  accessToken = access;
  refreshToken = refresh;
  if (access) {
    api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

// Get current tokens
export function getTokens() {
  return { accessToken, refreshToken };
}

// Clear tokens
export function clearTokens() {
  accessToken = null;
  refreshToken = null;
  delete api.defaults.headers.common['Authorization'];
}

// Request interceptor - add token to requests
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle 401 and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is not 401 or request already retried, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // If no refresh token, reject immediately
    if (!refreshToken) {
      return Promise.reject(error);
    }

    // Mark request as retried
    originalRequest._retry = true;

    // If already refreshing, queue this request
    if (isRefreshing) {
      return new Promise((resolve) => {
        subscribeTokenRefresh((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(api(originalRequest));
        });
      });
    }

    // Start refresh process
    isRefreshing = true;

    try {
      // Call refresh endpoint WITHOUT interceptor to avoid infinite loop
      const response = await axios.post(
        `${config.apiBaseUrl}/token/refresh/`,
        { refresh: refreshToken },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const newAccessToken = response.data.access;
      
      // Update tokens
      setTokens(newAccessToken, refreshToken);
      
      // Notify all queued requests
      onTokenRefreshed(newAccessToken);
      
      // Retry original request
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      // Refresh failed - clear tokens and reject
      clearTokens();
      // Dispatch custom event to notify auth context
      window.dispatchEvent(new CustomEvent('auth:logout'));
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;