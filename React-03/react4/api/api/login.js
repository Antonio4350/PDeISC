import { db } from "./db"; // tu conexión a la DB
import { json } from "micro"; // o lo que uses para parsear el body

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = await json(req);

    // Buscar usuario en la DB
    const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (!user.rows.length) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    // Comparar la contraseña directamente
    if (password !== user.rows[0].password) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    // Login exitoso
    return res.status(200).json({ message: "Login exitoso", user: user.rows[0] });
  } else {
    return res.status(405).json({ error: "Método no permitido" });
  }
}
