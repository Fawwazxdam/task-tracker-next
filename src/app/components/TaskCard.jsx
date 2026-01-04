// components/TaskCard.jsx

"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Calendar, User, MoreHorizontal, Edit, Trash2 } from "lucide-react";

function TaskCard({ task, onTaskClick, onEditTask, onDeleteTask }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Memberi efek visual saat kartu di-drag
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-50 bg-white p-4 rounded-xl border-2 border-blue-400 shadow-lg"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => !isDragging && onTaskClick && onTaskClick(task)}
      className="bg-white p-4 rounded-xl shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-200 cursor-grab active:cursor-grabbing group"
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
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-opacity"
          >
            <MoreHorizontal className="w-4 h-4 text-gray-400" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditTask && onEditTask(task);
                  setIsDropdownOpen(false);
                }}
                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
                className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-100"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Task content */}
      <h4 className="text-gray-900 font-medium mb-2 leading-tight">
        {task.content}
      </h4>

      {/* Labels */}
      {taskData.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {taskData.labels.map((label, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-md"
            >
              {label}
            </span>
          ))}
        </div>
      )}

      {/* Task metadata */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-3">
          {taskData.dueDate && (
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{taskData.dueDate}</span>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <User className="w-3 h-3" />
            <span>{taskData.assignee}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
