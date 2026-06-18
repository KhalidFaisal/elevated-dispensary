import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

export const metadata = {
  title: 'ELEVATED | Premium Cannabis Dispensary',
  description: 'Rise Above — Premium flower and edibles from ELEVATED dispensary. Browse our curated selection and order for pickup.',
  keywords: 'cannabis, dispensary, flower, edibles, THC, CBD, premium, ELEVATED',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen bg-elevated-black text-white font-sans">
        {children}
      </body>
    </html>
  );
}
