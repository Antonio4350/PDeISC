import express from 'express';
import * as ctrl from '../controllers/componentesController.js';
import accesoMiddleware from '../middlewares/accesoMiddleware.js';

const router = express.Router();

router.get('/', accesoMiddleware, ctrl.listComponents);
router.get('/:id', accesoMiddleware, ctrl.getComponent);

export default router;
