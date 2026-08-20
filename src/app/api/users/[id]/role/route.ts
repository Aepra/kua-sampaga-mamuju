import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  
  if (!session || (session.role !== 'admin' && session.role !== 'super_admin')) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { role } = body;

    if (!['user', 'admin', 'super_admin'].includes(role)) {
      return NextResponse.json({ success: false, error: 'Role tidak valid' }, { status: 400 });
    }

    if (role === 'super_admin' && session.role !== 'super_admin') {
      return NextResponse.json({ success: false, error: 'Hanya Super Admin yang dapat menaikkan pengguna menjadi Super Admin' }, { status: 403 });
    }

    const targetUser = await prisma.user.findUnique({ where: { id } });
    
    if (!targetUser) {
      return NextResponse.json({ success: false, error: 'Pengguna tidak ditemukan' }, { status: 404 });
    }

    if (targetUser.role === 'super_admin') {
      return NextResponse.json({ success: false, error: 'Role Super Admin tidak dapat diubah oleh siapapun' }, { status: 400 });
    }

    if (targetUser.role === 'admin' && session.role !== 'super_admin') {
      return NextResponse.json({ success: false, error: 'Admin tidak dapat mengubah role Admin lainnya' }, { status: 403 });
    }

    await prisma.user.update({
      where: { id },
      data: { role },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Gagal mengubah role' }, { status: 500 });
  }
}
