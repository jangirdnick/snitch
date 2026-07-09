import { motion } from 'motion/react';

interface StepIndicatorProps {
  totalSteps: number;
  currentStep: number; // 0-indexed
}

export function StepIndicator({ totalSteps, currentStep }: StepIndicatorProps) {
  return (
    <div
      className="flex items-center justify-center gap-2 mb-1"
      role="progressbar"
      aria-valuenow={currentStep + 1}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-label={`Step ${currentStep + 1} of ${totalSteps}`}
    >
      {Array.from({ length: totalSteps }).map((_, i) => (
        <motion.div
          key={i}
          initial={false}
          animate={{
            width: i === currentStep ? 24 : 6,
            opacity: i < currentStep ? 0.3 : 1,
            backgroundColor: i <= currentStep ? '#ffffff' : 'rgba(255, 255, 255, 0.15)',
          }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="h-1 rounded-full"
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
