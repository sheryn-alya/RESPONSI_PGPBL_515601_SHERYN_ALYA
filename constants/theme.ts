/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

// New primary tint: vivid blue to be used as main accent
const tintColorLight = '#0b63ff';
const tintColorDark = '#0b63ff';

export const Colors = {
  // Light theme uses black text on a white background with a blue accent
  light: {
    text: '#000000',
    background: '#ffffff',
    tint: tintColorLight,
    icon: '#111111',
    tabIconDefault: '#111111',
    tabIconSelected: tintColorLight,
  },
  // Dark theme uses white text on a true black background with the same blue accent
  dark: {
    text: '#FFFFFF',
    background: '#000000',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  // Recommend a clean sans font for the app. If you prefer a custom font (e.g. Poppins / Inter)
  // add the font files to the project and update the family name here.
  ios: {
    // prefer a modern sans with fallbacks
    sans: 'Poppins, system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    // Android / native default fallback - use Roboto if available
    sans: 'Poppins, Roboto, "Helvetica Neue", Arial',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "Poppins, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

