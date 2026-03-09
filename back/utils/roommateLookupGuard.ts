import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/express.js';

type AttemptRecord = {
  windowStart: number;
  count: number;
};

const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 12;

const attempts = new Map<string, AttemptRecord>();

export default function roommateLookupGuard(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const key = `${req.user?.id ?? 'anonymous'}:${req.ip}`;
  const now = Date.now();
  const existing = attempts.get(key);

  if (!existing || now - existing.windowStart >= WINDOW_MS) {
    attempts.set(key, { windowStart: now, count: 1 });
    return next();
  }

  if (existing.count >= MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      error: 'Trop de tentatives. Veuillez reessayer dans 1 minute.',
    });
  }

  existing.count += 1;
  attempts.set(key, existing);
  return next();
}
