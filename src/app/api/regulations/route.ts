import { NextResponse } from 'next/server';
import { getAllRegulations, createRegulation } from '@/lib/data/regulations';
import { getSession } from '@/lib/auth';
import { addLog } from '@/lib/data/activity-logs';

export async function GET() {
  try {
    const regs = await getAllRegulations();
    return NextResponse.json({ success: true, data: regs });
  } catch {
    return NextResponse.json({ success: false, error: 'Gagal memuat data peraturan.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'admin' && session.role !== 'super_admin')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    if (!body.title) {
      return NextResponse.json({ success: false, error: 'Judul peraturan wajib diisi.' }, { status: 400 });
    }

    const item = await createRegulation({
      title: body.title,
      number: body.number || '',
      year: body.year || '',
      description: body.description || '',
      documentLink: body.documentLink || '',
      published: body.published ?? true,
    });

    await addLog('Tambah Peraturan', `Menambahkan: ${item.title}`, session.userId, session.name);

    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: 'Gagal membuat data peraturan.' }, { status: 500 });
  }
}
