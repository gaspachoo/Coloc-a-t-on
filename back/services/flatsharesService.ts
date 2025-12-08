import flatsharesRepo from '../repositories/flatsharesRepo';
import imageProcessor from '../utils/imageProcessor';

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
  },

  async getMembers(flatshareId: number) {
    return await flatsharesRepo.getMembers(flatshareId);
  },

  async addPhoto(flatshareId: number, imageBuffer: Buffer, position?: number) {
    // Valider que c'est bien une image
    const isValid = await imageProcessor.validateImage(imageBuffer);
    if (!isValid) {
      throw new Error('Invalid image file');
    }

    // Traiter et sauvegarder l'image en WebP
    const imagePath = await imageProcessor.processAndSave(imageBuffer, {
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 85,
      folder: 'flatshares',
    });

    // Sauvegarder dans la base de données
    return await flatsharesRepo.addPhoto(flatshareId, imagePath, position);
  },

  async getPhotos(flatshareId: number) {
    return await flatsharesRepo.getPhotos(flatshareId);
  },

  async deletePhoto(photoId: number) {
    // Récupérer l'info de la photo pour supprimer le fichier
    const photo = await flatsharesRepo.getPhotoById(photoId);
    if (!photo) {
      throw new Error('Photo not found');
    }

    // Supprimer le fichier physique
    await imageProcessor.deleteImage(photo.url);

    // Supprimer de la base de données
    return await flatsharesRepo.deletePhoto(photoId);
  },

  async updatePhotoPosition(photoId: number, position: number) {
    return await flatsharesRepo.updatePhotoPosition(photoId, position);
  },

  async createApplication(flatshareId: number, userId: number, message?: string) {
    // Vérifier que l'utilisateur n'est pas déjà membre
    const isMember = await flatsharesRepo.checkMembership(flatshareId, userId);
    if (isMember) {
      throw new Error('User is already a member of this flatshare');
    }

    // Vérifier qu'il n'y a pas déjà une application en attente
    const existingApps = await flatsharesRepo.getUserApplications(userId);
    const hasPendingApp = existingApps.some(
      app => app.flatshare_id === flatshareId && app.status === 'pending'
    );
    if (hasPendingApp) {
      throw new Error('User already has a pending application for this flatshare');
    }

    return await flatsharesRepo.createApplication(flatshareId, userId, message);
  },

  async getApplications(flatshareId: number, userId: number) {
    // Vérifier que l'utilisateur est membre
    const isMember = await flatsharesRepo.checkMembership(flatshareId, userId);
    if (!isMember) {
      throw new Error('You are not a member of this flatshare');
    }

    return await flatsharesRepo.getApplications(flatshareId);
  },

  async acceptApplication(applicationId: number, userId: number) {
    // Récupérer l'application
    const application = await flatsharesRepo.getApplicationById(applicationId);
    if (!application) {
      throw new Error('Application not found');
    }

    // Vérifier que l'utilisateur actuel est membre et peut accepter
    const isMember = await flatsharesRepo.checkMembership(application.flatshare_id, userId);
    if (!isMember) {
      throw new Error('You are not a member of this flatshare');
    }

    if (application.status !== 'pending') {
      throw new Error('Application is not pending');
    }

    // Ajouter le nouvel utilisateur comme membre
    await flatsharesRepo.addMember(application.flatshare_id, application.user_id);

    // Mettre à jour le statut de l'application
    await flatsharesRepo.updateApplicationStatus(applicationId, 'accepted');

    // Annuler les autres applications en attente du même utilisateur
    await flatsharesRepo.cancelPendingApplications(application.flatshare_id, application.user_id);

    return await flatsharesRepo.getApplicationById(applicationId);
  },

  async rejectApplication(applicationId: number, userId: number) {
    // Récupérer l'application
    const application = await flatsharesRepo.getApplicationById(applicationId);
    if (!application) {
      throw new Error('Application not found');
    }

    // Vérifier que l'utilisateur actuel est membre et peut rejeter
    const isMember = await flatsharesRepo.checkMembership(application.flatshare_id, userId);
    if (!isMember) {
      throw new Error('You are not a member of this flatshare');
    }

    if (application.status !== 'pending') {
      throw new Error('Application is not pending');
    }

    // Mettre à jour le statut de l'application
    return await flatsharesRepo.updateApplicationStatus(applicationId, 'rejected');
  },

  async getUserApplications(userId: number) {
    return await flatsharesRepo.getUserApplications(userId);
  }
};

export default flatsharesServices;