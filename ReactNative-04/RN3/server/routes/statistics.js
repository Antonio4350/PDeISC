const express = require('express');
const router = express.Router();

const db = require('../db');

// Listado de estadísticas
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM estadisticas');
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

// Alta estadística
router.post('/', async (req, res) => {
  const { partido_id, jugador_id, goles, tarjetas } = req.body;
  try {
    await db.query('INSERT INTO estadisticas (partido_id, jugador_id, goles, tarjetas) VALUES (?, ?, ?, ?)', [partido_id, jugador_id, goles, tarjetas]);
    res.json({ message: 'Estadística creada' });
  } catch {
    res.status(500).json({ error: 'Error al crear estadística' });
  }
});

// Modificación estadística
router.put('/:id', async (req, res) => {
  const { partido_id, jugador_id, goles, tarjetas } = req.body;
  try {
    await db.query('UPDATE estadisticas SET partido_id=?, jugador_id=?, goles=?, tarjetas=? WHERE id=?', [partido_id, jugador_id, goles, tarjetas, req.params.id]);
    res.json({ message: 'Estadística modificada' });
  } catch {
    res.status(500).json({ error: 'Error al modificar estadística' });
  }
});

// Baja estadística
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM estadisticas WHERE id=?', [req.params.id]);
    res.json({ message: 'Estadística eliminada' });
  } catch {
    res.status(500).json({ error: 'Error al eliminar estadística' });
  }
});

module.exports = router;