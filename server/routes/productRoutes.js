import { Router } from 'express';
import { body } from 'express-validator';
import { authRequired } from '../middleware/auth.js';
import { listPublic, listAdmin, create, update, remove } from '../controllers/productController.js';

const router = Router();
router.get('/', listPublic);
router.get('/admin', /*authRequired,*/ listAdmin);
router.post('/admin', /*authRequired,*/ body('title').notEmpty(), body('price').isNumeric(), create);
router.put('/admin/:id', /*authRequired,*/ update);
router.delete('/admin/:id', authRequired, remove);
export default router;
