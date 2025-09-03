import { useState } from "react";

export default function LoginModal({ setShowLogin, setIsLogged }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user, password: pass }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error de login");

      // 🔹 Login exitoso
      setIsLogged(true);
      setShowLogin(false);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <form onSubmit={handleLogin} className="bg-gray-800 p-6 rounded shadow space-y-4">
        <h2 className="text-xl font-bold text-purple-400">Login</h2>
        <input
          value={user}
          onChange={(e) => setUser(e.target.value)}
          placeholder="Usuario"
          className="w-full p-2 bg-gray-700 rounded"
        />
        <input
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          type="password"
          placeholder="Contraseña"
          className="w-full p-2 bg-gray-700 rounded"
        />
        {error && <p className="text-red-400">{error}</p>}
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => setShowLogin(false)} className="px-3 py-1 bg-gray-600 rounded">Cancelar</button>
          <button type="submit" className="px-3 py-1 bg-purple-600 rounded">Entrar</button>
        </div>
      </form>
    </div>
  );
}
