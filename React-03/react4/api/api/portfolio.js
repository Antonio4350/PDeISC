import { db } from "./db"; // tu conexión
import { json } from "micro";

export default async function handler(req, res) {
  // Headers CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    // Responder preflight
    return res.status(200).end();
  }

  if (req.method === "GET") {
    try {
      const result = await db.query("SELECT * FROM portfolio");
      return res.status(200).json(result.rows);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    return res.status(405).json({ error: "Método no permitido" });
  }
}
