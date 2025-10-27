import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SECRET = process.env.JWT_SECRET || 'changeme_secret_key';
const ACCESS_EXP = process.env.JWT_ACCESS_EXPIRY || '15m';
const REFRESH_EXP = process.env.JWT_REFRESH_EXPIRY || '30d';

export function signAccessToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: ACCESS_EXP });
}

export function signRefreshToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: REFRESH_EXP });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
}
