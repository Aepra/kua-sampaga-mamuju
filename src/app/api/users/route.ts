import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  
  if (!session || (session.role !== 'admin' && session.role !== 'super_admin')) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Gagal mengambil data pengguna' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getSession();
  
  if (!session || (session.role !== 'admin' && session.role !== 'super_admin')) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { email, role } = await req.json();

    if (!email || !role) {
      return NextResponse.json({ success: false, error: 'Email dan role wajib diisi' }, { status: 400 });
    }

    if (!['super_admin', 'admin', 'user', 'guest'].includes(role)) {
      return NextResponse.json({ success: false, error: 'Role tidak valid' }, { status: 400 });
    }

    // Only super_admin can create super_admin
    if (role === 'super_admin' && session.role !== 'super_admin') {
      return NextResponse.json({ success: false, error: 'Hanya Super Admin yang dapat menambahkan Super Admin baru' }, { status: 403 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      if (existingUser.role === 'super_admin' && session.role !== 'super_admin') {
        return NextResponse.json({ success: false, error: 'Admin tidak dapat mengubah akun Super Admin' }, { status: 403 });
      }
      if (existingUser.role === 'admin' && session.role !== 'super_admin' && existingUser.id !== session.userId) {
        return NextResponse.json({ success: false, error: 'Admin tidak dapat mengubah role Admin lainnya' }, { status: 403 });
      }

      const updatedUser = await prisma.user.update({
        where: { email },
        data: { role }
      });
      return NextResponse.json({ success: true, user: updatedUser, message: 'Role pengguna berhasil diperbarui' });
    } else {
      const newUser = await prisma.user.create({
        data: {
          email,
          name: email.split('@')[0],
          role,
        }
      });
      return NextResponse.json({ success: true, user: newUser, message: 'Pengguna baru berhasil ditambahkan' });
    }

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Gagal menambahkan pengguna' }, { status: 500 });
  }
}
