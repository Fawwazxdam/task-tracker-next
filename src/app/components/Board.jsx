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

const COLUMNS = [
  { id: "todo", title: "To Do" },
  { id: "in_progress", title: "In Progress" },
  { id: "done", title: "Done" },
];

function Board({ tasks, onTasksChange, onTaskClick, onEditTask, onDeleteTask, onUpdateTaskStatus, projectMembers, onUpdateAssignee, isLoading }) {
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  if (isLoading) {
    return (
      <div className="flex gap-6 overflow-x-auto pb-6 px-2">
        {COLUMNS.map((col) => (
          <div key={col.id} className="w-[380px] min-h-[600px] bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 animate-pulse" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl mb-3 animate-pulse" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex gap-6 overflow-x-auto pb-6 px-2">
        {COLUMNS.map((col) => (
          <Column
            key={col.id}
            column={col}
            tasks={[]}
            onTaskClick={onTaskClick}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            projectMembers={projectMembers}
            onUpdateAssignee={onUpdateAssignee}
          />
        ))}
      </div>
    );
  }

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

    if (isActiveATask && isOverATask) {
      const activeIndex = tasks.findIndex((t) => t.id === activeId);
      const overIndex = tasks.findIndex((t) => t.id === overId);

      if (activeIndex === -1 || overIndex === -1) return;

      if (tasks[activeIndex].status !== tasks[overIndex].status) {
        const newStatus = tasks[overIndex].status;
        const newTasks = [...tasks];
        newTasks[activeIndex] = {
          ...newTasks[activeIndex],
          status: newStatus,
        };
        onTasksChange(arrayMove(newTasks, activeIndex, overIndex));
        onUpdateTaskStatus && onUpdateTaskStatus(activeId, newStatus);
      } else {
        onTasksChange(arrayMove(tasks, activeIndex, overIndex));
      }
    }

    if (isActiveATask && isOverAColumn) {
      const activeIndex = tasks.findIndex((t) => t.id === activeId);
      if (activeIndex === -1) return;

      const newStatus = overId;
      const newTasks = [...tasks];
      newTasks[activeIndex] = {
        ...newTasks[activeIndex],
        status: newStatus,
      };
      onTasksChange(newTasks);
      onUpdateTaskStatus && onUpdateTaskStatus(activeId, newStatus);
    }
  }

  function onDragEnd() {
    setActiveTask(null);
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
          {COLUMNS.map((col) => (
            <Column
              key={col.id}
              column={col}
              tasks={tasks.filter((task) => task.status === col.id)}
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
