import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    const banners = await prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(banners);
  } catch (error) {
    console.error('Error fetching active banners:', error);
    return NextResponse.json({ error: 'Failed to fetch active banners' }, { status: 500 });
  }
}
