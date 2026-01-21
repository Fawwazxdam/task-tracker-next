// components/ThemeToggle.jsx
"use client";
import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext"; // Import dari context

function ThemeToggle({ className }) {
  const { theme, toggleTheme } = useTheme();

  console.log("ThemeToggle render - theme:", theme); // Debug

  const handleClick = () => {
    console.log("Button clicked!"); // Debug
    toggleTheme();
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 ${className}`}
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}

export default ThemeToggle;
