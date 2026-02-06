import sharp from 'sharp';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

export interface ImageProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  folder?: string;
}

const imageProcessor = {
  /**
   * Convertit une image en WebP et la sauvegarde
   * @param buffer - Buffer de l'image originale
   * @param options - Options de traitement
   * @returns Le chemin relatif de l'image sauvegardée
   */
  async processAndSave(
    buffer: Buffer,
    options: ImageProcessingOptions = {}
  ): Promise<string> {
    const {
      maxWidth = 1920,
      maxHeight = 1080,
      quality = 85,
      folder = 'flatshares',
    } = options;

    // Générer un nom de fichier unique
    const filename = `${crypto.randomBytes(16).toString('hex')}.webp`;
    const uploadDir = path.join(process.cwd(), 'uploads', folder);
    const filePath = path.join(uploadDir, filename);

    // Créer le dossier s'il n'existe pas
    await fs.mkdir(uploadDir, { recursive: true });

    // Traiter et convertir l'image en WebP
    await sharp(buffer)
      .resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality })
      .toFile(filePath);

    // Retourner le chemin relatif (sans le préfixe 'uploads' car il est déjà dans la route statique)
    return path.join(folder, filename).replace(/\\/g, '/');
  },

  /**
   * Supprime une image du système de fichiers
   * @param relativePath - Chemin relatif de l'image
   */
  async deleteImage(relativePath: string): Promise<void> {
    try {
      const fullPath = path.join(process.cwd(), relativePath);
      await fs.unlink(fullPath);
    } catch (error) {
      console.error(`Failed to delete image: ${relativePath}`, error);
      // Ne pas propager l'erreur pour éviter de bloquer d'autres opérations
    }
  },

  /**
   * Valide qu'un buffer est bien une image
   * @param buffer - Buffer à valider
   * @returns true si c'est une image valide
   */
  async validateImage(buffer: Buffer): Promise<boolean> {
    try {
      const metadata = await sharp(buffer).metadata();
      return !!(metadata.width && metadata.height);
    } catch {
      return false;
    }
  },

  /**
   * Récupère les métadonnées d'une image
   * @param buffer - Buffer de l'image
   */
  async getMetadata(buffer: Buffer) {
    return await sharp(buffer).metadata();
  },
};

export default imageProcessor;
