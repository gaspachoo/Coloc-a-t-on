
import express from 'express';
import flatsharesCtrl from '../controllers/flatsharesCtrl';
import requireAuth from '../utils/requireAuth';
const router = express.Router();

// Public routes
router.get('/', flatsharesCtrl.getFlatshares);
router.get('/:id', flatsharesCtrl.getFlatshareById);

// Protected routes
router.post('/', requireAuth, flatsharesCtrl.createFlatshare);
router.patch('/:id', requireAuth, flatsharesCtrl.checkMembership, flatsharesCtrl.updateFlatshare);
router.delete('/:id', requireAuth, flatsharesCtrl.checkMembership, flatsharesCtrl.deleteFlatshare);

export default router;
