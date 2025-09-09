// server.js
import express from "express";
import cors from "cors";
import {
  getHero,
  updateHero,
  getAbout,
  updateAbout,
  getSkills,
  updateSkills,
  getProjects,
  insertProject,
  updateProject,
  deleteProject,
  loginUser
} from "./funcionesbd.js";

const app = express();
app.use(cors());
app.use(express.json());

// Hero
app.get("/api/hero", async (req, res) => {
  const hero = await getHero(); // devuelve string
  res.json({ hero });
});

app.put("/api/hero", async (req, res) => {
  const { texto } = req.body;
  const updatedHero = await updateHero(texto); // devuelve objeto {id, texto}
  res.json({ hero: updatedHero.texto });
});

// About
app.get("/api/about", async (req, res) => {
  const about = await getAbout(); // devuelve string
  res.json({ about });
});

app.put("/api/about", async (req, res) => {
  const { texto } = req.body;
  const updatedAbout = await updateAbout(texto); // devuelve objeto {id, texto}
  res.json({ about: updatedAbout.texto });
});

// Skills
app.get("/api/skills", async (req, res) => {
  const skills = await getSkills();
  res.json({ skills });
});

app.put("/api/skills", async (req, res) => {
  const { skills } = req.body;
  const updatedSkills = await updateSkills(skills);
  res.json({ skills: updatedSkills });
});

// Projects
app.get("/api/projects", async (req, res) => {
  const projects = await getProjects();
  res.json({ projects });
});

app.post("/api/projects", async (req, res) => {
  const { titulo, descripcion } = req.body;
  const newProject = await insertProject(titulo, descripcion);
  res.json({ project: newProject });
});

app.put("/api/projects/:id", async (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion } = req.body;
  const updatedProject = await updateProject(id, titulo, descripcion);
  res.json({ project: updatedProject });
});

app.delete("/api/projects/:id", async (req, res) => {
  const { id } = req.params;
  const deletedProject = await deleteProject(id);
  res.json({ project: deletedProject });
});

// Login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const ok = await loginUser(username, password);
  if (ok) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: "Credenciales inválidas" });
  }
});

// Arrancar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
