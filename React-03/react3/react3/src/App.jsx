import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Lista from "./components/Lista.jsx";
import Agregar from "./components/Agregar.jsx";
import Editar from "./components/Editar.jsx";
import Consulta from "./components/Consulta.jsx";
import "./App.css";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Header */}
      <Header />

      {/* Contenido principal */}
      <main className="container mx-auto py-8">
        <Routes>
          <Route path="/" element={<Lista />} />
          <Route path="/agregar" element={<Agregar />} />
          <Route path="/editar/:id" element={<Editar />} />
          <Route path="/consulta" element={<Consulta />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
