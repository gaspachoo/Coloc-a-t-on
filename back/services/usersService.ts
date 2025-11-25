import usersRepo from '../repositories/usersRepo';

const usersServices = {
  async createUser(data: any) {
    return await usersRepo.create(data);
  },

  async getUsers() {
    return await usersRepo.getAll();
  },

  async deleteUser(id: number) {
    return await usersRepo.delete(id);
  }
};

export default usersServices;