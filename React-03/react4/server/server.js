import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

// Importamos funciones de la DB
import {
  getPortfolio,
  upsertPortfolio,
  getSkills,
  saveSkills,
  getProjects,
  addProject,
  updateProject,
  deleteProject,
} from "./portfolioModel.js";

// Importamos rutas de login
import authRoutes from "./auth.js";

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Rutas para portfolio (hero + about + skills + projects)
app.get("/api/portfolio", async (req, res) => {
  try {
    const p = await getPortfolio();
    const skills = await getSkills();
    const projects = await getProjects();
    res.json({ portfolio: p, skills, projects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener datos del portfolio" });
  }
});

app.put("/api/portfolio", async (req, res) => {
  try {
    const data = req.body; // { hero, about }
    const updated = await upsertPortfolio(data);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar portfolio" });
  }
});

app.put("/api/skills", async (req, res) => {
  try {
    const skills = req.body; // array
    await saveSkills(skills);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al guardar skills" });
  }
});

// 🔹 Rutas para proyectos
app.get("/api/projects", async (req, res) => {
  try {
    const projs = await getProjects();
    res.json(projs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener proyectos" });
  }
});

app.post("/api/projects", async (req, res) => {
  try {
    const nuevo = await addProject(req.body);
    res.status(201).json(nuevo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear proyecto" });
  }
});

app.put("/api/projects/:id", async (req, res) => {
  try {
    await updateProject(req.params.id, req.body);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al modificar proyecto" });
  }
});

app.delete("/api/projects/:id", async (req, res) => {
  try {
    const ok = await deleteProject(req.params.id);
    if (!ok) return res.status(404).json({ error: "Proyecto no encontrado" });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar proyecto" });
  }
});

// 🔹 Rutas de login
app.use("/api", authRoutes);

// 🔹 Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
