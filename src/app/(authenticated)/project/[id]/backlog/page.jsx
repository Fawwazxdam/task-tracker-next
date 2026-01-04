// src/app/(authenticated)/project/[id]/page.jsx
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import AppLayout from "../../../../components/AppLayout";
import { ArrowLeft, Calendar, Users, CheckCircle, Plus, MoveRight, X } from "lucide-react";
import { useProject, useProjects } from "@/lib/hooks/useProjects";
import { useTasks, useBacklog } from "@/lib/hooks/useTasks";

export default function ProjectBacklogPage() {
  const params = useParams();
  const projectId = params.id;
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    type: "feature"
  });
  const { backlogTasks, isLoading: loading, addToBacklog } = useBacklog(projectId);

  // Fetch project data
  const { project, isLoading: projectLoading, error: projectError } = useProject(projectId);

  // Fetch tasks data
  const { tasks: apiTasks, isLoading: tasksLoading, createTask, updateTaskStatus } = useTasks(projectId);

  const handleMoveToBoard = async (taskId) => {
    try {
      await updateTaskStatus(taskId, 'todo');
      // Hook will automatically refetch backlog data
    } catch (error) {
      console.error("Failed to move task:", error);
    }
  };

  const handleAddTask = () => {
    setShowAddTaskModal(true);
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      await addToBacklog({
        title: newTask.title,
        description: newTask.description,
        type: newTask.type,
        priority: newTask.priority
      });

      setShowAddTaskModal(false);
      setNewTask({
        title: "",
        description: "",
        priority: "medium",
        type: "feature"
      });
    } catch (error) {
      console.error("Failed to add task:", error);
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
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'on-hold': return <CheckCircle className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  return (
    <AppLayout
      currentPage="projects"
      onAddBacklogTask={handleAddTask}
      currentProject={project ? project.project : null}
      currentProjectPage="backlog"
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
                    <span>{backlogTasks.length} backlog tasks</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Backlog Tasks */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Backlog</h2>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading backlog...</p>
              </div>
            ) : backlogTasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No tasks in backlog</p>
                <p className="text-sm">Tasks will appear here when added to the backlog</p>
              </div>
            ) : (
              <div className="space-y-4">
                {backlogTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{task.title}</h3>
                      {task.description && (
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                      )}
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>Priority: {task.priority}</span>
                        <span>Type: {task.type}</span>
                        {task.assignee && <span>Assignee: {task.assignee.name}</span>}
                      </div>
                    </div>
                    <button
                      onClick={() => handleMoveToBoard(task.id)}
                      className="flex items-center px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                    >
                      <MoveRight className="w-4 h-4 mr-1" />
                      Move to Board
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add Task Modal */}
        {showAddTaskModal && project && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-gray-900 opacity-70" onClick={() => setShowAddTaskModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-black">Add Task to Backlog</h3>
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
                      Add to Backlog
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