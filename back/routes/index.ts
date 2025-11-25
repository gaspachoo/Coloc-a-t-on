import express from 'express';
import colocationsRoutes from './colocationsRoutes';

const router = express.Router();

router.use('/colocations', colocationsRoutes);

export default router;
