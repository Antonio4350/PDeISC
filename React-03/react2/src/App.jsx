import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { initialTasks } from "./data/tasks";
import Home from "./pages/Home";
import TaskDetail from "./pages/TaskDetail";
import CreateTask from "./pages/CreateTask";

function App() {
  const [tasks, setTasks] = useState(initialTasks);

  const addTask = (task) => {
    setTasks([...tasks, { ...task, id: tasks.length + 1 }]);
  };

  return (
    <Router>
      <nav className="bg-blue-600 text-white p-4 flex gap-4">
        <Link to="/" className="hover:underline">Inicio</Link>
        <Link to="/create" className="hover:underline">Crear Tarea</Link>
      </nav>
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Home tasks={tasks} />} />
          <Route path="/task/:id" element={<TaskDetail tasks={tasks} />} />
          <Route path="/create" element={<CreateTask addTask={addTask} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
