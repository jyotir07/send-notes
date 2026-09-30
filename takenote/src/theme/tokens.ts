export type Palette = {
  background: string;
  surface: string;
  surfaceMuted: string;
  text: string;
  textMuted: string;
  border: string;
  accent: string;
  accentMuted: string;
  onAccent: string;
  danger: string;
  success: string;
};

export const light: Palette = {
  background: '#FAF7F2',
  surface: '#FFFFFF',
  surfaceMuted: '#F1ECE4',
  text: '#1F1B16',
  textMuted: '#6B6259',
  border: '#E4DDD2',
  accent: '#C4552D',
  accentMuted: '#F6E1D8',
  onAccent: '#FFFFFF',
  danger: '#B3261E',
  success: '#2E7D4F',
};

export const dark: Palette = {
  background: '#151311',
  surface: '#1F1C19',
  surfaceMuted: '#2A2622',
  text: '#F3EEE8',
  textMuted: '#A89F95',
  border: '#34302B',
  accent: '#E8794F',
  accentMuted: '#3A2419',
  onAccent: '#1A0E08',
  danger: '#F2B8B5',
  success: '#7FD1A0',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;

export const type = {
  title: { fontSize: 28, fontWeight: '700', letterSpacing: -0.4 },
  heading: { fontSize: 20, fontWeight: '600' },
  body: { fontSize: 16, fontWeight: '400' },
  bodyStrong: { fontSize: 16, fontWeight: '600' },
  caption: { fontSize: 13, fontWeight: '500' },
} as const;

// Minimum comfortable touch target (Material 48dp / Apple 44pt).
export const touchTarget = 48;
