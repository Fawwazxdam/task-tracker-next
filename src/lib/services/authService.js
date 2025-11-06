// services/authService.js
import apiClient from "../axios";

export const authService = {
  // Login user
  async login(credentials) {
    // EMERGENCY FALLBACK: Uncomment below for testing frontend without API
    /*
    console.log("Using mock login for testing");
    const mockUser = {
      id: 1,
      name: "Test User",
      email: credentials.email
    };
    const mockToken = "mock_token_" + Date.now();

    localStorage.setItem("auth_token", mockToken);
    localStorage.setItem("user_data", JSON.stringify(mockUser));

    return { user: mockUser, token: mockToken };
    */

    try {
      const response = await apiClient.post("/login", credentials);
      const { user, token } = response.data;

      // Store token and user data
      if (typeof window !== 'undefined') {
        localStorage.setItem("auth_token", token);
        localStorage.setItem("user_data", JSON.stringify(user));
      }

      return { user, token };
    } catch (error) {
      console.error("Login API error:", error);
      throw error.response?.data || error;
    }
  },

  // Register user
  async register(userData) {
    try {
      const response = await apiClient.post("/register", userData);
      const { user, token } = response.data;

      // Store token and user data
      if (typeof window !== 'undefined') {
        localStorage.setItem("auth_token", token);
        localStorage.setItem("user_data", JSON.stringify(user));
      }

      return { user, token };
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Logout user
  async logout() {
    try {
      await apiClient.post("/logout");
    } catch (error) {
      // Even if logout fails on server, clear local data
      console.warn("Server logout failed:", error);
    } finally {
      // Always clear local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_data");
      }
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const response = await apiClient.get("/user");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Check if user is authenticated
  isAuthenticated() {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem("auth_token");
  },

  // Get stored user data
  getStoredUser() {
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem("user_data");
    return userData ? JSON.parse(userData) : null;
  },

  // Get stored token
  getToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem("auth_token");
  }
};