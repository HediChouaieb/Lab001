import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// INTENTIONAL LAB VULNERABILITY — DO NOT USE IN PRODUCTION
// This endpoint exposes user records without any authentication or authorization

export async function GET(request: Request) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        // INTENTIONAL: Also exposing sensitive fields that shouldn't be public
        password: true,
        address: true,
        dateOfBirth: true,
      },
    });

    // INTENTIONAL: Enriching with library card data
    const enrichedUsers = await Promise.all(
      users.map(async (user) => {
        const card = await prisma.libraryCard.findUnique({
          where: { userId: user.id },
        });
        return {
          ...user,
          libraryCard: card?.cardNumber || null,
          // INTENTIONAL: Exposing internal metadata
          internalNotes: `User ${user.id} - Last login: 2026-09-${String(user.id % 30).padStart(2, '0')}`,
        };
      })
    );

    return NextResponse.json(enrichedUsers);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
