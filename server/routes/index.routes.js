import {Router} from 'express';
import userRoutes from './user.routes.js';
import authRoutes from './auth.routes.js';
import toolRoutes from './tool.routes.js';


const router = Router();


router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/tools', toolRoutes);

export default router;
