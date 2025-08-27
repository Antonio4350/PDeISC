export default function UserDetail({ user, onClose }) {
  if (!user) return null;

  return (
    <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-xl mt-4">
      <h2 className="text-xl font-bold mb-3">Detalle de Usuario</h2>
      <ul className="space-y-1">
        {Object.entries(user).map(([key, value]) => (
          <li key={key}>
            <strong className="capitalize">{key}:</strong> {value}
          </li>
        ))}
      </ul>
      <button
        onClick={onClose}
        className="mt-4 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded transition"
      >
        Cerrar
      </button>
    </div>
  );
}