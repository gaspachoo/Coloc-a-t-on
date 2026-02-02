
import express from 'express';
import flatsharesCtrl from '../controllers/flatsharesCtrl';
import requireAuth from '../utils/requireAuth';
import upload from '../utils/uploadMiddleware';
const router = express.Router();

// Public routes
router.get('/', flatsharesCtrl.getFlatshares);

// User applications route (before /:id to avoid conflict)
router.get('/user/applications', requireAuth, flatsharesCtrl.getUserApplications);

router.get('/:id', flatsharesCtrl.getFlatshareById);
router.get('/:id/members', flatsharesCtrl.getMembers);
router.get('/:id/photos', flatsharesCtrl.getPhotos);

// Protected routes
router.post('/', requireAuth, flatsharesCtrl.createFlatshare);
router.patch('/:id', requireAuth, flatsharesCtrl.checkMembership, flatsharesCtrl.updateFlatshare);
router.delete('/:id', requireAuth, flatsharesCtrl.checkMembership, flatsharesCtrl.deleteFlatshare);

// Photo routes
router.post('/:id/photos', requireAuth, flatsharesCtrl.checkMembership, upload.single('photo'), flatsharesCtrl.uploadPhoto);
router.delete('/:id/photos/:photoId', requireAuth, flatsharesCtrl.checkMembership, flatsharesCtrl.deletePhoto);
router.patch('/:id/photos/:photoId/position', requireAuth, flatsharesCtrl.checkMembership, flatsharesCtrl.updatePhotoPosition);

// Logo routes
router.post('/:id/logo', requireAuth, flatsharesCtrl.checkMembership, upload.single('logo'), flatsharesCtrl.uploadLogo);
router.delete('/:id/logo', requireAuth, flatsharesCtrl.checkMembership, flatsharesCtrl.deleteLogo);

// Application routes
router.post('/:id/applications', requireAuth, flatsharesCtrl.createApplication);
router.get('/:id/applications', requireAuth, flatsharesCtrl.getApplications);
router.patch('/:id/applications/:applicationId/accept', requireAuth, flatsharesCtrl.acceptApplication);
router.patch('/:id/applications/:applicationId/reject', requireAuth, flatsharesCtrl.rejectApplication);

export default router;
