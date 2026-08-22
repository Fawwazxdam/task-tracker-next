// hooks/useDashboard.js
import useSWR from "swr";
import { dashboardService } from "../services/dashboardService";

export const useDashboard = () => {
  const {
    data: statsData,
    error: statsError,
    isLoading: statsLoading,
  } = useSWR("dashboard/stats", () => dashboardService.getStats(), {
    revalidateOnFocus: false,
    dedupingInterval: 10000,
  });

  const {
    data: recentTasksData,
    error: recentTasksError,
    isLoading: recentTasksLoading,
  } = useSWR("dashboard/recent-tasks", () => dashboardService.getRecentTasks(5), {
    revalidateOnFocus: false,
    dedupingInterval: 10000,
  });

  return {
    stats: statsData?.data || null,
    recentTasks: recentTasksData?.data || [],
    isLoading: statsLoading || recentTasksLoading,
    error: statsError || recentTasksError,
  };
};
