import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withProductDiscounts } from '@/lib/discounts';

export async function GET(request, context) {
  try {
    const { id } = await context.params;

    // 1. Find all orders that contain this product
    const orderItemsWithProduct = await prisma.orderItem.findMany({
      where: { productId: id },
      select: { orderId: true },
    });

    const orderIds = [...new Set(orderItemsWithProduct.map(item => item.orderId))];

    let fbtProducts = [];
    let fbtIds = [];

    if (orderIds.length > 0) {
      // 2. Find other products in those same orders
      const coOccurringItems = await prisma.orderItem.groupBy({
        by: ['productId'],
        where: {
          orderId: { in: orderIds },
          productId: { not: id } // Exclude the current product
        },
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 4,
      });

      fbtIds = coOccurringItems.map(item => item.productId);

      if (fbtIds.length > 0) {
        fbtProducts = await prisma.product.findMany({
          where: {
            id: { in: fbtIds },
            isVisible: true,
            stock: { gt: 0 }
          }
        });
      }
    }

    // 3. Fallback: if we have fewer than 4 recommendations, pad with general best sellers
    if (fbtProducts.length < 4) {
      const topOrderItems = await prisma.orderItem.groupBy({
        by: ['productId'],
        where: {
          productId: { notIn: [id, ...fbtProducts.map(p => p.id)] }
        },
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 4 - fbtProducts.length,
      });

      const fallbackIds = topOrderItems.map(item => item.productId);

      if (fallbackIds.length > 0) {
        const fallbackProducts = await prisma.product.findMany({
          where: {
            id: { in: fallbackIds },
            isVisible: true,
            stock: { gt: 0 }
          }
        });
        fbtProducts.push(...fallbackProducts);
      }
    }

    // 4. Ultimate Fallback: if still fewer than 4, pad with featured items
    if (fbtProducts.length < 4) {
      const featuredProducts = await prisma.product.findMany({
        where: {
          id: { notIn: [id, ...fbtProducts.map(p => p.id)] },
          isVisible: true,
          stock: { gt: 0 },
          featured: true
        },
        take: 4 - fbtProducts.length
      });
      fbtProducts.push(...featuredProducts);
    }

    const enriched = await withProductDiscounts(fbtProducts);
    return NextResponse.json(enriched);
  } catch (error) {
    console.error('Error fetching frequently bought together:', error);
    return NextResponse.json({ error: 'Failed to fetch FBT' }, { status: 500 });
  }
}
