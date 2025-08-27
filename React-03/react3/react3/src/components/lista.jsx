import { useState, useEffect } from 'react';

function Lista() {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch('http://localhost:3000/users')
      .then(res => {
        if (!res.ok) throw new Error("No se pudo conectar con el servidor");
        return res.json();
      })
      .then(data => setUsuarios(data))
      .catch(err => setError(err.message));
  }, []);

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
    <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-8 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {usuarios.map(u => (
        <div
          key={u.id}
          className="bg-white shadow-xl rounded-xl p-6 border border-gray-200 hover:shadow-2xl hover:scale-105 transition-transform"
        >
          <p className="font-bold text-xl text-blue-700">{u.nombre} {u.apellido}</p>
          <p className="text-gray-700">Dirección: {u.direccion}</p>
          <p className="text-gray-700">Tel: {u.telefono} / Cel: {u.celular}</p>
          <p className="text-gray-700">
            Fecha Nac: {u.fecha_nacimiento ? u.fecha_nacimiento.split('T')[0] : "Sin fecha"}
          </p>
          <p className="text-gray-700">Email: {u.email}</p>
        </div>
      ))}
    </div>
  );
}

export default Lista;
