import Formulario from "./Formulario.jsx";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Agregar() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  function validar(data) {
    const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    const soloNumeros = /^[0-9]+$/;
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const hoy = new Date();
    const limiteMin = new Date("1900-01-01");
    const fecha = new Date(data.fecha_nacimiento);

    if (!data.nombre || data.nombre.length < 2 || !soloLetras.test(data.nombre)) {
      return "El nombre debe tener al menos 2 letras y no contener numeros.";
    }
    if (!data.apellido || data.apellido.length < 2 || !soloLetras.test(data.apellido)) {
      return "El apellido debe tener al menos 2 letras y no contener numeros.";
    }
    if (!soloNumeros.test(data.telefono) || data.telefono.length < 7 || data.telefono.length > 15) {
      return "El telefono debe tener entre 7 y 15 digitos numericos.";
    }
    if (!soloNumeros.test(data.celular) || data.celular.length < 7 || data.celular.length > 15) {
      return "El celular debe tener entre 7 y 15 digitos numericos.";
    }
    if (isNaN(fecha.getTime())) return "La fecha de nacimiento no es valida.";
    if (fecha < limiteMin) return "La fecha de nacimiento no puede ser menor al año 1900.";
    if (fecha > hoy) return "La fecha de nacimiento no puede ser mayor a hoy.";
    if (!regexEmail.test(data.email)) return "El email no es valido.";

    return null;
  }

  function agregar(data) {
    const msgError = validar(data);
    if (msgError) {
      setError(msgError);
      return;
    }

    // Normalizamos la fecha para backend
    const payload = { ...data, fechaNacimiento: data.fecha_nacimiento };

    fetch("http://localhost:3000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo agregar el usuario");
        return res.json();
      })
      .then(() => navigate("/"))
      .catch((err) => setError(err.message));
  }

  return (
    <div className="flex flex-col items-center px-4 py-12 sm:px-6 lg:px-8 space-y-6">
      <h2 className="text-3xl font-bold text-blue-700 text-center">Agregar Usuario</h2>

      {error && (
        <div className="w-full max-w-lg text-red-600 font-bold p-4 rounded bg-red-100 text-center">
          {error}
        </div>
      )}

      <div className="w-full max-w-lg">
        <Formulario onSubmit={agregar} />
      </div>
    </div>
  );
}

export default Agregar;
