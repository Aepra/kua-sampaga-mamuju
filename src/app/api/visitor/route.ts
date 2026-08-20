import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const visitor = await prisma.visitorCount.findUnique({
      where: { id: 'global' },
    });
    return NextResponse.json({ count: visitor?.count || 0 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch visitor count' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const visitor = await prisma.visitorCount.upsert({
      where: { id: 'global' },
      update: { count: { increment: 1 } },
      create: { id: 'global', count: 1 },
    });
    return NextResponse.json({ count: visitor.count });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update visitor count' }, { status: 500 });
  }
}
