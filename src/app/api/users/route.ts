import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if ((session?.user as any)?.role !== 'super_admin') {
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
    return NextResponse.json({ success: false, error: 'Gagal mengambil data pengguna' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  if ((session?.user as any)?.role !== 'super_admin') {
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

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      // Update role if user exists
      const updatedUser = await prisma.user.update({
        where: { email },
        data: { role }
      });
      return NextResponse.json({ success: true, user: updatedUser, message: 'Role pengguna berhasil diperbarui' });
    } else {
      // Create new placeholder user if doesn't exist
      const newUser = await prisma.user.create({
        data: {
          email,
          name: email.split('@')[0], // Generate a default name from email
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
