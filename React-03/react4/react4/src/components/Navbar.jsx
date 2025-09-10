export default function Navbar({ setShowLogin, isLogged, setIsLogged, toggleEdit }) {
  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-950 text-gray-100 shadow-md z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 md:px-12 h-16">
        <a href="#inicio" className="text-purple-400 text-lg md:text-xl font-bold hover:text-purple-300">
          MiPortfolio
        </a>

        <div className="space-x-4 md:space-x-6 hidden sm:flex">
          <a href="#inicio" className="hover:text-purple-400 text-sm md:text-base">Inicio</a>
          <a href="#sobre-mi" className="hover:text-purple-400 text-sm md:text-base">Sobre mí</a>
          <a href="#habilidades" className="hover:text-purple-400 text-sm md:text-base">Habilidades</a>
          <a href="#proyectos" className="hover:text-purple-400 text-sm md:text-base">Proyectos</a>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          {isLogged && (
            <button onClick={toggleEdit} className="px-2 py-1 md:px-3 md:py-1 rounded bg-purple-600 hover:bg-purple-700 text-sm md:text-base">
              Editar
            </button>
          )}
          {isLogged ? (
            <button onClick={() => setIsLogged(false)} className="px-2 py-1 md:px-3 md:py-1 rounded bg-red-600 hover:bg-red-700 text-sm md:text-base">
              Cerrar sesión
            </button>
          ) : (
            <button onClick={() => setShowLogin(true)} className="px-2 py-1 md:px-3 md:py-1 rounded bg-purple-600 hover:bg-purple-700 text-sm md:text-base">
              Iniciar sesión
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
