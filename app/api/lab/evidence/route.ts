import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, endpoint, method, requestBody, responseBody, finding, severity, notes, userId } = body;

    const evidence = await prisma.evidence.create({
      data: {
        title,
        endpoint,
        method,
        requestBody: requestBody || null,
        responseBody: responseBody || null,
        finding,
        severity,
        notes,
        userId: userId || 1,
      },
    });

    return NextResponse.json(evidence, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = parseInt(searchParams.get('userId') || '1');

    const evidence = await prisma.evidence.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(evidence);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
