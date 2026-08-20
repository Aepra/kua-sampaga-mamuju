import { NextResponse } from 'next/server';
import { getRegulationById, updateRegulation, deleteRegulation } from '@/lib/data/regulations';
import { getSession } from '@/lib/auth';
import { addLog } from '@/lib/data/activity-logs';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const reg = await getRegulationById(id);
    if (!reg) {
      return NextResponse.json({ success: false, error: 'Peraturan tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: reg });
  } catch {
    return NextResponse.json({ success: false, error: 'Gagal memuat peraturan' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'admin' && session.role !== 'super_admin')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const updated = await updateRegulation(id, body);

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Peraturan tidak ditemukan' }, { status: 404 });
    }

    await addLog('Update Peraturan', `Mengubah peraturan: ${updated.title}`, session.userId, session.name);

    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json({ success: false, error: 'Gagal mengupdate peraturan' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'admin' && session.role !== 'super_admin')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const existing = await getRegulationById(id);
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Peraturan tidak ditemukan' }, { status: 404 });
    }

    const deleted = await deleteRegulation(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Gagal menghapus peraturan' }, { status: 500 });
    }

    await addLog('Hapus Peraturan', `Menghapus peraturan: ${existing.title}`, session.userId, session.name);

    return NextResponse.json({ success: true, message: 'Peraturan berhasil dihapus' });
  } catch {
    return NextResponse.json({ success: false, error: 'Gagal menghapus peraturan' }, { status: 500 });
  }
}
