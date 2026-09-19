// INTENTIONAL LAB VULNERABILITY — DO NOT USE IN PRODUCTION
// This authentication module intentionally contains weaknesses for educational purposes.

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

// INTENTIONAL LAB VULNERABILITY — Weak JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'lab_secret_123';

export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  // INTENTIONAL LAB VULNERABILITY — Low salt rounds
  return bcrypt.hashSync(password, 4);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compareSync(password, hash);
}

export function generateToken(payload: JWTPayload): string {
  // INTENTIONAL LAB VULNERABILITY — Weak secret and long expiry
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export function getTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  // INTENTIONAL LAB VULNERABILITY — Also accept token from cookie without proper validation
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    const match = cookieHeader.match(/token=([^;]+)/);
    if (match) return match[1];
  }
  return null;
}

export async function getUserFromRequest(request: Request) {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload) return null;
  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  return user;
}
