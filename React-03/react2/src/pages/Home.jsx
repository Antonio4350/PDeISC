import React from "react";
import { Link } from "react-router-dom";

export default function Home({ tasks }) {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Lista de Tareas</h1>
      <ul className="space-y-4">
        {tasks.map((task) => (
          <li key={task.id} className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold">{task.title}</h2>
            <p>{task.shortDescription}</p>
            <Link
              to={`/task/${task.id}`}
              className="text-blue-600 hover:underline mt-2 block"
            >
              Ver detalle
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
