import { useState } from "react";

export default function LoginModal({ setShowLogin, setIsLogged }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user === "admin" && pass === "1234") {
      setIsLogged(true);
      setShowLogin(false);
    } else {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70">
      <div className="bg-gray-800 p-6 rounded shadow max-w-sm w-full">
        <h2 className="text-2xl font-bold text-purple-400 mb-4">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Usuario"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="w-full p-2 bg-gray-700 rounded text-gray-100"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className="w-full p-2 bg-gray-700 rounded text-gray-100"
          />
          {error && <p className="text-red-400">{error}</p>}
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setShowLogin(false)}
              className="px-3 py-1 bg-gray-600 rounded text-white"
            >
              Cancelar
            </button>
            <button type="submit" className="px-3 py-1 bg-purple-600 rounded text-white">
              Ingresar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
