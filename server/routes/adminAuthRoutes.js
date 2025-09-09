import { Router } from 'express';
import { adminLogin, registerOwner } from '../controllers/adminAuthController.js';

const router = Router();

router.post('/login', adminLogin);
router.post('/register-owner', registerOwner);

export default router;
