/**
 * HeroMarquee — Infinite horizontal marquee using Motion.
 *
 * Architecture:
 *  – The image list is duplicated once: [A, B, C, A, B, C]
 *  – The track animates from x=0 to x="-50%" (= exactly one list width)
 *  – At -50%, it snaps back to 0 invisibly — perfect seamless loop
 *  – `repeat: Infinity` + `repeatType: "loop"` handles this natively
 *
 * Performance:
 *  – Only `transform` is animated → compositor thread only, 60fps
 *  – Motion uses WAAPI under the hood for GPU-accelerated transforms
 *  – `will-change: transform` is applied via motion's internal optimisation
 *
 * Mobile:
 *  – Slightly faster duration on mobile (passed via prop) for better feel
 *  – Gap between cards is tighter on mobile (gap-2 vs sm:gap-4)
 *  – Container uses `items-stretch` so cards fill available vertical space
 */

import { useEffect } from 'react';
import { motion, useAnimationControls } from 'motion/react';
import { HeroCard, type HeroImage } from './HeroCard';

interface HeroMarqueeProps {
  images: HeroImage[];
  /** Duration in seconds for one full loop. Higher = slower. */
  duration?: number;
}

export function HeroMarquee({ images, duration = 40 }: HeroMarqueeProps) {
  const controls = useAnimationControls();

  // Duplicate for seamless loop
  const track = [...images, ...images];

  useEffect(() => {
    controls.start({
      x: '-50%',
      transition: {
        duration,
        ease: 'linear',
        repeat: Infinity,
        repeatType: 'loop',
      },
    });
  }, [controls, duration]);

  return (
    <div className="w-full h-full overflow-hidden" aria-hidden="true">
      <motion.div
        animate={controls}
        initial={{ x: '0%' }}
        className="flex h-full gap-2 sm:gap-3 md:gap-4 items-center"
        style={{
          width: 'max-content',
          willChange: 'transform',
        }}
      >
        {track.map((img, i) => (
          <HeroCard key={`${img.alt}-${i}`} image={img} priority={i === 0} />
        ))}
      </motion.div>
    </div>
  );
}
