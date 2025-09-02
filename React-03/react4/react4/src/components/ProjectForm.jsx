import { useState } from "react";

export default function ProjectForm({ onAgregar }) {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!titulo.trim() || !descripcion.trim()) return;
    onAgregar({ titulo, descripcion });
    setTitulo("");
    setDescripcion("");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 p-4 bg-gray-900 rounded shadow w-full max-w-md">
      <h3 className="text-lg font-bold text-purple-400 mb-3">Agregar Proyecto</h3>
      <input
        type="text"
        placeholder="Título"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        className="w-full mb-2 p-2 bg-gray-700 rounded text-gray-100"
      />
      <textarea
        placeholder="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        className="w-full mb-2 p-2 bg-gray-700 rounded text-gray-100"
      />
      <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded text-white">
        Guardar
      </button>
    </form>
  );
}
