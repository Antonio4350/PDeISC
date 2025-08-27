import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="bg-blue-700 shadow-lg">
  <nav className="container mx-auto flex flex-col md:flex-row items-center justify-between p-6">
    <h1 className="text-white font-bold text-2xl mb-4 md:mb-0">Gestión de Usuarios</h1>
    <div className="flex flex-col md:flex-row gap-4">
      <Link to="/" className="text-white hover:text-blue-200 font-semibold text-lg transition-colors">Lista</Link>
      <Link to="/agregar" className="text-white hover:text-blue-200 font-semibold text-lg transition-colors">Agregar</Link>
      <Link to="/consulta" className="text-white hover:text-blue-200 font-semibold text-lg transition-colors">Consulta</Link>
    </div>
  </nav>
</header>
  );
}

export default Header;
