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
  const { last_name, first_name, class_year, email, password_hash, role } = req.body;
  const user = await prisma.user.create({
    data: { last_name, first_name, class_year, email, password_hash, role }
  });
  res.json(user);
});

// Exemple : Route pour lister les utilisateurs
router.get('/', async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

router.delete('/:id', async (req: Request, res: Response) => {
  const user = await prisma.user.delete({
    where: { id: Number(req.params.id) }
  });
  res.json(user);
});


export default router;
