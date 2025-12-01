import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Home from "./components/Home";
import CreateTask from "./components/CreateTask";
import TaskDetail from "./components/TaskDetail";
import TaskSearch from "./components/TaskSearch";
import "./index.css";

export default function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("tasks");
    if (stored) {
      try {
        setTasks(JSON.parse(stored));
      } catch (error) {
        console.error("Error loading tasks:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  const addTask = (task) => {
    const newTask = {
      id: Date.now(),
      title: task.title,
      description: task.description,
      completed: task.completed || false,
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
    return newTask;
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const getTaskById = (id) => {
    const taskId = parseInt(id);
    return tasks.find(task => task.id === taskId);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-[#F8F7FF] to-white">
        <header className="bg-gradient-to-r from-[#7B2CBF] to-[#9D4EDD] text-white shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-between items-center">
              <div className="text-xl font-bold">Gestor de Tareas</div>
              <div className="flex flex-wrap gap-3 sm:gap-6 justify-center">
                <NavLink 
                  to="/" 
                  className={({ isActive }) => 
                    `px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm sm:text-base ${
                      isActive 
                        ? "bg-white/20 border-b-2 border-white" 
                        : "hover:bg-white/10"
                    }`
                  }
                >
                  Inicio
                </NavLink>
                <NavLink 
                  to="/search" 
                  className={({ isActive }) => 
                    `px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm sm:text-base ${
                      isActive 
                        ? "bg-white/20 border-b-2 border-white" 
                        : "hover:bg-white/10"
                    }`
                  }
                >
                  Buscar Tareas
                </NavLink>
                <NavLink 
                  to="/create" 
                  className={({ isActive }) => 
                    `px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm sm:text-base ${
                      isActive 
                        ? "bg-white/20 border-b-2 border-white" 
                        : "hover:bg-white/10"
                    }`
                  }
                >
                  Crear Tarea
                </NavLink>
              </div>
            </nav>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={
              <Home 
                tasks={tasks} 
                toggleComplete={toggleComplete} 
                deleteTask={deleteTask} 
              />
            } />
            <Route path="/search" element={
              <TaskSearch 
                tasks={tasks} 
                toggleComplete={toggleComplete} 
                deleteTask={deleteTask} 
              />
            } />
            <Route path="/create" element={<CreateTask addTask={addTask} />} />
            <Route path="/task/:id" element={
              <TaskDetail getTaskById={getTaskById} />
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}