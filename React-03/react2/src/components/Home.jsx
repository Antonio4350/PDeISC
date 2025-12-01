import React from "react";
import { Link } from "react-router-dom";

export default function Home({ tasks, toggleComplete, deleteTask }) {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-[#7B2CBF] mb-4">
          Lista de Tareas
        </h1>
        <p className="text-gray-600">
          {tasks.length} tarea{tasks.length !== 1 ? 's' : ''} registrada{tasks.length !== 1 ? 's' : ''}
        </p>
      </div>

      {tasks.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center border-2 border-[#E0AAFF] max-w-md mx-auto">
          <div className="w-16 h-16 bg-[#E0AAFF] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-[#7B2CBF]">!</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No hay tareas registradas
          </h3>
          <p className="text-gray-500 mb-6">
            Comienza creando tu primera tarea
          </p>
          <Link 
            to="/create" 
            className="inline-block bg-gradient-to-r from-[#7B2CBF] to-[#9D4EDD] text-white font-medium px-6 py-3 rounded-lg hover:opacity-90 transition-all duration-300 shadow-md"
          >
            Crear primera tarea
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div 
              key={task.id} 
              className={`bg-white rounded-xl shadow-lg overflow-hidden border-2 transition-all duration-300 hover:shadow-xl ${
                task.completed 
                  ? "border-green-300" 
                  : "border-[#E0AAFF] hover:border-[#7B2CBF]"
              }`}
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <Link to={`/task/${task.id}`} className="group">
                      <h2 className="text-lg font-bold text-gray-800 group-hover:text-[#7B2CBF] transition-colors truncate">
                        {task.title}
                      </h2>
                      <p className="text-xs text-gray-400 mt-1">
                        Creada el {formatDate(task.createdAt)}
                      </p>
                    </Link>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    task.completed 
                      ? "bg-green-100 text-green-800 border border-green-200" 
                      : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                  }`}>
                    {task.completed ? "Completada" : "Pendiente"}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px]">
                  {task.description || "Sin descripción"}
                </p>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button 
                      onClick={() => toggleComplete(task.id)}
                      className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                        task.completed
                          ? "bg-yellow-500 text-white hover:bg-yellow-600"
                          : "bg-green-500 text-white hover:bg-green-600"
                      }`}
                    >
                      {task.completed ? "Pendiente" : "Completar"}
                    </button>
                    <Link 
                      to={`/task/${task.id}`}
                      className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-sm font-medium bg-[#7B2CBF] text-white hover:bg-[#6A1B9A] transition-all duration-300 text-center"
                    >
                      Ver detalles
                    </Link>
                  </div>
                  <button 
                    onClick={() => deleteTask(task.id)}
                    className="w-full sm:w-auto px-3 py-1.5 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-all duration-300"
                  >
                    Eliminar tarea
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}