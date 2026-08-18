// ============================================================
// Supabase Storage Layer
// Handles file upload/delete for Supabase Storage
// ============================================================

import { createClient } from '@supabase/supabase-js';
import path from 'path';

// Supabase Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Create a Supabase client with the service role key for admin-level bypass
const supabase = createClient(supabaseUrl, supabaseKey);

const BUCKET_NAME = 'uploads';

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

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

export function validateFile(
  file: File
): { valid: boolean; error?: string } {
  // Check size
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'Ukuran file maksimal 2 MB.' };
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
  const ext = getExtension(file.name);
  const nameWithoutExt = file.name.replace(/\.[^.]+$/, '');
  const sanitized = sanitizeFilename(prefix || nameWithoutExt);
  const timestamp = Date.now();
  const filename = `${folder}/${timestamp}-${sanitized}${ext}`;

  // Read file to buffer
  const buffer = Buffer.from(await file.arrayBuffer());

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filename, buffer, {
      contentType: file.type,
      upsert: true,
    });

  if (error) {
    console.error('Supabase upload error:', error);
    throw new Error('Gagal mengunggah file ke Supabase');
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filename);

  return publicUrlData.publicUrl;
}

export async function deleteFile(publicUrl: string): Promise<boolean> {
  if (!publicUrl) return false;

  try {
    // Extract the file path from the URL
    // URL format: https://[project].supabase.co/storage/v1/object/public/uploads/[folder]/[filename]
    const urlObj = new URL(publicUrl);
    const pathParts = urlObj.pathname.split('/');
    
    // Find the index of the bucket name
    const bucketIndex = pathParts.indexOf(BUCKET_NAME);
    if (bucketIndex === -1) return false;

    // Reconstruct the path inside the bucket
    const filePath = pathParts.slice(bucketIndex + 1).join('/');

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error('Supabase delete error:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to parse or delete file URL:', error);
    return false;
  }
}

export async function replaceFile(
  oldPublicUrl: string,
  newFile: File,
  folder: UploadFolder,
  prefix?: string
): Promise<string> {
  if (oldPublicUrl) {
    await deleteFile(oldPublicUrl);
  }
  return uploadFile(newFile, folder, prefix);
}
