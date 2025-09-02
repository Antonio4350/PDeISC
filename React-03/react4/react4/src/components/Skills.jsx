export default function Skills({ skills }) {
  return (
    <div className="max-w-4xl w-full">
      <h2 className="text-3xl font-bold text-purple-400 mb-6 text-center">Habilidades</h2>
      <div className="space-y-4">
        {skills.map((s, i) => (
          <div key={i}>
            <div className="flex justify-between text-sm mb-1">
              <span>{s.nombre}</span>
              <span>{s.nivel}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded h-4">
              <div
                className="h-4 rounded transition-all"
                style={{
                  width: `${s.nivel}%`,
                  background: `linear-gradient(90deg, green, yellow, orange, red)`,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
