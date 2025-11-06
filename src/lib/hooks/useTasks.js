// hooks/useTasks.js
import useSWR from "swr";
import { taskService } from "../services/taskService";

export const useTasks = (projectId, filters = {}) => {
  // Create a stable key for SWR
  const queryKey = projectId ? ['/api/projects/tasks', projectId, filters] : null;

  const { data, error, isLoading, mutate } = useSWR(
    queryKey,
    () => taskService.getTasks(projectId, filters).then(res => res.data),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 3000, // 3 seconds
    }
  );

  return {
    tasks: data?.data || [],
    pagination: data ? {
      currentPage: data.current_page,
      perPage: data.per_page,
      total: data.total,
    } : null,
    isLoading,
    error,
    mutate,
    // Helper functions
    refetch: () => mutate(),
    createTask: async (taskData) => {
      try {
        const result = await taskService.createTask(projectId, taskData);
        mutate(); // Refetch tasks
        return result;
      } catch (error) {
        throw error;
      }
    },
    updateTask: async (taskId, taskData) => {
      try {
        const result = await taskService.updateTask(projectId, taskId, taskData);
        mutate(); // Refetch tasks
        return result;
      } catch (error) {
        throw error;
      }
    },
    updateTaskStatus: async (taskId, status) => {
      try {
        const result = await taskService.updateTaskStatus(projectId, taskId, status);
        mutate(); // Refetch tasks
        return result;
      } catch (error) {
        throw error;
      }
    },
    deleteTask: async (taskId) => {
      try {
        const result = await taskService.deleteTask(projectId, taskId);
        mutate(); // Refetch tasks
        return result;
      } catch (error) {
        throw error;
      }
    },
    moveTaskFromBacklog: async (taskId, moveData) => {
      try {
        const result = await taskService.moveTaskFromBacklog(projectId, taskId, moveData);
        mutate(); // Refetch tasks
        return result;
      } catch (error) {
        throw error;
      }
    }
  };
};

export const useTask = (projectId, taskId) => {
  const { data, error, isLoading, mutate } = useSWR(
    projectId && taskId ? `/api/projects/${projectId}/tasks/${taskId}` : null,
    () => taskService.getTask(projectId, taskId).then(res => res.data),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  );

  return {
    task: data,
    isLoading,
    error,
    mutate,
    refetch: () => mutate(),
  };
};

export const useTaskSearch = (projectId, query) => {
  const { data, error, isLoading } = useSWR(
    projectId && query ? ['/api/projects/tasks-search', projectId, query] : null,
    () => taskService.searchTasks(projectId, query).then(res => res.data),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  );

  return {
    searchResults: data?.data?.data || [],
    isLoading,
    error,
  };
};