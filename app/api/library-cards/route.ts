import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// INTENTIONAL LAB VULNERABILITY — DO NOT USE IN PRODUCTION
// IDOR: No ownership verification on library cards

export async function GET() {
  try {
    const cards = await prisma.libraryCard.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(cards);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
