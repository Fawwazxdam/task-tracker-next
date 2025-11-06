// components/AppLayout.jsx
"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function AppLayout({ children, currentPage = "tasks", showNavbar = true, onAddTask, searchTerm, onSearchChange }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentPage={currentPage}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {showNavbar && (
          <Navbar
            onAddTask={onAddTask}
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        )}

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppLayout;