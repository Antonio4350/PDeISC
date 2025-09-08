import { getSkills, saveSkills } from "../portfolioModel.js";
import withCors from "./cors.js";

async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const skills = await getSkills();
      return res.status(200).json(skills);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === "POST" || req.method === "PUT") {
    try {
      await saveSkills(req.body);
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: "Método no permitido" });
}

export default withCors(handler);
