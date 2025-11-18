const express = require('express');
const router = express.Router();

const db = require('../db');

// Listado de jugadores
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM jugadores');
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Error al obtener jugadores' });
  }
});

// Alta jugador
router.post('/', async (req, res) => {
  const { nombre, apellido, edad, posicion, numero_casaca, equipo_id, foto } = req.body;
  try {
    await db.query('INSERT INTO jugadores (nombre, apellido, edad, posicion, numero_casaca, equipo_id, foto) VALUES (?, ?, ?, ?, ?, ?, ?)', [nombre, apellido, edad, posicion, numero_casaca, equipo_id, foto]);
    res.json({ message: 'Jugador creado' });
  } catch {
    res.status(500).json({ error: 'Error al crear jugador' });
  }
});

// Modificación jugador
router.put('/:id', async (req, res) => {
  const { nombre, apellido, edad, posicion, numero_casaca, equipo_id, foto } = req.body;
  try {
    await db.query('UPDATE jugadores SET nombre=?, apellido=?, edad=?, posicion=?, numero_casaca=?, equipo_id=?, foto=? WHERE id=?', [nombre, apellido, edad, posicion, numero_casaca, equipo_id, foto, req.params.id]);
    res.json({ message: 'Jugador modificado' });
  } catch {
    res.status(500).json({ error: 'Error al modificar jugador' });
  }
});

// Baja jugador
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM jugadores WHERE id=?', [req.params.id]);
    res.json({ message: 'Jugador eliminado' });
  } catch {
    res.status(500).json({ error: 'Error al eliminar jugador' });
  }
});

module.exports = router;