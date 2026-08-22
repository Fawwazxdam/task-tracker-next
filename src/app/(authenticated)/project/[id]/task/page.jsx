// src/app/(authenticated)/project/[id]/task/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AppLayout from "../../../../components/AppLayout";
import Board from "../../../../components/Board";
import Link from "next/link";
import { ArrowLeft, Calendar, Users, CheckCircle, Clock, AlertCircle, X } from "lucide-react";
import { useProject, useProjects, useProjectStats, useProjectMembers } from "@/lib/hooks/useProjects";
import { useTasks } from "@/lib/hooks/useTasks";
export default function ProjectTaskPage() {
  const params = useParams();
  const projectId = params.id;
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showTaskDetailModal, setShowTaskDetailModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch project data
  const { project, isLoading: projectLoading, error: projectError } = useProject(projectId);

  // Fetch tasks data
  const { tasks: apiTasks, isLoading: tasksLoading, createTask, updateTask, updateTaskStatus, deleteTask } = useTasks(projectId);

  // Fetch project members for assign dropdown
  const { members: projectMembers } = useProjectMembers(projectId);

  // Local state for tasks that can be updated by drag and drop
  const [tasks, setTasks] = useState([]);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    type: "feature",
    status: "todo",
    due_date: "",
    assignee_id: ""
  });

  const [editTask, setEditTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    type: "feature",
    status: "todo"
  });

  // Update local tasks when API tasks change
  useEffect(() => {
    if (apiTasks.length > 0) {
      const transformedTasks = apiTasks.map(task => ({
        id: task.id,
        status: task.status,
        content: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.due_date,
        story_points: task.story_points,
        assignee: task.assignee?.name || "Unassigned",
        assignee_id: task.user_id,
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

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowTaskDetailModal(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setEditTask({
      title: task.content,
      description: task.description || "",
      priority: task.priority,
      type: task.labels[0] || "feature",
      status: task.status
    });
    setShowEditTaskModal(true);
  };

  const handleDeleteTask = async (task) => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(task.id);
      } catch (error) {
        console.error("Failed to delete task:", error);
      }
    }
  };

  const handleUpdateAssignee = async (taskId, assigneeId) => {
    try {
      await updateTask(taskId, { user_id: assigneeId || null });
    } catch (error) {
      console.error("Failed to update assignee:", error);
    }
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      const taskData = {
        title: newTask.title,
        description: newTask.description,
        type: newTask.type,
        status: newTask.status,
        priority: newTask.priority,
        due_date: newTask.due_date || null,
        user_id: newTask.assignee_id || null
      };
      
      const newTaskData = await createTask(taskData);

      // Add the new task to local state
      const transformedNewTask = {
        id: newTaskData.data.id,
        status: newTaskData.data.status,
        content: newTaskData.data.title,
        description: newTaskData.data.description,
        priority: newTaskData.data.priority,
        dueDate: newTaskData.data.due_date,
        story_points: newTaskData.data.story_points,
        assignee: newTaskData.data.assignee?.name || "Unassigned",
        assignee_id: newTaskData.data.user_id,
        labels: [newTaskData.data.type]
      };

      setTasks(prevTasks => [...prevTasks, transformedNewTask]);

      setShowAddTaskModal(false);
      setNewTask({
        title: "",
        description: "",
        priority: "medium",
        type: "feature",
        status: "todo",
        due_date: "",
        assignee_id: ""
      });
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const handleEditTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateTask(editingTask.id, {
        title: editTask.title,
        description: editTask.description,
        priority: editTask.priority,
        type: editTask.type,
        status: editTask.status
      });
      setShowEditTaskModal(false);
      setEditingTask(null);
    } catch (error) {
      console.error("Failed to update task:", error);
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <AppLayout
      currentPage="projects"
      pageTitle={project?.project?.name || 'Tasks'}
      pageSubtitle="Manage and track project tasks"
      onAddTask={handleAddTask}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      currentProject={project ? project.project : null}
      currentProjectPage="task"
    >
      <div className="space-y-6">
        {/* Project Header */}
        {project && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <Link
                href="/project"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Projects
              </Link>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(project.project.status || 'active')}`}>
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
                    <span>{projectMembers.length} member{projectMembers.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>{apiTasks.length} tasks</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Project Progress</span>
                <span>{Math.round((apiTasks.filter(task => task.status === 'done').length / apiTasks.length) * 100) || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.round((apiTasks.filter(task => task.status === 'done').length / apiTasks.length) * 100) || 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Task Board */}
        <Board
          tasks={filteredTasks}
          onTasksChange={setTasks}
          onTaskClick={handleTaskClick}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onUpdateTaskStatus={updateTaskStatus}
          projectMembers={projectMembers}
          onUpdateAssignee={handleUpdateAssignee}
          isLoading={tasksLoading}
        />

        {/* Add Task Modal */}
        {showAddTaskModal && project.project && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-gray-900 opacity-70" onClick={() => setShowAddTaskModal(false)} />
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Add Task to {project.project?.name || 'Project'}</h3>
                  <button
                    onClick={() => setShowAddTaskModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <span><X className="w-6 h-6" /></span>
                  </button>
                </div>

                <form onSubmit={handleTaskSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1">
                        Task Title
                      </label>
                      <input
                        type="text"
                        value={newTask.title}
                        onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Enter task title"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1">
                        Description
                      </label>
                      <textarea
                        value={newTask.description}
                        onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        rows={3}
                        placeholder="Enter task description"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1">
                          Type
                        </label>
                        <select
                          value={newTask.type}
                          onChange={(e) => setNewTask({...newTask, type: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="feature">Feature</option>
                          <option value="bug">Bug</option>
                          <option value="chore">Chore</option>
                          <option value="enhancement">Enhancement</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1">
                          Priority
                        </label>
                        <select
                          value={newTask.priority}
                          onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="critical">Critical</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1">
                          Status
                        </label>
                        <select
                          value={newTask.status}
                          onChange={(e) => setNewTask({...newTask, status: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="backlog">Backlog</option>
                          <option value="todo">To Do</option>
                          <option value="in_progress">In Progress</option>
                          <option value="done">Done</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1">
                          Due Date
                        </label>
                        <input
                          type="date"
                          value={newTask.due_date}
                          onChange={(e) => setNewTask({...newTask, due_date: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1">
                        Assign To
                      </label>
                      <select
                        value={newTask.assignee_id}
                        onChange={(e) => setNewTask({...newTask, assignee_id: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="">Unassigned</option>
                        {projectMembers.map(member => (
                          <option key={member.id} value={member.id}>
                            {member.name} ({member.email})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowAddTaskModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
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

        {/* Task Detail Modal */}
        {showTaskDetailModal && selectedTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-gray-900 opacity-70" onClick={() => setShowTaskDetailModal(false)} />
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Task Details</h3>
                  <button
                    onClick={() => setShowTaskDetailModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <span><X className="w-6 h-6" /></span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{selectedTask.content}</h4>
                    <div className="flex items-center space-x-2 mb-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(selectedTask.priority)}`}>
                        {selectedTask.priority.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Status: {selectedTask.status.replace('_', ' ')}</span>
                    </div>
                  </div>

                  {selectedTask.description && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                      <p className="text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">{selectedTask.description}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assignee</label>
                      <p className="text-gray-900 dark:text-white">{selectedTask.assignee}</p>
                    </div>
                    {selectedTask.dueDate && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
                        <p className="text-gray-900 dark:text-white">{selectedTask.dueDate}</p>
                      </div>
                    )}
                    {selectedTask.story_points && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Story Points</label>
                        <p className="text-gray-900 dark:text-white">{selectedTask.story_points}</p>
                      </div>
                    )}
                  </div>

                  {selectedTask.labels && selectedTask.labels.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Labels</label>
                      <div className="flex flex-wrap gap-2">
                        {selectedTask.labels.map((label, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-md"
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between space-x-3 mt-6">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setShowTaskDetailModal(false);
                        handleEditTask(selectedTask);
                      }}
                      className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setShowTaskDetailModal(false);
                        handleDeleteTask(selectedTask);
                      }}
                      className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50"
                    >
                      Delete
                    </button>
                  </div>
                  <button
                    onClick={() => setShowTaskDetailModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Task Modal */}
        {showEditTaskModal && editingTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-gray-900 opacity-70" onClick={() => setShowEditTaskModal(false)} />
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Edit Task</h3>
                  <button
                    onClick={() => setShowEditTaskModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <span><X className="w-6 h-6" /></span>
                  </button>
                </div>

                <form onSubmit={handleEditTaskSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1">
                        Task Title
                      </label>
                      <input
                        type="text"
                        value={editTask.title}
                        onChange={(e) => setEditTask({...editTask, title: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Enter task title"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1">
                        Description
                      </label>
                      <textarea
                        value={editTask.description}
                        onChange={(e) => setEditTask({...editTask, description: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        rows={3}
                        placeholder="Enter task description"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1">
                          Type
                        </label>
                        <select
                          value={editTask.type}
                          onChange={(e) => setEditTask({...editTask, type: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="feature">Feature</option>
                          <option value="bug">Bug</option>
                          <option value="chore">Chore</option>
                          <option value="enhancement">Enhancement</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1">
                          Priority
                        </label>
                        <select
                          value={editTask.priority}
                          onChange={(e) => setEditTask({...editTask, priority: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="critical">Critical</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1">
                          Status
                        </label>
                        <select
                          value={editTask.status}
                          onChange={(e) => setEditTask({...editTask, status: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="backlog">Backlog</option>
                          <option value="todo">To Do</option>
                          <option value="in_progress">In Progress</option>
                          <option value="done">Done</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowEditTaskModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      Update Task
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