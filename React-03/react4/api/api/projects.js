import { getProjects, addProject, updateProject, deleteProject } from "../portfolioModel.js";
import withCors from "./cors.js"; // <- IMPORTAR CORS

async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const projects = await getProjects();
      res.json(projects);
    } catch (err) {
      res.status(500).json({ error: "Error al obtener proyectos" });
    }
  }

  if (req.method === "POST") {
    try {
      const project = await addProject(req.body);
      res.status(201).json(project);
    } catch (err) {
      res.status(500).json({ error: "Error al crear proyecto" });
    }
  }

  if (req.method === "PUT") {
    try {
      await updateProject(req.body.id, req.body);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Error al modificar proyecto" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const ok = await deleteProject(req.body.id);
      if (!ok) return res.status(404).json({ error: "Proyecto no encontrado" });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Error al eliminar proyecto" });
    }
  }
}

export default withCors(handler); // <- EXPORTAR ENVUELTO EN CORS
