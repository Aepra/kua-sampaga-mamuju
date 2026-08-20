import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');

    if (type === 'mine') {
      // Get current user's feedback
      const session = await getServerSession(authOptions);
      if (!(session?.user as any)?.id) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      }

      const myFeedback = await prisma.feedback.findUnique({
        where: { userId: (session!.user as any).id },
      });
      return NextResponse.json({ success: true, data: myFeedback });
    }

    // Default: Get all published feedback
    const feedbackList = await prisma.feedback.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    return NextResponse.json({ success: true, data: feedbackList });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Gagal mengambil data masukan' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!(session?.user as any)?.id) {
      return NextResponse.json({ success: false, error: 'Silakan login terlebih dahulu' }, { status: 401 });
    }

    const body = await req.json();
    const { message, rating } = body;

    if (!message) {
      return NextResponse.json({ success: false, error: 'Pesan wajib diisi' }, { status: 400 });
    }

    // Upsert ensures only 1 feedback per user
    const feedback = await prisma.feedback.upsert({
      where: { userId: (session!.user as any).id },
      update: {
        message,
        rating: rating || 5,
        published: false, // Reset published status on edit so admin can re-review
        name: session?.user?.name || 'Pengunjung', // Update name in case it changed
      },
      create: {
        userId: (session!.user as any).id,
        name: session?.user?.name || 'Pengunjung',
        message,
        rating: rating || 5,
        published: false,
      },
    });

    return NextResponse.json({ success: true, data: feedback });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Gagal mengirim masukan' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!(session?.user as any)?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.feedback.delete({
      where: { userId: (session!.user as any).id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Gagal menghapus masukan' }, { status: 500 });
  }
}
