import { db } from "./db";

export default async function handler(req, res) {
  // Manejar preflight de CORS
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  // Para GET
  if (req.method === "GET") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    try {
      const result = await db.query("SELECT * FROM portfolio");
      return res.status(200).json(result.rows);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Métodos no permitidos
  res.setHeader("Access-Control-Allow-Origin", "*");
  return res.status(405).json({ error: "Método no permitido" });
}
