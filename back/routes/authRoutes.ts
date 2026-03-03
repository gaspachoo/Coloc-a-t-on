import express from 'express';
import authCtrl from '../controllers/authCtrl.js';
import requireAuth from '../utils/requireAuth.js';

const router = express.Router();

router.post('/signup', authCtrl.signup);
router.post('/login', authCtrl.login);
router.post('/logout', requireAuth, authCtrl.logout);
router.get('/me', requireAuth, authCtrl.me);

export default router;
