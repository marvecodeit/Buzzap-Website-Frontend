'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView } from '@/lib/api';

// Anonymous, cookieless visitor id kept in localStorage (approximates uniques).
function getVisitorId() {
  if (typeof window === 'undefined') return undefined;
  try {
    let id = localStorage.getItem('bz_vid');
    if (!id) {
      id = (crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`);
      localStorage.setItem('bz_vid', id);
    }
    return id;
  } catch {
    return undefined; // storage blocked — still track, just without a stable id
  }
}

function getDevice() {
  if (typeof window === 'undefined') return 'unknown';
  const w = window.innerWidth;
  if (w < 640) return 'mobile';
  if (w < 1024) return 'tablet';
  return 'desktop';
}

export default function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    // Don't count admin/auth screens as public site traffic.
    if (pathname.startsWith('/dashboard') || pathname === '/login') return;

    trackPageView({
      path: pathname,
      referrer: document.referrer || '',
      visitorId: getVisitorId(),
      device: getDevice(),
    });
  }, [pathname]);

  return null;
}
