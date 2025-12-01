import { Request, Response } from 'express';
import authService from '../services/authService';

export default {
  signup: async (req: Request, res: Response) => {
    try {
      const result = await authService.signup(req.body);
      return res.status(201).json(result);
    } catch (err: any) {
      const message = err?.meta?.driverAdapterError?.cause?.originalMessage || err.message || 'Unknown error';
      return res.status(400).json({ error: 'Fail to signup', details: message });
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const result = await authService.login(req.body);
      return res.status(200).json(result);
    } catch (err: any) {
      return res.status(401).json({ error: 'Fail to login', details: err.message });
    }
  },

  logout: async (req: Request, res: Response) => {
    try {
      const auth = req.headers.authorization || '';
      const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
      if (!token) return res.status(400).json({ error: 'Missing token' });
      await authService.logout(token);
      return res.status(204).send();
    } catch (err: any) {
      return res.status(400).json({ error: 'Fail to logout', details: err.message });
    }
  },

  me: async (req: any, res: Response) => {
    return res.status(200).json({ user: req.user });
  },
};
