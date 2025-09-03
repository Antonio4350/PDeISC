import { connectDB } from "./conectddbb.js";

// 🔹 Hero + About
export async function getPortfolio() {
  const conn = await connectDB();
  const [rows] = await conn.query("SELECT * FROM hero LIMIT 1");
  const [aboutRows] = await conn.query("SELECT * FROM about LIMIT 1");
  await conn.end();

  return {
    hero: rows.length > 0 ? rows[0].texto : "",
    about: aboutRows.length > 0 ? aboutRows[0].texto : ""
  };
}

export async function upsertPortfolio({ hero, about }) {
  const conn = await connectDB();

  // Hero
  await conn.query(
    "INSERT INTO hero (id, texto) VALUES (1, ?) ON DUPLICATE KEY UPDATE texto = VALUES(texto)",
    [hero]
  );

  // About
  await conn.query(
    "INSERT INTO about (id, texto) VALUES (1, ?) ON DUPLICATE KEY UPDATE texto = VALUES(texto)",
    [about]
  );

  await conn.end();
  return { hero, about };
}

// 🔹 Skills
export async function getSkills() {
  const conn = await connectDB();
  const [rows] = await conn.query("SELECT * FROM skills");
  await conn.end();
  return rows;
}

export async function saveSkills(skills) {
  const conn = await connectDB();
  await conn.query("DELETE FROM skills");
  for (const s of skills) {
    await conn.query("INSERT INTO skills (nombre, nivel) VALUES (?, ?)", [
      s.nombre,
      s.nivel,
    ]);
  }
  await conn.end();
}

// 🔹 Projects
export async function getProjects() {
  const conn = await connectDB();
  const [rows] = await conn.query("SELECT * FROM projects ORDER BY created_at DESC");
  await conn.end();
  return rows;
}

export async function addProject(project) {
  const { titulo, descripcion, imagen, link } = project;
  const conn = await connectDB();
  const [result] = await conn.query(
    "INSERT INTO projects (titulo, descripcion, imagen, link) VALUES (?, ?, ?, ?)",
    [titulo, descripcion, imagen || null, link || null]
  );
  await conn.end();
  return { id: result.insertId, ...project };
}

export async function updateProject(id, project) {
  const { titulo, descripcion, imagen, link } = project;
  const conn = await connectDB();
  await conn.query(
    "UPDATE projects SET titulo=?, descripcion=?, imagen=?, link=? WHERE id=?",
    [titulo, descripcion, imagen || null, link || null, id]
  );
  await conn.end();
}

export async function deleteProject(id) {
  const conn = await connectDB();
  const [result] = await conn.query("DELETE FROM projects WHERE id=?", [id]);
  await conn.end();
  return result.affectedRows > 0;
}
