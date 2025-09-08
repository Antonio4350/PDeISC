import { getPortfolio, upsertPortfolio } from "../portfolioModel.js";
import withCors from "./cors.js";

async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const data = await getPortfolio();
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === "POST") {
    try {
      const updated = await upsertPortfolio(req.body);
      return res.status(200).json(updated);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: "Método no permitido" });
}

export default withCors(handler);
