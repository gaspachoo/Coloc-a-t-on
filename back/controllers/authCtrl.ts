import { Request, Response } from 'express';
import authService from '../services/authService';
import { AuthenticatedRequest } from '../types/express';

export default {
  signup: async (req: Request, res: Response) => {
    try {
      const result = await authService.signup(req.body);
      res.cookie('auth_token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 30 // 30 days
      });
      return res.status(201).json({ user: result.user });
    } catch (err: any) {
      const message = err?.meta?.driverAdapterError?.cause?.originalMessage || err.message || 'Unknown error';
      return res.status(400).json({ error: 'Fail to signup', details: message });
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const result = await authService.login(req.body);
      res.cookie('auth_token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 30 // 30 days
      });
      return res.status(200).json({ user: result.user });
    } catch (err: any) {
      return res.status(401).json({ error: 'Fail to login', details: err.message });
    }
  },

  logout: async (req: Request, res: Response) => {
    try {
      const token = req.cookies.auth_token;
      if (!token) return res.status(400).json({ error: 'Missing token' });
      await authService.logout(token);
      res.clearCookie('auth_token');
      return res.status(204).send();
    } catch (err: any) {
      return res.status(400).json({ error: 'Fail to logout', details: err.message });
    }
  },

  me: async (req: AuthenticatedRequest, res: Response) => {
    return res.status(200).json({ user: req.user });
  },
};
