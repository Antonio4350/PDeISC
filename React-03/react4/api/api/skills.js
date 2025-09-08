import { getSkills, saveSkills } from "../portfolioModel.js";

export async function getSkillsHandler(req, res) {
  try {
    const skills = await getSkills();
    res.json(skills);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener skills" });
  }
}

export async function saveSkillsHandler(req, res) {
  try {
    await saveSkills(req.body);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al guardar skills" });
  }
}
