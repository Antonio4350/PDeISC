import { getUser } from "../portfolioModel.js";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Método no permitido" });

  const { username, password } = req.body;

  try {
    const user = await getUser(username);
    if (!user) return res.status(401).json({ error: "Usuario no encontrado" });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: "Contraseña incorrecta" });

    res.status(200).json({ success: true, username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el login" });
  }
}
