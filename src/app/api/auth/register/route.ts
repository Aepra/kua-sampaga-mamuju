import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Nama, Email, dan Password wajib diisi.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password minimal 6 karakter.' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email sudah terdaftar. Silakan login.' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user (default role: user)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: 'user', // Default role for public registration
      },
    });

    return NextResponse.json(
      { success: true, message: 'Pendaftaran berhasil. Silakan login.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan pada server saat mendaftar.' },
      { status: 500 }
    );
  }
}
