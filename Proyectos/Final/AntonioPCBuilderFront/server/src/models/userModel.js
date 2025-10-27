import pool from '../config/db.js';

export async function findUserByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ? LIMIT 1', [email]);
  return rows[0] || null;
}

export async function findUserById(id) {
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE id = ? LIMIT 1', [id]);
  return rows[0] || null;
}

export async function createUser({ nombre, email, pass_hash, rol = 'usuario', refresh_token = null }) {
  const [res] = await pool.query(
    'INSERT INTO usuarios (nombre,email,pass_hash,rol,refresh_token) VALUES (?,?,?,?,?)',
    [nombre, email, pass_hash, rol, refresh_token]
  );
  return res.insertId;
}

export async function saveRefreshToken(userId, token) {
  await pool.query('UPDATE usuarios SET refresh_token = ? WHERE id = ?', [token, userId]);
}

export async function findUserByRefreshToken(token) {
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE refresh_token = ? LIMIT 1', [token]);
  return rows[0] || null;
}
