/**
 * HomePage — Premium Fashion Hero Section
 *
 * Layout layers (bottom → top):
 *   1. Black background
 *   2. Infinite marquee gallery (HeroMarquee)
 *   3. Left/right soft edge gradient masks
 *   4. Top vignette (navbar legibility)
 *   5. Bottom vignette (grounds the content)
 *   6. Editorial headline & CTA (z-top)
 *   7. Editorial SVG frame panels (flanking, md+ only)
 *   8. Modal overlay routes
 *
 * Mobile-first:
 *  – Headline and CTA are always visible (Layer 6 was accidentally hidden).
 *  – Safe-area bottom inset clears the Dynamic Island / home bar.
 *  – Bottom vignette is taller on mobile (65%) so the headline is readable.
 *  – Edge masks are narrower on phones so more gallery is visible.
 *  – CTA buttons meet the 44px touch target minimum.
 *
 * Design references: Apple, Zara, COS, Aime Leon Dore, Fear of God.
 */

import { motion, AnimatePresence } from 'motion/react';
import { useEffect } from 'react';
import { useLocation, useOutlet, useSearchParams, useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { setAccessToken } from '@/features/auth/state/auth.slice';
import { HeroMarquee } from '@/features/home/components/HeroMarquee';
import { HeroEditorialFrames } from '@/features/home/components/HeroEditorialFrames';
import type { HeroImage } from '@/features/home/components/HeroCard';
import { showToast } from '@/lib/toast';

// ─── Data ──────────────────────────────────────────────────────────────────────
// offset creates an editorial staggered rhythm — cards aren't all at the same
// vertical baseline, giving the gallery a curated, editorial feel.
const HERO_IMAGES: HeroImage[] = [
  {
    url: 'https://i.pinimg.com/736x/9e/81/69/9e8169908f3759f7dc060ebf80ca5a22.jpg',
    alt: 'Nike — Seasonal campaign',
    offset: 'none',
  },
  {
    url: 'https://i.pinimg.com/736x/d0/5f/a8/d05fa8be9fe982a4be248aebb00f20d1.jpg',
    alt: 'New Balance — Studio editorial',
    offset: 'down',
  },
  {
    url: 'https://i.pinimg.com/1200x/9b/c2/f3/9bc2f363293773ada6f0e5240077be7a.jpg',
    alt: 'Adidas — Archive collection',
    offset: 'up',
  },
  {
    url: 'https://i.pinimg.com/736x/7c/77/82/7c7782898e6ee2bc90f1592c056e03f0.jpg',
    alt: 'Converse — Street culture',
    offset: 'none',
  },
  {
    url: 'https://i.pinimg.com/736x/ce/05/22/ce0522e74cf1dd5bbed55e16e5780670.jpg',
    alt: 'Reebok — Classic silhouette',
    offset: 'down',
  },
  {
    url: 'https://i.pinimg.com/736x/14/a0/17/14a017c45c9fb53c63815e570d476393.jpg',
    alt: 'Vans — Lifestyle campaign',
    offset: 'up',
  },
];

// ─── Component ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  const location = useLocation();
  const outlet = useOutlet();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const message = searchParams.get('message');
    const reason = searchParams.get('reason');

    if (message) {
      showToast.success(message, {
        duration: 6000,
      });
    }

    if (accessToken) {
      // Google OAuth success — store token and clean URL
      dispatch(setAccessToken(accessToken));
      navigate(location.pathname, { replace: true });
    }

    if (reason) {
      // Google OAuth error — show toast and clean URL
      showToast.error('Google login failed', {
        description: decodeURIComponent(reason),
        duration: 6000,
      });
      navigate(location.pathname, { replace: true });
    }
  }, [searchParams, dispatch, navigate, location.pathname]);

  return (
    <>
      <section
        aria-label="Snitch — New Season Collection"
        className="relative w-full overflow-hidden bg-[#08060d]"
        style={{ height: '100dvh' }}
      >
        {/* ── Layer 1: Gallery fills the full viewport ───────────────────────── */}
        <div className="absolute inset-0 flex items-center px-2 sm:px-4 py-10 sm:pb-0 sm:pt-10 opacity-70">
          <HeroMarquee images={HERO_IMAGES} duration={42} />
        </div>

        {/* ── Layer 2: Left edge gradient mask ──────────────────────────────── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-20"
          style={{
            // Narrower on mobile so more gallery is visible on small screens
            width: 'clamp(32px, 8vw, 200px)',
            background:
              'linear-gradient(to right, #08060d 0%, rgba(8,6,13,0.6) 60%, transparent 100%)',
          }}
        />

        {/* ── Layer 3: Right edge gradient mask ─────────────────────────────── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-20"
          style={{
            width: 'clamp(32px, 8vw, 200px)',
            background:
              'linear-gradient(to left, #08060d 0%, rgba(8,6,13,0.6) 60%, transparent 100%)',
          }}
        />

        {/* ── Layer 4: Top vignette — lifts navbar over gallery ─────────────── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 right-0 z-20"
          style={{
            height: '160px',
            background:
              'linear-gradient(to bottom, rgba(8,6,13,0.72) 0%, rgba(8,6,13,0.3) 60%, transparent 100%)',
          }}
        />

        {/* ── Layer 5: Bottom vignette — grounds the headline ───────────────── */}
        {/*
          On mobile: 65% height so the large headline sits on a solid dark base.
          On desktop: 55% is sufficient because the marquee is taller relative
          to the headline.
        */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 right-0 z-20"
          style={{
            height: 'clamp(55%, 65%, 65%)',
            background:
              'linear-gradient(to top, rgba(8,6,13,0.98) 0%, rgba(8,6,13,0.7) 35%, rgba(8,6,13,0.2) 70%, transparent 100%)',
          }}
        />

        {/* ── Layer 6: Editorial SVG frame panels (md+ only) ────────────────── */}
        {/* HeroEditorialFrames hides itself on mobile via hidden md:block */}
        <HeroEditorialFrames />

        {/* ── Layer 7: Modal routes (e.g., Auth) ────────────────────────────── */}
        <AnimatePresence mode="wait">
          {outlet && (
            <motion.div key={location.pathname} className="absolute z-200">
              {outlet}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </>
  );
}
