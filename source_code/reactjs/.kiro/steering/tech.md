# Technology Stack

## Framework & Build System
- **React 18.3.1** with TypeScript
- **Create React App** for build tooling and development server
- **Node.js** runtime environment

## Styling & Design System
- **Tailwind CSS 3.4.1** for utility-first styling
- **Custom CSS variables** for design system tokens
- **CSS-in-JS** approach with custom properties for theming

## State Management
- **React Context API** for global state (FontContext, ToastContext)
- **localStorage** for persisting user preferences
- No external state management libraries

## Development Tools
- **TypeScript 5.4.2** for type safety
- **ESLint** with React app configuration
- **Jest & React Testing Library** for testing

## Font Management
- **TTF font files** organized in categorized folders
- **CSS @font-face** declarations for font loading
- **CDN delivery** via jsDelivr for production fonts

## Common Commands

### Development
```bash
npm start          # Start development server (localhost:3000)
npm test           # Run tests in watch mode
npm run build      # Build for production
```

### Production Deployment
```bash
npm run production # Build with GitHub Pages URL and copy to docs/
```

## Architecture Patterns
- **Component composition** over inheritance
- **Custom hooks** for shared logic
- **Context providers** for cross-component state
- **Memoization** with React.memo for performance
- **TypeScript interfaces** for prop typing