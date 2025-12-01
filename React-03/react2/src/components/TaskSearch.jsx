import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";

export default function TaskSearch({ tasks, toggleComplete, deleteTask }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Filtrar por texto (título o descripción)
      const matchesSearch = searchTerm === "" || 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtrar por estado
      const matchesStatus = statusFilter === "all" || 
        (statusFilter === "completed" && task.completed) ||
        (statusFilter === "pending" && !task.completed);
      
      // Filtrar por fecha
      const matchesDate = dateFilter === "" || 
        task.createdAt.startsWith(dateFilter);
      
      return matchesSearch && matchesStatus && matchesDate;
    }).sort((a, b) => {
      // Ordenar
      if (sortBy === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      } else if (sortBy === "completed") {
        return (a.completed === b.completed) ? 0 : a.completed ? -1 : 1;
      }
      return 0;
    });
  }, [tasks, searchTerm, statusFilter, dateFilter, sortBy]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    filtered: filteredTasks.length
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-[#7B2CBF] mb-4">
          Buscar y Filtrar Tareas
        </h1>
        <p className="text-gray-600">
          Encuentra tareas específicas usando filtros avanzados
        </p>
      </div>

      {/* Panel de filtros */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-2 border-[#E0AAFF]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Buscador */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar por texto
            </label>
            <input
              type="text"
              placeholder="Buscar en título o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border-2 border-[#E0AAFF] rounded-lg focus:outline-none focus:border-[#7B2CBF] focus:ring-2 focus:ring-[#7B2CBF]/20"
            />
          </div>

          {/* Filtro por estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border-2 border-[#E0AAFF] rounded-lg focus:outline-none focus:border-[#7B2CBF] focus:ring-2 focus:ring-[#7B2CBF]/20"
            >
              <option value="all">Todas las tareas</option>
              <option value="completed">Completadas</option>
              <option value="pending">Pendientes</option>
            </select>
          </div>

          {/* Filtro por fecha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por fecha
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-4 py-2 border-2 border-[#E0AAFF] rounded-lg focus:outline-none focus:border-[#7B2CBF] focus:ring-2 focus:ring-[#7B2CBF]/20"
            />
          </div>

          {/* Ordenar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ordenar por
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border-2 border-[#E0AAFF] rounded-lg focus:outline-none focus:border-[#7B2CBF] focus:ring-2 focus:ring-[#7B2CBF]/20"
            >
              <option value="newest">Más recientes</option>
              <option value="oldest">Más antiguas</option>
              <option value="title">Título (A-Z)</option>
              <option value="completed">Estado (completadas primero)</option>
            </select>
          </div>
        </div>

        {/* Botones para limpiar filtros */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
              setDateFilter("");
              setSortBy("newest");
            }}
            className="px-4 py-2 border-2 border-[#E0AAFF] text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-300"
          >
            Limpiar todos los filtros
          </button>
          <button
            onClick={() => setDateFilter(new Date().toISOString().split('T')[0])}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-lg hover:opacity-90 transition-all duration-300"
          >
            Solo tareas de hoy
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow border border-gray-200 text-center">
          <div className="text-2xl font-bold text-[#7B2CBF]">{stats.total}</div>
          <div className="text-sm text-gray-600">Total de tareas</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow border border-gray-200 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-sm text-gray-600">Completadas</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow border border-gray-200 text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-gray-600">Pendientes</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow border border-gray-200 text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.filtered}</div>
          <div className="text-sm text-gray-600">Resultados filtrados</div>
        </div>
      </div>

      {/* Resultados */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Resultados de la búsqueda ({filteredTasks.length} tareas)
        </h2>
        
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center border-2 border-[#E0AAFF]">
            <div className="w-16 h-16 bg-[#E0AAFF] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-[#7B2CBF]">!</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No se encontraron tareas
            </h3>
            <p className="text-gray-500 mb-4">
              No hay tareas que coincidan con los filtros aplicados.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setDateFilter("");
              }}
              className="bg-gradient-to-r from-[#7B2CBF] to-[#9D4EDD] text-white font-medium px-6 py-2 rounded-lg hover:opacity-90 transition-all duration-300"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <div 
                key={task.id} 
                className={`bg-white rounded-xl shadow-lg overflow-hidden border-2 transition-all duration-300 hover:shadow-xl ${
                  task.completed 
                    ? "border-green-300" 
                    : "border-[#E0AAFF] hover:border-[#7B2CBF]"
                }`}
              >
                <div className="p-5">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Link to={`/task/${task.id}`} className="group">
                          <h3 className="text-lg font-bold text-gray-800 group-hover:text-[#7B2CBF] transition-colors">
                            {task.title}
                          </h3>
                        </Link>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          task.completed 
                            ? "bg-green-100 text-green-800 border border-green-200" 
                            : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                        }`}>
                          {task.completed ? "Completada" : "Pendiente"}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {task.description || "Sin descripción"}
                      </p>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                        <span>Creada: {formatDate(task.createdAt)}</span>
                        <span>ID: #{task.id}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                      <button 
                        onClick={() => toggleComplete(task.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                          task.completed
                            ? "bg-yellow-500 text-white hover:bg-yellow-600"
                            : "bg-green-500 text-white hover:bg-green-600"
                        }`}
                      >
                        {task.completed ? "Marcar pendiente" : "Marcar completada"}
                      </button>
                      <Link 
                        to={`/task/${task.id}`}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-[#7B2CBF] text-white hover:bg-[#6A1B9A] transition-all duration-300 text-center"
                      >
                        Ver detalles
                      </Link>
                      <button 
                        onClick={() => deleteTask(task.id)}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-all duration-300"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                  
                  {searchTerm && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        <span className="font-medium">Coincidencia encontrada en:</span> 
                        {task.title.toLowerCase().includes(searchTerm.toLowerCase()) && " título"}
                        {task.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) && " y"}
                        {task.description.toLowerCase().includes(searchTerm.toLowerCase()) && " descripción"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Exportar resultados */}
      {filteredTasks.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-[#E0AAFF]">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Exportar resultados</h3>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => {
                const dataStr = JSON.stringify(filteredTasks, null, 2);
                const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                const exportFileDefaultName = `tareas-filtradas-${new Date().toISOString().split('T')[0]}.json`;
                const linkElement = document.createElement('a');
                linkElement.setAttribute('href', dataUri);
                linkElement.setAttribute('download', exportFileDefaultName);
                linkElement.click();
              }}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-lg hover:opacity-90 transition-all duration-300"
            >
              Exportar JSON ({filteredTasks.length} tareas)
            </button>
            <button
              onClick={() => {
                const csvContent = "data:text/csv;charset=utf-8," 
                  + ["ID,Título,Descripción,Estado,Fecha de creación", 
                     ...filteredTasks.map(t => 
                       `${t.id},"${t.title}","${t.description}",${t.completed ? 'Completada' : 'Pendiente'},${t.createdAt}`
                     )].join('\n');
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", `tareas-${new Date().toISOString().split('T')[0]}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-lg hover:opacity-90 transition-all duration-300"
            >
              Exportar CSV
            </button>
          </div>
        </div>
      )}
    </div>
  );
}