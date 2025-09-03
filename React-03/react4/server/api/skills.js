import { saveSkills } from "../portfolioModel.js";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    try {
      await saveSkills(req.body);
      res.status(200).json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al guardar skills" });
    }
  } else {
    res.status(405).json({ error: "Método no permitido" });
  }
}
