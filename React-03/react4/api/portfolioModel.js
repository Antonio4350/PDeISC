
export async function getPortfolioHandler(req, res) {
  try {
    const portfolio = await getPortfolio();
    res.json(portfolio);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener portfolio" });
  }
}

export async function updatePortfolioHandler(req, res) {
  try {
    const updated = await upsertPortfolio(req.body);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar portfolio" });
  }
}