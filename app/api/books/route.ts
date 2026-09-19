import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// INTENTIONAL LAB VULNERABILITY — DO NOT USE IN PRODUCTION
// Intentionally returns excessive data and has optional reflected XSS on search

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const userId = searchParams.get('userId');

    // If userId is provided, return borrowings (simplified)
    if (userId) {
      const borrowings = await prisma.borrowing.findMany({
        where: { userId: parseInt(userId) },
        include: { book: true },
      });
      return NextResponse.json({ borrowings });
    }

    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (category) {
      where.category = category;
    }

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: 'asc' },
      }),
      prisma.book.count({ where }),
    ]);

    // INTENTIONAL: API returns more data than the frontend displays
    // Frontend only shows: title, author, category, available
    // API also returns: isbn, description, totalCopies, createdAt, imageUrl, id
    const enrichedBooks = books.map((book) => ({
      ...book,
      // INTENTIONAL: Internal metadata not needed by frontend
      internalSku: `SKU-${book.isbn.replace(/-/g, '')}`,
      lastUpdated: book.createdAt,
      popularityScore: Math.floor(Math.random() * 100),
    }));

    return NextResponse.json({ books: enrichedBooks, total, page, limit });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
