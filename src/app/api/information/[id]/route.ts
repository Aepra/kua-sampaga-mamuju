import { NextResponse } from 'next/server';
import { getInformationById, updateInformation, deleteInformation } from '@/lib/data/information';
import { getSession } from '@/lib/auth';
import { addLog } from '@/lib/data/activity-logs';
import { deleteFile } from '@/lib/storage';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const item = await getInformationById(id);
    if (!item) return NextResponse.json({ success: false, error: 'Tidak ditemukan.' }, { status: 404 });
    return NextResponse.json({ success: true, data: item });
  } catch {
    return NextResponse.json({ success: false, error: 'Gagal memuat data.' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'admin' && session.role !== 'super_admin')) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    const body = await request.json();
    const updated = await updateInformation(id, body);
    if (!updated) return NextResponse.json({ success: false, error: 'Tidak ditemukan.' }, { status: 404 });
    await addLog('Edit Informasi', `Mengedit: ${updated.title}`, session.userId, session.name);
    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json({ success: false, error: 'Gagal memperbarui.' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'admin' && session.role !== 'super_admin')) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    const item = await getInformationById(id);
    if (!item) return NextResponse.json({ success: false, error: 'Tidak ditemukan.' }, { status: 404 });
    if (item.images && item.images.length > 0) {
      for (const img of item.images) {
        await deleteFile(img);
      }
    }
    if (item.thumbnail) await deleteFile(item.thumbnail);
    await deleteInformation(id);
    await addLog('Hapus Informasi', `Menghapus: ${item.title}`, session.userId, session.name);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: 'Gagal menghapus.' }, { status: 500 });
  }
}
