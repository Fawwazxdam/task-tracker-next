// services/taskService.js
import apiClient from "../axios";

export const taskService = {
  // Get tasks for a project
  async getTasks(projectId, filters = {}) {
    try {
      const queryParams = new URLSearchParams();

      // Add filters to query params
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') {
          queryParams.append(key, value);
        }
      });

      const url = `/projects/${projectId}/tasks${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create new task
  async createTask(projectId, taskData) {
    try {
      const response = await apiClient.post(`/projects/${projectId}/tasks`, taskData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single task
  async getTask(projectId, taskId) {
    try {
      const response = await apiClient.get(`/projects/${projectId}/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update task
  async updateTask(projectId, taskId, taskData) {
    try {
      const response = await apiClient.put(`/projects/${projectId}/tasks/${taskId}`, taskData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update task status
  async updateTaskStatus(projectId, taskId, status) {
    try {
      const response = await apiClient.patch(`/projects/${projectId}/tasks/${taskId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Move task from backlog
  async moveTaskFromBacklog(projectId, taskId, moveData) {
    try {
      const response = await apiClient.patch(`/projects/${projectId}/tasks/${taskId}/move`, moveData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete task
  async deleteTask(projectId, taskId) {
    try {
      const response = await apiClient.delete(`/projects/${projectId}/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Search tasks
  async searchTasks(projectId, query, perPage = 15) {
    try {
      const queryParams = new URLSearchParams({ q: query, per_page: perPage });
      const response = await apiClient.get(`/projects/${projectId}/tasks-search?${queryParams}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get backlog tasks
  async getBacklog(projectId) {
    try {
      const response = await apiClient.get(`/projects/${projectId}/backlog`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Add task to backlog
  async addToBacklog(projectId, taskData) {
    try {
      const response = await apiClient.post(`/projects/${projectId}/backlog`, taskData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};