import { getProjects, addProject, updateProject, deleteProject } from "../portfolioModel.js";
import withCors from "./cors.js";

async function handler(req, res) {
  const { method } = req;

  try {
    if (method === "GET") {
      const projects = await getProjects();
      return res.status(200).json(projects);
    }

    if (method === "POST") {
      const project = await addProject(req.body);
      return res.status(201).json(project);
    }

    if (method === "PUT") {
      await updateProject(req.body.id, req.body);
      return res.status(200).json({ success: true });
    }

    if (method === "DELETE") {
      const ok = await deleteProject(req.body.id);
      if (!ok) return res.status(404).json({ error: "Proyecto no encontrado" });
      return res.status(200).json({ success: true });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }

  return res.status(405).json({ error: "Método no permitido" });
}

export default withCors(handler);
