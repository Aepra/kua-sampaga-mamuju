import { NextResponse } from 'next/server';
import { getGalleryById, updateGalleryItem, deleteGalleryItem } from '@/lib/data/gallery';
import { getSession } from '@/lib/auth';
import { addLog } from '@/lib/data/activity-logs';
import { deleteFile } from '@/lib/storage';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const item = await getGalleryById(id);
    if (!item) return NextResponse.json({ success: false, error: 'Tidak ditemukan.' }, { status: 404 });
    return NextResponse.json({ success: true, data: item });
  } catch {
    return NextResponse.json({ success: false, error: 'Gagal memuat data.' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;
    const body = await request.json();
    const updated = await updateGalleryItem(id, body);
    if (!updated) return NextResponse.json({ success: false, error: 'Tidak ditemukan.' }, { status: 404 });
    await addLog('Edit Galeri', `Mengedit foto: ${updated.title}`, session.userId, session.name);
    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json({ success: false, error: 'Gagal memperbarui.' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;
    const item = await deleteGalleryItem(id);
    if (!item) return NextResponse.json({ success: false, error: 'Tidak ditemukan.' }, { status: 404 });
    // Delete physical file
    if (item.image) await deleteFile(item.image);
    await addLog('Hapus Galeri', `Menghapus foto: ${item.title}`, session.userId, session.name);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: 'Gagal menghapus.' }, { status: 500 });
  }
}
