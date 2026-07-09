import { motion } from 'motion/react';
import { Link } from 'react-router';

export default function NotFoundPage() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen bg-[#08060d] overflow-hidden text-center px-4">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.02] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-[120px] sm:text-[180px] font-bold tracking-tighter leading-none text-white/5"
        >
          404
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex flex-col items-center -mt-8 sm:-mt-12"
        >
          <h2 className="text-[24px] sm:text-[32px] font-light tracking-[-0.02em] text-white leading-tight">
            Page not found
          </h2>
          <p className="mt-4 text-[14px] text-white/50 max-w-[320px] leading-relaxed font-light">
            The page you're looking for doesn't exist or has been moved to a new collection.
          </p>

          <Link
            to="/"
            className="mt-10 inline-flex items-center justify-center h-12 px-8 rounded-full bg-white text-[#08060d] text-[13px] font-semibold tracking-widest uppercase transition-all duration-500 hover:bg-white/90 hover:scale-[1.03] hover:shadow-[0_8px_32px_rgba(255,255,255,0.15)] active:scale-[0.98]"
          >
            Return Home
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
