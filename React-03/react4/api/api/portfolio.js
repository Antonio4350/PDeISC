import { db } from "./db";
import { json } from "micro";

export default async function handler(req, res) {
  // Manejo de preflight CORS
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  if (req.method === "GET") {
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

  if (req.method === "PUT") {
    try {
      const body = await json(req);
      const { hero, about } = body;

      if (hero !== undefined) {
        await db.query(
          `INSERT INTO hero (id, texto) VALUES (1, $1)
           ON CONFLICT (id) DO UPDATE SET texto = EXCLUDED.texto`,
          [hero]
        );
      }

      if (about !== undefined) {
        await db.query(
          `INSERT INTO about (id, texto) VALUES (1, $1)
           ON CONFLICT (id) DO UPDATE SET texto = EXCLUDED.texto`,
          [about]
        );
      }

      return res.status(200).json({ hero, about });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: "Método no permitido" });
}
