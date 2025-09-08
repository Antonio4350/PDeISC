import { getPortfolio, upsertPortfolio } from "..portfolioModel.js";

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
      const data = await getPortfolio();
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: "Método no permitido" });
}
