export default function Projects({ proyectos }) {
  return (
    <div className="max-w-4xl w-full">
      <h2 className="text-3xl font-bold text-purple-400 mb-6 text-center">Proyectos</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {proyectos.map((p) => (
          <div key={p.id} className="bg-gray-700 p-4 rounded shadow">
            <h3 className="font-bold text-xl mb-2">{p.titulo}</h3>
            <p>{p.descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
