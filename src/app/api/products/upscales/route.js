import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withProductDiscounts } from '@/lib/discounts';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const cartIdsParam = searchParams.get('cartIds');
    const cartIds = cartIdsParam ? cartIdsParam.split(',') : [];

    let products = [];
    let excludeIds = [...cartIds];

    // 1. Context-Aware Upsells: If cart has items, find orders containing those items
    if (cartIds.length > 0) {
      const orderItemsWithCart = await prisma.orderItem.findMany({
        where: { productId: { in: cartIds } },
        select: { orderId: true },
      });

      const orderIds = [...new Set(orderItemsWithCart.map(item => item.orderId))];

      if (orderIds.length > 0) {
        const coOccurringItems = await prisma.orderItem.groupBy({
          by: ['productId'],
          where: {
            orderId: { in: orderIds },
            productId: { notIn: excludeIds }
          },
          _sum: { quantity: true },
          orderBy: { _sum: { quantity: 'desc' } },
          take: 4,
        });

        const fbtIds = coOccurringItems.map(item => item.productId);

        if (fbtIds.length > 0) {
          products = await prisma.product.findMany({
            where: {
              id: { in: fbtIds },
              isVisible: true,
              stock: { gt: 0 }
            }
          });
          excludeIds.push(...products.map(p => p.id));
        }
      }
    }

    // 2. Fallback: Find Best Sellers to recommend as upscales
    if (products.length < 4) {
      const topOrderItems = await prisma.orderItem.groupBy({
        by: ['productId'],
        where: { productId: { notIn: excludeIds } },
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 8, // Overfetch in case some are out of stock
      });
      
      const bestSellerIds = topOrderItems.map(i => i.productId);
      
      if (bestSellerIds.length > 0) {
        const bestSellers = await prisma.product.findMany({
          where: { 
            id: { in: bestSellerIds },
            isVisible: true,
            stock: { gt: 0 }
          },
          take: 4 - products.length
        });
        products.push(...bestSellers);
        excludeIds.push(...bestSellers.map(p => p.id));
      }
    }

    // 3. Ultimate Backfill with featured products
    if (products.length < 4) {
      const moreProducts = await prisma.product.findMany({
        where: {
          id: { notIn: excludeIds },
          isVisible: true,
          stock: { gt: 0 },
          featured: true
        },
        take: 4 - products.length
      });
      products.push(...moreProducts);
    }

    const enriched = await withProductDiscounts(products);
    return NextResponse.json(enriched);
  } catch (error) {
    console.error('Error fetching upscales:', error);
    return NextResponse.json({ error: 'Failed to fetch upscales' }, { status: 500 });
  }
}

