import { getSkills, saveSkills } from "../portfolioModel.js";
import { json } from "micro";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://p-de-isc-peach.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

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
      await saveSkills(await json(req));
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: "Método no permitido" });
}
