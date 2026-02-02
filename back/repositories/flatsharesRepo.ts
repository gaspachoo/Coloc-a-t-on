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
  },

  async getMembers(flatshareId: number) {
    const members = await prisma.flatshareMember.findMany({
      where: { flatshare_id: flatshareId, status: 'active' },
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            profile_photo_url: true
          }
        }
      },
      orderBy: { joined_at: 'asc' }
    });

    // Retourner seulement les infos utilisateur
    return members.map(m => m.user);
  },

  async addPhoto(flatshareId: number, url: string, position?: number) {
    // Si aucune position n'est fournie, on prend la position max + 1
    if (position === undefined) {
      const maxPositionPhoto = await prisma.flatsharePhoto.findFirst({
        where: { flatshare_id: flatshareId },
        orderBy: { position: 'desc' }
      });
      position = maxPositionPhoto ? maxPositionPhoto.position + 1 : 0;
    }

    return prisma.flatsharePhoto.create({
      data: {
        flatshare_id: flatshareId,
        url,
        position
      }
    });
  },

  async getPhotos(flatshareId: number) {
    return prisma.flatsharePhoto.findMany({
      where: { flatshare_id: flatshareId },
      orderBy: { position: 'asc' }
    });
  },

  async deletePhoto(photoId: number) {
    return prisma.flatsharePhoto.delete({
      where: { id: photoId }
    });
  },

  async getPhotoById(photoId: number) {
    return prisma.flatsharePhoto.findUnique({
      where: { id: photoId }
    });
  },

  async updatePhotoPosition(photoId: number, position: number) {
    return prisma.flatsharePhoto.update({
      where: { id: photoId },
      data: { position }
    });
  },

  // Application methods
  async createApplication(flatshareId: number, userId: number, message?: string) {
    return prisma.flatshareApplication.create({
      data: {
        flatshare_id: flatshareId,
        user_id: userId,
        message,
        status: 'pending'
      },
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            profile_photo_url: true
          }
        }
      }
    });
  },

  async getApplications(flatshareId: number) {
    return prisma.flatshareApplication.findMany({
      where: { flatshare_id: flatshareId },
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            profile_photo_url: true
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });
  },

  async getApplicationById(applicationId: number) {
    return prisma.flatshareApplication.findUnique({
      where: { id: applicationId },
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            profile_photo_url: true
          }
        }
      }
    });
  },

  async getUserApplications(userId: number) {
    return prisma.flatshareApplication.findMany({
      where: { user_id: userId },
      include: {
        flatshare: {
          select: {
            id: true,
            title: true,
            description: true,
            street: true,
            city: true
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });
  },

  async updateApplicationStatus(applicationId: number, status: 'accepted' | 'rejected' | 'cancelled') {
    return prisma.flatshareApplication.update({
      where: { id: applicationId },
      data: { status }
    });
  },

  async addMember(flatshareId: number, userId: number) {
    return prisma.flatshareMember.create({
      data: {
        flatshare_id: flatshareId,
        user_id: userId,
        status: 'active',
        joined_at: new Date()
      }
    });
  },

  async cancelPendingApplications(flatshareId: number, userId: number) {
    return prisma.flatshareApplication.updateMany({
      where: {
        flatshare_id: flatshareId,
        user_id: userId,
        status: 'pending'
      },
      data: { status: 'cancelled' }
    });
  },

  async updateLogoUrl(flatshareId: number, logoUrl: string | null) {
    return prisma.flatshare.update({
      where: { id: flatshareId },
      data: { logo_url: logoUrl }
    });
  }
};

export default flatsharesRepo;