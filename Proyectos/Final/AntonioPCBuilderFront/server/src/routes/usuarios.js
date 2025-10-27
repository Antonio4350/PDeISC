import express from 'express';
import accesoMiddleware from '../middlewares/accesoMiddleware.js';
import { me } from '../controllers/usuariosController.js';
const router = express.Router();

router.get('/me', accesoMiddleware, me);
export default router;
