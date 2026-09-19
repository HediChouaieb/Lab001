import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    environment: process.env.APP_ENV || 'development',
    debug: process.env.APP_DEBUG === 'true',
    version: '1.0.0-lab',
    database: process.env.DATABASE_NAME || 'carthage_library_lab',
    framework: 'Next.js',
    nodeVersion: process.version,
    platform: process.platform,
    uptime: process.uptime(),
    internalServices: ['library-api', 'notification-service', 'database'],
    config: {
      jwtSecret: process.env.JWT_SECRET,
      databaseHost: process.env.DATABASE_HOST,
      databasePort: process.env.DATABASE_PORT,
      databaseUser: process.env.DATABASE_USER,
      apiKey: process.env.INTERNAL_API_KEY,
    },
    features: ['authentication', 'borrowing', 'notifications', 'admin-panel'],
    lastDeployment: '2026-09-15T10:30:00Z',
    buildHash: 'abc123def456',
  });
}
