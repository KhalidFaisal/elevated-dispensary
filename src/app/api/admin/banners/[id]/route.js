import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function PUT(request, { params }) {
  try {
    if (!requireAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();

    const banner = await prisma.banner.update({
      where: { id },
      data: {
        title: data.title,
        desktopImage: data.desktopImage,
        mobileImage: data.mobileImage,
        link: data.link,
        isActive: data.isActive,
        order: parseInt(data.order),
      },
    });

    return NextResponse.json(banner);
  } catch (error) {
    console.error('Error updating banner:', error);
    return NextResponse.json({ error: 'Failed to update banner' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    if (!requireAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    
    await prisma.banner.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting banner:', error);
    return NextResponse.json({ error: 'Failed to delete banner' }, { status: 500 });
  }
}
