'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface XRayAIFinding {
  id: string;
  number: number;
  label: string;
  confidence: number;
  severity: 'normal' | 'mild' | 'moderate' | 'severe';
  description: string;
  x: number;
  y: number;
}

interface XRayAIOverlaysProps {
  findings: XRayAIFinding[];
  width: number;
  height: number;
  visible: boolean;
}

const severityColors = {
  normal: { border: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)' },
  mild: { border: '#eab308', bg: 'rgba(234, 179, 8, 0.1)' },
  moderate: { border: '#f97316', bg: 'rgba(249, 115, 22, 0.1)' },
  severe: { border: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
};

export function XRayAIOverlays({ findings, width, height, visible }: XRayAIOverlaysProps) {
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
              initial={{ scale: 0, opacity: 0, rotate: -180 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                duration: 0.5,
                delay: finding.number * 0.15,
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
              className="absolute"
              style={{
                left: xPos,
                top: yPos,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {/* Pulse animation */}
              <motion.div
                className="absolute inset-0 rounded-lg"
                style={{
                  backgroundColor: colors.border,
                  width: 50,
                  height: 50,
                  transform: 'translate(-50%, -50%)',
                }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: finding.number * 0.15,
                }}
              />

              {/* Square badge with number */}
              <div
                className="relative rounded-lg flex items-center justify-center font-bold text-white shadow-lg"
                style={{
                  width: 44,
                  height: 44,
                  backgroundColor: colors.border,
                  border: `3px solid ${colors.border}`,
                  boxShadow: `0 0 25px ${colors.bg}, 0 0 15px ${colors.border}`,
                }}
              >
                <span className="text-xl font-extrabold">{finding.number}</span>
              </div>

              {/* Label below badge */}
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: finding.number * 0.15 + 0.4 }}
                className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap"
              >
                <div
                  className="px-2 py-1 rounded text-xs font-semibold backdrop-blur-sm"
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.85)',
                    color: colors.border,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  {finding.label}
                </div>
              </motion.div>

              {/* Confidence indicator on the side */}
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <div className="w-1 h-10 bg-black/60 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${finding.confidence}%` }}
                    transition={{ duration: 0.6, delay: finding.number * 0.15 + 0.3 }}
                    className="w-full"
                    style={{
                      backgroundColor:
                        finding.confidence >= 80
                          ? '#22c55e'
                          : finding.confidence >= 60
                          ? '#eab308'
                          : '#ef4444',
                      transformOrigin: 'bottom',
                    }}
                  />
                </div>
                <span className="text-[10px] font-bold text-white/80">
                  {finding.confidence}%
                </span>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* AI indicator */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-2 right-2 flex items-center gap-1.5 bg-black/80 backdrop-blur-sm px-2.5 py-1.5 rounded-md border border-pink-500/30"
      >
        <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
        <span className="text-xs text-pink-400 font-medium">
          AI: {findings.length} gjetje
        </span>
      </motion.div>
    </div>
  );
}
