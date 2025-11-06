// src/contexts/AuthContext.jsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/services/authService";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on initial load
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          // Try to get current user from API
          const user = await authService.getCurrentUser();
          setCurrentUser(user);
        } else {
          // Check stored user data as fallback
          const storedUser = authService.getStoredUser();
          if (storedUser) {
            setCurrentUser(storedUser);
          }
        }
      } catch (error) {
        console.warn("Auth check failed:", error);
        // Clear invalid tokens
        if (typeof window !== 'undefined') {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user_data");
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const { user } = await authService.login({ email, password });
      setCurrentUser(user);
      router.push("/dashboard");
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const { user } = await authService.register(userData);
      setCurrentUser(user);
      router.push("/dashboard");
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setCurrentUser(null);
      router.push("/login");
    } catch (error) {
      console.warn("Logout error:", error);
      // Still clear local state even if API call fails
      setCurrentUser(null);
      router.push("/login");
    }
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    isAuthenticated: authService.isAuthenticated(),
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
