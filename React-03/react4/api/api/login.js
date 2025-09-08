import { getUser } from "../portfolioModel.js";
import { json } from "micro";
import withCors from "./cors.js"; // <- IMPORTAR CORS

async function handler(req, res) {
  if (req.method === "POST") {
    const { username, password } = await json(req);

    try {
      const user = await getUser(username);
      if (!user) return res.status(401).json({ error: "Usuario no encontrado" });
      if (password !== user.password) return res.status(401).json({ error: "Contraseña incorrecta" });
      return res.status(200).json({ message: "Login exitoso", user });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: "Método no permitido" });
}

export default withCors(handler); // <- EXPORTAR ENVUELTO EN CORS
