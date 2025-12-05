import usersRepo from '../repositories/usersRepo';
import imageProcessor from '../utils/imageProcessor';

const usersServices = {
  async createUser(data: any) {
    return await usersRepo.create(data);
  },

  async getUsers() {
    return await usersRepo.getAll();
  },

  async getUserById(id: number) {
    return await usersRepo.getUserById(id);
  },

  async updateUser(id: number, data: any) {
    return await usersRepo.update(id, data);
  },

  async deleteUser(id: number) {
    return await usersRepo.delete(id);
  },

  async uploadProfilePhoto(userId: number, imageBuffer: Buffer) {
    // Valider que c'est bien une image
    const isValid = await imageProcessor.validateImage(imageBuffer);
    if (!isValid) {
      throw new Error('Invalid image file');
    }

    // Récupérer l'utilisateur pour supprimer l'ancienne photo si elle existe
    const user = await usersRepo.getUserById(userId);
    if (user?.profile_photo_url) {
      await imageProcessor.deleteImage(user.profile_photo_url);
    }

    // Traiter et sauvegarder l'image en WebP (format carré)
    const imagePath = await imageProcessor.processAndSave(imageBuffer, {
      maxWidth: 800,
      maxHeight: 800,
      quality: 90,
      folder: 'profiles',
    });

    // Mettre à jour dans la base de données
    return await usersRepo.updateProfilePhoto(userId, imagePath);
  },

  async deleteProfilePhoto(userId: number) {
    // Récupérer l'utilisateur pour supprimer la photo
    const user = await usersRepo.getUserById(userId);
    if (user?.profile_photo_url) {
      await imageProcessor.deleteImage(user.profile_photo_url);
    }

    // Supprimer de la base de données
    return await usersRepo.deleteProfilePhoto(userId);
  }
};

export default usersServices;