
import express from 'express';
import usersCtrl from '../controllers/usersCtrl';
import requireAuth from '../utils/requireAuth';
const router = express.Router();

// Public routes
router.get('/', usersCtrl.getUsers);
router.get('/:id', usersCtrl.getUserById);

// Protected routes
router.patch('/:id', requireAuth, usersCtrl.checkOwnership, usersCtrl.updateUser);
router.delete('/:id', requireAuth, usersCtrl.checkOwnership, usersCtrl.deleteUser);

export default router;
