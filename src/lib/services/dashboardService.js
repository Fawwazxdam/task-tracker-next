// services/dashboardService.js
import apiClient from "../axios";

export const dashboardService = {
  async getStats() {
    try {
      const response = await apiClient.get("/dashboard/stats");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getRecentTasks(limit = 5) {
    try {
      const response = await apiClient.get(`/dashboard/recent-tasks?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};
