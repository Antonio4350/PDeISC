import pool from '../config/db.js';
import Joi from 'joi';

const createSchema = Joi.object({
  componente_id: Joi.number().integer().allow(null),
  titulo: Joi.string().max(255).required(),
  descripcion: Joi.string().allow('', null),
  tipo: Joi.string().valid('error','falta','inconsistencia').default('falta')
});

export async function crearReporte(req, res) {
  const { error, value } = createSchema.validate(req.body);
  if (error) return res.status(400).json({ ok:false, msg: error.details[0].message });
  const { componente_id, titulo, descripcion, tipo } = value;
  await pool.query(
    'INSERT INTO reportes (componente_id,titulo,descripcion,tipo) VALUES (?,?,?,?)',
    [componente_id, titulo, descripcion, tipo]
  );
  return res.status(201).json({ ok:true, msg:'reporte creado' });
}

export async function listarReportes(req, res) {
  const [rows] = await pool.query(
    `SELECT r.*, c.nombre AS componente_nombre, c.imagen
     FROM reportes r
     LEFT JOIN componentes c ON c.id = r.componente_id
     WHERE r.resuelto = 0
     ORDER BY r.creado_en DESC`
  );
  return res.json({ ok:true, data: rows });
}

export async function resolverReporte(req, res) {
  const id = parseInt(req.params.id);
  if (!id) return res.status(400).json({ ok:false, msg:'id invalido' });
  await pool.query('UPDATE reportes SET resuelto = 1, resuelto_en = NOW() WHERE id = ?', [id]);
  return res.json({ ok:true, msg:'reporte resuelto' });
}

export async function eliminarReporte(req, res) {
  const id = parseInt(req.params.id);
  if (!id) return res.status(400).json({ ok:false, msg:'id invalido' });
  await pool.query('DELETE FROM reportes WHERE id = ?', [id]);
  return res.json({ ok:true, msg:'reporte eliminado' });
}
