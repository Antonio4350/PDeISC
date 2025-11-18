const express = require('express');
const router = express.Router();

const db = require('../db');

// Listado de partidos
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM partidos');
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Error al obtener partidos' });
  }
});

// Alta partido
router.post('/', async (req, res) => {
  const { equipo_local, equipo_visitante, fecha, lugar, resultado, latitud, longitud } = req.body;
  try {
    await db.query('INSERT INTO partidos (equipo_local, equipo_visitante, fecha, lugar, resultado, latitud, longitud) VALUES (?, ?, ?, ?, ?, ?, ?)', [equipo_local, equipo_visitante, fecha, lugar, resultado, latitud, longitud]);
    res.json({ message: 'Partido creado' });
  } catch {
    res.status(500).json({ error: 'Error al crear partido' });
  }
});

// Modificación partido
router.put('/:id', async (req, res) => {
  const { equipo_local, equipo_visitante, fecha, lugar, resultado, latitud, longitud } = req.body;
  try {
    await db.query('UPDATE partidos SET equipo_local=?, equipo_visitante=?, fecha=?, lugar=?, resultado=?, latitud=?, longitud=? WHERE id=?', [equipo_local, equipo_visitante, fecha, lugar, resultado, latitud, longitud, req.params.id]);
    res.json({ message: 'Partido modificado' });
  } catch {
    res.status(500).json({ error: 'Error al modificar partido' });
  }
});

// Baja partido
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM partidos WHERE id=?', [req.params.id]);
    res.json({ message: 'Partido eliminado' });
  } catch {
    res.status(500).json({ error: 'Error al eliminar partido' });
  }
});

module.exports = router;