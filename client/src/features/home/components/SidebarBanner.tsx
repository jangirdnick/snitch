import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, type Variants } from 'motion/react';
import { Link } from 'react-router';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, Tag } from 'lucide-react';
import { SIDEBAR_BANNERS, type SidebarBannerItem } from '../data/sidebarBanners';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface SidebarBannerProps {
  banners?: SidebarBannerItem[];
  autoPlayInterval?: number;
  className?: string;
}

export function SidebarBanner({
  banners = SIDEBAR_BANNERS,
  autoPlayInterval = 5000,
  className,
}: SidebarBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [isPaused, setIsPaused] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Touch swipe handling for mobile
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const currentBanner = banners[currentIndex] || banners[0];

  const handleNext = useCallback(() => {
    setDirection('right');
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const handlePrev = useCallback(() => {
    setDirection('left');
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  // Auto-play timer
  useEffect(() => {
    if (isPaused || banners.length <= 1) return;

    const timer = setInterval(() => {
      handleNext();
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [isPaused, autoPlayInterval, banners.length, handleNext]);

  // Touch gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diffX = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (diffX > minSwipeDistance) {
      handleNext();
    } else if (diffX < -minSwipeDistance) {
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Framer motion variants (Premium Archetype)
  const slideVariants: Variants = {
    initial: (dir: 'left' | 'right') => ({
      x: dir === 'right' ? '100%' : '-100%',
      opacity: 0,
      scale: 1.05,
    }),
    animate: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
      },
    },
    exit: (dir: 'left' | 'right') => ({
      x: dir === 'right' ? '-100%' : '100%',
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 },
      },
    }),
  };

  const contentVariants: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: 0.15, ease: [0.4, 0, 0.2, 1] },
    },
  };

  return (
    <div
      className={cn(
        'group relative w-full h-full rounded-2xl overflow-hidden bg-zinc-950 shadow-2xl select-none',
        className,
      )}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── Background Image Slider ─────────────────────────────────────────── */}
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={currentBanner.id}
          custom={direction}
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute inset-0 w-full h-full overflow-hidden"
        >
          {/* Skeleton Loader during image load */}
          {!isLoaded && (
            <Skeleton className="absolute inset-0 w-full h-full bg-zinc-900/80 rounded-2xl" />
          )}

          <img
            src={currentBanner.imageUrl}
            alt={currentBanner.alt}
            onLoad={() => setIsLoaded(true)}
            className="w-full h-full object-cover object-top brightness-90 contrast-[1.05] transition-all duration-700 rounded-2xl group-hover:scale-101 ease-in-out"
            loading="lazy"
          />

          {/* Dual Vignette Mask overlays for typography readability */}
          <div className="absolute inset-0 bg-linear-to-t from-[#08060d] via-[#08060d]/50 to-transparent z-10" />
          <div className="absolute inset-0 bg-linear-to-r from-[#08060d]/70 via-transparent to-[#08060d]/40 z-10" />
        </motion.div>
      </AnimatePresence>

      {/* ── Top Header Offer Tag ────────────────────────────────────────────── */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
        {currentBanner.offerTag && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/90 text-black text-xs font-extrabold uppercase tracking-wider shadow-lg backdrop-blur-md">
            <Tag className="w-3 h-3" />
            <span>{currentBanner.offerTag}</span>
          </span>
        )}
      </div>

      {/* ── Bottom Right Grouped Navigation Arrows ───────────────────────────── */}
      <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-30 flex items-center gap-2 pointer-events-auto">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous slide"
          className="p-2.5 sm:p-3 rounded-full bg-zinc-950/70 text-white border border-white/20 hover:bg-amber-500 hover:text-black hover:border-amber-400 backdrop-blur-md transition-all duration-300 shadow-xl active:scale-95 focus:outline-none"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next slide"
          className="p-2.5 sm:p-3 rounded-full bg-zinc-950/70 text-white border border-white/20 hover:bg-amber-500 hover:text-black hover:border-amber-400 backdrop-blur-md transition-all duration-300 shadow-xl active:scale-95 focus:outline-none"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* ── Bottom Content Banner Text & Action ─────────────────────────────── */}
      <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 z-20 flex flex-col justify-end gap-3 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBanner.id + '-content'}
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
            className="flex flex-col items-start gap-2 max-w-xl pr-24"
          >
            {/* Small Eyebrow Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-amber-400 text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
              <Sparkles className="w-3 h-3" />
              <span>{currentBanner.badge}</span>
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-none drop-shadow-md">
              {currentBanner.title}
            </h2>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-zinc-300 font-medium line-clamp-2 leading-relaxed max-w-md drop-shadow">
              {currentBanner.subtitle}
            </p>

            {/* CTA Button */}
            <div className="pt-2 pointer-events-auto">
              <Link
                to={currentBanner.ctaLink}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 active:scale-95"
              >
                <span>{currentBanner.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Pagination Indicators Bar */}
        <div className="flex items-center gap-2 pt-4 pointer-events-auto">
          {banners.map((banner, idx) => (
            <button
              key={banner.id}
              type="button"
              onClick={() => {
                setDirection(idx > currentIndex ? 'right' : 'left');
                setCurrentIndex(idx);
              }}
              aria-label={`Go to slide ${idx + 1}`}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300 focus:outline-none',
                currentIndex === idx
                  ? 'w-8 bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.6)]'
                  : 'w-2 bg-white/30 hover:bg-white/60',
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
