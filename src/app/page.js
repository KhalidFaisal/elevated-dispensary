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

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  });

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
