/**
 * HeroCard — Individual image card in the marquee.
 *
 * Mobile-first:
 *  – Narrower min-width (150px) so more cards are visible on 320px screens.
 *  – Vertical offset is halved on mobile to prevent cards clipping the container.
 *  – Cinematic gradient overlay preserved at all sizes.
 *  – LCP-optimised first image (priority=true).
 */
import { motion } from 'motion/react';

export type HeroImage = {
  url: string;
  alt: string;
  /** Controls vertical card height offset for editorial rhythm */
  offset?: 'up' | 'down' | 'none';
};

interface HeroCardProps {
  image: HeroImage;
  /** Make the first visible image LCP-optimised */
  priority?: boolean;
}

export function HeroCard({ image, priority = false }: HeroCardProps) {
  // Offset: full on md+, halved on mobile so cards don't clip the container
  const offsetClass =
    image.offset === 'up'
      ? 'md:-translate-y-6 -translate-y-3'
      : image.offset === 'down'
        ? 'md:translate-y-6 translate-y-3'
        : '';

  return (
    <motion.div
      className={`relative shrink-0 overflow-hidden rounded-xl md:rounded-2xl cursor-pointer ${offsetClass}`}
      style={{
        /*
         * clamp() gives a fluid width:
         *   – min 150px on tiny phones (320px → 2+ cards visible)
         *   – 28vw on mid-range phones
         *   – max 450px on large desktop screens
         */
        width: 'clamp(150px, 28vw, 450px)',
        height: '100%',
        boxShadow: '0 8px 40px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.3)',
      }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Cinematic gradient overlay — bottom-weighted for depth */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10 pointer-events-none rounded-xl md:rounded-2xl"
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.42) 100%)',
        }}
      />

      <img
        src={image.url}
        alt={image.alt}
        width={380}
        height={520}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        {...(priority ? { fetchPriority: 'high' as const } : {})}
        draggable={false}
        className="w-full h-full object-cover object-center select-none"
        style={{ display: 'block' }}
      />
    </motion.div>
  );
}
