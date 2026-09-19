import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { challengeId, flag, userId } = body;

    if (!challengeId || !flag) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
    }

    // INTENTIONAL: Simple flag comparison (in production, use timing-safe comparison)
    const isCorrect = challenge.flag === flag;

    if (isCorrect) {
      const progress = await prisma.userProgress.upsert({
        where: {
          userId_challengeId: {
            userId: userId || 1,
            challengeId,
          },
        },
        update: {
          completed: true,
          completedAt: new Date(),
        },
        create: {
          userId: userId || 1,
          challengeId,
          completed: true,
          completedAt: new Date(),
        },
      });

      return NextResponse.json({
        correct: true,
        message: 'Correct flag!',
        points: challenge.points,
      });
    }

    return NextResponse.json({
      correct: false,
      message: 'Incorrect flag. Try again.',
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
