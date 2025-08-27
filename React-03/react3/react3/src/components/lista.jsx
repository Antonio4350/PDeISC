import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Lista() {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/users')
      .then(res => {
        if (!res.ok) throw new Error("No se pudo conectar con el servidor");
        return res.json();
      })
      .then(data => setUsuarios(data))
      .catch(err => setError(err.message));
  }, []);

function eliminar(id) {
  fetch(`http://localhost:3000/users/${id}`, { method: 'DELETE' })
    .then(res => {
      if (!res.ok) throw new Error("No se pudo eliminar el usuario");
      setUsuarios(usuarios.filter(u => u.id !== id));
    })
    .catch(err => setError(err.message));
}

  if (error) {
    return (
      <div className="container mx-auto p-6 text-red-600 font-bold">
        Error: {error}
      </div>
    );
  }

  if (usuarios.length === 0) {
    return (
      <div className="container mx-auto p-6 text-gray-600">
        No hay usuarios para mostrar.
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {usuarios.map(u => (
        <div key={u.id} className="bg-white shadow-xl rounded-xl p-6 border border-gray-200 hover:shadow-2xl hover:scale-105 transition-transform">
          <p className="font-bold text-xl text-blue-700">{u.nombre} {u.apellido}</p>
          <p className="text-gray-700">Dirección: {u.direccion}</p>
          <p className="text-gray-700">Tel: {u.telefono} / Cel: {u.celular}</p>
          <p className="text-gray-700">Fecha Nac: {u.fecha_nacimiento ? u.fecha_nacimiento.split('T')[0] : "Sin fecha"}</p>
          <p className="text-gray-700">Email: {u.email}</p>
          <div className="flex gap-2 mt-4">
            <Link to={`/consulta/${u.id}`} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors">Consultar</Link>
            <Link to={`/editar/${u.id}`} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-colors">Editar</Link>
            <button onClick={() => eliminar(u.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors">Eliminar</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Lista;