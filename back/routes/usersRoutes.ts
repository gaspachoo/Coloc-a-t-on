
import express from 'express';
import usersCtrl from '../controllers/usersCtrl.js';
import requireAuth from '../utils/requireAuth.js';
import upload from '../utils/uploadMiddleware.js';
import roommateLookupGuard from '../utils/roommateLookupGuard.js';
const router = express.Router();

// Public routes
router.get('/', usersCtrl.getUsers);
router.post('/check-roommate-email', requireAuth, roommateLookupGuard, usersCtrl.checkRoommateEmail);
router.get('/:id', usersCtrl.getUserById);

// Protected routes
router.patch('/:id', requireAuth, usersCtrl.checkOwnership, usersCtrl.updateUser);
router.delete('/:id', requireAuth, usersCtrl.checkOwnership, usersCtrl.deleteUser);

// Profile photo routes
router.post('/:id/profile-photo', requireAuth, usersCtrl.checkOwnership, upload.single('photo'), usersCtrl.uploadProfilePhoto);
router.delete('/:id/profile-photo', requireAuth, usersCtrl.checkOwnership, usersCtrl.deleteProfilePhoto);

export default router;
