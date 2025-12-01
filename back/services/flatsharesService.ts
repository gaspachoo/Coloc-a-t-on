import flatsharesRepo from '../repositories/flatsharesRepo';

const flatsharesServices = {
  async createFlatshare(data: any) {
    return await flatsharesRepo.create(data);
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
  }
};

export default flatsharesServices;