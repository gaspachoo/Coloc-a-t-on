import prisma from '../services/databaseService';

const usersRepo = {
  async create(data: any) {
    const { last_name, first_name, class_year, email, password_hash, role } = data.body;
    return prisma.user.create({ data : { last_name, first_name, class_year, email, password_hash, role } });
  },

  async getAll() {
    return prisma.user.findMany();
  },

  async delete(id: number) {
    return prisma.user.delete({ where: { id } });
  }
};

export default usersRepo;