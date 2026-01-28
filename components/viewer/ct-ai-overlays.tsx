'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

interface CTAIFinding {
  id: string;
  number: number;
  label: string;
  confidence: number;
  severity: 'normal' | 'mild' | 'moderate' | 'severe';
  description: string;
  x: number;
  y: number;
}

interface CTAIOverlaysProps {
  findings: CTAIFinding[];
  width: number;
  height: number;
  visible: boolean;
}

export function CTAIOverlays({ findings, width, height, visible }: CTAIOverlaysProps) {
  if (!visible || findings.length === 0) {
    return null;
  }

  // Check if all findings are normal (clean scan)
  const allNormal = findings.every((f) => f.severity === 'normal');

  return (
    <div className="absolute inset-0 pointer-events-none">
      <AnimatePresence>
        {findings.map((finding) => {
          const xPos = (finding.x / 100) * width;
          const yPos = (finding.y / 100) * height;
          const isNormal = finding.severity === 'normal';

          // For abnormal findings, use warning colors
          const color = isNormal ? '#22c55e' : '#f97316';
          const bgColor = isNormal ? 'rgba(34, 197, 94, 0.1)' : 'rgba(249, 115, 22, 0.1)';

          return (
            <motion.div
              key={finding.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                duration: 0.4,
                delay: finding.number * 0.12,
                type: "spring",
                stiffness: 180,
                damping: 12
              }}
              className="absolute"
              style={{
                left: xPos,
                top: yPos,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {/* Gentle pulse for normal findings */}
              {isNormal && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    backgroundColor: color,
                    width: 45,
                    height: 45,
                    transform: 'translate(-50%, -50%)',
                  }}
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.2, 0, 0.2],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: finding.number * 0.12,
                  }}
                />
              )}

              {/* Checkmark badge for normal, exclamation for abnormal */}
              <div
                className="relative rounded-full flex items-center justify-center shadow-lg"
                style={{
                  width: 38,
                  height: 38,
                  backgroundColor: 'rgba(0, 0, 0, 0.75)',
                  border: `2.5px solid ${color}`,
                  boxShadow: `0 0 20px ${bgColor}, 0 0 10px ${color}`,
                }}
              >
                {isNormal ? (
                  <CheckCircle2
                    className="text-green-400"
                    size={22}
                    strokeWidth={2.5}
                  />
                ) : (
                  <span className="text-lg font-bold text-orange-400">!</span>
                )}
              </div>

              {/* Label with clean design */}
              <motion.div
                initial={{ opacity: 0, y: -3 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: finding.number * 0.12 + 0.3 }}
                className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap"
              >
                <div
                  className="px-2 py-0.5 rounded-md text-[11px] font-semibold backdrop-blur-md"
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.85)',
                    color: color,
                    border: `1px solid ${color}40`,
                  }}
                >
                  {finding.label}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Clean scan indicator */}
      {allNormal && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="absolute top-2 right-2 flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-cyan-500/20 backdrop-blur-md px-3 py-2 rounded-lg border border-green-500/40 shadow-lg"
        >
          <ShieldCheck className="w-4 h-4 text-green-400" />
          <span className="text-xs text-green-300 font-semibold">
            Skanim i Pastër - {findings.length} zona normale
          </span>
        </motion.div>
      )}

      {/* AI indicator */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/80 backdrop-blur-sm px-2.5 py-1.5 rounded-md border border-cyan-500/30"
      >
        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
        <span className="text-xs text-cyan-400 font-medium">
          AI Analiza
        </span>
      </motion.div>
    </div>
  );
}
