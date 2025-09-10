<div className="space-y-2">
  <label className="font-bold text-gray-200">Habilidades</label>
  <button
    onClick={() => setTempSkills([...tempSkills, { nombre: "", nivel: 0 }])}
    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded mb-2"
  >
    + Agregar Habilidad
  </button>

  {tempSkills.map((s, i) => (
    <div key={i} className="flex items-center gap-2 mb-2">
      <input
        type="text"
        value={s.nombre}
        onChange={(e) => {
          const copy = [...tempSkills];
          copy[i].nombre = e.target.value;
          setTempSkills(copy);
        }}
        className="flex-1 p-2 bg-gray-700 rounded text-gray-100"
        placeholder="Nombre"
      />
      <input
        type="number"
        min={0}
        max={100}
        value={s.nivel}
        onChange={(e) => {
          const copy = [...tempSkills];
          copy[i].nivel = e.target.value;
          setTempSkills(copy);
        }}
        className="w-20 p-2 bg-gray-700 rounded text-gray-100"
        placeholder="Nivel %"
      />
      <button
        onClick={() => setTempSkills(tempSkills.filter((_, idx) => idx !== i))}
        className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
      >
        ✕
      </button>
    </div>
  ))}
</div>
