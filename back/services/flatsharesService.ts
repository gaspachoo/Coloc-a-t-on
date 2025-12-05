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
  }
};

export default flatsharesServices;