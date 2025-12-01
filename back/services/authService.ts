import authRepo from '../repositories/authRepo';
import { hashPassword, verifyPassword } from '../utils/password';
import { generateToken, hashToken } from '../utils/authToken';

export default {
  async signup(body: any) {
    const { email, password, first_name, last_name, class_year, role } = body;
    const password_hash = await hashPassword(password);
    const user = await authRepo.createUser({ email, password_hash, first_name, last_name, class_year, role });
    return { user };
  },

  async login(body: any) {
    const { email, password } = body;
    const user = await authRepo.findUserByEmail(email);
    if (!user) {
      throw new Error('Identifiants invalides');
    }
    const ok = await verifyPassword(password, (user as any).password_hash);
    if (!ok) {
      throw new Error('Identifiants invalides');
    }
    const rawToken = generateToken(48);
    const token_hash = hashToken(rawToken);
    const expires_at = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30j
    await authRepo.createAuthToken((user as any).id, token_hash, expires_at);
    return { token: rawToken, user };
  },

  async logout(rawToken: string) {
    const token_hash = hashToken(rawToken);
    await authRepo.deleteToken(token_hash);
  },
};
