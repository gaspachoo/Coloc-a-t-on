
import express, { Request, Response } from 'express';
import prisma from '../services/databaseService';
import usersCtrl from '../controllers/usersCtrl';
const router = express.Router();

// Exemple : Route pour créer un utilisateur
router.post('/', usersCtrl.createUser);

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
