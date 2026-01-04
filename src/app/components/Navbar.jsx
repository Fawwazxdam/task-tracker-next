// components/Navbar.jsx
"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Menu
} from "lucide-react";

function Navbar({ onAddTask, onAddBacklogTask, searchTerm, onSearchChange, sidebarOpen, setSidebarOpen }) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="ml-4 lg:ml-0">
              <h1 className="text-2xl font-bold text-gray-900">Project Tasks</h1>
              <p className="text-sm text-gray-500">Manage your project workflow</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Filter */}
            <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <Filter className="w-5 h-5" />
            </button>

            {/* Add Task/Button */}
            {(onAddTask || onAddBacklogTask) && (
              <button
                onClick={onAddBacklogTask || onAddTask}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Plus className="w-4 h-4 mr-2" />
                {onAddBacklogTask ? 'Add to Backlog' : 'Add Task'}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;