import { useState } from "react";

function Formulario({ usuario = {}, onSubmit }) {
  const [errores, setErrores] = useState([]);

  function handleSubmit(e) {
    e.preventDefault();
    const data = {
      nombre: e.target.nombre.value.trim(),
      apellido: e.target.apellido.value.trim(),
      direccion: e.target.direccion.value.trim(),
      telefono: e.target.telefono.value.trim(),
      celular: e.target.celular.value.trim(),
      fecha_nacimiento: e.target.fechaNacimiento.value,
      email: e.target.email.value.trim(),
    };

    const nuevosErrores = validar(data);

    if (nuevosErrores.length > 0) {
      setErrores(nuevosErrores);
    } else {
      setErrores([]);
      onSubmit(data);
    }
  }

  function validar(data) {
    let errores = [];

    const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    const soloNumeros = /^[0-9]+$/;
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const hoy = new Date();
    const limiteMin = new Date("1900-01-01");
    const fecha = new Date(data.fecha_nacimiento);

    if (!data.nombre || data.nombre.length < 2 || !soloLetras.test(data.nombre)) {
      errores.push("El nombre debe tener al menos 2 letras y no contener números.");
    }
    if (!data.apellido || data.apellido.length < 2 || !soloLetras.test(data.apellido)) {
      errores.push("El apellido debe tener al menos 2 letras y no contener números.");
    }
    if (!soloNumeros.test(data.telefono) || data.telefono.length < 7 || data.telefono.length > 15) {
      errores.push("El teléfono debe tener entre 7 y 15 dígitos numéricos.");
    }
    if (!soloNumeros.test(data.celular) || data.celular.length < 7 || data.celular.length > 15) {
      errores.push("El celular debe tener entre 7 y 15 dígitos numéricos.");
    }
    if (isNaN(fecha.getTime())) {
      errores.push("La fecha de nacimiento no es válida.");
    } else {
      if (fecha < limiteMin) errores.push("La fecha de nacimiento no puede ser menor al año 1900.");
      if (fecha > hoy) errores.push("La fecha de nacimiento no puede ser mayor a hoy.");
    }
    if (!regexEmail.test(data.email)) {
      errores.push("El email no es válido.");
    }

    return errores;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-8 bg-white rounded-xl shadow-xl space-y-6"
    >
      <label className="block">
        <span className="text-gray-700 font-semibold">Nombre:</span>
        <input
          name="nombre"
          defaultValue={usuario.nombre || ""}
          placeholder="Nombre"
          required
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
        />
      </label>

      <label className="block">
        <span className="text-gray-700 font-semibold">Apellido:</span>
        <input
          name="apellido"
          defaultValue={usuario.apellido || ""}
          placeholder="Apellido"
          required
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
        />
      </label>

      <label className="block">
        <span className="text-gray-700 font-semibold">Dirección:</span>
        <input
          name="direccion"
          defaultValue={usuario.direccion || ""}
          placeholder="Dirección"
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
        />
      </label>

      <label className="block">
        <span className="text-gray-700 font-semibold">Teléfono:</span>
        <input
          name="telefono"
          defaultValue={usuario.telefono || ""}
          placeholder="Teléfono"
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
        />
      </label>

      <label className="block">
        <span className="text-gray-700 font-semibold">Celular:</span>
        <input
          name="celular"
          defaultValue={usuario.celular || ""}
          placeholder="Celular"
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
        />
      </label>

      <label className="block">
        <span className="text-gray-700 font-semibold">Fecha de nacimiento:</span>
        <input
          type="date"
          name="fechaNacimiento"
          defaultValue={usuario.fecha_nacimiento?.split("T")[0] || ""}
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
        />
      </label>

      <label className="block">
        <span className="text-gray-700 font-semibold">Email:</span>
        <input
          type="email"
          name="email"
          defaultValue={usuario.email || ""}
          placeholder="Email"
          required
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
        />
      </label>

      {/* Botón */}
      <button
        type="submit"
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors font-semibold"
      >
        Guardar
      </button>

      {/* Lista de errores debajo del botón */}
      {errores.length > 0 && (
        <ul className="mt-4 space-y-2 text-red-600 font-medium">
          {errores.map((err, i) => (
            <li key={i} className="bg-red-100 p-2 rounded">
              {err}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}

export default Formulario;
