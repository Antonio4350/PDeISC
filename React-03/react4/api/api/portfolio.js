import { getPortfolio, upsertPortfolio } from "../portfolioModel.js";

export default async function handler(req, res) {
  // --- CORS headers para permitir tu frontend ---
  res.setHeader("Access-Control-Allow-Origin", "https://p-de-isc-peach.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "GET") {
    try {
      const data = await getPortfolio();
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === "POST" || req.method === "PUT") {
    try {
      const updated = await upsertPortfolio(req.body);
      return res.status(200).json(updated);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: "Método no permitido" });
}
