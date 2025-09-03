import express from "express";
import bcrypt from "bcrypt";
import pool from "./db.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE username=$1", [
      username,
    ]);

    if (result.rows.length === 0)
      return res.status(401).json({ error: "Usuario no encontrado" });

    const user = result.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);

    if (!ok) return res.status(401).json({ error: "Contraseña incorrecta" });

    res.json({ success: true, username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el login" });
  }
});

export default router;
