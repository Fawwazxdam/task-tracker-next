// src/app/(authenticated)/layout.jsx
'use client';
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext"; // Import dari context
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function AuthenticatedLayout({ children }) {
  const { currentUser, loading } = useAuth();
  const { theme } = useTheme(); // Gunakan hook dari context
  const router = useRouter();

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push("/login");
    }
  }, [currentUser, loading, router]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return children;
}