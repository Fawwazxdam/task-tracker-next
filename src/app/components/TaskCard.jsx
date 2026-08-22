// components/TaskCard.jsx

"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Calendar, User, MoreHorizontal, Edit, Trash2, Hash } from "lucide-react";

function TaskCard({ task, onTaskClick, onEditTask, onDeleteTask, onUpdateAssignee, projectMembers }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAssigneeDropdownOpen, setIsAssigneeDropdownOpen] = useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  // Mock data for enhanced task display
  const taskData = {
    ...task,
    priority: task.priority || 'medium',
    dueDate: task.dueDate || null,
    assignee: task.assignee || 'Unassigned',
    labels: task.labels || []
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-700';
      case 'high': return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 border-red-200 dark:border-red-700';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700';
      case 'low': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600';
    }
  };

  // Memberi efek visual saat kartu di-drag
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-50 bg-white dark:bg-gray-800 p-4 rounded-xl border-2 border-blue-400 shadow-lg"
      />
    );
  }

  const handleAssigneeChange = (e) => {
    const newAssigneeId = e.target.value;
    if (onUpdateAssignee) {
      onUpdateAssignee(task.id, newAssigneeId);
    }
    setIsAssigneeDropdownOpen(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => !isDragging && onTaskClick && onTaskClick(task)}
      className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-200 cursor-grab active:cursor-grabbing group"
    >
      {/* Priority indicator */}
      <div className="flex items-center justify-between mb-3">
        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(taskData.priority)}`}>
          {taskData.priority.toUpperCase()}
        </span>
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsDropdownOpen(!isDropdownOpen);
            }}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-opacity"
          >
            <MoreHorizontal className="w-4 h-4 text-gray-400" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditTask && onEditTask(task);
                  setIsDropdownOpen(false);
                }}
                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteTask && onDeleteTask(task);
                  setIsDropdownOpen(false);
                }}
                className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-100 dark:hover:bg-red-900"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Task content */}
      <h4 className="text-gray-900 dark:text-white font-medium mb-2 leading-tight">
        {task.content}
      </h4>

      {/* Labels */}
      {taskData.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {taskData.labels.map((label, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-md"
            >
              {label}
            </span>
          ))}
        </div>
      )}

      {/* Task metadata */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-3">
          {taskData.dueDate && (
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{taskData.dueDate}</span>
            </div>
          )}
          {task.story_points && (
            <div className="flex items-center space-x-1">
              <Hash className="w-3 h-3" />
              <span>{task.story_points} pts</span>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <User className="w-3 h-3" />
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAssigneeDropdownOpen(!isAssigneeDropdownOpen);
                }}
                className="hover:text-blue-600 transition-colors"
              >
                <span>{taskData.assignee}</span>
              </button>
              {isAssigneeDropdownOpen && projectMembers && (
                <div className="absolute left-0 mt-1 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-20 max-h-32 overflow-y-auto">
                  <select
                    value={task.assignee_id || ""}
                    onChange={handleAssigneeChange}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full px-2 py-1 text-sm bg-transparent border-none focus:ring-0 text-gray-700 dark:text-gray-300"
                  >
                    <option value="">Unassigned</option>
                    {projectMembers.map(member => (
                      <option key={member.id} value={member.id}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
