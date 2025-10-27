import express from 'express';
import accesoMiddleware from '../middlewares/accesoMiddleware.js';
import requireRole from '../middlewares/role.js';
import * as ctrl from '../controllers/componentesController.js';
import * as repCtrl from '../controllers/reportesController.js';

const router = express.Router();

router.use(accesoMiddleware, requireRole('admin'));
router.post('/componentes', ctrl.createComponent);
router.put('/componentes/:id', ctrl.updateComponent);
router.delete('/componentes/:id', ctrl.deleteComponent);

router.get('/reportes', repCtrl.listarReportes);
router.post('/reportes', repCtrl.crearReporte);
router.put('/reportes/:id/resolver', repCtrl.resolverReporte);
router.delete('/reportes/:id', repCtrl.eliminarReporte);

export default router;
