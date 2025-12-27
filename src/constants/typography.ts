/**
 * RTX AI Typography Configuration
 * Inter font family with various weights and sizes
 */

// Font family names - Inter font
export const FontFamily = {
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  semiBold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
} as const;

// Font sizes based on design specifications
export const FontSize = {
  // App Title/Branding: 24-26px
  appTitle: 26,

  // Headers: 20-22px
  header: 22,
  headerSmall: 20,

  // Body Text: 16px
  body: 16,

  // Chat Messages: 15px
  chatMessage: 15,

  // Buttons: 16px
  button: 16,

  // Input Placeholder: 15px
  inputPlaceholder: 15,

  // Timestamps: 11-12px
  timestamp: 12,
  timestampSmall: 11,

  // Small text
  small: 13,
  tiny: 10,
} as const;

// Pre-defined text styles for convenience
export const TextStyles = {
  appTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.appTitle,
  },
  header: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.header,
  },
  headerSmall: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.headerSmall,
  },
  body: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.body,
  },
  chatMessage: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.chatMessage,
  },
  button: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.button,
  },
  inputPlaceholder: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.inputPlaceholder,
  },
  timestamp: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.timestamp,
  },
  small: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.small,
  },
} as const;
