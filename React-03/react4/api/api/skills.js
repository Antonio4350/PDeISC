import withCors from "./cors.js";
import { getSkills, saveSkills } from "../portfolioModel.js";

async function handler(req, res) {
  const { method } = req;
  try {
    if (method === "GET") {
      const skills = await getSkills();
      return res.json(skills);
    }
    if (method === "POST") {
      await saveSkills(req.body);
      return res.json({ success: true });
    }
    return res.status(405).json({ error: "Método no permitido" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export default withCors(handler);
