import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Home from "./components/Home";
import CreateTask from "./components/CreateTask";
import TaskDetail from "./components/TaskDetail";
import "./index.css";

export default function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("tasks");
    if (stored) setTasks(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task) => {
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        title: task.title,
        description: task.description,
        completed: task.completed || false,
        createdAt: new Date().toISOString().split("T")[0],
      },
    ]);
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

  return (
    <Router>
      <header className="bg-blue-600 text-white p-4 flex gap-4">
        <NavLink to="/" className={({ isActive }) => isActive ? "underline" : "hover:underline"}>Inicio</NavLink>
        <NavLink to="/create" className={({ isActive }) => isActive ? "underline" : "hover:underline"}>Crear Tarea</NavLink>
        <NavLink to="/details" className={({ isActive }) => isActive ? "underline" : "hover:underline"}>Detalles</NavLink>
      </header>

      <main className="p-4 min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Home tasks={tasks} toggleComplete={toggleComplete} deleteTask={deleteTask} />} />
          <Route path="/create" element={<CreateTask addTask={addTask} />} />
          <Route path="/details" element={<TaskDetail tasks={tasks} />} />
        </Routes>
      </main>
    </Router>
  );
}
