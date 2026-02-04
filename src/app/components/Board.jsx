// components/Board.jsx

"use client";

import { useState } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import Column from "./Column";

// Data awal untuk simulasi
const initialColumns = [
  { id: "todo", title: "To Do" },
  { id: "in_progress", title: "In Progress" },
  { id: "done", title: "Done" },
];

const initialTasks = [
  {
    id: 1,
    columnId: "todo",
    content: "Mendesain UI/UX untuk halaman login",
    priority: "high",
    dueDate: "Dec 15",
    assignee: "John Doe",
    labels: ["Design", "UI/UX"]
  },
  {
    id: 2,
    columnId: "todo",
    content: "Membuat komponen Button reusable",
    priority: "medium",
    dueDate: "Dec 18",
    assignee: "Jane Smith",
    labels: ["Development", "Component"]
  },
  {
    id: 3,
    columnId: "in_progress",
    content: "Mengintegrasikan API otentikasi",
    priority: "high",
    dueDate: "Dec 12",
    assignee: "Mike Johnson",
    labels: ["Backend", "Security"]
  },
  {
    id: 4,
    columnId: "in_progress",
    content: "Setup environment Next.js",
    priority: "medium",
    dueDate: "Dec 14",
    assignee: "Sarah Wilson",
    labels: ["Setup", "DevOps"]
  },
  {
    id: 5,
    columnId: "done",
    content: "Rapat kickoff proyek",
    priority: "low",
    dueDate: "Dec 10",
    assignee: "Team Lead",
    labels: ["Meeting", "Planning"]
  },
];

function Board({ tasks, onTasksChange, onTaskClick, onEditTask, onDeleteTask, onUpdateTaskStatus, projectMembers, onUpdateAssignee }) {
  const [columns, setColumns] = useState(initialColumns);
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10, // Butuh geser 10px untuk memulai drag
      },
    })
  );

  function onDragStart(event) {
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
    }
  }

  function onDragOver(event) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";
    const isOverAColumn = over.data.current?.type === "Column";

    // Handle dropping task on another task
    if (isActiveATask && isOverATask) {
      const activeIndex = tasks.findIndex((t) => t.id === activeId);
      const overIndex = tasks.findIndex((t) => t.id === overId);

      if (activeIndex === -1 || overIndex === -1) return;

      // If tasks are in different columns, move the task to the new column
      if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
        const newStatus = tasks[overIndex].columnId;
        const newTasks = [...tasks];
        newTasks[activeIndex] = {
          ...newTasks[activeIndex],
          columnId: newStatus,
          status: newStatus // Keep both for compatibility
        };
        onTasksChange(arrayMove(newTasks, activeIndex, overIndex));
        // Update status via API
        const apiStatus = newStatus === 'inProgress' ? 'in_progress' : newStatus;
        onUpdateTaskStatus && onUpdateTaskStatus(activeId, apiStatus);
      } else {
        // If tasks are in the same column, just reorder
        onTasksChange(arrayMove(tasks, activeIndex, overIndex));
      }
    }

    // Handle dropping task on a column
    if (isActiveATask && isOverAColumn) {
      const activeIndex = tasks.findIndex((t) => t.id === activeId);
      if (activeIndex === -1) return;

      const newStatus = overId;
      const newTasks = [...tasks];
      newTasks[activeIndex] = {
        ...newTasks[activeIndex],
        columnId: newStatus,
        status: newStatus // Keep both for compatibility
      };
      onTasksChange(newTasks);
      // Update status via API
      const apiStatus = newStatus === 'inProgress' ? 'in_progress' : newStatus;
      onUpdateTaskStatus && onUpdateTaskStatus(activeId, apiStatus);
    }
  }

  function onDragEnd(event) {
    setActiveTask(null);
    // Most of the logic is handled in onDragOver, so onDragEnd is simpler
    // This prevents double-processing of moves
  }

  return (
    <div className="w-full">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="flex gap-6 overflow-x-auto pb-6 px-2">
          {columns.map((col) => (
            <Column
              key={col.id}
              column={col}
              tasks={tasks.filter((task) => task.columnId === col.id)}
              onTaskClick={onTaskClick}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
              projectMembers={projectMembers}
              onUpdateAssignee={onUpdateAssignee}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}

export default Board;
