import { NextResponse } from 'next/server';
import { getSettings, updateSettings } from '@/lib/data/settings';
import { getSession } from '@/lib/auth';
import { addLog } from '@/lib/data/activity-logs';

export async function GET() {
  try {
    const settings = await getSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch {
    return NextResponse.json({ success: false, error: 'Gagal memuat data.' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    const body = await request.json();
    const updated = await updateSettings(body);
    await addLog('Edit Profil KUA', 'Memperbarui profil KUA', session.userId, session.name);
    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json({ success: false, error: 'Gagal memperbarui.' }, { status: 500 });
  }
}
