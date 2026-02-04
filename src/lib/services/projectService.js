// services/projectService.js
import apiClient from "../axios";

export const projectService = {
  // Get all projects
  async getProjects() {
    try {
      const response = await apiClient.get("/projects");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create new project
  async createProject(projectData) {
    try {
      const response = await apiClient.post("/projects", projectData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get project by ID
  async getProject(id) {
    try {
      const response = await apiClient.get(`/projects/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update project
  async updateProject(id, projectData) {
    try {
      const response = await apiClient.put(`/projects/${id}`, projectData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete project
  async deleteProject(id) {
    try {
      const response = await apiClient.delete(`/projects/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get project backlog
  async getProjectBacklog(projectId) {
    try {
      const response = await apiClient.get(`/projects/${projectId}/backlog`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Add task to backlog
  async addTaskToBacklog(projectId, taskData) {
    try {
      const response = await apiClient.post(`/projects/${projectId}/backlog`, taskData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get project statistics
  async getProjectStats(projectId) {
    try {
      const response = await apiClient.get(`/projects/${projectId}/stats`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get project members
  async getProjectMembers(projectId) {
    try {
      const response = await apiClient.get(`/projects/${projectId}/members`);
      console.log("Project members SERVICE:", response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Add members to project
  async addProjectMembers(projectId, userIds, role = 'member') {
    try {
      const response = await apiClient.post(`/projects/${projectId}/members`, {
        user_ids: userIds,
        role: role
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};