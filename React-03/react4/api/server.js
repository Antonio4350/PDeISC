import express from 'express';
import cors from 'cors';
import {
  getHero, updateHero,
  getAbout, updateAbout,
  getSkills, updateSkills,
  getProjects, insertProject, updateProject, deleteProject,
  loginUser
} from './funcionesbd.js';

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Hero
app.get('/api/hero', async (_req, res) => {
  const hero = await getHero();
  res.json({ hero });
});

app.put('/api/hero', async (req, res) => {
  const { texto } = req.body;
  const updated = await updateHero(texto);
  res.json(updated);
});

// About
app.get('/api/about', async (_req, res) => {
  const about = await getAbout();
  res.json({ about });
});

app.put('/api/about', async (req, res) => {
  const { texto } = req.body;
  const updated = await updateAbout(texto);
  res.json(updated);
});

// Skills
app.get('/api/skills', async (_req, res) => {
  const skills = await getSkills();
  res.json(skills);
});

app.put('/api/skills', async (req, res) => {
  const skills = req.body;
  const updated = await updateSkills(skills);
  res.json(updated);
});

// Projects
app.get('/api/projects', async (_req, res) => {
  const projects = await getProjects();
  res.json(projects);
});

app.post('/api/projects', async (req, res) => {
  const { titulo, descripcion } = req.body;
  const project = await insertProject(titulo, descripcion);
  res.json(project);
});

app.put('/api/projects/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion } = req.body;
  const updated = await updateProject(id, titulo, descripcion);
  res.json(updated);
});

app.delete('/api/projects/:id', async (req, res) => {
  const { id } = req.params;
  const deleted = await deleteProject(id);
  res.json(deleted);
});

// Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const ok = await loginUser(username, password);
  res.json({ ok });
});

const port = process.env.PORT || 8081;
app.listen(port, () => console.log(`API escuchando en :${port}`));
