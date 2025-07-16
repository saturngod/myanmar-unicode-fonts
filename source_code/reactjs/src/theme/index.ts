/**
 * Design System Theme Module
 * Exports all theme-related utilities and configurations
 */

export { theme, cssVars, type Theme } from './config';
export {
    getCSSVar,
    setCSSVar,
    applyTheme,
    createThemeStyles,
    breakpoints,
    mediaQueries,
    stylePatterns,
} from './utils';