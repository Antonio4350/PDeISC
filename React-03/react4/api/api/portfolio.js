import { db } from "..db.js";

export default async function handler(req, res) {
  // --- Manejo de OPTIONS (preflight CORS) ---
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  if (req.method === "GET") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    try {
      const hero = await db.query("SELECT texto FROM hero LIMIT 1");
      const about = await db.query("SELECT texto FROM about LIMIT 1");

      return res.status(200).json({
        hero: hero.rows[0]?.texto || "",
        about: about.rows[0]?.texto || "",
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: "Método no permitido" });
}
