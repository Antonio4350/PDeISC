import { getSkills, saveSkills } from "../portfolioModel.js";
import withCors from "./cors.js"; // <- IMPORTAR CORS

async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const skills = await getSkills();
      res.json(skills);
    } catch (err) {
      res.status(500).json({ error: "Error al obtener skills" });
    }
  }

  if (req.method === "POST") {
    try {
      await saveSkills(req.body);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Error al guardar skills" });
    }
  }
}

export default withCors(handler); // <- EXPORTAR ENVUELTO EN CORS
