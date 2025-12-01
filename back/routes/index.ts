import express from 'express';
import usersRoutes from './usersRoutes';
import flatsharesRoutes from './flatsharesRoutes';
import authRoutes from './authRoutes';

const router = express.Router();

router.use('/users', usersRoutes);
router.use('/flatshares', flatsharesRoutes);
router.use('/auth', authRoutes);

export default router;
