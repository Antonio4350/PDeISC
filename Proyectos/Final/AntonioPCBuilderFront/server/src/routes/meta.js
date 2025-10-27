import express from 'express';
import pool from '../config/db.js';
import accesoMiddleware from '../middlewares/accesoMiddleware.js';
const router = express.Router();

router.get('/generaciones', accesoMiddleware, async (req,res)=>{
  const [rows] = await pool.query('SELECT id, familia, nombre FROM generaciones ORDER BY familia, nombre');
  return res.json({ ok:true, data: rows });
});

router.get('/estandares', accesoMiddleware, async (req,res)=>{
  const [rows] = await pool.query('SELECT id, categoria, nombre, version FROM estandares ORDER BY categoria,nombre');
  return res.json({ ok:true, data: rows });
});

export default router;
