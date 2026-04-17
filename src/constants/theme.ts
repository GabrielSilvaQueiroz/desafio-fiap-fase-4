import type { ViewStyle } from 'react-native';

export const colors = {
  background: '#0B1420',
  surface: '#0F1E3C',
  surfaceAlt: '#172D58',
  card: '#FAF7F1',
  cardMuted: '#EEE7DA',
  primary: '#CC6D1E',
  primaryDark: '#8F4511',
  accent: '#0F2D5C',
  success: '#2E7D5B',
  warning: '#B7791F',
  danger: '#B8404A',
  text: '#172435',
  textMuted: '#5F6E82',
  textOnDark: '#F8F3EB',
  border: '#CDD7E2',
  divider: '#E4E8EF',
  overlay: 'rgba(11, 20, 32, 0.58)',
};

export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  x2: 32,
  x3: 40,
};

export const radius = {
  sm: 12,
  md: 16,
  lg: 22,
  pill: 999,
};

export const typography = {
  title: 28,
  subtitle: 20,
  body: 16,
  caption: 13,
};

export function shadow(level = 1): ViewStyle {
  return {
    shadowColor: '#020617',
    shadowOffset: { width: 0, height: level * 3 },
    shadowOpacity: 0.08 + level * 0.02,
    shadowRadius: level * 6,
    elevation: level * 3,
  };
}
