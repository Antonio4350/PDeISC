import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export default function accesoMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ ok: false, msg: 'token faltante' });

  const parts = header.split(' ');
  if (parts.length !== 2) return res.status(401).json({ ok: false, msg: 'token mal formado' });

  const token = parts[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ ok: false, msg: 'token invalido' });
  }
}
