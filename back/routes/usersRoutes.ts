import 'dotenv/config';
import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const router = express.Router();

// Exemple : Route pour créer un utilisateur
router.post('/', async (req: Request, res: Response) => {
  const { name, email } = req.body;
  const user = await prisma.user.create({
    data: { name, email }
  });
  res.json(user);
});

// Exemple : Route pour lister les utilisateurs
router.get('/', async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

export default router;
