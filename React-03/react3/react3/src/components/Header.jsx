import { Link } from "react-router-dom";
import { useState } from "react";

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-blue-700 shadow-lg">
      <nav className="container mx-auto flex flex-wrap items-center justify-between p-4 md:p-6">
        <h1 className="text-white font-bold text-2xl">Gestion de Usuarios</h1>

        <button
          className="text-white md:hidden focus:outline-none"
          onClick={() => setOpen(!open)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>

        {/* Menú */}
        <div
          className={`w-full md:w-auto md:flex md:items-center ${
            open ? "block" : "hidden"
          }`}
        >
          <div className="flex flex-col md:flex-row gap-4 mt-4 md:mt-0">
            <Link
              to="/"
              className="text-white hover:text-blue-200 font-semibold text-lg transition-colors"
              onClick={() => setOpen(false)}
            >
              Lista
            </Link>
            <Link
              to="/agregar"
              className="text-white hover:text-blue-200 font-semibold text-lg transition-colors"
              onClick={() => setOpen(false)}
            >
              Agregar
            </Link>
            <Link
              to="/consulta"
              className="text-white hover:text-blue-200 font-semibold text-lg transition-colors"
              onClick={() => setOpen(false)}
            >
              Consulta
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
