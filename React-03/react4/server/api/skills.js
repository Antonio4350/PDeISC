import { getSkills, saveSkills } from "../portfolioModel.js";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const skills = await getSkills();
      res.status(200).json(skills);

    } else if (req.method === "PUT") {
      if (!Array.isArray(req.body)) return res.status(400).json({ error: "Formato inválido" });
      await saveSkills(req.body);
      res.status(200).json({ success: true });

    } else {
      res.status(405).json({ error: "Método no permitido" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en skills" });
  }
}
