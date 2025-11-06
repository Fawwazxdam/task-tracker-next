// src/app/(authenticated)/project/[id]/task/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AppLayout from "../../../../components/AppLayout";
import Board from "../../../../components/Board";
import { ArrowLeft, Calendar, Users, CheckCircle, Clock, AlertCircle, X } from "lucide-react";
import { useProject, useProjects, useProjectStats } from "@/lib/hooks/useProjects";
import { useTasks } from "@/lib/hooks/useTasks";
export default function ProjectTaskPage() {
  const params = useParams();
  const projectId = params.id;
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch project data
  const { project, isLoading: projectLoading, error: projectError } = useProject(projectId);

  // Fetch tasks data
  const { tasks: apiTasks, isLoading: tasksLoading, createTask } = useTasks(projectId);

  // Local state for tasks that can be updated by drag and drop
  const [tasks, setTasks] = useState([]);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    type: "feature"
  });

  // Update local tasks when API tasks change
  useEffect(() => {
    if (apiTasks.length > 0) {
      const transformedTasks = apiTasks.map(task => ({
        id: task.id,
        columnId: task.status, // Map API status to our columnId
        content: task.title,
        priority: task.priority,
        dueDate: task.due_date,
        assignee: task.assignee?.name || "Unassigned",
        labels: [task.type]
      }));
      setTasks(transformedTasks);
    }
  }, [apiTasks]);

  // Filter tasks based on search term
  const filteredTasks = tasks.filter(task =>
    task.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.assignee.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.labels.some(label => label.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddTask = () => {
    if (project) {
      setShowAddTaskModal(true);
    }
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      const newTaskData = await createTask({
        title: newTask.title,
        description: newTask.description,
        type: newTask.type,
        status: "todo",
        priority: newTask.priority
      });

      // Add the new task to local state
      const transformedNewTask = {
        id: newTaskData.data.id,
        columnId: newTaskData.data.status,
        content: newTaskData.data.title,
        priority: newTaskData.data.priority,
        dueDate: newTaskData.data.due_date,
        assignee: newTaskData.data.assignee?.name || "Unassigned",
        labels: [newTaskData.data.type]
      };

      setTasks(prevTasks => [...prevTasks, transformedNewTask]);

      setShowAddTaskModal(false);
      setNewTask({
        title: "",
        description: "",
        priority: "medium",
        type: "feature"
      });
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <Clock className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'on-hold': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };
  console.log("Project Data:", project);

  return (
    <AppLayout
      currentPage="projects"
      onAddTask={handleAddTask}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
    >
      <div className="space-y-6">
        {/* Project Header */}
        {project && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => window.history.back()}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Projects
              </button>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(project.status || 'active')}`}>
                {getStatusIcon(project.project.status || 'active')}
                <span className="ml-2 capitalize">{(project.project.status || 'active').replace('-', ' ')}</span>
              </span>
            </div>

            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.project.name || 'Project'}</h1>
                <p className="text-gray-600 mb-4">{project.project.description || 'No description available'}</p>

                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Created {project.project.created_at ? new Date(project.project.created_at).toLocaleDateString() : 'Unknown'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>1 member</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>{apiTasks.length} tasks</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar - Will be updated when we have completion data */}
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Project Progress</span>
                <span>0%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: '0%' }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Task Board */}
        <Board
          tasks={filteredTasks}
          onTasksChange={setTasks}
        />

        {/* Add Task Modal */}
        {showAddTaskModal && project.project && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-gray-900 opacity-70" onClick={() => setShowAddTaskModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-black">Add Task to {project.project?.name || 'Project'}</h3>
                  <button
                    onClick={() => setShowAddTaskModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <span><X className="w-6 h-6" /></span>
                  </button>
                </div>

                <form onSubmit={handleTaskSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">
                        Task Title
                      </label>
                      <input
                        type="text"
                        value={newTask.title}
                        onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                        placeholder="Enter task title"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-1">
                        Description
                      </label>
                      <textarea
                        value={newTask.description}
                        onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                        rows={3}
                        placeholder="Enter task description"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">
                          Type
                        </label>
                        <select
                          value={newTask.type}
                          onChange={(e) => setNewTask({...newTask, type: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                        >
                          <option value="feature">Feature</option>
                          <option value="bug">Bug</option>
                          <option value="chore">Chore</option>
                          <option value="enhancement">Enhancement</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-black mb-1">
                          Priority
                        </label>
                        <select
                          value={newTask.priority}
                          onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="critical">Critical</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowAddTaskModal(false)}
                      className="px-4 py-2 text-sm font-medium text-black bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      Add Task
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}