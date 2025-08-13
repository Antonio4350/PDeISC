import React from "react";

export default function Home({ tasks, toggleComplete, deleteTask }) {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Lista de Tareas</h1>
      <ul className="space-y-4">
        {tasks.map((task) => (
          <li key={task.id} className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold">{task.title}</h2>
            <p className="text-sm text-gray-400">Creada el {task.createdAt}</p>
            <p className={`mt-1 ${task.completed ? "text-green-600" : "text-red-600"}`}>
              {task.completed ? "Completada" : "Pendiente"}
            </p>
            <div className="flex gap-2 mt-2">
              <button onClick={() => toggleComplete(task.id)} className="bg-yellow-500 text-white px-2 py-1 rounded">Cambiar estado</button>
              <button onClick={() => deleteTask(task.id)} className="bg-red-500 text-white px-2 py-1 rounded">Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
