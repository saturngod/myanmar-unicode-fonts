# Design Document

## Overview

The UI redesign transforms the Myanmar Font Preview application from a single-column layout to a modern two-panel interface. The new design separates controls from content, providing better organization and improved user experience. The left panel houses all font controls and settings, while the right panel focuses on font search and preview display.

## Architecture

### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│                    Myanmar Font Preview                     │
├─────────────────┬───────────────────────────────────────────┤
│   Left Panel    │              Right Panel                  │
│   (Controls)    │            (Search & Preview)             │
│                 │                                           │
│ [Collapse] ←──  │  ┌─────────────────────────────────────┐  │
│ • Preview Text  │  │         Search Box                  │  │
│ • Font Size     │  └─────────────────────────────────────┘  │
│ • Line Height   │                                           │
│ • Grid Toggle   │  ┌─────────────────────────────────────┐  │
│                 │  │                                     │  │
│                 │  │        Font Preview Grid/List       │  │
│                 │  │                                     │  │
│                 │  └─────────────────────────────────────┘  │
└─────────────────┴───────────────────────────────────────────┘
```

### Responsive Behavior
- **Desktop (≥1024px)**: Two-panel layout with fixed left panel width (320px)
- **Tablet (768px-1023px)**: Collapsible left panel, overlay on mobile
- **Mobile (<768px)**: Left panel becomes a slide-out drawer

## Components and Interfaces

### New Components

#### 1. LeftControlPanel Component
```typescript
interface LeftControlPanelProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}
```
**Responsibilities:**
- Render all font controls (preview text, font size, line height, grid toggle)
- Handle collapse/expand functionality
- Maintain responsive behavior
- Persist panel state in localStorage

#### 2. RightPreviewPanel Component
```typescript
interface RightPreviewPanelProps {
  isLeftPanelCollapsed: boolean;
}
```
**Responsibilities:**
- Render search box at the top
- Display font category sections
- Handle dynamic width based on left panel state
- Maintain scroll position during layout changes

#### 3. SearchBox Component
```typescript
interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}
```
**Responsibilities:**
- Provide real-time search functionality
- Clear search functionality
- Keyboard shortcuts (Escape to clear)
- Search result highlighting

### Modified Components

#### 1. App Component Updates
- Remove existing control elements from main layout
- Implement two-panel layout structure
- Add panel state management
- Handle responsive breakpoints

#### 2. FontContext Enhancements
```typescript
interface FontContextProps {
  // Existing properties...
  leftPanelCollapsed: boolean;
  toggleLeftPanel: (collapsed: boolean) => void;
}
```

#### 3. FontList Component Updates
- Remove search logic (moved to parent)
- Focus on rendering filtered results
- Optimize for both grid and list layouts

## Data Models

### Panel State Model
```typescript
interface PanelState {
  leftPanelCollapsed: boolean;
  leftPanelWidth: number;
  rightPanelWidth: number;
}
```

### Layout Configuration
```typescript
interface LayoutConfig {
  leftPanelMinWidth: number;    // 280px
  leftPanelMaxWidth: number;    // 400px
  leftPanelDefaultWidth: number; // 320px
  breakpoints: {
    mobile: number;    // 768px
    tablet: number;    // 1024px
    desktop: number;   // 1200px
  };
}
```

## Error Handling

### Layout Errors
- **Panel Width Constraints**: Ensure minimum/maximum widths are respected
- **Responsive Breakpoints**: Graceful degradation on unsupported screen sizes
- **State Persistence**: Handle localStorage errors gracefully

### Search Functionality
- **Empty Results**: Display "No fonts found" message with clear search option
- **Invalid Input**: Sanitize search terms to prevent XSS
- **Performance**: Debounce search input to prevent excessive filtering

### Accessibility Errors
- **Keyboard Navigation**: Ensure all controls are keyboard accessible
- **Screen Readers**: Provide appropriate ARIA labels and roles
- **Focus Management**: Maintain logical focus order during panel state changes

## Testing Strategy

### Unit Tests
- **LeftControlPanel**: Test collapse/expand functionality, control interactions
- **RightPreviewPanel**: Test responsive width calculations, search integration
- **SearchBox**: Test filtering logic, keyboard shortcuts, clear functionality
- **FontContext**: Test new panel state management functions

### Integration Tests
- **Panel Layout**: Test two-panel layout across different screen sizes
- **State Persistence**: Test localStorage integration for panel preferences
- **Search Integration**: Test search functionality with font filtering
- **Responsive Behavior**: Test panel behavior at various breakpoints

### Visual Regression Tests
- **Layout Consistency**: Ensure consistent spacing and alignment
- **Grid/List Toggle**: Test visual differences between view modes
- **Panel Transitions**: Test smooth animations during collapse/expand
- **Font Preview**: Ensure font previews render correctly in both layouts

### Accessibility Tests
- **WCAG Compliance**: Test color contrast, keyboard navigation, screen reader support
- **Focus Management**: Test focus trapping in collapsed panel states
- **Semantic HTML**: Ensure proper heading hierarchy and landmark roles

## Performance Considerations

### Rendering Optimization
- **Virtual Scrolling**: Implement for large font lists (>100 fonts)
- **Memoization**: Use React.memo for font preview components
- **Lazy Loading**: Load font previews as they enter viewport
- **Debounced Search**: Prevent excessive re-renders during typing

### Layout Performance
- **CSS Grid/Flexbox**: Use modern CSS layout methods for better performance
- **Transform Animations**: Use CSS transforms for smooth panel transitions
- **Avoid Layout Thrashing**: Minimize DOM measurements during resize events

### Memory Management
- **Component Cleanup**: Properly cleanup event listeners and timers
- **Font Loading**: Implement font loading strategies to prevent FOUT/FOIT
- **State Management**: Optimize context updates to prevent unnecessary re-renders