import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();

  if (!session || (session.role !== 'admin' && session.role !== 'super_admin')) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { id } = await params;

    if (id === session.userId) {
      return NextResponse.json({ success: false, error: 'Anda tidak dapat menghapus akun Anda sendiri' }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({ where: { id } });

    if (!targetUser) {
      return NextResponse.json({ success: false, error: 'Pengguna tidak ditemukan' }, { status: 404 });
    }

    if (targetUser.role === 'super_admin') {
      return NextResponse.json({ success: false, error: 'Akun Super Admin tidak dapat dihapus' }, { status: 403 });
    }

    if (targetUser.role === 'admin' && session.role !== 'super_admin') {
      return NextResponse.json({ success: false, error: 'Admin tidak dapat menghapus akun Admin lainnya' }, { status: 403 });
    }

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Pengguna berhasil dihapus' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Gagal menghapus pengguna' }, { status: 500 });
  }
}
