import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  totalSteps: number;
  currentStep: number; // 0-indexed
}

export function StepIndicator({ totalSteps, currentStep }: StepIndicatorProps) {
  return (
    <div
      className="step-indicator"
      role="progressbar"
      aria-valuenow={currentStep + 1}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-label={`Step ${currentStep + 1} of ${totalSteps}`}
    >
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'step-dot',
            i < currentStep && 'step-dot--done',
            i === currentStep && 'step-dot--active',
            i > currentStep && 'step-dot--upcoming',
          )}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
