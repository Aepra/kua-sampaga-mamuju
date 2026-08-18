import { NextResponse } from 'next/server';
import { getAllRegulations, createRegulation } from '@/lib/data/regulations';
import { getSession } from '@/lib/auth';
import { addLog } from '@/lib/data/activity-logs';
import { v4 as uuidv4 } from 'uuid';
import type { Regulation } from '@/lib/types';

export async function GET() {
  try {
    const regs = await getAllRegulations();
    return NextResponse.json({ success: true, data: regs });
  } catch {
    return NextResponse.json({ success: false, error: 'Gagal memuat data.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    const body = await request.json();
    const now = new Date().toISOString().split('T')[0];
    const reg: Regulation = {
      id: `reg-${uuidv4().substring(0, 8)}`,
      title: body.title || '',
      number: body.number || '',
      year: body.year || '',
      description: body.description || '',
      documentLink: body.documentLink || '',
      published: body.published ?? true,
      createdAt: now,
      updatedAt: now,
    };
    await createRegulation(reg);
    await addLog('Tambah Peraturan', `Menambahkan: ${reg.title}`, session.userId, session.name);
    return NextResponse.json({ success: true, data: reg }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: 'Gagal membuat data.' }, { status: 500 });
  }
}
