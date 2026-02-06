import { Request, Response, NextFunction } from 'express';
import authRepo from '../repositories/authRepo';
import { hashToken } from './authToken';

export default async function requireAuth(req: any, res: Response, next: NextFunction) {
  try {
    const token = req.cookies.auth_token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const token_hash = hashToken(token);
    const record = await authRepo.findToken(token_hash);
    if (!record) return res.status(401).json({ error: 'Unauthorized' });
    if (new Date(record.expires_at) < new Date()) return res.status(401).json({ error: 'Token expired' });

    // Charger les données complètes de l'utilisateur
    const user = await authRepo.findUserById(record.user_id);
    if (!user) return res.status(401).json({ error: 'User not found' });

    req.user = user;
    next();
  } catch (err: any) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}
