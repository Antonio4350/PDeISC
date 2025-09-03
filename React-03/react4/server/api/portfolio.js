import { getPortfolio, upsertPortfolio, getSkills, getProjects } from "../portfolioModel.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const portfolio = await getPortfolio();
      const skills = await getSkills();
      const projects = await getProjects();
      res.status(200).json({ portfolio, skills, projects });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al obtener datos del portfolio" });
    }
  } else if (req.method === "PUT") {
    try {
      const updated = await upsertPortfolio(req.body);
      res.status(200).json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al actualizar portfolio" });
    }
  } else {
    res.status(405).json({ error: "Método no permitido" });
  }
}
