import { useState } from "react";

function ListaTareas() {
  const [gettareas, setTareas] = useState([]);
  const [getnuevaTarea, setNuevaTarea] = useState("");

  const agregarTarea = () => {
    if (getnuevaTarea.trim() === "") return;
    setTareas([...gettareas, { texto: getnuevaTarea, completada: false }]);
    setNuevaTarea("");
  };

  const marcaTarea = (index) => {
    const getnuevasTareas = [...gettareas];
    getnuevasTareas[index].completada = !getnuevasTareas[index].completada;
    setTareas(getnuevasTareas);
  };

  const enter = (e) => {
    if (e.key === "Enter") {
      agregarTarea();
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6 p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Lista de Tareas</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={getnuevaTarea}
          onChange={(e) => setNuevaTarea(e.target.value)}
          onKeyDown={enter}
          className="flex-1 border border-gray-300 p-2 rounded-lg"
          placeholder="Nueva tarea"
        />
        <button
          onClick={agregarTarea}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >Agregar</button>
      </div>

      <ul className="space-y-2">
        {gettareas.map((tarea, index) => (
          <li
            key={index}
            onClick={() => marcaTarea(index)}
            className={`p-2 cursor-pointer rounded-lg bg-white shadow hover:bg-gray-50 ${
              tarea.completada ? "line-through decoration-2 decoration-green-500" : "decoration-2 decoration-transparent"
            }`}
          >
            {tarea.texto}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListaTareas;
