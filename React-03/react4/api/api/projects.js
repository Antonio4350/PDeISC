import { getProjects, addProject, updateProject, deleteProject } from "../portfolioModel.js";
import { json } from "micro";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://p-de-isc-peach.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "GET") {
    try {
      const projects = await getProjects();
      return res.status(200).json(projects);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === "POST") {
    try {
      const project = await addProject(await json(req));
      return res.status(201).json(project);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === "PUT") {
    try {
      const { id } = req.query; // en Vercel se usa query params
      await updateProject(id, await json(req));
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === "DELETE") {
    try {
      const { id } = req.query;
      const ok = await deleteProject(id);
      if (!ok) return res.status(404).json({ error: "Proyecto no encontrado" });
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: "Método no permitido" });
}
