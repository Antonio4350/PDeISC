import { getProjects, addProject, updateProject, deleteProject } from "../portfolioModel.js";

export default async function handler(req, res) {
  const id = req.query.id; // Para PUT/DELETE de proyecto específico

  try {
    if (req.method === "GET") {
      const projects = await getProjects();
      res.status(200).json(projects);

    } else if (req.method === "POST") {
      const project = await addProject(req.body);
      res.status(201).json(project);

    } else if (req.method === "PUT") {
      if (!id) return res.status(400).json({ error: "Falta ID" });
      await updateProject(id, req.body);
      res.status(200).json({ success: true });

    } else if (req.method === "DELETE") {
      if (!id) return res.status(400).json({ error: "Falta ID" });
      const ok = await deleteProject(id);
      if (!ok) return res.status(404).json({ error: "Proyecto no encontrado" });
      res.status(200).json({ success: true });

    } else {
      res.status(405).json({ error: "Método no permitido" });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en la operación de proyectos" });
  }
}
