function Formulario({ usuario = {}, onSubmit }) {
  function handleSubmit(e) {
    e.preventDefault();
    const data = {
      nombre: e.target.nombre.value,
      apellido: e.target.apellido.value,
      direccion: e.target.direccion.value,
      telefono: e.target.telefono.value,
      celular: e.target.celular.value,
      fechaNacimiento: e.target.fechaNacimiento.value,
      email: e.target.email.value
    };
    onSubmit(data);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-8 bg-white rounded-xl shadow-xl space-y-6">
      <label className="block">
        <span className="text-gray-700 font-semibold">Nombre:</span>
        <input name="nombre" defaultValue={usuario.nombre || ''} placeholder="Nombre" required className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"/>
      </label>
      <label className="block">
        <span className="text-gray-700 font-semibold">Apellido:</span>
        <input name="apellido" defaultValue={usuario.apellido || ''} placeholder="Apellido" required className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"/>
      </label>
      <label className="block">
        <span className="text-gray-700 font-semibold">Dirección:</span>
        <input name="direccion" defaultValue={usuario.direccion || ''} placeholder="Dirección" className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"/>
      </label>
      <label className="block">
        <span className="text-gray-700 font-semibold">Teléfono:</span>
        <input name="telefono" defaultValue={usuario.telefono || ''} placeholder="Teléfono" className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"/>
      </label>
      <label className="block">
        <span className="text-gray-700 font-semibold">Celular:</span>
        <input name="celular" defaultValue={usuario.celular || ''} placeholder="Celular" className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"/>
      </label>
      <label className="block">
        <span className="text-gray-700 font-semibold">Fecha de nacimiento:</span>
        <input type="date" name="fechaNacimiento" defaultValue={usuario.fecha_nacimiento?.split('T')[0] || ''} className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"/>
      </label>
      <label className="block">
        <span className="text-gray-700 font-semibold">Email:</span>
        <input type="email" name="email" defaultValue={usuario.email || ''} placeholder="Email" required className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"/>
      </label>
      <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors font-semibold">Guardar</button>
    </form>
  );
}

export default Formulario;