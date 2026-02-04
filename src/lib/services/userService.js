// services/userService.js
import apiClient from "../axios";

export const userService = {
  // Get all users
  async getUsers() {
    try {
      const response = await apiClient.get("/users");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};
