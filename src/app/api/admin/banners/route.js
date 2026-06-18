import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET(request) {
  try {
    if (!requireAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const banners = await prisma.banner.findMany({
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(banners);
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (!requireAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    const banner = await prisma.banner.create({
      data: {
        title: data.title || '',
        desktopImage: data.desktopImage,
        mobileImage: data.mobileImage,
        link: data.link || '',
        isActive: data.isActive !== undefined ? data.isActive : true,
        order: parseInt(data.order) || 0,
      },
    });

    return NextResponse.json(banner, { status: 201 });
  } catch (error) {
    console.error('Error creating banner:', error);
    return NextResponse.json({ error: 'Failed to create banner' }, { status: 500 });
  }
}
