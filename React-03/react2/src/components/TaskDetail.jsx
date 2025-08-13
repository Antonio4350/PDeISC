import React, { useState } from "react";

export default function TaskDetail({ tasks }) {
  const [completedFilter, setCompletedFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredTasks = tasks.filter((task) => {
    const matchCompleted =
      completedFilter === "all"
        ? true
        : completedFilter === "completed"
        ? task.completed
        : !task.completed;

    const matchDate =
      (!startDate || task.createdAt >= startDate) &&
      (!endDate || task.createdAt <= endDate);

    return matchCompleted && matchDate;
  });

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Detalles de Tareas</h1>

      <div className="flex gap-4 mb-4">
        <select value={completedFilter} onChange={(e) => setCompletedFilter(e.target.value)} className="p-2 border rounded">
          <option value="all">Todas</option>
          <option value="completed">Completadas</option>
          <option value="pending">Pendientes</option>
        </select>

        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="p-2 border rounded" />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="p-2 border rounded" />
      </div>

      <ul className="space-y-4">
        {filteredTasks.map((task) => (
          <li key={task.id} className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold">{task.title}</h2>
            <p>{task.description}</p>
            <p className="text-sm text-gray-500">Fecha: {task.createdAt}</p>
            <p className="text-sm">{task.completed ? "✅ Completada" : "⌛ Pendiente"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
