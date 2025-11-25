import express from 'express';
import usersRoutes from './usersRoutes';

const router = express.Router();

router.use('/users', usersRoutes);

export default router;
