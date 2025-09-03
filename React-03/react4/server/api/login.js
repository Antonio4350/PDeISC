import bcrypt from "bcryptjs";
import { db } from "./db";

export default async function handler(req, res) {
  // CORS preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  if (req.method === "POST") {
    const { email, password } = await req.json();

    try {
      const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);
      if (!user.rows.length) {
        return res.status(401).json({ error: "Usuario no encontrado" });
      }

      const valid = bcrypt.compareSync(password, user.rows[0].password);
      if (!valid) {
        return res.status(401).json({ error: "Contraseña incorrecta" });
      }

      return res.status(200).json({ message: "Login exitoso", user: user.rows[0] });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    return res.status(405).json({ error: "Método no permitido" });
  }
}
