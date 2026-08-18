import { NextResponse } from 'next/server';
import { getRegulationById, updateRegulation, deleteRegulation } from '@/lib/data/regulations';
import { getSession } from '@/lib/auth';
import { addLog } from '@/lib/data/activity-logs';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    const body = await request.json();
    const updated = await updateRegulation(id, body);
    if (!updated) return NextResponse.json({ success: false, error: 'Tidak ditemukan.' }, { status: 404 });
    await addLog('Edit Peraturan', `Mengedit: ${updated.title}`, session.userId, session.name);
    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json({ success: false, error: 'Gagal memperbarui.' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    const reg = await getRegulationById(id);
    if (!reg) return NextResponse.json({ success: false, error: 'Tidak ditemukan.' }, { status: 404 });
    await deleteRegulation(id);
    await addLog('Hapus Peraturan', `Menghapus: ${reg.title}`, session.userId, session.name);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: 'Gagal menghapus.' }, { status: 500 });
  }
}
