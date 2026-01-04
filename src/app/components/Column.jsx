// components/Column.jsx

"use client";

import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { useMemo } from "react";
import { Plus } from "lucide-react";
import TaskCard from "./TaskCard";

function Column({ column, tasks, onTaskClick, onEditTask, onDeleteTask }) {
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const { setNodeRef } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  const getColumnColor = (columnId) => {
    switch (columnId) {
      case 'todo':
        return {
          bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
          header: 'bg-gradient-to-r from-blue-500 to-blue-600',
          border: 'border-blue-200'
        };
      case 'inProgress':
        return {
          bg: 'bg-gradient-to-br from-yellow-50 to-orange-100',
          header: 'bg-gradient-to-r from-yellow-500 to-orange-500',
          border: 'border-yellow-200'
        };
      case 'done':
        return {
          bg: 'bg-gradient-to-br from-green-50 to-emerald-100',
          header: 'bg-gradient-to-r from-green-500 to-emerald-600',
          border: 'border-green-200'
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-gray-50 to-gray-100',
          header: 'bg-gradient-to-r from-gray-500 to-gray-600',
          border: 'border-gray-200'
        };
    }
  };

  const colors = getColumnColor(column.id);

  return (
    <div
      ref={setNodeRef}
      className={`
        w-[380px]
        min-h-[600px]
        ${colors.bg}
        rounded-xl
        flex
        flex-col
        shadow-lg
        border-2
        ${colors.border}
        transition-all
        duration-200
        hover:shadow-xl
      `}
    >
      {/* Header */}
      <div
        className={`
          ${colors.header}
          text-white
          h-[70px]
          rounded-t-xl
          p-4
          flex
          items-center
          justify-between
          shadow-md
        `}
      >
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold">{column.title}</h3>
          <div className="flex justify-center items-center bg-white/20 backdrop-blur-sm px-3 py-1 text-sm rounded-full font-semibold">
            {tasks.length}
          </div>
        </div>
        <div className="w-3 h-3 bg-white/30 rounded-full"></div>
      </div>

      {/* Tasks Container */}
      <div className="flex flex-grow flex-col gap-3 p-4 overflow-x-hidden overflow-y-auto">
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onTaskClick={onTaskClick} onEditTask={onEditTask} onDeleteTask={onDeleteTask} />
          ))}
        </SortableContext>

        {/* Empty state */}
        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <Plus className="w-6 h-6" />
            </div>
            <p className="text-sm text-center">No tasks yet</p>
            <p className="text-xs text-center mt-1">Drag tasks here or create new ones</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Column;
