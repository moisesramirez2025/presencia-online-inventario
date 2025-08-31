import { Router } from 'express';
import { body } from 'express-validator';
import { authRequired } from '../middleware/auth.js';
import { getPublic, updateAdmin } from '../controllers/settingController.js';

const router = Router();
router.get('/', getPublic);
router.put('/admin', authRequired, body('bannerImageUrl').optional().isString(), body('heroTitle').optional().isString(), body('heroSubtitle').optional().isString(), updateAdmin);
export default router;
