import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  
  if ((session?.user as any)?.role !== 'super_admin') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { role } = body;

    if (!['user', 'admin'].includes(role)) {
      return NextResponse.json({ success: false, error: 'Role tidak valid' }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({ where: { id } });
    
    if (!targetUser) {
      return NextResponse.json({ success: false, error: 'Pengguna tidak ditemukan' }, { status: 404 });
    }

    if (targetUser.role === 'super_admin') {
      return NextResponse.json({ success: false, error: 'Tidak bisa mengubah role Super Admin' }, { status: 400 });
    }

    await prisma.user.update({
      where: { id },
      data: { role },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Gagal mengubah role' }, { status: 500 });
  }
}
