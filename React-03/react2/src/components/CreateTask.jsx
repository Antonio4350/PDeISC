import React, { useState } from "react";

export default function CreateTask({ addTask }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    addTask({
      title: title.trim(),
      description: description.trim(),
      completed: false
    });

    setTitle("");
    setDescription("");
    setError("");
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Crear nueva tarea</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Titulo" value={title} onChange={(e) => setTitle(e.target.value)} className="border p-2 w-full" />
        <textarea placeholder="Descripcion" value={description} onChange={(e) => setDescription(e.target.value)} className="border p-2 w-full"></textarea>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Crear tarea</button>
      </form>
    </div>
  );
}
