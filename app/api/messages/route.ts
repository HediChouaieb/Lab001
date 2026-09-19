import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// INTENTIONAL LAB VULNERABILITY — DO NOT USE IN PRODUCTION
// Stored XSS: Message content is stored without sanitization

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message, userId } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // INTENTIONAL: Storing raw HTML without sanitization
    const newMessage = await prisma.message.create({
      data: {
        name,
        email,
        subject,
        message,
        userId: userId || 1,
      },
    });

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
