import { NextResponse } from 'next/server';
import { getServiceById, updateService, deleteService } from '@/lib/data/services';
import { getSession } from '@/lib/auth';
import { addLog } from '@/lib/data/activity-logs';
import { deleteFile } from '@/lib/storage';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const service = await getServiceById(id);
    if (!service) return NextResponse.json({ success: false, error: 'Tidak ditemukan.' }, { status: 404 });
    return NextResponse.json({ success: true, data: service });
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
    const updated = await updateService(id, body);
    if (!updated) return NextResponse.json({ success: false, error: 'Tidak ditemukan.' }, { status: 404 });

    await addLog('Edit Layanan', `Mengedit layanan: ${updated.title}`, session.userId, session.name);
    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json({ success: false, error: 'Gagal memperbarui data.' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const service = await getServiceById(id);
    if (!service) return NextResponse.json({ success: false, error: 'Tidak ditemukan.' }, { status: 404 });

    if (service.image) await deleteFile(service.image);
    await deleteService(id);
    await addLog('Hapus Layanan', `Menghapus layanan: ${service.title}`, session.userId, session.name);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: 'Gagal menghapus data.' }, { status: 500 });
  }
}
