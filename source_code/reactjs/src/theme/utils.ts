/**
 * Theme utility functions for programmatic access to design system values
 */

import { theme, cssVars } from './config';

/**
 * Get a CSS custom property value
 */
export const getCSSVar = (varName: string): string => {
    if (typeof window !== 'undefined') {
        return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    }
    return '';
};

/**
 * Set a CSS custom property value
 */
export const setCSSVar = (varName: string, value: string): void => {
    if (typeof window !== 'undefined') {
        document.documentElement.style.setProperty(varName, value);
    }
};

/**
 * Apply theme values to CSS custom properties
 * Useful for dynamic theming or theme switching
 */
export const applyTheme = (themeOverrides?: Partial<typeof theme>): void => {
    const finalTheme = { ...theme, ...themeOverrides };

    // Apply colors
    setCSSVar(cssVars.colors.primary, finalTheme.colors.primary);
    setCSSVar(cssVars.colors.secondary, finalTheme.colors.secondary);
    setCSSVar(cssVars.colors.background, finalTheme.colors.background);
    setCSSVar(cssVars.colors.surface, finalTheme.colors.surface);
    setCSSVar(cssVars.colors.textPrimary, finalTheme.colors.text.primary);
    setCSSVar(cssVars.colors.textSecondary, finalTheme.colors.text.secondary);
    setCSSVar(cssVars.colors.textMuted, finalTheme.colors.text.muted);
    setCSSVar(cssVars.colors.borderDefault, finalTheme.colors.border.default);
    setCSSVar(cssVars.colors.borderFocus, finalTheme.colors.border.focus);
    setCSSVar(cssVars.colors.borderHover, finalTheme.colors.border.hover);
    setCSSVar(cssVars.colors.accentBlue, finalTheme.colors.accent.blue);
    setCSSVar(cssVars.colors.accentSuccess, finalTheme.colors.accent.success);
    setCSSVar(cssVars.colors.accentWarning, finalTheme.colors.accent.warning);
    setCSSVar(cssVars.colors.accentError, finalTheme.colors.accent.error);

    // Apply spacing
    setCSSVar(cssVars.spacing.xs, finalTheme.spacing.xs);
    setCSSVar(cssVars.spacing.sm, finalTheme.spacing.sm);
    setCSSVar(cssVars.spacing.md, finalTheme.spacing.md);
    setCSSVar(cssVars.spacing.lg, finalTheme.spacing.lg);
    setCSSVar(cssVars.spacing.xl, finalTheme.spacing.xl);
    setCSSVar(cssVars.spacing.xxl, finalTheme.spacing.xxl);

    // Apply typography
    setCSSVar(cssVars.typography.scaleXs, finalTheme.typography.scale.xs);
    setCSSVar(cssVars.typography.scaleSm, finalTheme.typography.scale.sm);
    setCSSVar(cssVars.typography.scaleMd, finalTheme.typography.scale.md);
    setCSSVar(cssVars.typography.scaleLg, finalTheme.typography.scale.lg);
    setCSSVar(cssVars.typography.scaleXl, finalTheme.typography.scale.xl);
    setCSSVar(cssVars.typography.weightNormal, finalTheme.typography.weights.normal.toString());
    setCSSVar(cssVars.typography.weightMedium, finalTheme.typography.weights.medium.toString());
    setCSSVar(cssVars.typography.weightSemibold, finalTheme.typography.weights.semibold.toString());
    setCSSVar(cssVars.typography.weightBold, finalTheme.typography.weights.bold.toString());
    setCSSVar(cssVars.typography.lineHeightTight, finalTheme.typography.lineHeights.tight.toString());
    setCSSVar(cssVars.typography.lineHeightNormal, finalTheme.typography.lineHeights.normal.toString());
    setCSSVar(cssVars.typography.lineHeightRelaxed, finalTheme.typography.lineHeights.relaxed.toString());

    // Apply border radius
    setCSSVar(cssVars.borderRadius.sm, finalTheme.borderRadius.sm);
    setCSSVar(cssVars.borderRadius.md, finalTheme.borderRadius.md);
    setCSSVar(cssVars.borderRadius.lg, finalTheme.borderRadius.lg);

    // Apply shadows
    setCSSVar(cssVars.shadows.sm, finalTheme.shadows.sm);
    setCSSVar(cssVars.shadows.md, finalTheme.shadows.md);
    setCSSVar(cssVars.shadows.lg, finalTheme.shadows.lg);

    // Apply transitions
    setCSSVar(cssVars.transitions.fast, finalTheme.transitions.fast);
    setCSSVar(cssVars.transitions.normal, finalTheme.transitions.normal);
    setCSSVar(cssVars.transitions.slow, finalTheme.transitions.slow);
};

/**
 * Generate inline styles using theme values
 */
export const createThemeStyles = (styles: Record<string, keyof typeof theme | string>) => {
    const result: Record<string, string> = {};

    Object.entries(styles).forEach(([property, value]) => {
        if (typeof value === 'string' && value.startsWith('--')) {
            result[property] = `var(${value})`;
        } else {
            result[property] = value as string;
        }
    });

    return result;
};

/**
 * Responsive breakpoints for consistent responsive design
 */
export const breakpoints = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
} as const;

/**
 * Media query helpers
 */
export const mediaQueries = {
    sm: `@media (min-width: ${breakpoints.sm})`,
    md: `@media (min-width: ${breakpoints.md})`,
    lg: `@media (min-width: ${breakpoints.lg})`,
    xl: `@media (min-width: ${breakpoints.xl})`,
    '2xl': `@media (min-width: ${breakpoints['2xl']})`,
} as const;

/**
 * Common component style patterns
 */
export const stylePatterns = {
    card: {
        backgroundColor: 'var(--color-background)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 'var(--border-radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        transition: 'all var(--transition-normal)',
    },
    cardHover: {
        borderColor: 'var(--color-border-hover)',
        boxShadow: 'var(--shadow-md)',
    },
    input: {
        border: '2px solid var(--color-border-default)',
        borderRadius: 'var(--border-radius-md)',
        padding: 'var(--spacing-sm)',
        fontSize: 'var(--font-size-sm)',
        transition: 'border-color var(--transition-fast)',
    },
    inputFocus: {
        borderColor: 'var(--color-border-focus)',
        outline: 'none',
    },
    button: {
        padding: 'var(--spacing-xs) var(--spacing-sm)',
        borderRadius: 'var(--border-radius-md)',
        fontWeight: 'var(--font-weight-medium)',
        transition: 'all var(--transition-fast)',
        cursor: 'pointer',
        border: 'none',
    },
} as const;