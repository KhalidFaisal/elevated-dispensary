import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    if (!requireAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();
    let imagesArr = [];
    if (Array.isArray(data.images)) {
      imagesArr = data.images;
    } else if (data.image) {
      imagesArr = [data.image];
    }
    const primaryImage = imagesArr.length > 0 ? imagesArr[0] : '';

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        category: data.category,
        price: parseFloat(data.price),
        weight: data.weight || null,
        description: data.description || '',
        image: primaryImage,
        images: JSON.stringify(imagesArr),
        stock: parseInt(data.stock) || 0,
        featured: data.featured || false,
        isVisible: data.isVisible !== undefined ? data.isVisible : true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    if (!requireAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    
    await prisma.$transaction([
      prisma.orderItem.deleteMany({ where: { productId: id } }),
      prisma.product.delete({ where: { id } }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
