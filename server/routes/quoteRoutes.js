import { Router } from 'express';
import { body } from 'express-validator';
import { authRequired } from '../middleware/auth.js';
import { createPublic, listAdmin, updateStatus } from '../controllers/quoteController.js';

const router = Router();
router.post('/', body('customerName').notEmpty(), body('customerEmail').optional().isEmail(), body('customerPhone').optional().isString(), body('quantity').optional().isInt({ min: 1 }), createPublic);
router.get('/admin', authRequired, listAdmin);
router.put('/admin/:id/status', authRequired, body('status').isIn(['nueva','en_proceso','cerrada']), updateStatus);
export default router;
