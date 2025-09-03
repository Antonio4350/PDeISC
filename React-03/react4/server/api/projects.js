import { getProjects, addProject, updateProject, deleteProject } from "../portfolioModel.js";

export default async function handler(req, res) {
  const id = req.query.id; // opcional, para PUT o DELETE

  try {
    if (req.method === "GET") {
      const projects = await getProjects();
      res.status(200).json(projects);

    } else if (req.method === "POST") {
      const project = await addProject(req.body);
      res.status(201).json(project);

    } else if (req.method === "PUT") {
      if (!id) return res.status(400).json({ error: "Falta ID para actualizar" });
      await updateProject(id, req.body);
      res.status(200).json({ success: true });

    } else if (req.method === "DELETE") {
      if (!id) return res.status(400).json({ error: "Falta ID para eliminar" });
      const ok = await deleteProject(id);
      res.status(ok ? 200 : 404).json(ok ? { success: true } : { error: "No encontrado" });

    } else {
      res.status(405).json({ error: "Método no permitido" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en proyecto" });
  }
}
