import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Formulario from "./Formulario.jsx";

function Editar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`http://localhost:3000/users/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar el usuario");
        return res.json();
      })
      .then((data) => {
        // Asegurarse que fecha este en formato YYYY-MM-DD
        if (data.fecha_nacimiento) {
          data.fecha_nacimiento = data.fecha_nacimiento.split("T")[0];
        }
        setUsuario(data);
      })
      .catch((err) => setError(err.message));
  }, [id]);

  // Guardar cambios
  function guardar(data) {
    const payload = { ...data, fechaNacimiento: data.fecha_nacimiento };

    fetch(`http://localhost:3000/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo guardar el usuario");
        return res.json();
      })
      .then(() => navigate("/"))
      .catch((err) => setError(err.message));
  }

  if (error)
    return (
      <div className="p-6 text-red-600 font-bold bg-red-100 rounded">{error}</div>
    );
  if (!usuario) return <p className="p-6 text-gray-600">Cargando...</p>;

  return (
    <div className="max-w-xl mx-auto mt-8">
      <Formulario usuario={usuario} onSubmit={guardar} />
    </div>
  );
}

export default Editar;
