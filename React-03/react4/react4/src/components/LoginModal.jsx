import { useState } from "react";

export default function LoginModal({ setShowLogin, setIsLogged }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  function handleLogin(e) {
    e.preventDefault();
    if (user === "admin" && pass === "1234") {
      setIsLogged(true);
      setShowLogin(false);
    } else {
      alert("Credenciales incorrectas");
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <form onSubmit={handleLogin} className="bg-gray-800 p-6 rounded shadow space-y-4">
        <h2 className="text-xl font-bold text-purple-400">Login</h2>
        <input value={user} onChange={(e) => setUser(e.target.value)} placeholder="Usuario" className="w-full p-2 bg-gray-700 rounded" />
        <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="Contraseña" className="w-full p-2 bg-gray-700 rounded" />
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => setShowLogin(false)} className="px-3 py-1 bg-gray-600 rounded">Cancelar</button>
          <button type="submit" className="px-3 py-1 bg-purple-600 rounded">Entrar</button>
        </div>
      </form>
    </div>
  );
}
