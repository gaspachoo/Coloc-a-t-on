import prisma from '../services/databaseService';

export default {
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  async findUserById(id: number) {
    return prisma.user.findUnique({ 
      where: { id },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        class_year: true,
        profile_photo_url: true,
        role: true,
        created_at: true
      }
    });
  },

  async createUser(data: any) {
    return prisma.user.create({ data });
  },

  async createAuthToken(user_id: number, token_hash: string, expires_at: Date) {
    return prisma.authToken.create({
      data: { user_id, token_hash, expires_at },
    });
  },

  async findToken(token_hash: string) {
    return prisma.authToken.findFirst({ where: { token_hash } });
  },

  async deleteToken(token_hash: string) {
    return prisma.authToken.deleteMany({ where: { token_hash } });
  },
};
