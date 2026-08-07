'use client';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';

export default function LazyVideo({
  src,
  poster,
  alt = 'Video preview',
  className = '',
  style = {},
}) {
  const containerRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Load video only when user scrolls close to it (within 300px)
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        },
        { rootMargin: '300px' }
      );
      observer.observe(el);
      return () => observer.disconnect();
    } else {
      setShouldLoad(true);
    }
  }, []);

  return (
    <div ref={containerRef} className={`lazy-video-container ${className}`} style={{ position: 'relative', width: '100%', height: '100%', ...style }}>
      {poster && (
        <Image
          src={poster}
          alt={alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 400px, 384px"
          quality={70}
          className="lazy-video-poster"
          style={{ objectFit: 'cover', opacity: shouldLoad ? 0.3 : 1, transition: 'opacity 0.5s ease' }}
        />
      )}
      {shouldLoad && (
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          className="lazy-video-element"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        >
          <source src={src} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
