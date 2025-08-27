import { useState } from 'react'
import './App.css'
import UserManager from "./components/UserManager";

export default function App() {
  const [section, setSection] = useState("listado");

  const links = [
    { key: "alta", label: "Alta" },
    { key: "baja", label: "Baja" },
    { key: "modificacion", label: "Modificación" },
    { key: "listado", label: "Listado" },
    { key: "consulta", label: "Consulta" },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header con navegación */}
      <header className="bg-gray-900 shadow-md p-4 flex justify-center gap-6">
        {links.map((link) => (
          <button
            key={link.key}
            onClick={() => setSection(link.key)}
            className={`px-3 py-1 rounded transition ${
              section === link.key
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-700 text-gray-300"
            }`}
          >
            {link.label}
          </button>
        ))}
      </header>

      {/* Contenido */}
      <main className="flex-1 flex items-center justify-center p-6">
        {/* Por ahora mostramos siempre UserManager */}
        <UserManager activeSection={section} />
      </main>

      <footer className="bg-gray-900 text-gray-400 text-center py-3 text-sm">
        © {new Date().getFullYear()} Gestión de Usuarios - React + Tailwind
      </footer>
    </div>
  );
}