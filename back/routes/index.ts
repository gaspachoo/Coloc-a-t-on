import express from 'express';
import usersRoutes from './usersRoutes';
import flatsharesRoutes from './flatsharesRoutes';

const router = express.Router();

router.use('/users', usersRoutes);
router.use('/flatshares', flatsharesRoutes);

export default router;
