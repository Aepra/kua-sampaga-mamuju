import { NextResponse } from 'next/server';
import { getAllServices, createService } from '@/lib/data/services';
import { getSession } from '@/lib/auth';
import { addLog } from '@/lib/data/activity-logs';
import { v4 as uuidv4 } from 'uuid';
import type { Service } from '@/lib/types';

export async function GET() {
  try {
    const services = await getAllServices();
    return NextResponse.json({ success: true, data: services });
  } catch {
    return NextResponse.json({ success: false, error: 'Gagal memuat data.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const now = new Date().toISOString().split('T')[0];

    const service: Service = {
      id: `service-${uuidv4().substring(0, 8)}`,
      title: body.title || '',
      slug: body.slug || '',
      category: body.category || 'Lainnya',
      icon: body.icon || 'FileText',
      image: body.image || '',
      description: body.description || '',
      additionalDescription: body.additionalDescription || '',
      requirements: body.requirements || [],
      documentsToBring: body.documentsToBring || [],
      steps: body.steps || [],
      notes: body.notes || [],
      fee: body.fee || null,
      processingTime: body.processingTime || null,
      externalLink: body.externalLink || null,
      keywords: body.keywords || [],
      published: body.published ?? true,
      isDummy: false,
      createdAt: now,
      updatedAt: now,
    };

    await createService(service);
    await addLog('Tambah Layanan', `Menambahkan layanan: ${service.title}`, session.userId, session.name);

    return NextResponse.json({ success: true, data: service }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: 'Gagal membuat data.' }, { status: 500 });
  }
}
