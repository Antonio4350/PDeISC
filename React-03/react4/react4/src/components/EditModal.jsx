import { useState } from "react";

export default function EditModal({
  setEditSection,
  hero, setHero,
  about, setAbout,
  skills, setSkills,
  proyectos, setProyectos
}) {
  const [tempHero, setTempHero] = useState(hero);
  const [tempAbout, setTempAbout] = useState(about);
  const [tempSkills, setTempSkills] = useState([...skills]);
  const [tempProyectos, setTempProyectos] = useState([...proyectos]);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSave = () => setConfirmOpen(true);

  const applyChanges = async () => {
    try {
      if (tempHero !== hero) {
        const resHero = await fetch(`${API_URL}/api/hero`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ texto: tempHero }) });
        const dataHero = await resHero.json();
        setHero(dataHero.hero);
      }
      if (tempAbout !== about) {
        const resAbout = await fetch(`${API_URL}/api/about`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ texto: tempAbout }) });
        const dataAbout = await resAbout.json();
        setAbout(dataAbout.about);
      }
      const resSkills = await fetch(`${API_URL}/api/skills`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ skills: tempSkills }) });
      const dataSkills = await resSkills.json();
      setSkills(dataSkills.skills);

      for (const p of tempProyectos) {
        if (p.id < 0) {
          const resNew = await fetch(`${API_URL}/api/projects`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ titulo: p.titulo, descripcion: p.descripcion }) });
          const newProj = await resNew.json();
          p.id = newProj.project.id;
        } else {
          await fetch(`${API_URL}/api/projects/${p.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ titulo: p.titulo, descripcion: p.descripcion }) });
        }
      }
      setProyectos([...tempProyectos]);
      setEditSection(false);
      setConfirmOpen(false);
    } catch (err) {
      console.error("Error guardando cambios:", err);
    }
  };

  const addSkill = () => setTempSkills([...tempSkills, { nombre: "", nivel: 0 }]);
  const removeSkill = (index) => setTempSkills(tempSkills.filter((_, i) => i !== index));

  const addProject = () => setTempProyectos([...tempProyectos, { id: -Date.now(), titulo: "", descripcion: "" }]);
  const removeProject = (id) => setTempProyectos(tempProyectos.filter((p) => p.id !== id));

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 p-4">
        <div className="bg-gray-800 p-4 md:p-6 rounded shadow max-w-3xl w-full max-h-[90vh] overflow-y-auto space-y-4">
          <h2 className="text-xl md:text-2xl font-bold text-purple-400 mb-4 text-center">Editar Portafolio</h2>

          {/* Hero */}
          <div className="space-y-2">
            <label className="font-bold text-gray-200">Hero</label>
            <textarea value={tempHero} onChange={e => setTempHero(e.target.value)} className="w-full p-2 bg-gray-700 rounded text-gray-100 h-20 md:h-24 text-sm md:text-base" />
          </div>

          {/* About */}
          <div className="space-y-2">
            <label className="font-bold text-gray-200">Sobre mí</label>
            <textarea value={tempAbout} onChange={e => setTempAbout(e.target.value)} className="w-full p-2 bg-gray-700 rounded text-gray-100 h-28 md:h-32 text-sm md:text-base" />
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <label className="font-bold text-gray-200">Habilidades</label>
            <div className="flex gap-2 mb-2 flex-wrap">
              <button onClick={addSkill} className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 md:px-3 md:py-1 rounded text-sm md:text-base">+ Agregar</button>
            </div>
            {tempSkills.map((s, i) => (
              <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <input type="text" value={s.nombre} onChange={e => { const copy=[...tempSkills]; copy[i].nombre=e.target.value; setTempSkills(copy); }} className="flex-1 p-2 bg-gray-700 rounded text-gray-100 text-sm md:text-base" placeholder="Nombre" />
                <input type="number" min={0} max={100} value={s.nivel} onChange={e => { const copy=[...tempSkills]; copy[i].nivel=e.target.value; setTempSkills(copy); }} className="w-full sm:w-20 p-2 bg-gray-700 rounded text-gray-100 text-sm md:text-base" placeholder="Nivel" />
                <button onClick={() => removeSkill(i)} className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-sm md:text-base">X</button>
              </div>
            ))}
          </div>

          {/* Projects */}
          <div className="space-y-2">
            <label className="font-bold text-gray-200">Proyectos</label>
            <button onClick={addProject} className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 md:px-3 md:py-1 rounded mb-2 text-sm md:text-base">+ Agregar Proyecto</button>
            {tempProyectos.map((p, i) => (
              <div key={p.id} className="bg-gray-700 p-2 rounded space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-purple-300 text-sm md:text-base">Proyecto {i+1}</span>
                  <button onClick={() => removeProject(p.id)} className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-sm md:text-base">Eliminar</button>
                </div>
                <input type="text" value={p.titulo} onChange={e => { const copy=[...tempProyectos]; copy[i].titulo=e.target.value; setTempProyectos(copy); }} placeholder="Título" className="w-full p-2 bg-gray-600 rounded text-gray-100 text-sm md:text-base" />
                <textarea value={p.descripcion} onChange={e => { const copy=[...tempProyectos]; copy[i].descripcion=e.target.value; setTempProyectos(copy); }} placeholder="Descripción" className="w-full p-2 bg-gray-600 rounded text-gray-100 h-16 md:h-20 text-sm md:text-base" />
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
            <button onClick={() => setEditSection(false)} className="px-3 py-1 bg-gray-600 rounded text-white text-sm md:text-base">Cancelar</button>
            <button onClick={handleSave} className="px-3 py-1 bg-green-600 rounded text-white text-sm md:text-base">Guardar</button>
          </div>
        </div>
      </div>

      {/* Modal confirmación */}
      {confirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-60 p-4">
          <div className="bg-gray-800 p-4 md:p-6 rounded shadow max-w-md w-full space-y-4 text-center">
            <p className="text-gray-100 text-lg">¿Deseas aplicar los cambios?</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button onClick={() => setConfirmOpen(false)} className="px-4 py-2 bg-red-600 rounded text-white text-sm md:text-base">Cancelar</button>
              <button onClick={applyChanges} className="px-4 py-2 bg-green-600 rounded text-white text-sm md:text-base">Aplicar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
