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
import { FeaturedProductsSection } from '@/features/home/components/FeaturedProductsSection';
import { SidebarBanner } from '@/features/home/components/SidebarBanner';
import { showToast } from '@/lib/toast';

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
    <div className="w-full bg-[#08060d] min-h-screen">
      <section
        aria-label="Snitch — New Season Collection"
        className="relative w-full overflow-hidden bg-[#08060d]"
        style={{ minHeight: '100dvh' }}
      >
        {/* shadow aria */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-999 shadow-[inset_0_0_200px_-15px_#000] pointer-events-none"
        />

        <div className="w-full h-screen grid grid-rows-2 p-2 sm:p-3 gap-2 sm:gap-3">
          {/* side bar area */}
          <div className="w-full h-full min-h-0 overflow-hidden pt-12">
            <SidebarBanner />
          </div>

          <div className="h-full min-h-0">
            <FeaturedProductsSection />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {outlet && (
            <motion.div key={location.pathname} className="absolute z-200">
              {outlet}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
