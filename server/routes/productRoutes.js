import { Router } from 'express';
import { body } from 'express-validator';
import { authRequired } from '../middleware/auth.js';
import { listPublic, listAdmin, create, update, remove, getById } from '../controllers/productController.js';

const router = Router();

router.get('/', listPublic);





// 👇 Protege TODAS las admin
router.get('/admin', authRequired, listAdmin);
router.post(
  '/admin',
  authRequired,
  body('title').notEmpty().withMessage('title requerido'),
  body('price').isNumeric().withMessage('price debe ser número'),
  create
);
router.put('/admin/:id', authRequired, update);
router.delete('/admin/:id', authRequired, remove);

router.get('/:id', getById); // Obtener producto público por ID

export default router;
