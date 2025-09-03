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
} from "./portfolioModel.js";

import authRoutes from "./auth.js";

const app = express();
app.use(cors());
app.use(express.json());

// Portfolio
app.get("/api/portfolio", async (req, res) => {
  try {
    const portfolio = await getPortfolio();
    const skills = await getSkills();
    const projects = await getProjects();
    res.json({ portfolio, skills, projects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener datos del portfolio" });
  }
});

app.put("/api/portfolio", async (req, res) => {
  try {
    const updated = await upsertPortfolio(req.body);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar portfolio" });
  }
});

// Skills
app.put("/api/skills", async (req, res) => {
  try {
    await saveSkills(req.body);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al guardar skills" });
  }
});

app.get("/api/skills", async (req, res) => {
  try {
    const skills = await getSkills();
    res.json(skills);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener skills" });
  }
});

// Projects
app.get("/api/projects", async (req, res) => {
  try {
    const projects = await getProjects();
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener proyectos" });
  }
});

app.post("/api/projects", async (req, res) => {
  try {
    const project = await addProject(req.body);
    res.status(201).json(project);
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

// Auth
app.use("/api", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
