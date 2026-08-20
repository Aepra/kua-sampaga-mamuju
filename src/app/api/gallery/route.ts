import { NextResponse } from 'next/server';
import { getAllGallery, createGalleryItem } from '@/lib/data/gallery';
import { getSession } from '@/lib/auth';
import { addLog } from '@/lib/data/activity-logs';
import { v4 as uuidv4 } from 'uuid';
import type { GalleryItem } from '@/lib/types';

export async function GET() {
  try {
    const gallery = await getAllGallery();
    return NextResponse.json({ success: true, data: gallery });
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

    const item: GalleryItem = {
      id: `gallery-${uuidv4().substring(0, 8)}`,
      title: body.title || '',
      description: body.description || '',
      category: body.category || 'Lainnya',
      image: body.image || '',
      date: body.date || now,
      published: body.published ?? true,
      createdAt: now,
      updatedAt: now,
    };

    await createGalleryItem(item);
    await addLog('Tambah Galeri', `Menambahkan foto: ${item.title}`, session.userId, session.name);

    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: 'Gagal membuat data.' }, { status: 500 });
  }
}
