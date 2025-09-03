export default function Navbar({ setShowLogin, isLogged, setIsLogged }) {
  return (
    <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between fixed top-0 left-0 w-full z-50">
      <div className="font-bold text-purple-400">Mi Portfolio</div>
      <div className="space-x-4">
        <a href="#inicio" className="hover:text-purple-300">Inicio</a>
        <a href="#sobre-mi" className="hover:text-purple-300">Sobre mí</a>
        <a href="#habilidades" className="hover:text-purple-300">Habilidades</a>
        <a href="#proyectos" className="hover:text-purple-300">Proyectos</a>
        {!isLogged ? (
          <button onClick={() => setShowLogin(true)} className="ml-4 bg-purple-600 px-3 py-1 rounded">Login</button>
        ) : (
          <button onClick={() => setIsLogged(false)} className="ml-4 bg-red-600 px-3 py-1 rounded">Salir</button>
        )}
      </div>
    </nav>
  );
}
