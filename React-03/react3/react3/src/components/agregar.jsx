import Formulario from './Formulario.jsx';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Agregar() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  function agregar(data) {
    fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(res => {
        if (!res.ok) throw new Error("No se pudo agregar el usuario");
        return res.json();
      })
      .then(() => navigate("/"))
      .catch(err => setError(err.message));
  }

  return (
    <div className="max-w-xl mx-auto mt-8">
      {error && <div className="text-red-600 font-bold p-4 mb-4 rounded bg-red-100">{error}</div>}
      <Formulario onSubmit={agregar} />
    </div>
  );
}

export default Agregar;