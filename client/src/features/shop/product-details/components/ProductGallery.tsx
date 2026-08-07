import { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function ProductGallery({ images }: { images: { url: string; alt?: string }[] }) {
  const [prevImages, setPrevImages] = useState(images);
  const [activeIndex, setActiveIndex] = useState(0);

  if (prevImages !== images) {
    setPrevImages(images);
    setActiveIndex(0);
  }

  if (!images || images.length === 0) {
    return <div className="aspect-[3/4] bg-muted animate-pulse rounded-lg" />;
  }

  // Ensure index is in bounds
  const currentIndex = activeIndex >= images.length ? 0 : activeIndex;

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 h-full">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto no-scrollbar snap-x snap-mandatory">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={cn(
              'relative snap-center shrink-0 w-16 h-20 md:w-20 md:h-28 rounded-md overflow-hidden border-2 transition-all',
              currentIndex === idx
                ? 'border-primary'
                : 'border-transparent hover:border-muted-foreground/50 opacity-70 hover:opacity-100',
            )}
          >
            <img
              src={img.url}
              alt={img.alt || `Thumbnail ${idx}`}
              className="object-cover w-full h-full"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="relative flex-1 aspect-[3/4] md:aspect-auto md:h-[600px] bg-muted rounded-lg overflow-hidden group">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            src={images[currentIndex].url}
            alt={images[currentIndex].alt || 'Product image'}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </AnimatePresence>
      </div>
    </div>
  );
}
