export default function Navbar({ setShowLogin, isLogged, setIsLogged }) {
  return (
    <header className="sticky top-0 bg-gray-950/80 backdrop-blur border-b border-gray-700 z-10">
      <nav className="max-w-6xl mx-auto flex justify-between items-center p-4">
        <span className="text-purple-400 font-bold text-xl">Mi Portfolio</span>
        <div className="flex gap-4">
          <a href="#inicio" className="hover:text-purple-400">Inicio</a>
          <a href="#sobre-mi" className="hover:text-purple-400">Sobre mí</a>
          <a href="#habilidades" className="hover:text-purple-400">Habilidades</a>
          <a href="#proyectos" className="hover:text-purple-400">Proyectos</a>
          {!isLogged ? (
            <button
              onClick={() => setShowLogin(true)}
              className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-white"
            >
              Login
            </button>
          ) : (
            <button
              onClick={() => setIsLogged(false)}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white"
            >
              Salir
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
