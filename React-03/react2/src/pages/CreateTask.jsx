import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateTask({ addTask }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert("El título y la descripción son obligatorios.");
      return;
    }

    addTask({
      title,
      description,
      shortDescription: description.slice(0, 20) + "...",
      createdAt: new Date().toISOString().split("T")[0],
      completed
    });

    navigate("/");
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Crear Nueva Tarea</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Título</label>
          <input
            type="text"
            className="border p-2 w-full rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Descripción</label>
          <textarea
            className="border p-2 w-full rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
            />
            Marcar como completa
          </label>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Guardar Tarea
        </button>
      </form>
    </div>
  );
}
