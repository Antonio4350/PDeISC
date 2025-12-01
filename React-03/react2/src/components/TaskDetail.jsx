import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

export default function TaskDetail({ getTaskById }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const task = getTaskById(id);

  if (!task) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-[#E0AAFF] text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-bold text-red-500">X</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-700 mb-4">
            Tarea no encontrada
          </h2>
          <p className="text-gray-500 mb-6">
            La tarea que buscas no existe o ha sido eliminada.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 border-2 border-[#E0AAFF] text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-300"
            >
              Volver al inicio
            </button>
            <button
              onClick={() => navigate("/search")}
              className="px-6 py-3 bg-gradient-to-r from-[#7B2CBF] to-[#9D4EDD] text-white font-medium rounded-lg hover:opacity-90 transition-all duration-300"
            >
              Buscar tareas
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('es-ES', options);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Link 
          to="/" 
          className="inline-flex items-center text-[#7B2CBF] hover:text-[#6A1B9A] font-medium transition-colors"
        >
          <span className="mr-2">←</span>
          Volver a la lista de tareas
        </Link>
        <div className="flex gap-3">
          <Link 
            to="/search"
            className="px-4 py-2 border-2 border-[#E0AAFF] text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-300 text-sm"
          >
            Buscar más tareas
          </Link>
          <Link 
            to="/create"
            className="px-4 py-2 bg-gradient-to-r from-[#7B2CBF] to-[#9D4EDD] text-white font-medium rounded-lg hover:opacity-90 transition-all duration-300 text-sm"
          >
            Crear nueva
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-[#E0AAFF]">
        <div className={`p-1 ${
          task.completed ? "bg-gradient-to-r from-green-50 to-emerald-50" : "bg-gradient-to-r from-[#F8F7FF] to-purple-50"
        }`}>
          <div className="bg-white rounded-xl p-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                    task.completed 
                      ? "bg-green-100 text-green-800 border border-green-200" 
                      : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                  }`}>
                    {task.completed ? "COMPLETADA" : "PENDIENTE"}
                  </span>
                  <span className="text-sm text-gray-500">
                    ID: #{task.id}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {task.title}
                </h1>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-xl border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Fecha de creación
                </h3>
                <p className="text-lg font-medium text-gray-800">
                  {formatDate(task.createdAt)}
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-xl border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Estado actual
                </h3>
                <p className={`text-lg font-medium ${task.completed ? "text-green-600" : "text-yellow-600"}`}>
                  {task.completed ? "Completada" : "En progreso"}
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">
                Descripción completa
              </h2>
              <div className="bg-gray-50 p-6 rounded-xl">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {task.description || "Esta tarea no tiene descripción."}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-between pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Última actualización: {formatDate(task.createdAt)}
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate("/search")}
                  className="px-6 py-2.5 border-2 border-[#E0AAFF] text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-300"
                >
                  Buscar tareas
                </button>
                <button
                  onClick={() => navigate("/create")}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#7B2CBF] to-[#9D4EDD] text-white font-medium rounded-lg hover:opacity-90 transition-all duration-300"
                >
                  Crear nueva tarea
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}