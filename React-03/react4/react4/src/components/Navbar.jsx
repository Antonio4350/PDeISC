export default function Navbar({ setShowLogin, isLogged, setIsLogged }) {
  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-950 text-gray-100 shadow-md z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 md:px-12 h-16">
        {/* Logo */}
        <a href="#inicio" className="text-purple-400 text-xl font-bold hover:text-purple-300">
          MiPortfolio
        </a>

        {/* Links */}
        <div className="space-x-6 hidden sm:flex">
          <a href="#inicio" className="hover:text-purple-400">Inicio</a>
          <a href="#sobre-mi" className="hover:text-purple-400">Sobre mí</a>
          <a href="#habilidades" className="hover:text-purple-400">Habilidades</a>
          <a href="#proyectos" className="hover:text-purple-400">Proyectos</a>
        </div>

        {/* Botón login/logout */}
        <div>
          {isLogged ? (
            <button
              onClick={() => setIsLogged(false)}
              className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-sm"
            >
              Cerrar sesión
            </button>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="px-3 py-1 rounded bg-purple-600 hover:bg-purple-700 text-sm"
            >
              Iniciar sesión
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
