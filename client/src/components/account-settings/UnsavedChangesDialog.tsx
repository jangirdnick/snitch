import { memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle } from 'lucide-react';

interface UnsavedChangesDialogProps {
  open: boolean;
  onKeepEditing: () => void;
  onDiscard: () => void;
}

const SPRING_ALERT = {
  type: 'spring',
  stiffness: 450,
  damping: 30,
} as const;

export const UnsavedChangesDialog = memo(function UnsavedChangesDialog({
  open,
  onKeepEditing,
  onDiscard,
}: UnsavedChangesDialogProps) {
  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-10000 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={SPRING_ALERT}
          role="alertdialog"
          aria-labelledby="unsaved-title"
          aria-describedby="unsaved-desc"
          className="w-full max-w-sm p-4 rounded-xl bg-zinc-950 border border-orange-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.9)] space-y-3"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-orange-500/15 text-orange-400 shrink-0">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 id="unsaved-title" className="text-sm font-bold text-white tracking-tight">
                Unsaved Changes Detected
              </h3>
              <p id="unsaved-desc" className="text-xs text-white/60 mt-1 leading-relaxed">
                You have modified fields in your settings. If you close now, your unsaved changes
                will be lost.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-end gap-2 text-xs font-semibold">
            <button
              type="button"
              onClick={onKeepEditing}
              className="px-3 py-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              Keep Editing
            </button>
            <button
              type="button"
              onClick={onDiscard}
              className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors cursor-pointer shadow-xs active:scale-95"
            >
              Discard Changes
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
});

export default UnsavedChangesDialog;
