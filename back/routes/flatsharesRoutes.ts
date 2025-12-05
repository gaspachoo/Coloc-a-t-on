
import express from 'express';
import flatsharesCtrl from '../controllers/flatsharesCtrl';
import requireAuth from '../utils/requireAuth';
import upload from '../utils/uploadMiddleware';
const router = express.Router();

// Public routes
router.get('/', flatsharesCtrl.getFlatshares);
router.get('/:id', flatsharesCtrl.getFlatshareById);
router.get('/:id/photos', flatsharesCtrl.getPhotos);

// Protected routes
router.post('/', requireAuth, flatsharesCtrl.createFlatshare);
router.patch('/:id', requireAuth, flatsharesCtrl.checkMembership, flatsharesCtrl.updateFlatshare);
router.delete('/:id', requireAuth, flatsharesCtrl.checkMembership, flatsharesCtrl.deleteFlatshare);

// Photo routes
router.post('/:id/photos', requireAuth, flatsharesCtrl.checkMembership, upload.single('photo'), flatsharesCtrl.uploadPhoto);
router.delete('/:id/photos/:photoId', requireAuth, flatsharesCtrl.checkMembership, flatsharesCtrl.deletePhoto);
router.patch('/:id/photos/:photoId/position', requireAuth, flatsharesCtrl.checkMembership, flatsharesCtrl.updatePhotoPosition);

export default router;
