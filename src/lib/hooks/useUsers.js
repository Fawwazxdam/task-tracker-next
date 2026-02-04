// hooks/useUsers.js
import useSWR from "swr";
import { userService } from "../services/userService";

// Custom fetcher function
const fetcher = () => userService.getUsers().then(res => res.data);

export const useUsers = () => {
  const { data, error, isLoading, mutate } = useSWR('/api/users', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 10000,
  });

  return {
    users: data || [],
    isLoading,
    error,
    mutate,
    refetch: () => mutate(),
  };
};
