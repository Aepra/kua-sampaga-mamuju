import { NextResponse } from 'next/server';
import { uploadFile, validateFile, type UploadFolder } from '@/lib/storage';
import { getSession } from '@/lib/auth';

const VALID_FOLDERS: UploadFolder[] = ['gallery', 'information', 'profile', 'services'];

export async function POST(
  request: Request,
  { params }: { params: Promise<{ folder: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { folder } = await params;
    if (!VALID_FOLDERS.includes(folder as UploadFolder)) {
      return NextResponse.json({ success: false, error: 'Folder tidak valid.' }, { status: 400 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'File wajib diunggah.' }, { status: 400 });
    }

    const validation = validateFile(file);
    if (!validation.valid) {
      return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
    }

    const prefix = formData.get('prefix') as string | undefined;
    const path = await uploadFile(file, folder as UploadFolder, prefix || undefined);

    return NextResponse.json({ success: true, data: { path } });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, error: 'Gagal mengunggah file.' }, { status: 500 });
  }
}
