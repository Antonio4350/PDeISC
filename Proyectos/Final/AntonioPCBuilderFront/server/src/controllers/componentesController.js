import pool from '../config/db.js';
import Joi from 'joi';

const createSchema = Joi.object({
  tipo: Joi.string().valid('motherboard','cpu','ram','gpu','almacenamiento','fuente','caja','cooler').required(),
  nombre: Joi.string().max(200).required(),
  descripcion_corta: Joi.string().max(500).allow('', null),
  descripcion_detallada: Joi.string().allow('', null),
  precio: Joi.number().min(0).required(),
  stock: Joi.number().integer().min(0).required(),
  imagen: Joi.string().uri().allow('', null),
  generacion_id: Joi.number().integer().allow(null),
  estandares: Joi.array().items(Joi.number().integer()).optional()
});

async function checkAndCreateReportIfNeeded(componentId, tipo, payload) {
  if (tipo === 'motherboard') {
    if (!payload.motherboard || !payload.motherboard.socket || !payload.motherboard.formato) {
      await pool.query('INSERT INTO reportes (componente_id,titulo,descripcion,tipo) VALUES (?,?,?,?)', [
        componentId, 'datos incompletos: motherboard', 'faltan socket o formato en motherboard', 'falta'
      ]);
    }
  }
  if (!payload.imagen || payload.imagen === '') {
    await pool.query('INSERT INTO reportes (componente_id,titulo,descripcion,tipo) VALUES (?,?,?,?)', [
      componentId, 'imagen faltante', 'componente sin imagen', 'falta'
    ]);
  }
}

export async function listComponents(req, res) {
  const [rows] = await pool.query('SELECT id, tipo, nombre, precio, stock, imagen, activo FROM componentes ORDER BY id DESC LIMIT 500');
  return res.json({ ok:true, data: rows });
}

export async function getComponent(req, res) {
  const id = parseInt(req.params.id);
  if (!id) return res.status(400).json({ ok:false, msg:'id invalido' });
  const [rows] = await pool.query('SELECT * FROM componentes WHERE id = ? LIMIT 1', [id]);
  return res.json({ ok:true, data: rows[0] || null });
}

export async function createComponent(req, res) {
  const { error, value } = createSchema.validate(req.body);
  if (error) return res.status(400).json({ ok:false, msg: error.details[0].message });

  const { tipo, nombre, descripcion_corta, descripcion_detallada, precio, stock, imagen, generacion_id } = value;
  const [result] = await pool.query(
    'INSERT INTO componentes (tipo,nombre,descripcion_corta,descripcion_detallada,precio,stock,imagen,creado_por) VALUES (?,?,?,?,?,?,?,?)',
    [tipo, nombre, descripcion_corta, descripcion_detallada, precio, stock, imagen, req.user?.id || null]
  );
  const insertedId = result.insertId;

  if (Array.isArray(req.body.estandares) && req.body.estandares.length) {
    const estIds = req.body.estandares.map(eid => [insertedId, eid, null]);
    await pool.query('INSERT INTO componente_estandar (componente_id,estandar_id,detalle) VALUES ?', [estIds]);
  }

  if (req.body.motherboard) {
    const m = req.body.motherboard;
    await pool.query('INSERT INTO motherboards (componente_id,socket,formato,chipset,max_ram_gb,slots_ram,pcie_version,m2_slots,sata_ports,generacion_id) VALUES (?,?,?,?,?,?,?,?,?,?)', [
      insertedId, m.socket || null, m.formato || null, m.chipset || null, m.max_ram_gb || null, m.slots_ram || null, m.pcie_version || null, m.m2_slots || 0, m.sata_ports || 0, generacion_id || null
    ]);
  }

  await checkAndCreateReportIfNeeded(insertedId, tipo, req.body);

  return res.status(201).json({ ok:true, id: insertedId });
}

export async function updateComponent(req, res) {
  const id = parseInt(req.params.id);
  if (!id) return res.status(400).json({ ok:false, msg:'id invalido' });

  const fields = [];
  const params = [];
  ['nombre','descripcion_corta','descripcion_detallada','precio','stock','imagen','activo'].forEach(k=>{
    if (k in req.body) { fields.push(`${k} = ?`); params.push(req.body[k]); }
  });
  if (!fields.length) return res.status(400).json({ ok:false, msg:'nada para actualizar' });
  params.push(id);
  await pool.query(`UPDATE componentes SET ${fields.join(', ')} WHERE id = ?`, params);
  return res.json({ ok:true, msg:'actualizado' });
}

export async function deleteComponent(req, res) {
  const id = parseInt(req.params.id);
  if (!id) return res.status(400).json({ ok:false, msg:'id invalido' });
  await pool.query('DELETE FROM componentes WHERE id = ?', [id]);
  return res.json({ ok:true, msg:'borrado' });
}
