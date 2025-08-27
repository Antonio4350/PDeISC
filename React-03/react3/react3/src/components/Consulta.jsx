import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Consulta() {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState("");
  const [filtro, setFiltro] = useState("");
  const [campo, setCampo] = useState("nombre"); // por defecto buscar por nombre
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/users")
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo conectar con el servidor");
        return res.json();
      })
      .then((data) => setUsuarios(data))
      .catch((err) => setError(err.message));
  }, []);

  function eliminar(id) {
    fetch(`http://localhost:3000/users/${id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo eliminar el usuario");
        setUsuarios(usuarios.filter((u) => u.id !== id));
      })
      .catch((err) => setError(err.message));
  }

  // Filtrado dinámico
  const usuariosFiltrados = usuarios.filter((u) => {
    if (!filtro) return true;
    const valor = (u[campo] || "").toString().toLowerCase();
    return valor.includes(filtro.toLowerCase());
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-blue-700">Consulta de Usuarios</h2>

      {/* Barra de búsqueda */}
      <div className="flex gap-2">
        <select
          value={campo}
          onChange={(e) => setCampo(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="nombre">Nombre</option>
          <option value="apellido">Apellido</option>
          <option value="email">Email</option>
          <option value="telefono">Teléfono</option>
          <option value="celular">Celular</option>
          <option value="direccion">Dirección</option>
        </select>

        <input
          type="text"
          placeholder={`Buscar por ${campo}...`}
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="flex-grow border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && (
        <div className="p-4 text-red-600 font-bold bg-red-100 rounded">
          Error: {error}
        </div>
      )}

      {usuariosFiltrados.length === 0 ? (
        <p className="text-gray-600">No hay usuarios que coincidan.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {usuariosFiltrados.map((u) => (
            <div
              key={u.id}
              className="bg-white p-6 shadow rounded-xl space-y-2 border"
            >
              <p>
                <span className="font-semibold text-blue-700">Nombre:</span>{" "}
                {u.nombre} {u.apellido}
              </p>
              <p>
                <span className="font-semibold text-blue-700">Email:</span>{" "}
                {u.email}
              </p>
              <p>
                <span className="font-semibold text-blue-700">Tel:</span>{" "}
                {u.telefono} / {u.celular}
              </p>
              <p>
                <span className="font-semibold text-blue-700">Dirección:</span>{" "}
                {u.direccion}
              </p>
              <p>
                <span className="font-semibold text-blue-700">Fecha Nac:</span>{" "}
                {u.fecha_nacimiento?.split("T")[0] || "Sin fecha"}
              </p>

              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => navigate(`/editar/${u.id}`)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => eliminar(u.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Consulta;
