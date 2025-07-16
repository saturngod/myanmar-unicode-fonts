# Project Structure

## Root Directory
```
├── public/           # Static assets and font files
├── src/             # Source code
├── build/           # Production build output
├── .kiro/           # Kiro configuration and steering
└── package.json     # Dependencies and scripts
```

## Source Code Organization (`src/`)
```
src/
├── App.tsx          # Main application component
├── index.tsx        # React app entry point
├── Context/         # React Context providers
│   ├── mmfontContext.tsx    # Font settings state
│   └── toastContext.tsx     # Toast notifications
├── components/      # Reusable UI components
│   ├── fontBox.tsx          # Individual font preview
│   ├── fontList.tsx         # Font category lists
│   ├── Toast.tsx            # Toast notification UI
│   └── [category]Font.tsx   # Category-specific components
└── theme/           # Design system utilities
    ├── config.ts            # Theme configuration
    ├── index.ts             # Theme exports
    └── utils.ts             # Theme utilities
```

## Font Assets (`public/`)
Fonts are organized by category in separate folders:
- `KhmerType/` - Traditional Myanmar fonts
- `masterpiece/` - Modern Myanmar fonts  
- `other/` - Standard Unicode fonts
- `unknown/` - Miscellaneous fonts

## Naming Conventions
- **Components**: PascalCase (e.g., `FontBox`, `ToastProvider`)
- **Files**: camelCase for components, lowercase for utilities
- **Context**: Descriptive names ending in "Context" (e.g., `FontContext`)
- **Hooks**: Start with "use" prefix (e.g., `useToast`)
- **CSS Classes**: Kebab-case following Tailwind conventions

## Component Architecture
- **Container Components**: Handle state and business logic
- **Presentational Components**: Focus on UI rendering
- **Context Providers**: Wrap app sections needing shared state
- **Custom Hooks**: Extract reusable stateful logic

## File Organization Rules
- Group related files in folders (Context, components, theme)
- Keep component-specific styles in same directory
- Use index files for clean imports
- Separate concerns: UI components vs business logic