import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import {
  getPortfolio,
  upsertPortfolio,
  getSkills,
  saveSkills,
  getProjects,
  addProject,
  updateProject,
  deleteProject,
  getUserByUsername,
} from "./portfolioModel.js";

import authRoutes from "./auth.js";

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Portfolio completo (portfolio + skills + projects)
app.get("/api/portfolio", async (req, res) => {
  try {
    const portfolio = await getPortfolio();
    const skills = await getSkills();
    const projects = await getProjects();
    res.json({ portfolio, skills, projects });
  } catch (err) {
    console.error("GET /api/portfolio error:", err.message);
    res.status(500).json({ error: "Error al obtener datos del portfolio" });
  }
});

// 🔹 Upsert portfolio (hero + about)
app.put("/api/portfolio", async (req, res) => {
  try {
    const updated = await upsertPortfolio(req.body);
    res.json(updated);
  } catch (err) {
    console.error("PUT /api/portfolio error:", err.message);
    res.status(500).json({ error: "Error al actualizar portfolio" });
  }
});

// 🔹 Skills
app.get("/api/skills", async (req, res) => {
  try {
    const skills = await getSkills();
    res.json(skills);
  } catch (err) {
    console.error("GET /api/skills error:", err.message);
    res.status(500).json({ error: "Error al obtener skills" });
  }
});

app.put("/api/skills", async (req, res) => {
  try {
    await saveSkills(req.body);
    res.json({ success: true });
  } catch (err) {
    console.error("PUT /api/skills error:", err.message);
    res.status(500).json({ error: "Error al guardar skills" });
  }
});

// 🔹 Projects
app.get("/api/projects", async (req, res) => {
  try {
    const projects = await getProjects();
    res.json(projects);
  } catch (err) {
    console.error("GET /api/projects error:", err.message);
    res.status(500).json({ error: "Error al obtener proyectos" });
  }
});

app.post("/api/projects", async (req, res) => {
  try {
    const project = await addProject(req.body);
    res.status(201).json(project);
  } catch (err) {
    console.error("POST /api/projects error:", err.message);
    res.status(500).json({ error: "Error al crear proyecto" });
  }
});

app.put("/api/projects/:id", async (req, res) => {
  try {
    await updateProject(req.params.id, req.body);
    res.json({ success: true });
  } catch (err) {
    console.error("PUT /api/projects/:id error:", err.message);
    res.status(500).json({ error: "Error al modificar proyecto" });
  }
});

app.delete("/api/projects/:id", async (req, res) => {
  try {
    const ok = await deleteProject(req.params.id);
    if (!ok) return res.status(404).json({ error: "Proyecto no encontrado" });
    res.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/projects/:id error:", err.message);
    res.status(500).json({ error: "Error al eliminar proyecto" });
  }
});

// 🔹 Auth (login)
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await getUserByUsername(username);
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    }
    res.json({ success: true, username: user.username });
  } catch (err) {
    console.error("POST /api/login error:", err.message);
    res.status(500).json({ error: "Error en login" });
  }
});

// 🔹 Otras rutas de auth si existen
app.use("/api", authRoutes);

export default app;
