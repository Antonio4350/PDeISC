import { connectBD } from './conectbd.js';

// Hero
export async function getHero() {
  const db = await connectBD();
  if (!db) return;
  try {
    const result = await db.query('SELECT texto FROM hero WHERE id=1');
    return result.rows[0]?.texto || '';
  } finally { await db.end(); }
}

export async function updateHero(texto) {
  const db = await connectBD();
  if (!db) return;
  try {
    const result = await db.query('UPDATE hero SET texto=$1 WHERE id=1 RETURNING *', [texto]);
    return result.rows[0];
  } finally { await db.end(); }
}

// About
export async function getAbout() {
  const db = await connectBD();
  if (!db) return;
  try {
    const result = await db.query('SELECT texto FROM about WHERE id=1');
    return result.rows[0]?.texto || '';
  } finally { await db.end(); }
}

export async function updateAbout(texto) {
  const db = await connectBD();
  if (!db) return;
  try {
    const result = await db.query('UPDATE about SET texto=$1 WHERE id=1 RETURNING *', [texto]);
    return result.rows[0];
  } finally { await db.end(); }
}

// Skills
export async function getSkills() {
  const db = await connectBD();
  if (!db) return [];
  try {
    const result = await db.query('SELECT * FROM skills ORDER BY id ASC');
    return result.rows;
  } finally { await db.end(); }
}

export async function updateSkills(skills) {
  const db = await connectBD();
  if (!db) return;
  try {
    for (const s of skills) {
      if (s.id) {
        await db.query('UPDATE skills SET nombre=$1, nivel=$2 WHERE id=$3', [s.nombre, s.nivel, s.id]);
      } else {
        await db.query('INSERT INTO skills(nombre,nivel) VALUES($1,$2)', [s.nombre, s.nivel]);
      }
    }
    const result = await db.query('SELECT * FROM skills ORDER BY id ASC');
    return result.rows;
  } finally { await db.end(); }
}

// Projects
export async function getProjects() {
  const db = await connectBD();
  if (!db) return [];
  try {
    const result = await db.query('SELECT * FROM projects ORDER BY id ASC');
    return result.rows;
  } finally { await db.end(); }
}

export async function insertProject(titulo, descripcion) {
  const db = await connectBD();
  if (!db) return;
  try {
    const result = await db.query(
      'INSERT INTO projects (titulo, descripcion) VALUES ($1, $2) RETURNING *',
      [titulo, descripcion]
    );
    return result.rows[0];
  } finally { await db.end(); }
}

export async function updateProject(id, titulo, descripcion) {
  const db = await connectBD();
  if (!db) return;
  try {
    const result = await db.query(
      'UPDATE projects SET titulo=$1, descripcion=$2 WHERE id=$3 RETURNING *',
      [titulo, descripcion, id]
    );
    return result.rows[0];
  } finally { await db.end(); }
}

export async function deleteProject(id) {
  const db = await connectBD();
  if (!db) return;
  try {
    const result = await db.query('DELETE FROM projects WHERE id=$1 RETURNING *', [id]);
    return result.rows[0];
  } finally { await db.end(); }
}

// Login
export async function loginUser(username, password) {
  const db = await connectBD();
  if (!db) return false;
  try {
    const result = await db.query('SELECT * FROM users WHERE username=$1 AND password_hash=$2', [username, password]);
    return !!result.rows[0];
  } finally { await db.end(); }
}
