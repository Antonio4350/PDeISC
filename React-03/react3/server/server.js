import { main, agregarUsuario, modificarUsuario, eliminarUsuario, consultarUsuario } from "./index.js";
import path from "path";
import express from "express";
import { fileURLToPath } from "url";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Servir index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Listado de usuarios
app.get("/users", async (req, res) => {
  try {
    const usuarios = await main();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

// Alta de usuario con validación de email duplicado
app.post("/users", async (req, res) => {
  try {
    const nuevoUsuario = await agregarUsuario(req.body);
    res.status(201).json(nuevoUsuario);
  } catch (err) {
    if (err.message === "EMAIL_DUPLICADO") {
      return res.status(400).json({ error: "El email ya está registrado" });
    }
    res.status(500).json({ error: "Error al agregar usuario" });
  }
});

// Consulta por ID
app.get("/users/:id", async (req, res) => {
  try {
    const usuario = await consultarUsuario(req.params.id);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: "Error al consultar usuario" });
  }
});

// Modificación de usuario
app.put("/users/:id", async (req, res) => {
  try {
    const usuarioModificado = await modificarUsuario(req.params.id, req.body);
    if (!usuarioModificado) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(usuarioModificado);
  } catch (err) {
    res.status(500).json({ error: "Error al modificar usuario" });
  }
});

// Baja de usuario
app.delete("/users/:id", async (req, res) => {
  try {
    const eliminado = await eliminarUsuario(req.params.id);
    if (!eliminado) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
});

// Iniciar servidor
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
