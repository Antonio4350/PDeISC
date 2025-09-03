import { db } from "./db";

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
      const result = await db.query("SELECT * FROM skills ORDER BY id ASC");
      return res.status(200).json(result.rows);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: "Método no permitido" });
}
