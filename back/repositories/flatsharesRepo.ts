import prisma from '../services/databaseService';

const flatsharesRepo = {
  async create(data: any) {
    const { title, 
            description, 
            rent_per_person, 
            bedrooms_count, 
            created_at, 
            street, 
            postal_code, 
            city, 
            latitude, 
            longitude, 
            ambiance, 
            status, 
            next_available_at, 
            created_by_user_id, 
            created_by_user, 
            flatshareMembers, 
            flatsharePhotos, 
            favorites, 
            flatshareApplications, 
            flatshareEquipments
      } = data.body;
      
    return prisma.flatshare.create(
        { data : {  title, 
                    description, 
                    rent_per_person, 
                    bedrooms_count, 
                    created_at, 
                    street, 
                    postal_code, 
                    city, 
                    latitude, 
                    longitude, 
                    ambiance, 
                    status, 
                    next_available_at, 
                    created_by_user_id, 
                    created_by_user, 
                    flatshareMembers, 
                    flatsharePhotos, 
                    favorites, 
                    flatshareApplications, 
                    flatshareEquipments
      } });
  },

  async getAll() {
    return prisma.flatshare.findMany();
  },

  async getFlatshareById(id: number) {
    return prisma.flatshare.findUnique({ where: { id } });
  },

  async update(id: number, data: any) {
    return prisma.flatshare.update({ where: { id }, data });
  },

  async delete(id: number) {
    return prisma.flatshare.delete({ where: { id } });
  }
};

export default flatsharesRepo;