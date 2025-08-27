export default function UserList({ users, onDelete, onEdit, onSelect }) {
  return (
    <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-xl">
      <h2 className="text-xl font-bold mb-4">Listado de Usuarios</h2>
      <table className="w-full border border-gray-700 rounded overflow-hidden">
        <thead className="bg-gray-800">
          <tr>
            <th className="p-2">Nombre</th>
            <th className="p-2">Apellido</th>
            <th className="p-2">Email</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t border-gray-700 hover:bg-gray-800">
              <td className="p-2">{u.nombre}</td>
              <td className="p-2">{u.apellido}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2 flex gap-2">
                <button
                  className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded transition"
                  onClick={() => onSelect(u)}
                >
                  Ver
                </button>
                <button
                  className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded transition"
                  onClick={() => onEdit(u)}
                >
                  Editar
                </button>
                <button
                  className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition"
                  onClick={() => onDelete(u.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}