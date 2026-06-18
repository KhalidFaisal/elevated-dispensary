import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

const flowerProducts = [
  {
    name: 'OG Kush',
    category: 'FLOWER',
    price: 35.00,
    weight: '3.5g',
    description: 'A legendary strain with a complex aroma of fuel, skunk, and spice. Known for its heavy, euphoric effects that melt away stress.',
    stock: 50,
    featured: true,
  },
  {
    name: 'Blue Dream',
    category: 'FLOWER',
    price: 30.00,
    weight: '3.5g',
    description: 'A sweet berry aroma with full-body relaxation paired with gentle cerebral invigoration. Perfect for daytime use.',
    stock: 75,
    featured: true,
  },
  {
    name: 'Granddaddy Purple',
    category: 'FLOWER',
    price: 40.00,
    weight: '3.5g',
    description: 'Dense purple buds with a grape and berry aroma. Delivers potent physical relaxation and dreamy euphoria.',
    stock: 30,
    featured: true,
  },
  {
    name: 'Sour Diesel',
    category: 'FLOWER',
    price: 38.00,
    weight: '3.5g',
    description: 'Fast-acting, energizing cerebral effects with a pungent diesel aroma. Great for creative sessions.',
    stock: 45,
    featured: false,
  },
  {
    name: 'Wedding Cake',
    category: 'FLOWER',
    price: 45.00,
    weight: '3.5g',
    description: 'Rich and tangy with earthy pepper undertones. Offers relaxation with euphoric creative uplift.',
    stock: 25,
    featured: true,
  },
  {
    name: 'Northern Lights',
    category: 'FLOWER',
    price: 32.00,
    weight: '3.5g',
    description: 'A classic indica with sweet, spicy aromas. Provides comfortable laziness and psychoactive effects.',
    stock: 60,
    featured: false,
  },
  {
    name: 'Jack Herer',
    category: 'FLOWER',
    price: 36.00,
    weight: '3.5g',
    description: 'Named after the cannabis activist, delivering blissful, clear-headed creativity and focus.',
    stock: 40,
    featured: false,
  },
  {
    name: 'Gelato',
    category: 'FLOWER',
    price: 42.00,
    weight: '3.5g',
    description: 'Sweet, dessert-like flavors with a balanced high. Beautiful purple and orange buds.',
    stock: 8,
    featured: true,
  },
];

const edibleProducts = [
  {
    name: 'Gummy Bears (Assorted)',
    category: 'EDIBLE',
    price: 25.00,
    weight: '10pc',
    description: 'Delicious assorted fruit-flavored gummy bears. 10mg THC per piece. Perfect for micro-dosing.',
    stock: 100,
    featured: true,
  },
  {
    name: 'Dark Chocolate Bar',
    category: 'EDIBLE',
    price: 35.00,
    weight: '1pc',
    description: 'Premium 72% dark chocolate bar scored into 10 pieces. 10mg THC per square for precise dosing.',
    stock: 60,
    featured: true,
  },
  {
    name: 'Watermelon Gummies',
    category: 'EDIBLE',
    price: 20.00,
    weight: '20pc',
    description: 'Balanced 1:1 THC/CBD watermelon gummies. Mild, relaxing effects without overwhelming intensity.',
    stock: 80,
    featured: false,
  },
  {
    name: 'Peanut Butter Cups',
    category: 'EDIBLE',
    price: 18.00,
    weight: '2pc',
    description: 'Creamy peanut butter in milk chocolate. 12.5mg THC per cup for a decadent experience.',
    stock: 45,
    featured: false,
  },
  {
    name: 'Sour Worms',
    category: 'EDIBLE',
    price: 22.00,
    weight: '10pc',
    description: 'Sour and sweet gummy worms with a kick. 10mg THC per worm. Fan favorite.',
    stock: 3,
    featured: true,
  },
  {
    name: 'Honey Sticks',
    category: 'EDIBLE',
    price: 15.00,
    weight: '5pc',
    description: 'Pure infused honey in convenient stick packs. Perfect in tea, coffee, or straight.',
    stock: 55,
    featured: false,
  },
];

async function main() {
  console.log('🌿 Seeding ELEVATED database...\n');

  // Clear existing products
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();

  // Seed flower products
  for (const product of flowerProducts) {
    const created = await prisma.product.create({ data: product });
    console.log(`  ✅ ${created.category} | ${created.name} ($${created.price})`);
  }

  // Seed edible products
  for (const product of edibleProducts) {
    const created = await prisma.product.create({ data: product });
    console.log(`  ✅ ${created.category} | ${created.name} ($${created.price})`);
  }

  console.log(`\n🎉 Seeded ${flowerProducts.length + edibleProducts.length} products!\n`);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
