import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET);

    // Get sessions active in the last 2 minutes
    const twoMinsAgo = new Date(Date.now() - 2 * 60 * 1000);
    
    const activeSessions = await prisma.activeSession.findMany({
      where: {
        lastActiveAt: { gte: twoMinsAgo }
      },
      orderBy: {
        lastActiveAt: 'desc'
      }
    });

    return NextResponse.json(activeSessions);
  } catch (error) {
    console.error('Admin Presence Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
