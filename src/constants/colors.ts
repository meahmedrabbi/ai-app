/**
 * RTX AI Color Palette
 * Design color scheme used throughout the application
 */

export const Colors = {
  // Main background, light surfaces
  parchment: '#f7f4f2',

  // AI message bubbles, secondary elements
  khakiBeige: '#bbac9d',

  // User message bubbles, accent elements, active states
  fadedCopper: '#8f7258',

  // Headers, text, dark elements
  shadowGrey: '#2b2827',

  // Additional utility colors
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',

  // Derived colors for various states
  mutedText: '#6b6b6b',
  error: '#dc3545',
  success: '#28a745',
  warning: '#ffc107',

  // Overlay and shadow colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  shadow: 'rgba(0, 0, 0, 0.1)',
} as const;

export type ColorKey = keyof typeof Colors;
