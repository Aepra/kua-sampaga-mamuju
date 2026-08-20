import { NextResponse } from 'next/server';
import { getAllInformation, createInformation } from '@/lib/data/information';
import { getSession } from '@/lib/auth';
import { addLog } from '@/lib/data/activity-logs';
import { v4 as uuidv4 } from 'uuid';
import type { Information } from '@/lib/types';

export async function GET() {
  try {
    const info = await getAllInformation();
    return NextResponse.json({ success: true, data: info });
  } catch {
    return NextResponse.json({ success: false, error: 'Gagal memuat data.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'admin' && session.role !== 'super_admin')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const now = new Date().toISOString().split('T')[0];
    const item: Information = {
      id: `info-${uuidv4().substring(0, 8)}`,
      title: body.title || '',
      slug: body.slug || '',
      content: body.content || '',
      excerpt: body.excerpt || '',
      thumbnail: body.thumbnail || '',
      category: body.category || 'Lainnya',
      date: body.date || now,
      published: body.published ?? true,
      createdAt: now,
      updatedAt: now,
    };
    await createInformation(item);
    await addLog('Tambah Informasi', `Menambahkan: ${item.title}`, session.userId, session.name);
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: 'Gagal membuat data.' }, { status: 500 });
  }
}
