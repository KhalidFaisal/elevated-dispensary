import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const discounts = await prisma.discount.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(discounts);
  } catch (error) {
    console.error('Error fetching active discounts:', error);
    return NextResponse.json({ error: 'Failed to fetch discounts' }, { status: 500 });
  }
}
