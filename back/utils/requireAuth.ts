import { Request, Response, NextFunction } from 'express';
import authRepo from '../repositories/authRepo';
import { hashToken } from './authToken';

export default async function requireAuth(req: any, res: Response, next: NextFunction) {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const token_hash = hashToken(token);
    const record = await authRepo.findToken(token_hash);
    if (!record) return res.status(401).json({ error: 'Unauthorized' });
    if (new Date(record.expires_at) < new Date()) return res.status(401).json({ error: 'Token expired' });

    // Attach user id; expand to fetch user if needed
    req.user = { id: record.user_id };
    next();
  } catch (err: any) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}
