import React from "react";
import { useParams, Link } from "react-router-dom";

export default function TaskDetail({ tasks }) {
  const { id } = useParams();
  const task = tasks.find((t) => t.id === Number(id));

  if (!task) {
    return <p className="text-red-500">Tarea no encontrada</p>;
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold">{task.title}</h1>
      <p className="mt-2">{task.description}</p>
      <p className="mt-2 text-sm text-gray-500">
        Fecha de creación: {task.createdAt}
      </p>
      <p
        className={`mt-2 font-semibold ${
          task.completed ? "text-green-600" : "text-red-600"
        }`}
      >
        Estado: {task.completed ? "Completa" : "Incompleta"}
      </p>
      <Link to="/" className="text-blue-600 hover:underline mt-4 block">
        Volver a la lista
      </Link>
    </div>
  );
}
