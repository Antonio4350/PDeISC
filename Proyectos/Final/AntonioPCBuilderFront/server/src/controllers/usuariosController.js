import * as userModel from '../models/userModel.js';

export async function me(req, res) {
  if (!req.user) return res.status(401).json({ ok:false, msg:'sin usuario' });
  const user = await userModel.findUserById(req.user.id);
  if (!user) return res.status(404).json({ ok:false, msg:'usuario no encontrado' });
  return res.json({ ok:true, user: { id:user.id, nombre:user.nombre, email:user.email, rol:user.rol } });
}
