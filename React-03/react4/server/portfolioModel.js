import pool from "./db.js";

// 🔹 Hero + About
export async function getPortfolio() {
  const heroRes = await pool.query("SELECT texto FROM hero LIMIT 1");
  const aboutRes = await pool.query("SELECT texto FROM about LIMIT 1");

  return {
    hero: heroRes.rows[0]?.texto || "",
    about: aboutRes.rows[0]?.texto || "",
  };
}

export async function upsertPortfolio({ hero, about }) {
  if (hero !== undefined) {
    await pool.query(
      `INSERT INTO hero (id, texto) VALUES (1, $1)
       ON CONFLICT (id) DO UPDATE SET texto = EXCLUDED.texto`,
      [hero]
    );
  }
  if (about !== undefined) {
    await pool.query(
      `INSERT INTO about (id, texto) VALUES (1, $1)
       ON CONFLICT (id) DO UPDATE SET texto = EXCLUDED.texto`,
      [about]
    );
  }
  return { hero, about };
}

// 🔹 Skills
export async function getSkills() {
  const res = await pool.query("SELECT * FROM skills ORDER BY id ASC");
  return res.rows;
}

export async function saveSkills(skills) {
  await pool.query("TRUNCATE TABLE skills RESTART IDENTITY");
  for (const s of skills) {
    await pool.query(
      "INSERT INTO skills (nombre, nivel) VALUES ($1, $2)",
      [s.nombre, s.nivel]
    );
  }
}

// 🔹 Projects
export async function getProjects() {
  const res = await pool.query("SELECT * FROM projects ORDER BY created_at DESC");
  return res.rows;
}

export async function addProject(project) {
  const { titulo, descripcion, imagen, link, finalizado } = project;
  const res = await pool.query(
    `INSERT INTO projects (titulo, descripcion, imagen, link, finalizado)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [titulo, descripcion, imagen || null, link || null, finalizado || false]
  );
  return res.rows[0];
}

export async function updateProject(id, project) {
  const { titulo, descripcion, imagen, link, finalizado } = project;
  await pool.query(
    `UPDATE projects SET titulo=$1, descripcion=$2, imagen=$3, link=$4, finalizado=$5 WHERE id=$6`,
    [titulo, descripcion, imagen || null, link || null, finalizado || false, id]
  );
}

export async function deleteProject(id) {
  const res = await pool.query("DELETE FROM projects WHERE id=$1", [id]);
  return res.rowCount > 0;
}

// 🔹 Users
export async function getUser(username) {
  const res = await pool.query("SELECT * FROM users WHERE username=$1", [username]);
  return res.rows[0];
}
