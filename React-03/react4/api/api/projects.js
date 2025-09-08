import { getProjects, addProject, updateProject, deleteProject } from "../portfolioModel.js";

export async function getProjectsHandler(req, res) {
  try {
    const projects = await getProjects();
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener proyectos" });
  }
}

export async function addProjectHandler(req, res) {
  try {
    const project = await addProject(req.body);
    res.status(201).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear proyecto" });
  }
}

export async function updateProjectHandler(req, res) {
  try {
    await updateProject(req.params.id, req.body);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al modificar proyecto" });
  }
}

export async function deleteProjectHandler(req, res) {
  try {
    const ok = await deleteProject(req.params.id);
    if (!ok) return res.status(404).json({ error: "Proyecto no encontrado" });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar proyecto" });
  }
}
