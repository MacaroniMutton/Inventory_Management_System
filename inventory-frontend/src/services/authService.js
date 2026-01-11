import axios from 'axios';
import { config } from '../config/config';
import { setTokens, clearTokens } from './api';

// Storage keys
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// Auth service - handles all authentication logic
export const authService = {
  // Login
  async login(username, password) {
    try {
      const response = await axios.post(`${config.apiBaseUrl}/token/`, {
        username,
        password,
      });

      const { access, refresh } = response.data;
      
      // Store tokens
      this.storeTokens(access, refresh);
      
      // Update api service
      setTokens(access, refresh);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || { detail: 'Login failed' },
      };
    }
  },

  // Logout
  logout() {
    // Clear from storage
    this.clearStoredTokens();
    
    // Clear from api service
    clearTokens();
  },

  // Store tokens in localStorage
  storeTokens(access, refresh) {
    try {
      localStorage.setItem(ACCESS_TOKEN_KEY, access);
      localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
    } catch (error) {
      console.error('Failed to store tokens:', error);
    }
  },

  // Clear tokens from localStorage
  clearStoredTokens() {
    try {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }
  },

  // Get stored tokens
  getStoredTokens() {
    try {
      return {
        access: localStorage.getItem(ACCESS_TOKEN_KEY),
        refresh: localStorage.getItem(REFRESH_TOKEN_KEY),
      };
    } catch (error) {
      console.error('Failed to get tokens:', error);
      return { access: null, refresh: null };
    }
  },

  // Check if user is authenticated
  isAuthenticated() {
    const { access } = this.getStoredTokens();
    return !!access;
  },

  // Initialize - restore tokens from storage
  initialize() {
    const { access, refresh } = this.getStoredTokens();
    if (access && refresh) {
      setTokens(access, refresh);
      return true;
    }
    return false;
  },
};