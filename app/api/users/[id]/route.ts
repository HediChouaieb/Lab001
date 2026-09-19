import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// INTENTIONAL LAB VULNERABILITY — DO NOT USE IN PRODUCTION
// IDOR: No ownership verification - any user can access any other user's data

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        // INTENTIONAL: Exposing sensitive fields
        password: true,
        address: true,
        dateOfBirth: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const card = await prisma.libraryCard.findUnique({
      where: { userId: user.id },
    });

    return NextResponse.json({
      ...user,
      libraryCard: card?.cardNumber || null,
      libraryCardStatus: card?.status || null,
      libraryCardExpiry: card?.expiresAt || null,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
