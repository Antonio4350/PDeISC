export default function Projects({ proyectos }) {
  return (
    <div className="max-w-5xl w-full text-center">
      <h2 className="text-3xl font-bold text-purple-400 mb-6">Proyectos</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {proyectos.map((p) => (
          <div key={p.id} className="bg-gray-700 p-4 rounded shadow text-left hover:shadow-lg transition">
            {p.imagen && <img src={p.imagen} alt={p.titulo} className="rounded mb-3" />}
            <h3 className="text-xl font-bold text-purple-300">{p.titulo}</h3>
            <p className="text-gray-200">{p.descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
