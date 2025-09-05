# Interface Design System Commands for aInvestFeed

## @create-design-system
Initialize complete design system with reusable components, tokens, and patterns for aInvestFeed application.

---

## 1. Design Tokens & Variables

### @setup-design-tokens
Create design tokens for consistent styling across the application.

```css
/* Design Tokens Structure */
:root {
  /* Colors - Financial Theme */
  --color-primary: #2563eb;        /* Blue for primary actions */
  --color-success: #10b981;        /* Green for BUY signals */
  --color-danger: #ef4444;         /* Red for SELL signals */
  --color-warning: #f59e0b;        /* Amber for HOLD/warnings */
  --color-neutral: #6b7280;        /* Gray for neutral states */
  
  /* Background Colors */
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  --bg-tertiary: #f3f4f6;
  --bg-dark: #111827;
  
  /* Text Colors */
  --text-primary: #111827;
  --text-secondary: #4b5563;
  --text-tertiary: #9ca3af;
  --text-inverse: #ffffff;
  
  /* Spacing Scale */
  --space-xs: 0.25rem;  /* 4px */
  --space-sm: 0.5rem;   /* 8px */
  --space-md: 1rem;     /* 16px */
  --space-lg: 1.5rem;   /* 24px */
  --space-xl: 2rem;     /* 32px */
  --space-2xl: 3rem;    /* 48px */
  --space-3xl: 4rem;    /* 64px */
  
  /* Typography Scale */
  --font-xs: 0.75rem;   /* 12px */
  --font-sm: 0.875rem;  /* 14px */
  --font-base: 1rem;    /* 16px */
  --font-lg: 1.125rem;  /* 18px */
  --font-xl: 1.25rem;   /* 20px */
  --font-2xl: 1.5rem;   /* 24px */
  --font-3xl: 2rem;     /* 32px */
  
  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
  
  /* Z-Index Scale */
  --z-base: 0;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-overlay: 300;
  --z-modal: 400;
  --z-popover: 500;
  --z-tooltip: 600;
  --z-toast: 700;
}

/* Dark Mode Variables */
[data-theme="dark"] {
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-tertiary: #334155;
  --text-primary: #f1f5f9;
  --text-secondary: #cbd5e1;
  --text-tertiary: #94a3b8;
}
```

---

## 2. Base Components Library

### @create-button-component
Standardized button component with variants.

```typescript
// components/base/Button.tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// Usage Examples:
<Button variant="primary" size="md">Trade Now</Button>
<Button variant="success" leftIcon={<TrendingUp />}>BUY</Button>
<Button variant="danger" leftIcon={<TrendingDown />}>SELL</Button>
<Button variant="ghost" size="sm">View Details</Button>
```

### @create-card-component
Reusable card component for content containers.

```typescript
// components/base/Card.tsx
interface CardProps {
  variant: 'default' | 'elevated' | 'outlined' | 'glass';
  padding: 'none' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

// Specialized Cards:
- NewsCard
- AnalysisCard
- StatsCard
- ProfileCard
- WatchlistCard
```

### @create-input-components
Form input components suite.

```typescript
// components/base/Input.tsx
interface InputProps {
  type: 'text' | 'email' | 'password' | 'number' | 'search';
  size: 'sm' | 'md' | 'lg';
  state: 'default' | 'success' | 'error' | 'warning';
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
  helperText?: string;
  errorMessage?: string;
}

// Related Components:
- TextInput
- NumberInput
- SearchInput
- PasswordInput
- TextArea
- Select
- Checkbox
- Radio
- Switch
- DatePicker
- TimePicker
```

### @create-badge-component
Badge/chip component for labels and tags.

```typescript
// components/base/Badge.tsx
interface BadgeProps {
  variant: 'default' | 'success' | 'danger' | 'warning' | 'info';
  size: 'xs' | 'sm' | 'md';
  rounded?: boolean;
  removable?: boolean;
  icon?: React.ReactNode;
}

// Financial Badges:
<Badge variant="success">BUY</Badge>
<Badge variant="danger">SELL</Badge>
<Badge variant="warning">HOLD</Badge>
<Badge variant="info">85% Confidence</Badge>
```

---

## 3. Layout Components

### @create-layout-system
Responsive layout components.

```typescript
// components/layout/Container.tsx
interface ContainerProps {
  size: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: boolean;
  centered?: boolean;
}

// components/layout/Grid.tsx
interface GridProps {
  cols: 1 | 2 | 3 | 4 | 6 | 12;
  gap: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  responsive?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

// components/layout/Stack.tsx
interface StackProps {
  direction: 'horizontal' | 'vertical';
  spacing: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
}
```

### @create-navigation-components
Navigation system components.

```typescript
// components/navigation/Navbar.tsx
interface NavbarProps {
  variant: 'default' | 'floating' | 'transparent';
  fixed?: boolean;
  logo: React.ReactNode;
  menuItems: MenuItem[];
  actions?: React.ReactNode;
}

// components/navigation/Sidebar.tsx
interface SidebarProps {
  variant: 'default' | 'compact' | 'overlay';
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  menuItems: MenuItem[];
}

// components/navigation/Tabs.tsx
interface TabsProps {
  variant: 'default' | 'pills' | 'underline';
  size: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  tabs: Tab[];
}

// components/navigation/Breadcrumb.tsx
interface BreadcrumbProps {
  separator?: React.ReactNode;
  items: BreadcrumbItem[];
}
```

---

## 4. Data Display Components

### @create-table-component
Advanced data table component.

```typescript
// components/data/Table.tsx
interface TableProps {
  columns: Column[];
  data: any[];
  sortable?: boolean;
  filterable?: boolean;
  paginated?: boolean;
  selectable?: boolean;
  expandable?: boolean;
  loading?: boolean;
  emptyState?: React.ReactNode;
}

// Features:
- Sorting
- Filtering
- Pagination
- Row selection
- Column resizing
- Virtual scrolling for large datasets
- Export functionality
```

### @create-chart-components
Financial charts and visualizations.

```typescript
// components/charts/LineChart.tsx
// components/charts/CandlestickChart.tsx
// components/charts/BarChart.tsx
// components/charts/PieChart.tsx
// components/charts/SparklineChart.tsx

interface ChartProps {
  data: ChartData[];
  height?: number;
  responsive?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  showGrid?: boolean;
  theme?: 'light' | 'dark';
}
```

### @create-stat-components
Statistics display components.

```typescript
// components/data/StatCard.tsx
interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease';
  icon?: React.ReactNode;
  trend?: number[];
}

// components/data/MetricCard.tsx
interface MetricCardProps {
  title: string;
  metrics: Metric[];
  layout?: 'horizontal' | 'vertical';
  showChart?: boolean;
}
```

---

## 5. Feedback Components

### @create-alert-component
Alert/notification component.

```typescript
// components/feedback/Alert.tsx
interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  description?: string;
  dismissible?: boolean;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
}
```

### @create-modal-component
Modal/dialog component.

```typescript
// components/feedback/Modal.tsx
interface ModalProps {
  size: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  closeable?: boolean;
  backdrop?: boolean | 'blur';
  centered?: boolean;
}
```

### @create-toast-component
Toast notification system.

```typescript
// components/feedback/Toast.tsx
interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

### @create-loading-components
Loading states and skeletons.

```typescript
// components/feedback/Spinner.tsx
interface SpinnerProps {
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  thickness?: number;
}

// components/feedback/Skeleton.tsx
interface SkeletonProps {
  variant: 'text' | 'rect' | 'circle';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

// components/feedback/Progress.tsx
interface ProgressProps {
  value: number;
  max?: number;
  variant: 'linear' | 'circular';
  size: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  color?: string;
}
```

---

## 6. Specialized Financial Components

### @create-news-feed-component
News feed with real-time updates.

```typescript
// components/financial/NewsFeed.tsx
interface NewsFeedProps {
  variant: 'cards' | 'list' | 'compact';
  filters?: FilterOptions;
  sortBy?: 'date' | 'relevance' | 'confidence';
  infiniteScroll?: boolean;
  realTimeUpdates?: boolean;
  showAnalysis?: boolean;
}

// components/financial/NewsCard.tsx
interface NewsCardProps {
  news: News;
  showSummary?: boolean;
  showAnalysis?: boolean;
  showActions?: boolean;
  compact?: boolean;
  onClick?: () => void;
}
```

### @create-analysis-components
AI analysis display components.

```typescript
// components/financial/AnalysisPanel.tsx
interface AnalysisPanelProps {
  analysis: Analysis;
  showConfidence?: boolean;
  showReasoning?: boolean;
  showRiskFactors?: boolean;
  showPriceTargets?: boolean;
  expandable?: boolean;
}

// components/financial/RecommendationBadge.tsx
interface RecommendationBadgeProps {
  recommendation: 'BUY' | 'SELL' | 'HOLD' | 'WATCH';
  confidence: number;
  size: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  animated?: boolean;
}
```

### @create-market-components
Market data display components.

```typescript
// components/financial/MarketOverview.tsx
interface MarketOverviewProps {
  markets: Market[];
  layout: 'grid' | 'carousel' | 'list';
  showSparklines?: boolean;
  updateInterval?: number;
}

// components/financial/InstrumentCard.tsx
interface InstrumentCardProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
  sparklineData?: number[];
  showChart?: boolean;
  interactive?: boolean;
}

// components/financial/WatchlistWidget.tsx
interface WatchlistWidgetProps {
  items: WatchlistItem[];
  editable?: boolean;
  sortable?: boolean;
  showAlerts?: boolean;
  compact?: boolean;
}
```

---

## 7. Mobile-Specific Components

### @create-mobile-optimized-components
Components optimized for mobile devices.

```typescript
// components/mobile/BottomSheet.tsx
interface BottomSheetProps {
  snapPoints?: number[];
  initialSnapPoint?: number;
  backdrop?: boolean;
  handleIndicator?: boolean;
  closeOnBackdrop?: boolean;
}

// components/mobile/SwipeableCard.tsx
interface SwipeableCardProps {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
}

// components/mobile/PullToRefresh.tsx
interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  threshold?: number;
  resistance?: number;
  indicator?: React.ReactNode;
}
```

---

## 8. Component Registry & Documentation

### @generate-component-registry
Create a centralized registry of all UI components.

```typescript
// components/registry.ts
export const ComponentRegistry = {
  base: {
    Button: { path: './base/Button', props: ButtonProps },
    Card: { path: './base/Card', props: CardProps },
    Input: { path: './base/Input', props: InputProps },
    Badge: { path: './base/Badge', props: BadgeProps },
    // ... all base components
  },
  
  layout: {
    Container: { path: './layout/Container', props: ContainerProps },
    Grid: { path: './layout/Grid', props: GridProps },
    Stack: { path: './layout/Stack', props: StackProps },
    // ... all layout components
  },
  
  financial: {
    NewsFeed: { path: './financial/NewsFeed', props: NewsFeedProps },
    AnalysisPanel: { path: './financial/AnalysisPanel', props: AnalysisPanelProps },
    MarketOverview: { path: './financial/MarketOverview', props: MarketOverviewProps },
    // ... all financial components
  },
  
  // Categories: base, layout, navigation, data, feedback, financial, mobile
};
```

### @create-storybook-stories
Generate Storybook stories for all components.

```typescript
// stories/Button.stories.tsx
export default {
  title: 'Base/Button',
  component: Button,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'danger', 'ghost']
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl']
    }
  }
};

export const Primary = { args: { variant: 'primary', children: 'Click Me' } };
export const Success = { args: { variant: 'success', children: 'BUY' } };
export const Danger = { args: { variant: 'danger', children: 'SELL' } };
```

---

## 9. Theme System

### @implement-theme-provider
Theme provider with dark mode support.

```typescript
// contexts/ThemeContext.tsx
interface Theme {
  mode: 'light' | 'dark';
  colors: ColorPalette;
  typography: Typography;
  spacing: SpacingScale;
  breakpoints: Breakpoints;
  shadows: Shadows;
  transitions: Transitions;
}

const ThemeProvider: React.FC = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

---

## 10. Responsive System

### @create-responsive-utilities
Responsive design utilities and hooks.

```typescript
// hooks/useResponsive.ts
const useResponsive = () => {
  const [breakpoint, setBreakpoint] = useState(getCurrentBreakpoint());
  
  const isMobile = breakpoint === 'xs' || breakpoint === 'sm';
  const isTablet = breakpoint === 'md';
  const isDesktop = breakpoint === 'lg' || breakpoint === 'xl';
  
  return { breakpoint, isMobile, isTablet, isDesktop };
};

// utils/responsive.ts
export const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};
```

---

## 11. Animation System

### @setup-animation-library
Animation presets and utilities.

```typescript
// utils/animations.ts
export const animations = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 }
  },
  slideUp: {
    from: { transform: 'translateY(100%)' },
    to: { transform: 'translateY(0)' }
  },
  scaleIn: {
    from: { transform: 'scale(0.9)', opacity: 0 },
    to: { transform: 'scale(1)', opacity: 1 }
  },
  // ... more animations
};

export const transitions = {
  fast: '150ms',
  base: '250ms',
  slow: '350ms',
  slower: '500ms'
};
```

---

## 12. Accessibility

### @ensure-accessibility
Accessibility compliance for all components.

```typescript
// utils/accessibility.ts
export const a11y = {
  // ARIA labels
  ariaLabels: {
    button: 'Click to perform action',
    close: 'Close dialog',
    menu: 'Open menu',
    // ... more labels
  },
  
  // Keyboard navigation
  keyboardShortcuts: {
    'Escape': 'Close modal/dropdown',
    'Enter': 'Submit form/Select item',
    'Tab': 'Navigate forward',
    'Shift+Tab': 'Navigate backward',
    // ... more shortcuts
  },
  
  // Focus management
  focusTrap: (container: HTMLElement) => {
    // Implementation
  },
  
  // Screen reader support
  announceToScreenReader: (message: string) => {
    // Implementation
  }
};
```

---

## Usage Guide

### Component Implementation Priority:
1. **Critical** (Week 1):
   - Button, Input, Card, Badge
   - Container, Grid, Stack
   - Alert, Modal, Spinner
   
2. **High** (Week 2):
   - NewsCard, AnalysisPanel
   - Table, Navigation
   - Form components
   
3. **Medium** (Week 3):
   - Charts, Statistics
   - Financial widgets
   - Mobile optimizations

### File Structure:

```
frontend/src/components/
├── base/           # Base UI components
├── layout/         # Layout components
├── navigation/     # Navigation components
├── data/          # Data display components
├── feedback/      # Feedback components
├── financial/     # Financial-specific components
├── mobile/        # Mobile-specific components
├── registry.ts    # Component registry
└── index.ts       # Main export file
```

### Component Checklist:
- [ ] TypeScript interfaces defined
- [ ] Props validation
- [ ] Responsive design
- [ ] Dark mode support
- [ ] Accessibility (ARIA labels, keyboard nav)
- [ ] Loading states
- [ ] Error states
- [ ] Empty states
- [ ] Documentation
- [ ] Unit tests
- [ ] Storybook story

This comprehensive interface system ensures consistency, reusability, and maintainability across the entire aInvestFeed application.