import Formulario from "./Formulario.jsx";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Agregar() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  function validar(data) {
    // Nombre y apellido: solo letras, min 2
    const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

    if (!data.nombre || data.nombre.length < 2 || !soloLetras.test(data.nombre)) {
      return "El nombre debe tener al menos 2 letras y no contener números.";
    }
    if (!data.apellido || data.apellido.length < 2 || !soloLetras.test(data.apellido)) {
      return "El apellido debe tener al menos 2 letras y no contener números.";
    }

    // Teléfono y celular: solo números, entre 7 y 15
    const soloNumeros = /^[0-9]+$/;

    if (!soloNumeros.test(data.telefono) || data.telefono.length < 7 || data.telefono.length > 15) {
      return "El teléfono debe tener entre 7 y 15 dígitos numéricos.";
    }
    if (!soloNumeros.test(data.celular) || data.celular.length < 7 || data.celular.length > 15) {
      return "El celular debe tener entre 7 y 15 dígitos numéricos.";
    }

    // Fecha nacimiento: entre 1900 y hoy
    const fecha = new Date(data.fecha_nacimiento);
    const hoy = new Date();
    const limiteMin = new Date("1900-01-01");

    if (isNaN(fecha.getTime())) {
      return "La fecha de nacimiento no es válida.";
    }
    if (fecha < limiteMin) {
      return "La fecha de nacimiento no puede ser menor al año 1900.";
    }
    if (fecha > hoy) {
      return "La fecha de nacimiento no puede ser mayor a hoy.";
    }

    // Email
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(data.email)) {
      return "El email no es válido.";
    }

    return null; // todo válido
  }

  function agregar(data) {
    const msgError = validar(data);
    if (msgError) {
      setError(msgError);
      return;
    }

    fetch("http://localhost:3000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo agregar el usuario");
        return res.json();
      })
      .then(() => navigate("/"))
      .catch((err) => setError(err.message));
  }

  return (
    <div className="max-w-xl mx-auto mt-8">
      {error && (
        <div className="text-red-600 font-bold p-4 mb-4 rounded bg-red-100">
          {error}
        </div>
      )}
      <Formulario onSubmit={agregar} />
    </div>
  );
}

export default Agregar;
