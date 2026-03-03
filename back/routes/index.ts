import express from 'express';
import usersRoutes from './usersRoutes.js';
import flatsharesRoutes from './flatsharesRoutes.js';
import authRoutes from './authRoutes.js';

const router = express.Router();

router.use('/users', usersRoutes);
router.use('/flatshares', flatsharesRoutes);
router.use('/auth', authRoutes);

export default router;
