import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/authOptions';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const serviceId = searchParams.get('serviceId');

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (serviceId) {
      // Check specific service
      const existing = await prisma.userSavedService.findUnique({
        where: {
          userId_serviceId: {
            userId: user.id,
            serviceId: serviceId,
          },
        },
      });
      return NextResponse.json({ isSaved: !!existing });
    } else {
      // Get all saved services
      const savedServices = await prisma.userSavedService.findMany({
        where: { userId: user.id },
        include: { service: { include: { requirements: true } } },
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json({ data: savedServices });
    }
  } catch (error) {
    console.error('Error fetching saved services:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { serviceId } = await req.json();

    if (!serviceId) {
      return NextResponse.json({ error: 'Service ID is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Cek apakah sudah tersimpan
    const existing = await prisma.userSavedService.findUnique({
      where: {
        userId_serviceId: {
          userId: user.id,
          serviceId: serviceId,
        },
      },
    });

    if (existing) {
      // Hapus (Unsave)
      await prisma.userSavedService.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ message: 'Service removed from dashboard', saved: false });
    } else {
      // Simpan (Save)
      const savedService = await prisma.userSavedService.create({
        data: {
          userId: user.id,
          serviceId: serviceId,
        },
      });
      return NextResponse.json({ message: 'Service saved to dashboard', saved: true, data: savedService });
    }
  } catch (error) {
    console.error('Error saving service:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { savedServiceId, requirementId, isChecked } = await req.json();

    if (!savedServiceId || !requirementId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const savedService = await prisma.userSavedService.findUnique({
      where: { id: savedServiceId },
    });

    if (!savedService || savedService.userId !== user.id) {
      return NextResponse.json({ error: 'Saved service not found or unauthorized' }, { status: 404 });
    }

    let updatedCheckedIds = [...savedService.checkedRequirementIds];

    if (isChecked) {
      if (!updatedCheckedIds.includes(requirementId)) {
        updatedCheckedIds.push(requirementId);
      }
    } else {
      updatedCheckedIds = updatedCheckedIds.filter(id => id !== requirementId);
    }

    const updated = await prisma.userSavedService.update({
      where: { id: savedServiceId },
      data: {
        checkedRequirementIds: updatedCheckedIds,
      },
    });

    return NextResponse.json({ message: 'Progress updated', data: updated });
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
