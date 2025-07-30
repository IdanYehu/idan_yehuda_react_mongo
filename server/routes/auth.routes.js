import { Router } from 'express';
import {registerUser,logUser} from  '../controllers/auth.controller.js';
import { controllerTryCatch } from '../utils/tryCatch.js';

const router = Router();

router.post('/register', controllerTryCatch(registerUser, 201))
router.post('/login', controllerTryCatch(logUser))

export default router;