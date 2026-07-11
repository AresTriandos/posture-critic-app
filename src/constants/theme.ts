/**
 * PostureCritic Design System
 * Athletic aesthetic with focus on body awareness
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    // Primary brand
    primary: '#1F6F8E',       // Aegean blue
    primaryLight: '#3E92CC',  // Lighter Aegean blue
    
    // Accents
    accent: '#123B4F',        // Deep sea blue
    success: '#10B981',       // Green (correct form)
    warning: '#F59E0B',       // Amber (caution)
    danger: '#EF4444',        // Red (incorrect form)
    
    // Neutrals
    text: '#1a1a1a',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    
    // Backgrounds
    background: '#FAFAFA',
    surface: '#FFFFFF',
    surfaceAlt: '#F3F4F6',
    overlay: '#00000080',
    
    // Borders
    border: '#E5E7EB',
  },
  dark: {
    // Primary brand
    primary: '#3E92CC',       // Bright Aegean blue for dark mode
    primaryLight: '#7FB3CC',  // Lighter Aegean blue
    
    // Accents
    accent: '#9CC4D8',        // Pale sky blue
    success: '#34D399',       // Green
    warning: '#FBBF24',       // Amber
    danger: '#F87171',        // Red
    
    // Neutrals
    text: '#F3F4F6',
    textSecondary: '#D1D5DB',
    textTertiary: '#9CA3AF',
    
    // Backgrounds
    background: '#0F172A',
    surface: '#1E293B',
    surfaceAlt: '#334155',
    overlay: '#00000099',
    
    // Borders
    border: '#475569',
  },
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
  '4xl': 64,
} as const;

export const BorderRadius = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const;

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 5,
  },
} as const;

export const Typography = {
  displayLarge: {
    fontSize: 40,
    lineHeight: 48,
    fontWeight: '700',
  },
  displaySmall: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
  },
  headingLarge: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '600',
  },
  headingSmall: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
  },
  bodyLarge: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  bodyMedium: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  bodySmall: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
  },
  labelLarge: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  labelSmall: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
  },
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
