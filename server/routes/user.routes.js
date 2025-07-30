import {Router} from 'express';
import {userAction, getUsers} from '../controllers/user.controller.js';

const router = Router();

router.get('/', getUsers)

// user actions by id
router.get('/:id', userAction)
router.put('/:id', userAction)
router.delete('/:id', userAction )

export default router;