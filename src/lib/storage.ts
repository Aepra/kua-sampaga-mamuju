// ============================================================
// Storage Abstraction Layer
// Handles file upload/delete for local storage
// Can be swapped to Supabase Storage later
// ============================================================

import { promises as fs } from 'fs';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export type UploadFolder = 'gallery' | 'information' | 'profile' | 'services';

function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50);
}

function getExtension(filename: string): string {
  return path.extname(filename).toLowerCase();
}

export async function ensureUploadDir(folder: UploadFolder): Promise<void> {
  const dir = path.join(UPLOAD_DIR, folder);
  await fs.mkdir(dir, { recursive: true });
}

export function validateFile(
  file: File
): { valid: boolean; error?: string } {
  // Check size
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'Ukuran file maksimal 5 MB.' };
  }

  // Check MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { valid: false, error: 'Format file tidak diizinkan. Gunakan JPG, PNG, atau WebP.' };
  }

  // Check extension
  const ext = getExtension(file.name);
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return { valid: false, error: 'Ekstensi file tidak diizinkan. Gunakan .jpg, .jpeg, .png, atau .webp.' };
  }

  return { valid: true };
}

export async function uploadFile(
  file: File,
  folder: UploadFolder,
  prefix?: string
): Promise<string> {
  await ensureUploadDir(folder);

  const ext = getExtension(file.name);
  const nameWithoutExt = file.name.replace(/\.[^.]+$/, '');
  const sanitized = sanitizeFilename(prefix || nameWithoutExt);
  const timestamp = Date.now();
  const filename = `${folder}-${timestamp}-${sanitized}${ext}`;

  const filePath = path.join(UPLOAD_DIR, folder, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);

  // Return the public path
  return `/uploads/${folder}/${filename}`;
}

export async function deleteFile(publicPath: string): Promise<boolean> {
  if (!publicPath || !publicPath.startsWith('/uploads/')) {
    return false;
  }

  try {
    const filePath = path.join(process.cwd(), 'public', publicPath);
    await fs.unlink(filePath);
    return true;
  } catch {
    // File may not exist, that's okay
    return false;
  }
}

export async function replaceFile(
  oldPublicPath: string,
  newFile: File,
  folder: UploadFolder,
  prefix?: string
): Promise<string> {
  // Delete old file
  if (oldPublicPath) {
    await deleteFile(oldPublicPath);
  }

  // Upload new file
  return uploadFile(newFile, folder, prefix);
}
