// hooks/useProjects.js
import useSWR from "swr";
import { projectService } from "../services/projectService";

// Custom fetcher function
const fetcher = (url) => projectService.getProjects().then(res => res.data);

export const useProjects = () => {
  const { data, error, isLoading, mutate } = useSWR('/api/projects', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 5000, // 5 seconds
  });

  return {
    projects: data || [],
    isLoading,
    error,
    mutate,
    // Helper functions
    refetch: () => mutate(),
    createProject: async (projectData) => {
      try {
        const result = await projectService.createProject(projectData);
        mutate(); // Refetch projects
        return result;
      } catch (error) {
        throw error;
      }
    },
    updateProject: async (id, projectData) => {
      try {
        const result = await projectService.updateProject(id, projectData);
        mutate(); // Refetch projects
        return result;
      } catch (error) {
        throw error;
      }
    },
    deleteProject: async (id) => {
      try {
        const result = await projectService.deleteProject(id);
        mutate(); // Refetch projects
        return result;
      } catch (error) {
        throw error;
      }
    }
  };
};

export const useProject = (id) => {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/api/projects/${id}` : null,
    () => projectService.getProject(id).then(res => res.data),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  );

  return {
    project: data,
    isLoading,
    error,
    mutate,
    refetch: () => mutate(),
  };
};

export const useProjectStats = (projectId) => {
  const { data, error, isLoading } = useSWR(
    projectId ? `/api/projects/${projectId}/stats` : null,
    () => projectService.getProjectStats(projectId).then(res => res.data),
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000, // 10 seconds for stats
    }
  );

  return {
    stats: data,
    isLoading,
    error,
  };
};

export const useProjectMembers = (projectId) => {
  const { data, error, isLoading, mutate } = useSWR(
    projectId ? `/api/projects/${projectId}/members` : null,
    () => projectService.getProjectMembers(projectId).then(res => res.data),
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000,
    }
  );

  const addMembers = async (userIds, role = 'member') => {
    try {
      const result = await projectService.addProjectMembers(projectId, userIds, role);
      mutate(); // Refetch members
      return result;
    } catch (error) {
      throw error;
    }
  };
  console.log("Members hooks:", data);

  return {
    members: data || [],
    isLoading,
    error,
    mutate,
    addMembers,
  };
};