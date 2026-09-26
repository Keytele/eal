export const ealColor = {
  background950: '#06101a',
  background900: '#0a1520',
  background850: '#0e1b27',
  surface800: '#13222e',
  surface750: '#182833',
  line: 'rgba(255,255,255,.16)',
  lineStrong: 'rgba(255,255,255,.32)',
  text: '#f5f7f8',
  textMuted: 'rgba(245,247,248,.68)',
  textSubtle: 'rgba(245,247,248,.48)',
  inverse: '#08111a',
  accentWarm: '#d8a466',
  positive: '#73c69b',
  warning: '#e7b45c',
  danger: '#d96f68',
} as const;

export const ealSpace = [4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96, 128] as const;

export const ealMotion = {
  duration: {
    instant: 0.09,
    fast: 0.14,
    ui: 0.22,
    panel: 0.36,
    section: 0.52,
    hero: 0.9,
    cinematic: 1.4,
  },
  ease: {
    standard: [0.2, 0.7, 0.2, 1],
    enter: [0.16, 1, 0.3, 1],
    exit: [0.7, 0, 0.84, 0],
    emphasized: [0.22, 1, 0.36, 1],
    linear: [0, 0, 1, 1],
  },
} as const;

export type DesignTokenPackageBoundary = 'semantic-tokens-only';
