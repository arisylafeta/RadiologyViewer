/**
 * Dark Medical Theme Color Palette
 * Professional colors for radiology/medical imaging application
 */

export const colors = {
  // Background colors (slate scale)
  darkest: '#0f172a',
  darker: '#1e293b',
  dark: '#334155',

  // Text colors
  textPrimary: '#f8fafc',
  textSecondary: '#e2e8f0',
  textMuted: '#94a3b8',

  // Primary accent (blue)
  primary: '#2563eb',
  primaryHover: '#1e40af',

  // Border colors
  border: '#475569',
  borderLight: '#64748b',

  // Special colors
  viewerBlack: '#000000',

  // AI annotation colors
  aiCyan: '#06b6d4',
  aiMagenta: '#ec4899',
  aiLime: '#84cc16',
  aiYellow: '#eab308',
} as const;

export type ColorPalette = typeof colors;
