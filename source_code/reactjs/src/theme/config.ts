/**
 * Design System Theme Configuration
 * Professional UI redesign theme constants
 */

export const theme = {
    colors: {
        primary: '#3b82f6', // Blue-500
        secondary: '#6b7280', // Gray-500
        background: '#ffffff', // White
        surface: '#f9fafb', // Gray-50
        text: {
            primary: '#1f2937', // Gray-800
            secondary: '#6b7280', // Gray-500
            muted: '#9ca3af', // Gray-400
        },
        border: {
            default: '#e5e7eb', // Gray-200
            focus: '#3b82f6', // Blue-500
            hover: '#d1d5db', // Gray-300
        },
        accent: {
            blue: '#3b82f6', // Blue-500
            success: '#10b981', // Emerald-500
            warning: '#f59e0b', // Amber-500
            error: '#ef4444', // Red-500
        },
    },
    spacing: {
        xs: '8px',
        sm: '16px',
        md: '24px',
        lg: '32px',
        xl: '48px',
        xxl: '64px',
    },
    typography: {
        scale: {
            xs: '14px',
            sm: '16px',
            md: '18px',
            lg: '24px',
            xl: '32px',
        },
        weights: {
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
        },
        lineHeights: {
            tight: 1.25,
            normal: 1.5,
            relaxed: 1.75,
        },
    },
    borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
    },
    shadows: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    },
    transitions: {
        fast: '150ms ease-in-out',
        normal: '250ms ease-in-out',
        slow: '350ms ease-in-out',
    },
} as const;

export type Theme = typeof theme;

// CSS Custom Property Names
export const cssVars = {
    colors: {
        primary: '--color-primary',
        secondary: '--color-secondary',
        background: '--color-background',
        surface: '--color-surface',
        textPrimary: '--color-text-primary',
        textSecondary: '--color-text-secondary',
        textMuted: '--color-text-muted',
        borderDefault: '--color-border-default',
        borderFocus: '--color-border-focus',
        borderHover: '--color-border-hover',
        accentBlue: '--color-accent-blue',
        accentSuccess: '--color-accent-success',
        accentWarning: '--color-accent-warning',
        accentError: '--color-accent-error',
    },
    spacing: {
        xs: '--spacing-xs',
        sm: '--spacing-sm',
        md: '--spacing-md',
        lg: '--spacing-lg',
        xl: '--spacing-xl',
        xxl: '--spacing-xxl',
    },
    typography: {
        scaleXs: '--font-size-xs',
        scaleSm: '--font-size-sm',
        scaleMd: '--font-size-md',
        scaleLg: '--font-size-lg',
        scaleXl: '--font-size-xl',
        weightNormal: '--font-weight-normal',
        weightMedium: '--font-weight-medium',
        weightSemibold: '--font-weight-semibold',
        weightBold: '--font-weight-bold',
        lineHeightTight: '--line-height-tight',
        lineHeightNormal: '--line-height-normal',
        lineHeightRelaxed: '--line-height-relaxed',
    },
    borderRadius: {
        sm: '--border-radius-sm',
        md: '--border-radius-md',
        lg: '--border-radius-lg',
    },
    shadows: {
        sm: '--shadow-sm',
        md: '--shadow-md',
        lg: '--shadow-lg',
    },
    transitions: {
        fast: '--transition-fast',
        normal: '--transition-normal',
        slow: '--transition-slow',
    },
} as const;