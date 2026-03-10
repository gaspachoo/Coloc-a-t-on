import usersRepo from '../repositories/usersRepo.js';
import imageProcessor from '../utils/imageProcessor.js';
import { hashPassword, verifyPassword } from '../utils/password.js';

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

  async checkRoommateEmailExists(email: string) {
    return await usersRepo.existsByEmail(email);
  },

  async updateUser(id: number, data: any) {
    const { current_password, new_password, ...updateData } = data;

    const isChangingEmail = 'email' in updateData;
    const isChangingPassword = Boolean(new_password);

    if (isChangingEmail || isChangingPassword) {
      if (!current_password) {
        throw new Error('Mot de passe actuel requis');
      }
      const user = await usersRepo.getUserWithPassword(id);
      if (!user) throw new Error('Utilisateur introuvable');
      const ok = await verifyPassword(current_password, (user as any).password_hash);
      if (!ok) throw new Error('Mot de passe actuel incorrect');
    }

    if (isChangingPassword) {
      updateData.password_hash = await hashPassword(new_password);
    }

    // Only allow safe fields to be updated (no role escalation)
    const allowedFields = ['first_name', 'last_name', 'email', 'class_year', 'password_hash'];
    const safeData: Record<string, any> = {};
    for (const key of allowedFields) {
      if (key in updateData) safeData[key] = updateData[key];
    }

    return await usersRepo.updateProfile(id, safeData);
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