import bcrypt from 'bcryptjs';
import axios from 'axios';
import { registroSchema, loginSchema } from '../validators/accesoValidator.js';
import * as userModel from '../models/userModel.js';
import { signAccessToken, signRefreshToken, verifyToken } from '../utils/jwt.js';
import dotenv from 'dotenv';
dotenv.config();

export async function registro(req, res) {
  const { error, value } = registroSchema.validate(req.body);
  if (error) return res.status(400).json({ ok:false, msg: error.details[0].message });

  const { nombre, email, password } = value;
  const existing = await userModel.findUserByEmail(email);
  if (existing) return res.status(409).json({ ok:false, msg: 'email ya registrado' });

  const pass_hash = await bcrypt.hash(password, 10);
  const userId = await userModel.createUser({ nombre, email, pass_hash, rol: 'usuario' });

  const accessToken = signAccessToken({ id: userId, email });
  const refreshToken = signRefreshToken({ id: userId, email });

  await userModel.saveRefreshToken(userId, refreshToken);

  return res.status(201).json({ ok:true, accessToken, refreshToken, user:{ id: userId, nombre, email, rol:'usuario' } });
}

export async function login(req, res) {
  const { error, value } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ ok:false, msg: error.details[0].message });

  const { email, password } = value;
  const user = await userModel.findUserByEmail(email);
  if (!user) return res.status(401).json({ ok:false, msg: 'credenciales invalidas' });

  const match = await bcrypt.compare(password, user.pass_hash);
  if (!match) return res.status(401).json({ ok:false, msg: 'credenciales invalidas' });

  const accessToken = signAccessToken({ id: user.id, email: user.email, rol: user.rol });
  const refreshToken = signRefreshToken({ id: user.id, email: user.email, rol: user.rol });

  await userModel.saveRefreshToken(user.id, refreshToken);

  return res.json({
    ok:true,
    accessToken,
    refreshToken,
    user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol }
  });
}

export async function refresh(req, res) {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ ok:false, msg: 'refresh token requerido' });

  const dbUser = await userModel.findUserByRefreshToken(refreshToken);
  if (!dbUser) return res.status(401).json({ ok:false, msg: 'refresh invalido' });

  const payload = verifyToken(refreshToken);
  if (!payload) return res.status(401).json({ ok:false, msg: 'refresh expirado o invalido' });

  const accessToken = signAccessToken({ id: dbUser.id, email: dbUser.email, rol: dbUser.rol });
  const newRefresh = signRefreshToken({ id: dbUser.id, email: dbUser.email, rol: dbUser.rol });

  await userModel.saveRefreshToken(dbUser.id, newRefresh);

  return res.json({ ok:true, accessToken, refreshToken: newRefresh });
}

export async function logout(req, res) {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ ok:false, msg: 'refresh requerido' });

  const dbUser = await userModel.findUserByRefreshToken(refreshToken);
  if (!dbUser) return res.status(200).json({ ok:true, msg: 'ya cerrado' });

  await userModel.saveRefreshToken(dbUser.id, null);
  return res.json({ ok:true, msg: 'logout ok' });
}

export async function loginGithub(req, res) {
  const { githubToken } = req.body;
  if (!githubToken) return res.status(400).json({ ok:false, msg:'github token requerido' });

  try {
    const r = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${githubToken}` }
    });
    const data = r.data;
    if (!data || !data.id) return res.status(401).json({ ok:false, msg:'token github invalido' });

    const email = data.email || `${data.id}@github.fake`;
    let user = await userModel.findUserByEmail(email);
    if (!user) {
      const pass_hash = await bcrypt.hash(`gh_${data.id}_${Date.now()}`, 10);
      const id = await userModel.createUser({
        nombre: data.name || data.login,
        email,
        pass_hash,
        rol: 'usuario'
      });
      user = await userModel.findUserById(id);
    }

    const accessToken = signAccessToken({ id: user.id, email: user.email, rol: user.rol });
    const refreshToken = signRefreshToken({ id: user.id, email: user.email, rol: user.rol });
    await userModel.saveRefreshToken(user.id, refreshToken);

    return res.json({
      ok:true,
      accessToken,
      refreshToken,
      user: { id:user.id, nombre:user.nombre, email:user.email, rol:user.rol }
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok:false, msg:'error github login' });
  }
}

export async function githubExchange(req, res) {
  const { code, redirect_uri } = req.body;
  if (!code) return res.status(400).json({ ok:false, msg:'code requerido' });

  try {
    const tokenRes = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri
    }, {
      headers: { Accept: 'application/json' }
    });

    const tokenData = tokenRes.data;
    if (!tokenData || tokenData.error) return res.status(401).json({ ok:false, msg:'error intercambio github' });

    const githubToken = tokenData.access_token;

    const userRes = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${githubToken}`, Accept: 'application/vnd.github.v3+json' }
    });
    const gh = userRes.data;

    let email = gh.email;
    if (!email) {
      const emRes = await axios.get('https://api.github.com/user/emails', {
        headers: { Authorization: `Bearer ${githubToken}`, Accept: 'application/vnd.github.v3+json' }
      });
      const emails = emRes.data;
      const primary = emails && emails.find(e => e.primary) || emails[0];
      email = primary?.email || `${gh.id}@github.fake`;
    }

    let user = await userModel.findUserByEmail(email);
    if (!user) {
      const pass_hash = await bcrypt.hash(`gh_${gh.id}_${Date.now()}`, 10);
      const newId = await userModel.createUser({
        nombre: gh.name || gh.login,
        email,
        pass_hash,
        rol: 'usuario'
      });
      user = await userModel.findUserById(newId);
    }

    const accessToken = signAccessToken({ id: user.id, email: user.email, rol: user.rol });
    const refreshToken = signRefreshToken({ id: user.id, email: user.email, rol: user.rol });
    await userModel.saveRefreshToken(user.id, refreshToken);

    return res.json({ ok:true, accessToken, refreshToken, user:{ id:user.id, nombre:user.nombre, email:user.email, rol:user.rol } });
  } catch (err) {
    console.error('githubExchange error', err?.response?.data || err.message);
    return res.status(500).json({ ok:false, msg:'error github exchange' });
  }
}
