// src/app/dashboard/page.jsx
"use client";

import AppLayout from "@/app/components/AppLayout";
import { useAuth } from "@/context/AuthContext";
// import AppLayout from "../components/AppLayout";
import { BarChart3, CheckCircle, Clock, AlertCircle } from "lucide-react";
export default function Dashboard() {
  const { currentUser } = useAuth();

  // Mock dashboard data
  const stats = [
    {
      title: "Total Tasks",
      value: "24",
      icon: BarChart3,
      color: "bg-blue-500",
      change: "+12%"
    },
    {
      title: "Completed",
      value: "18",
      icon: CheckCircle,
      color: "bg-green-500",
      change: "+8%"
    },
    {
      title: "In Progress",
      value: "4",
      icon: Clock,
      color: "bg-yellow-500",
      change: "+2"
    },
    {
      title: "Overdue",
      value: "2",
      icon: AlertCircle,
      color: "bg-red-500",
      change: "-1"
    }
  ];

  const recentTasks = [
    { id: 1, title: "Design login page UI/UX", status: "completed", priority: "high" },
    { id: 2, title: "Integrate authentication API", status: "in-progress", priority: "high" },
    { id: 3, title: "Setup Next.js environment", status: "completed", priority: "medium" },
    { id: 4, title: "Create reusable components", status: "in-progress", priority: "medium" },
  ];

  return (
    <AppLayout currentPage="dashboard" showNavbar={false}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {currentUser?.name || "User"}! 👋
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your projects today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className={`text-sm mt-1 ${
                    stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change} from last week
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Tasks */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Tasks</h2>
          <div className="space-y-3">
            {recentTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    task.status === 'completed' ? 'bg-green-500' :
                    task.status === 'in-progress' ? 'bg-yellow-500' : 'bg-gray-400'
                  }`} />
                  <span className="text-gray-900 font-medium">{task.title}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    task.priority === 'high' ? 'bg-red-100 text-red-800' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.priority}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    task.status === 'completed' ? 'bg-green-100 text-green-800' :
                    task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status.replace('-', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/project"
              className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              View All Projects
            </a>
            <button className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md">
              <CheckCircle className="w-5 h-5 mr-2" />
              Create New Task
            </button>
            <button className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-sm hover:shadow-md">
              <Clock className="w-5 h-5 mr-2" />
              View Reports
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}