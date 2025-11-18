const express = require('express');
const router = express.Router();

const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Listado de usuarios
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, nombre, email, rol FROM usuarios');
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Alta usuario
router.post('/', async (req, res) => {
  const { nombre, email, password, rol } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)', [nombre, email, hash, rol || 'seguidor']);
    res.json({ message: 'Usuario creado' });
  } catch {
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// Modificación usuario
router.put('/:id', async (req, res) => {
  const { nombre, email, password, rol } = req.body;
  try {
    let query = 'UPDATE usuarios SET nombre=?, email=?, rol=?';
    let params = [nombre, email, rol];
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      query += ', password=?';
      params.push(hash);
    }
    query += ' WHERE id=?';
    params.push(req.params.id);
    await db.query(query, params);
    res.json({ message: 'Usuario modificado' });
  } catch {
    res.status(500).json({ error: 'Error al modificar usuario' });
  }
});

// Baja usuario
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM usuarios WHERE id=?', [req.params.id]);
    res.json({ message: 'Usuario eliminado' });
  } catch {
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

// Login usuario
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE email=?', [email]);
    if (!rows.length) return res.status(401).json({ error: 'Usuario no encontrado' });
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Contraseña incorrecta' });
    // Opcional: generar token JWT
    // const token = jwt.sign({ id: user.id, rol: user.rol }, process.env.JWT_SECRET || 'secret');
    res.json({ user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol } });
  } catch {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

module.exports = router;