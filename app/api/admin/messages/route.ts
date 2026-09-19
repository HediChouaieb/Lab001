import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// INTENTIONAL LAB VULNERABILITY — DO NOT USE IN PRODUCTION
// No authentication or authorization check

export async function GET() {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
