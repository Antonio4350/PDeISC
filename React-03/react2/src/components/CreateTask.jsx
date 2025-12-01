import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateTask({ addTask }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
    navigate("/");
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#E0AAFF]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#7B2CBF] mb-2">
            Crear Nueva Tarea
          </h1>
          <p className="text-gray-500">
            Completa los detalles de tu nueva tarea
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Título
            </label>
            <input 
              type="text" 
              placeholder="Ej:Aprovar" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="w-full px-4 py-3 border-2 border-[#E0AAFF] rounded-lg focus:outline-none focus:border-[#7B2CBF] focus:ring-2 focus:ring-[#7B2CBF]/20 transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Descripción
            </label>
            <textarea 
              placeholder="Describe los detalles de la tarea..." 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              rows="4"
              className="w-full px-4 py-3 border-2 border-[#E0AAFF] rounded-lg focus:outline-none focus:border-[#7B2CBF] focus:ring-2 focus:ring-[#7B2CBF]/20 transition-all duration-300"
            />
          </div>

          <div className="pt-4 border-t border-gray-100">
            <div className="flex gap-4">
              <button 
                type="button"
                onClick={() => navigate("/")}
                className="flex-1 px-6 py-3 border-2 border-[#E0AAFF] text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-300"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="flex-1 bg-gradient-to-r from-[#7B2CBF] to-[#9D4EDD] text-white font-medium px-6 py-3 rounded-lg hover:opacity-90 hover:shadow-lg transition-all duration-300"
              >
                Crear Tarea
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}