'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import ProductCard from '@/components/ProductCard';
import { CartProvider } from '@/components/CartProvider';
import CannabisIcon from '@/components/icons/CannabisIcon';

import { useState, useEffect } from 'react';

function BannerCarousel({ banners }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!banners || banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners]);

  if (!banners || banners.length === 0) return <HeroSection />;

  return (
    <section className="relative w-full max-w-7xl mx-auto px-0 md:px-4 sm:px-6 lg:px-8 mt-16 md:mt-20 group">
      <div className="grid rounded-none md:rounded-2xl overflow-hidden">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`col-start-1 row-start-1 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <Link href={banner.link || '#'} className="block w-full h-full cursor-pointer">
              <picture>
                <source media="(min-width: 768px)" srcSet={banner.desktopImage || banner.mobileImage} />
                <img
                  src={banner.mobileImage || banner.desktopImage}
                  alt={banner.title}
                  className="w-full h-auto object-contain"
                />
              </picture>
            </Link>
          </div>
        ))}
      </div>
      
      {/* Carousel Controls */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-3 h-3 rounded-full transition-all ${
                i === currentIndex ? 'bg-elevated-emerald scale-125' : 'bg-white/50 hover:bg-white'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" id="hero">
      {/* Background */}
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.08)_0%,transparent_70%)]" />

      {/* Floating particles */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-elevated-emerald/30 rounded-full animate-float" style={{ animationDelay: '0s' }} />
      <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-elevated-gold/20 rounded-full animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-elevated-emerald/20 rounded-full animate-float" style={{ animationDelay: '4s' }} />
      <div className="absolute top-2/3 right-1/4 w-2.5 h-2.5 bg-elevated-gold/15 rounded-full animate-float" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto animate-fade-in-up">
        {/* Leaf icon */}
        <div className="mb-6">
          <svg
            className="w-16 h-16 md:w-20 md:h-20 mx-auto text-elevated-emerald animate-float"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
          </svg>
        </div>

        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-4">
          <span className="text-gradient">ELEVATED</span>
        </h1>

        <p className="text-xl md:text-2xl text-elevated-muted font-light tracking-widest uppercase mb-8">
          Rise Above
        </p>

        <p className="text-lg text-elevated-muted/80 max-w-xl mx-auto mb-10">
          Premium flower and edibles, hand-selected for the elevated experience you deserve.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/menu" className="btn-primary text-lg px-10 py-4" id="shop-now-btn">
            Shop Now
          </Link>
          <Link href="/menu?category=FLOWER" className="btn-secondary text-lg px-10 py-4" id="browse-flower-btn">
            Browse Flowers
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProductSection({ title, subtitle, products, viewAllHref, icon }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="section-title flex items-center gap-3">
            <span>{icon}</span> {title}
          </h2>
          <p className="section-subtitle">{subtitle}</p>
        </div>
        <Link
          href={viewAllHref}
          className="text-elevated-emerald hover:text-elevated-emerald-light font-medium text-sm transition-colors hidden sm:block"
        >
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="text-center mt-8 sm:hidden">
        <Link href={viewAllHref} className="btn-secondary text-sm">
          View All →
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-elevated-border bg-elevated-dark/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-7 h-7 text-elevated-emerald" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
              </svg>
              <span className="text-lg font-black text-gradient">ELEVATED</span>
            </div>
            <p className="text-elevated-muted text-sm">
              Premium cannabis dispensary offering the finest flower and edibles. Rise above the ordinary.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link href="/menu" className="block text-elevated-muted text-sm hover:text-white transition-colors">Full Menu</Link>
              <Link href="/menu?category=FLOWER" className="block text-elevated-muted text-sm hover:text-white transition-colors">Flowers</Link>
              <Link href="/menu?category=EDIBLE" className="block text-elevated-muted text-sm hover:text-white transition-colors">Edibles</Link>
            </div>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-semibold text-white mb-4">Info</h4>
            <div className="space-y-2 text-elevated-muted text-sm">
              <p className="flex items-center gap-3">
                <svg className="w-5 h-5 text-elevated-emerald shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>Open Daily: 10 AM – 10 PM</span>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-elevated-border mt-8 pt-8 text-center text-elevated-muted/60 text-xs">
          <div className="max-w-4xl mx-auto mb-4">
            <p className="mb-2 uppercase tracking-widest font-semibold text-elevated-muted">Disclaimer:</p>
            <p>
              Our products are not FDA approved to diagnose, treat, cure, or prevent any disease. All items comply with the U.S. Farm Bill and contain less than 0.3% THC. Intended for adult use only. THCa and other hemp-derived THC products are not shipped to states where restricted by law. Full disclaimer in <Link href="/terms" className="underline hover:text-white transition-colors">Terms of Service</Link>.
            </p>
          </div>
          <p>© {new Date().getFullYear()} ELEVATED. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default function HomeClient({ featuredProducts, flowerProducts, edibleProducts, banners }) {
  return (
    <CartProvider>
      <Navbar />
      <CartDrawer />

      <main>
        <BannerCarousel banners={banners} />

        {/* Featured */}
        <ProductSection
          title="Featured"
          subtitle="Our top picks, curated for you"
          products={featuredProducts}
          viewAllHref="/menu"
          icon={<svg className="w-6 h-6 text-elevated-gold" fill="currentColor" viewBox="0 0 24 24"><path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/></svg>}
        />

        {/* Divider */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-px bg-gradient-to-r from-transparent via-elevated-border to-transparent" />
        </div>

        {/* Flower */}
        <ProductSection
          title="Flowers"
          subtitle="Hand-selected premium buds"
          products={flowerProducts}
          viewAllHref="/menu?category=FLOWER"
          icon={<CannabisIcon className="w-6 h-6 text-elevated-emerald" />}
        />

        {/* Edibles */}
        <ProductSection
          title="Edibles"
          subtitle="Delicious infused treats"
          products={edibleProducts}
          viewAllHref="/menu?category=EDIBLE"
          icon={<svg className="w-6 h-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /></svg>}
        />

        {/* CTA Banner */}
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center glass-card p-10 md:p-16 glow-emerald">
            <h2 className="text-3xl md:text-5xl font-black mb-4 text-gradient">
              Ready to get Elevated?
            </h2>
            <p className="text-elevated-muted text-lg mb-8">
              Browse our full menu and place your order for pickup.
            </p>
            <Link href="/menu" className="btn-primary text-lg px-12 py-4">
              View Full Menu
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </CartProvider>
  );
}
