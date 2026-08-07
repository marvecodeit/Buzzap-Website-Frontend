'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function SiteLayout({ children }) {
  const pathname = usePathname();
  const hideChrome = pathname === '/not-found' || pathname === '/404';

  return (
    <>
      {!hideChrome && <Navbar />}
      {children}
      {!hideChrome && <Footer />}
    </>
  );
}
