import flatsharesRepo from '../repositories/flatsharesRepo';

const flatsharesServices = {
  async createFlatshare(req: any) {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    return await flatsharesRepo.create(req.body, userId);
  },

  async getFlatshares() {
    return await flatsharesRepo.getAll();
  },

  async getFlatshareById(id: number) {
    return await flatsharesRepo.getFlatshareById(id);
  },

  async updateFlatshare(id: number, data: any) {
    return await flatsharesRepo.update(id, data);
  },

  async deleteFlatshare(id: number) {
    return await flatsharesRepo.delete(id);
  },

  async checkUserMembership(flatshareId: number, userId: number) {
    return await flatsharesRepo.checkMembership(flatshareId, userId);
  }
};

export default flatsharesServices;