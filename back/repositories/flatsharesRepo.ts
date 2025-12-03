import prisma from '../services/databaseService';

const flatsharesRepo = {
  async create(data: any, userId: number) {
    const { title, 
            description, 
            rent_per_person, 
            bedrooms_count, 
            street, 
            postal_code, 
            city, 
            latitude, 
            longitude, 
            ambiance, 
            status, 
            next_available_at
      } = data;
      
    return prisma.flatshare.create({
      data: {
        title, 
        description, 
        rent_per_person, 
        bedrooms_count, 
        street, 
        postal_code, 
        city, 
        latitude, 
        longitude, 
        ambiance, 
        status, 
        next_available_at, 
        created_by_user_id: userId,
        flatshareMembers: {
          create: {
            user_id: userId,
            status: 'active',
            joined_at: new Date()
          }
        }
      },
      include: {
        flatshareMembers: true
      }
    });
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
  },

  async checkMembership(flatshareId: number, userId: number) {
    const member = await prisma.flatshareMember.findUnique({
      where: {
        flatshare_id_user_id: {
          flatshare_id: flatshareId,
          user_id: userId
        }
      }
    });
    return member !== null;
  }
};

export default flatsharesRepo;