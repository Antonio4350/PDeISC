import { useState, useEffect, useRef } from "react";

export default function UserForm({ onSave, userToEdit, onCancel }) {
  const [user, setUser] = useState({
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: "",
    celular: "",
    fechaNacimiento: "",
    email: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const errorBoxRef = useRef(null);

  useEffect(() => {
    if (userToEdit) setUser(userToEdit);
  }, [userToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  // ✅ Validación
  const validate = () => {
    let newErrors = {};
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    if (!user.nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
    if (!user.apellido.trim()) newErrors.apellido = "El apellido es obligatorio";

    if (!user.email.trim()) {
      newErrors.email = "El email es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      newErrors.email = "Formato de email inválido";
    }

    if (user.telefono && !/^\d+$/.test(user.telefono)) {
      newErrors.telefono = "El teléfono solo puede contener números";
    }

    if (user.celular && !/^\d+$/.test(user.celular)) {
      newErrors.celular = "El celular solo puede contener números";
    }

    if (!user.fechaNacimiento) {
      newErrors.fechaNacimiento = "La fecha de nacimiento es obligatoria";
    } else if (user.fechaNacimiento > today) {
      newErrors.fechaNacimiento = "La fecha no puede ser mayor al día de hoy";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setMessage({ type: "error" });

      // 🔽 Scrollea al bloque de errores
      setTimeout(() => {
        if (errorBoxRef.current) {
          errorBoxRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);

      return;
    }
    try {
      await onSave(user);
      setMessage({ type: "success", text: "Usuario guardado con éxito ✅" });
      setUser({
        nombre: "",
        apellido: "",
        direccion: "",
        telefono: "",
        celular: "",
        fechaNacimiento: "",
        email: "",
      });
      setErrors({});
    } catch (err) {
      setMessage({ type: "error" });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-900 text-white p-6 rounded-2xl shadow-xl space-y-4"
    >
      <h2 className="text-xl font-bold mb-2">
        {userToEdit ? "Modificar Usuario" : "Alta de Usuario"}
      </h2>

      {Object.keys(user).map((field) => (
        <div key={field} className="flex flex-col">
          <label className="capitalize mb-1">{field}</label>
          <input
            type={field === "fechaNacimiento" ? "date" : "text"}
            name={field}
            value={user[field]}
            onChange={handleChange}
            className={`bg-gray-800 border rounded px-3 py-2 text-white focus:outline-none ${
              errors[field]
                ? "border-red-500 focus:ring-2 focus:ring-red-500"
                : "border-gray-600 focus:ring-2 focus:ring-blue-500"
            }`}
            required={["nombre", "apellido", "email", "fechaNacimiento"].includes(
              field
            )}
          />
        </div>
      ))}

      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md transition"
        >
          Guardar
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-lg shadow-md transition"
          >
            Cancelar
          </button>
        )}
      </div>

      {/* ✅ Bloque de errores solo si hay errores */}
      {message?.type === "error" && Object.keys(errors).length > 0 && (
        <div
          ref={errorBoxRef}
          className="mt-4 bg-red-800 text-red-200 p-3 rounded-lg"
        >
          <h3 className="font-semibold mb-1">Errores encontrados:</h3>
          <ul className="list-disc list-inside text-sm">
            {Object.values(errors).map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* ✅ Mensaje de éxito */}
      {message?.type === "success" && (
        <div className="mt-4 bg-green-800 text-green-200 p-3 rounded-lg">
          {message.text}
        </div>
      )}
    </form>
  );
}