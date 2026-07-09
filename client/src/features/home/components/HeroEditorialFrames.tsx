/**
 * HeroEditorialFrames
 *
 * Two premium SVG editorial panels that flank the hero section.
 * SVG geometry (viewBox, paths, positions) is preserved exactly from design.
 * Added: image fills with clipPath, Link overlays, motion entrance, camelCase props.
 *
 * Left panel  — indicator bottom-left, single 249×299 frame at top
 * Right panel — indicator bottom-right, two frames (249×299 + 199×249), long connector
 */

import { memo, type CSSProperties } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import {
  FRAME_LEFT_MAIN,
  FRAME_RIGHT_TOP,
  FRAME_RIGHT_BOTTOM,
  PRODUCTS_BOTTOM,
} from '../data/heroFrames';

// ─── Design tokens ────────────────────────────────────────────────────────────

const BG = '#08060d';

/** Shared entrance animation — both panels slide in simultaneously. */
const ENTRANCE: Parameters<typeof motion.div>[0]['transition'] = {
  duration: 0.6,
  ease: [0.4, 0, 0.2, 1],
  delay: 0.8,
};

// ─── SvgFrame ─────────────────────────────────────────────────────────────────
// Renders: fashion image (clipped) + bottom vignette + border above image.

interface SvgFrameProps {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  imageUrl: string;
}

function SvgFrame({ id, x, y, width, height, imageUrl }: SvgFrameProps) {
  const clipId = `hef-clip-${id}`;
  const gradId = `hef-grad-${id}`;

  return (
    <>
      <defs>
        <clipPath id={clipId}>
          <rect x={x} y={y} width={width} height={height} />
        </clipPath>

        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={BG} stopOpacity={0.02} />
          <stop offset="65%" stopColor={BG} stopOpacity={0.22} />
          <stop offset="100%" stopColor={BG} stopOpacity={0.65} />
        </linearGradient>
      </defs>

      {/* Fashion photo */}
      <image
        href={imageUrl}
        x={x}
        y={y}
        width={width}
        height={height}
        preserveAspectRatio="xMidYMid slice"
        clipPath={`url(#${clipId})`}
      />

      {/* Vignette overlay */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={`url(#${gradId})`}
        clipPath={`url(#${clipId})`}
      />

      {/* Refined graphite border — transition to subtle orange on group hover */}
      <rect
        x={x + 0.5}
        y={y + 0.5}
        width={width - 1}
        height={height - 1}
        stroke="#ff8a0082"
        strokeWidth="1"
        className="transition-colors duration-500 group-hover:stroke-[#ff8a0082]/80"
      />
    </>
  );
}

// ─── IndicatorBox ─────────────────────────────────────────────────────────────
// Small square: glass fill + border + centred pip.

interface IndicatorBoxProps {
  x: number;
  y: number;
  width?: number;
  height?: number;
}

function IndicatorBox({ x, y, width = 30, height = 30 }: IndicatorBoxProps) {
  const pipX = x + Math.round(width / 2) - 5;
  const pipY = y + 10;

  return (
    <>
      {/* Glass fill */}
      <rect x={x} y={y} width={width} height={height} fill="white" fillOpacity={0.06} />
      {/* Graphite border — transition to subtle orange on hover */}
      <rect
        x={x + 0.5}
        y={y + 0.5}
        width={width - 1}
        height={height - 1}
        stroke="#ff8a0082"
        className="transition-colors duration-500 group-hover:stroke-[#ff8a0082]/70"
      />
      {/* Pip — default soft white, transition to orange on hover */}
      <rect
        x={pipX}
        y={pipY}
        width={10}
        height={10}
        fill="#ff8a0082"
        className="transition-colors duration-500 group-hover:fill-[#FF7F00]"
      />
    </>
  );
}

// ─── FrameLink ────────────────────────────────────────────────────────────────

interface FrameLinkProps {
  leftPct: number;
  topPct: number;
  widthPct: number;
  heightPct: number;
  to: string;
  label: string;
}

function FrameLink({ leftPct, topPct, widthPct, heightPct, to, label }: FrameLinkProps) {
  const style: CSSProperties = {
    position: 'absolute',
    left: `${leftPct}%`,
    top: `${topPct}%`,
    width: `${widthPct}%`,
    height: `${heightPct}%`,
    cursor: 'pointer',
    transition: 'background-color 400ms cubic-bezier(0.4, 0, 0.2, 1)',
  };

  return (
    <Link
      to={to}
      aria-label={label}
      style={style}
      className="hover:bg-white/5 active:bg-white/10"
    />
  );
}

// ─── Left Panel ───────────────────────────────────────────────────────────────

const L_VBW = 250;
const L_VBH = 366;

const LeftPanel = memo(function LeftPanel() {
  return (
    <motion.div
      // Hidden on mobile — the SVG panels don't work on small screens.
      // They appear from md (768px) upward where there is horizontal space.
      className="w-[17%] min-w-37.5 max-w-62.5 shrink-0 hidden md:block"
      style={{ pointerEvents: 'none', willChange: 'transform, opacity' }}
      initial={{ opacity: 0, x: -14 }}
      animate={{ opacity: 1, x: 0 }}
      transition={ENTRANCE}
    >
      <h2 className="text-[clamp(2.5rem,5vw,3.3rem)] leading-[0.85] tracking-tighter uppercase font-semibold drop-shadow-xl mb-3 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
        New
        <br />
        Arrivals
      </h2>
      <div className="group relative " style={{ position: 'relative', pointerEvents: 'auto' }}>
        <svg
          width="100%"
          height="100%"
          className="w-full h-auto"
          viewBox="0 0 250 366"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <SvgFrame
            id="left-main"
            x={0.5}
            y={0.5}
            width={249}
            height={299}
            imageUrl={FRAME_LEFT_MAIN.imageUrl}
          />

          {/* Connector line — transition to soft orange on group hover */}
          <path
            d="M20 351.5H109.5V300"
            stroke="#ff8a0082"
            className="transition-colors duration-500 group-hover:stroke-[#ff8a0082]/60"
          />

          <IndicatorBox x={0} y={336} />
        </svg>

        <FrameLink
          leftPct={(0.5 / L_VBW) * 100}
          topPct={(0.5 / L_VBH) * 100}
          widthPct={(249 / L_VBW) * 100}
          heightPct={(299 / L_VBH) * 100}
          to={FRAME_LEFT_MAIN.to}
          label={FRAME_LEFT_MAIN.alt}
        />
      </div>
    </motion.div>
  );
});

// ─── Right Panel ──────────────────────────────────────────────────────────────

const R_VBW = 522;
const R_VBH = 650;

const RightPanel = memo(function RightPanel() {
  return (
    <motion.div
      // Hidden on mobile — same rationale as LeftPanel.
      className="w-[36%] min-w-[280px] max-w-[522px] shrink-0 hidden md:block"
      style={{ pointerEvents: 'none', willChange: 'transform, opacity' }}
      initial={{ opacity: 0, x: 14 }}
      animate={{ opacity: 1, x: 0 }}
      transition={ENTRANCE}
    >
      <div className="group relative" style={{ position: 'relative', pointerEvents: 'auto' }}>
        <svg
          width="100%"
          height="100%"
          className="w-full h-auto"
          viewBox="0 0 522 650"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <SvgFrame
            id="right-top"
            x={124}
            y={0.5}
            width={249}
            height={329}
            imageUrl={FRAME_RIGHT_TOP.imageUrl}
          />

          <SvgFrame
            id="right-bottom"
            x={250.5}
            y={370.5}
            width={199}
            height={249}
            imageUrl={FRAME_RIGHT_BOTTOM.imageUrl}
          />

          {/* Long connector line — transition to soft orange on group hover */}
          <path
            d="M506.5 635.5V474V157H372.5"
            stroke="#ff8a0082"
            className="transition-colors duration-500 group-hover:stroke-[#ff8a0082]/60"
          />

          {/* Horizontal leg connector */}
          <path
            d="M449.5 490H506.5"
            stroke="#ff8a0082"
            className="transition-colors duration-500 group-hover:stroke-[#ff8a0082]/40"
          />

          <IndicatorBox x={490} y={620} width={32} height={30} />
        </svg>

        <FrameLink
          leftPct={(124 / R_VBW) * 100}
          topPct={(0.5 / R_VBH) * 100}
          widthPct={(249 / R_VBW) * 100}
          heightPct={(329 / R_VBH) * 100}
          to={FRAME_RIGHT_TOP.to}
          label={FRAME_RIGHT_TOP.alt}
        />

        <FrameLink
          leftPct={(250.5 / R_VBW) * 100}
          topPct={(370.5 / R_VBH) * 100}
          widthPct={(199 / R_VBW) * 100}
          heightPct={(249 / R_VBH) * 100}
          to={FRAME_RIGHT_BOTTOM.to}
          label={FRAME_RIGHT_BOTTOM.alt}
        />
      </div>
    </motion.div>
  );
});

// ─── Bottom Product Card ──────────────────────────────────────────────────────

interface BottomProductCardProps {
  item: (typeof PRODUCTS_BOTTOM)[0];
  className?: string;
}

const BottomProductCard = memo(function BottomProductCard({
  item,
  className = '',
}: BottomProductCardProps) {
  return (
    <Link
      to={item.to}
      style={{ pointerEvents: 'auto' }}
      className={`group relative flex flex-col justify-between w-full h-full bg-[#08060d]/50 border border-white/10 hover:border-[#ff8a0082]/60 active:scale-[0.98] transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.55)] backdrop-blur-md ${className}`}
    >
      {/* Image frame */}
      <div className="relative w-full flex-1 overflow-hidden border-b border-white/10">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover object-center transition-transform duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105 select-none"
          loading="lazy"
          decoding="async"
        />
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08060d]/70 to-transparent pointer-events-none" />

        {/* Mini indicator box matching left/right panels */}
        <div className="absolute top-2 left-2 w-[18px] h-[18px] bg-white/10 border border-white/20 flex items-center justify-center pointer-events-none transition-colors duration-500 group-hover:border-[#ff8a0082]/60">
          <div className="w-1.5 h-1.5 bg-white/30 transition-colors duration-500 group-hover:bg-[#FF7F00]" />
        </div>
      </div>

      {/* Product Info */}
      <div className="p-2.5 bg-[#08060d]/90 flex flex-col justify-center min-h-[64px] relative">
        <span className="text-[9px] font-medium tracking-[0.16em] uppercase text-white/50 truncate block">
          {item.name}
        </span>
        <span className="text-xs font-semibold tracking-wider text-white/80 block mt-0.5 transition-colors duration-300 group-hover:text-[#ff8a0082]">
          {item.price}
        </span>

        {/* Decorative corner ticks on hover */}
        <div className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 border-r border-b border-transparent group-hover:border-[#ff8a0082]/60 transition-all duration-300" />
        <div className="absolute top-1.5 left-1.5 w-1.5 h-1.5 border-l border-t border-transparent group-hover:border-[#ff8a0082]/60 transition-all duration-300" />
      </div>
    </Link>
  );
});

// ─── Public export ────────────────────────────────────────────────────────────

export const HeroEditorialFrames = memo(function HeroEditorialFrames() {
  return (
    <div className="absolute inset-x-0 bottom-0 z-30 px-4 flex items-end justify-between pointer-events-none">
      <LeftPanel />

      {/* Staggered entry animation grid for bottom products */}
      <motion.div
        className="flex-1 max-w-300 w-full mx-4 h-69 gap-2.5 z-30 hidden lg:grid lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 1.0 }}
        style={{ pointerEvents: 'none' }}
      >
        {PRODUCTS_BOTTOM.map((item, index) => {
          let visibilityClass = '';
          if (index === 4) visibilityClass = 'hidden xl:flex';
          else if (index >= 5 && index <= 7) visibilityClass = 'hidden 2xl:flex';
          else if (index > 7) visibilityClass = 'hidden';

          return (
            <BottomProductCard
              key={`${item.imageUrl}-${index}`}
              item={item}
              className={visibilityClass}
            />
          );
        })}
      </motion.div>

      <RightPanel />
    </div>
  );
});
