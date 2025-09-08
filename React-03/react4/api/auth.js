import express from "express";
import { getUser } from "./portfolioModel.js";

const router = express.Router();

// Login sin hash, texto plano
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await getUser(username);
    if (!user) return res.status(401).json({ error: "Usuario no encontrado" });

    if (user.password !== password) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    res.json({ success: true, username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el login" });
  }
});

export default router;
