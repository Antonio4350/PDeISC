import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Formulario from './form';

function Detalle() {
  const { id } = useParams();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/users/${id}`)
      .then(res => res.json())
      .then(data => setUsuario(data))
      .catch(err => alert(err));
  }, [id]);

  if (!usuario) return <p>Cargando usuario...</p>;

  function eliminar() {
    fetch(`http://localhost:3000/users/${id}`, { method: 'DELETE' })
      .then(() => window.location.href = "/");
  }

  function guardar(datos) {
    fetch(`http://localhost:3000/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    }).then(() => window.location.href = "/");
  }

  return (
    <div>
      <div className="flex justify-start mb-6">
        <button onClick={eliminar} className="px-5 py-2 bg-red-600 text-white font-medium rounded-lg shadow hover:bg-red-700 transition-colors">
          Eliminar Usuario
        </button>
      </div>
      <Formulario subirDatos={guardar} datos={{ modo: "editar", usuario }} />
    </div>
  );
}

export default Detalle;
