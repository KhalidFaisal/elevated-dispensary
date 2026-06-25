import Link from 'next/link';
import prisma from '@/lib/prisma';
import HomeClient from './HomeClient';
import { withProductDiscounts } from '@/lib/discounts';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const featuredProducts = await prisma.product.findMany({
    where: { featured: true, isVisible: true, stock: { gt: 0 } },
    take: 8,
    orderBy: { createdAt: 'desc' },
  });

  let categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  });

  if (categories.length === 0) {
    try {
      await prisma.category.createMany({
        data: [
          { name: 'Flower', slug: 'FLOWER', order: 1 },
          { name: 'Edible', slug: 'EDIBLE', order: 2 }
        ],
        skipDuplicates: true
      });
      categories = await prisma.category.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' },
      });
    } catch (err) {
      console.error("Failed to seed categories:", err);
    }
  }

  const enrichedFeatured = await withProductDiscounts(featuredProducts);

  const activeBanners = await prisma.banner.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  });

  return (
    <HomeClient
      featuredProducts={JSON.parse(JSON.stringify(enrichedFeatured))}
      categories={JSON.parse(JSON.stringify(categories))}
      banners={JSON.parse(JSON.stringify(activeBanners))}
    />
  );
}
