import express from 'express';
import { registro, login, refresh, logout, loginGithub, githubExchange } from '../controllers/accesoController.js';
const router = express.Router();

router.post('/registro', registro);
router.post('/login', login);
router.post('/login-github', loginGithub);
router.post('/github-exchange', githubExchange);
router.post('/refresh', refresh);
router.post('/logout', logout);

export default router;
