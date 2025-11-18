const express = require('express');
const router = express.Router();

const db = require('../db');

// Listado de equipos
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM equipos');
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Error al obtener equipos' });
  }
});

// Alta equipo
router.post('/', async (req, res) => {
  const { nombre, escudo } = req.body;
  try {
    await db.query('INSERT INTO equipos (nombre, escudo) VALUES (?, ?)', [nombre, escudo]);
    res.json({ message: 'Equipo creado' });
  } catch {
    res.status(500).json({ error: 'Error al crear equipo' });
  }
});

// Modificación equipo
router.put('/:id', async (req, res) => {
  const { nombre, escudo } = req.body;
  try {
    await db.query('UPDATE equipos SET nombre=?, escudo=? WHERE id=?', [nombre, escudo, req.params.id]);
    res.json({ message: 'Equipo modificado' });
  } catch {
    res.status(500).json({ error: 'Error al modificar equipo' });
  }
});

// Baja equipo
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM equipos WHERE id=?', [req.params.id]);
    res.json({ message: 'Equipo eliminado' });
  } catch {
    res.status(500).json({ error: 'Error al eliminar equipo' });
  }
});

module.exports = router;