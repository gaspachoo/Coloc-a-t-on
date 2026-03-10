import prisma from '../services/databaseService.js';

const usersRepo = {
  async create(data: any) {
    const { last_name, first_name, class_year, email, password_hash, role } = data.body;
    return prisma.user.create({ data : { last_name, first_name, class_year, email, password_hash, role } });
  },

  async getAll() {
    return prisma.user.findMany();
  },

  async getUserById(id: number) {
    return prisma.user.findUnique({ where: { id } });
  },

  async existsByEmail(email: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    });
    return Boolean(user);
  },

  async update(id: number, data: any) {
    return prisma.user.update({ where: { id }, data });
  },

  async updateProfile(id: number, data: any) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        class_year: true,
        profile_photo_url: true,
        role: true,
        created_at: true,
      },
    });
  },

  async getUserWithPassword(id: number) {
    return prisma.user.findUnique({ where: { id } });
  },

  async delete(id: number) {
    return prisma.user.delete({ where: { id } });
  },

  async updateProfilePhoto(id: number, photoUrl: string) {
    return prisma.user.update({
      where: { id },
      data: { profile_photo_url: photoUrl }
    });
  },

  async deleteProfilePhoto(id: number) {
    return prisma.user.update({
      where: { id },
      data: { profile_photo_url: null }
    });
  }
};

export default usersRepo;