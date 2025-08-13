import { useState } from "react";

function FormularioSimple() {
  const [getnombre, setNombre] = useState("");
  const [getenviado, setEnviado] = useState(false);
  const [geterror, setError] = useState("");

  const manejarSubmit = (e) => {
    e.preventDefault();

    if (/\d/.test(getnombre)) {
      setError("El nombre no debe contener numeros.");
      setEnviado(false);
      return;
    }
    setError("");
    setEnviado(true);
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md">
      <form onSubmit={manejarSubmit} className="flex flex-col gap-4">
        <label htmlFor="nombre" className="font-semibold text-gray-700">Nombre:</label>
        <input 
        id="nombre" 
        type="text" 
        value={getnombre} 
        onChange={(e) => {setNombre(e.target.value); setEnviado(false); setError(""); }} 
        className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
        placeholder="nombre" required />
        <button type="submit" className="bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">Enviar 
        </button>
      </form>

      {geterror && (
        <p className="mt-4 text-red-600 font-semibold text-center">{geterror}</p>
      )}

      {getenviado && !geterror && (
        <p className="mt-6 text-center text-green-600 font-semibold">¡Bienvenido, {getnombre}!</p>
      )}
    </div>
  );
}

export default FormularioSimple;
