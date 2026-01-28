'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface MRIAIFinding {
  id: string;
  number: number;
  label: string;
  confidence: number;
  severity: 'normal' | 'mild' | 'moderate' | 'severe';
  description: string;
  x: number;
  y: number;
}

interface MRIAIOverlaysProps {
  findings: MRIAIFinding[];
  width: number;
  height: number;
  visible: boolean;
}

const severityColors = {
  normal: { border: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
  mild: { border: '#eab308', bg: 'rgba(234, 179, 8, 0.1)' },
  moderate: { border: '#f97316', bg: 'rgba(249, 115, 22, 0.1)' },
  severe: { border: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
};

export function MRIAIOverlays({ findings, width, height, visible }: MRIAIOverlaysProps) {
  if (!visible || findings.length === 0) {
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      <AnimatePresence>
        {findings.map((finding) => {
          const colors = severityColors[finding.severity];
          const xPos = (finding.x / 100) * width;
          const yPos = (finding.y / 100) * height;

          return (
            <motion.div
              key={finding.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3, delay: finding.number * 0.1 }}
              className="absolute"
              style={{
                left: xPos,
                top: yPos,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {/* Outer glow */}
              <div
                className="absolute inset-0 rounded-full blur-md opacity-30"
                style={{
                  backgroundColor: colors.border,
                  width: 48,
                  height: 48,
                  transform: 'translate(-50%, -50%)',
                }}
              />

              {/* Badge */}
              <div
                className="relative rounded-full flex items-center justify-center font-bold text-white shadow-lg"
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: colors.border,
                  border: `3px solid ${colors.border}`,
                  boxShadow: `0 0 20px ${colors.bg}`,
                }}
              >
                <span className="text-lg">{finding.number}</span>
              </div>

              {/* Confidence meter */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-black/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${finding.confidence}%` }}
                  transition={{ duration: 0.5, delay: finding.number * 0.1 + 0.3 }}
                  className="h-full"
                  style={{
                    backgroundColor:
                      finding.confidence >= 80
                        ? '#22c55e'
                        : finding.confidence >= 60
                        ? '#eab308'
                        : '#ef4444',
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* AI indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-2 right-2 flex items-center gap-1.5 bg-black/80 backdrop-blur-sm px-2.5 py-1.5 rounded-md border border-blue-500/30"
      >
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
        <span className="text-xs text-blue-400 font-medium">
          AI: {findings.length} finding{findings.length !== 1 ? 's' : ''}
        </span>
      </motion.div>
    </div>
  );
}
