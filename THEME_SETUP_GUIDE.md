# DoseMate Theme System Documentation

## Overview
The DoseMate project now has a centralized theme system that allows you to control all colors and styles from one place. The system supports both light and dark themes automatically.

## File Structure

### 1. **theme.css** (`src/theme.css`)
The main theme configuration file with all CSS variables.

#### CSS Variables Available:

**Brand Colors (Static)**
```css
--brand: #009665          /* Primary brand color */
--brand-dark: #007a53     /* Dark variant */
--brand-light: #00d084    /* Light variant */
--brand-600: #0f766e      /* Brand 600 shade */
--accent: #DAF800         /* Accent yellow color */
--accent-light: #e8ff4d   /* Light accent */
```

**Theme-Aware Colors (Change based on light/dark mode)**
```css
--text-primary: #1f2937 (light) / #ffffff (dark)
--text-secondary: #6b7280 (light) / #e5e7eb (dark)
--text-muted: #9ca3af (light) / #d1d5db (dark)
--bg-primary: #ffffff (light) / #1a1a1f (dark)
--bg-secondary: #f9fafb (light) / #242429 (dark)
--bg-tertiary: #f3f4f6 (light) / #2d2d33 (dark)
--border-color: rgba(0,150,101,0.15) (light) / rgba(218,248,0,0.15) (dark)
--border-light: rgba(0,0,0,0.1) (light) / rgba(255,255,255,0.1) (dark)
```

**Shadows**
```css
--shadow-sm: 0 1px 2px rgba(...)
--shadow-md: 0 4px 12px rgba(...)
--shadow-lg: 0 10px 30px rgba(...)
--shadow-xl: 0 20px 60px rgba(...)
--shadow-2xl: 0 30px 80px rgba(...)
--card-shadow: Combined shadow for cards
```

**Status Colors**
```css
--success: #4caf50
--warning: #ff9800
--error: #f44336
--info: #2196f3
```

## How to Use

### In CSS Files
```css
/* Use any CSS variable */
.my-element {
  color: var(--text-primary);
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-md);
}

/* Utility classes are already available */
.text-primary { color: var(--text-primary); }
.bg-secondary { background-color: var(--bg-secondary); }
.shadow-lg { box-shadow: var(--shadow-lg); }
```

### In React Components (MUI)
```jsx
// Colors automatically adapt based on darkMode context
const MyComponent = () => {
  const { darkMode } = useContext(ThemeContext)
  
  return (
    <Box sx={{
      color: 'var(--text-primary)',
      backgroundColor: 'var(--bg-primary)',
      borderColor: 'var(--border-color)',
      boxShadow: 'var(--shadow-lg)'
    }}>
      Content
    </Box>
  )
}
```

### Theme Toggle Component
```jsx
import ThemeToggle from '@/components/ThemeToggle'

// Add to any page
<ThemeToggle /> // Default: fixed top-right

// Or customize position
<ThemeToggle position="absolute" top={20} right={20} />
```

## How Theme Switching Works

1. **ThemeContext** (`src/context/ThemeContext.jsx`)
   - Manages darkMode state
   - Persists preference in localStorage
   - Updates HTML `data-theme` attribute
   - Provides theme to Material-UI

2. **ThemeToggle Component** (`src/components/ThemeToggle.jsx`)
   - Reusable toggle button for all pages
   - Animated hover effects
   - Tooltip support
   - Can be positioned anywhere

3. **CSS Media Query**
   - System respects user's OS theme preference
   - Manual override via data-theme attribute

## Modifying Colors

### To Change All Primary Text Color:

Edit `theme.css` and find:
```css
:root {
  --text-primary: #1f2937; /* Light mode */
}

@media (prefers-color-scheme: dark) {
  :root {
    --text-primary: #ffffff; /* Dark mode */
  }
}
```

### To Change Brand Color:

Update the static variable:
```css
--brand: #009665; /* Change this */
--brand-dark: #007a53;
--brand-light: #00d084;
```

All components using `var(--brand)` will update automatically!

## Applying to Existing Pages

### Step 1: Add ThemeToggle
```jsx
import ThemeToggle from '../components/ThemeToggle'

export const MyPage = () => {
  return (
    <>
      <ThemeToggle />
      {/* Page content */}
    </>
  )
}
```

### Step 2: Use Theme Variables
```jsx
// Instead of hardcoding colors
<Box sx={{
  color: '#1f2937',                    // Bad
  backgroundColor: 'rgba(0,0,0,0.05)',  // Bad
}}>

// Use variables
<Box sx={{
  color: 'var(--text-primary)',
  backgroundColor: 'var(--bg-secondary)',
  borderColor: 'var(--border-color)',
  boxShadow: 'var(--shadow-md)'
}}>
```

## Utility Classes

Pre-made utility classes available:

```html
<!-- Text Colors -->
<div class="text-primary">Primary text</div>
<div class="text-secondary">Secondary text</div>
<div class="text-muted">Muted text</div>
<div class="text-brand">Brand colored text</div>
<div class="text-accent">Accent colored text</div>

<!-- Backgrounds -->
<div class="bg-primary">Primary background</div>
<div class="bg-secondary">Secondary background</div>
<div class="bg-tertiary">Tertiary background</div>

<!-- Borders -->
<div class="border-color">Themed border color</div>
<div class="border-light">Light border color</div>

<!-- Shadows -->
<div class="shadow-sm">Small shadow</div>
<div class="shadow-md">Medium shadow</div>
<div class="shadow-lg">Large shadow</div>
<div class="shadow-xl">Extra large shadow</div>
<div class="shadow-2xl">2XL shadow</div>

<!-- Gradients -->
<div class="gradient-brand">Brand gradient</div>
<div class="gradient-subtle">Subtle gradient</div>

<!-- Animations -->
<div class="animate-fadeIn">Fade in animation</div>
<div class="animate-slideInUp">Slide up animation</div>
<div class="animate-slideInDown">Slide down animation</div>
<div class="animate-pulse">Pulse animation</div>
```

## Current Pages with Theme Support

✅ Register - Using ThemeToggle
✅ Login - Using ThemeToggle

## Next Steps

1. Add `<ThemeToggle />` to all other pages:
   - Dashboard
   - MedicineList
   - Profile
   - History
   - Reminders
   - Reports

2. Update all color hardcodes to use CSS variables

3. Test both light and dark modes

## Example Integration

```jsx
import { useContext } from 'react'
import { Box, Container } from '@mui/material'
import ThemeToggle from '../components/ThemeToggle'
import { ThemeContext } from '../context/ThemeContext'

export const Dashboard = () => {
  const { darkMode } = useContext(ThemeContext)

  return (
    <Container>
      <ThemeToggle />
      
      <Box sx={{
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-lg)'
      }}>
        {darkMode ? 'Dark Mode' : 'Light Mode'} is active!
      </Box>
    </Container>
  )
}
```

## Troubleshooting

**Colors not changing when theme toggles:**
- Make sure you're importing ThemeContext
- Check that CSS variables are being used instead of hardcoded values
- Verify theme.css is imported in index.css

**Theme not persisting on reload:**
- Clear browser localStorage
- Check ThemeContext useEffect is setting localStorage

**Theme toggle not appearing:**
- Import ThemeToggle component
- Add `<ThemeToggle />` to your page
- Ensure ThemeContext provider wraps the app

---

**Happy theming! 🎨**
