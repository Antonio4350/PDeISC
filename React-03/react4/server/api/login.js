import bcrypt from "bcryptjs";
import { db } from "./db"; // tu conexión a la DB
import { json } from "micro"; // o lo que uses en tu función serverless

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = await json(req);

    // Buscar usuario en DB
    const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (!user.rows.length) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    // Comparar contraseña
    const valid = bcrypt.compareSync(password, user.rows[0].password);
    if (!valid) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    // Retornar algo si es válido
    return res.status(200).json({ message: "Login exitoso", user: user.rows[0] });
  } else {
    return res.status(405).json({ error: "Método no permitido" });
  }
}
