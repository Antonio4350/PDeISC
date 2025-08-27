import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

function Consulta() {
  const { id } = useParams();
  const [usuario, setUsuario] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3000/users/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("No se pudo cargar el usuario");
        return res.json();
      })
      .then(data => setUsuario(data))
      .catch(err => setError(err.message));
  }, [id]);

  function eliminar() {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
    fetch(`http://localhost:3000/users/${id}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error("No se pudo eliminar el usuario");
        navigate("/");
      })
      .catch(err => setError(err.message));
  }

  if (error) return <div className="p-6 text-red-600 font-bold bg-red-100 rounded">{error}</div>;
  if (!usuario) return <p className="p-6 text-gray-600">Cargando...</p>;

  return (
    <div className="max-w-lg mx-auto p-8 bg-white rounded-xl shadow-xl space-y-4 mt-8">
      <p><span className="font-semibold text-blue-700">Nombre:</span> {usuario.nombre}</p>
      <p><span className="font-semibold text-blue-700">Apellido:</span> {usuario.apellido}</p>
      <p><span className="font-semibold text-blue-700">Dirección:</span> {usuario.direccion}</p>
      <p><span className="font-semibold text-blue-700">Teléfono:</span> {usuario.telefono}</p>
      <p><span className="font-semibold text-blue-700">Celular:</span> {usuario.celular}</p>
      <p><span className="font-semibold text-blue-700">Fecha Nac:</span> {usuario.fecha_nacimiento ? usuario.fecha_nacimiento.split('T')[0] : "Sin fecha"}</p>
      <p><span className="font-semibold text-blue-700">Email:</span> {usuario.email}</p>
      <div className="flex gap-4 mt-6">
        <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors font-semibold shadow">Volver</Link>
        <button onClick={eliminar} className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors font-semibold shadow">Eliminar</button>
      </div>
    </div>
  );
}

export default Consulta;