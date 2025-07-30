# Splash Screen and Background Decorations

## Overview

This document explains how the splash screen and background decorations are implemented in the AcademiaPort application.

## Splash Screen

### Location

- **Component**: `components/SplashScreen.tsx`
- **Usage**: `app/[locale]/page.tsx` (Home page)

### Features

- **Animated Loading**: Shows a progress bar that simulates loading progress
- **Academic Theme**: Uses graduation cap icon and academic-related animations
- **Skip Option**: Users can skip the splash screen by clicking the X button
- **Smooth Transitions**: Uses Framer Motion for smooth animations
- **Responsive Design**: Works on all screen sizes

### Props

```typescript
interface SplashScreenProps {
  onComplete?: () => void; // Called when splash screen completes naturally
  onSkip?: () => void; // Called when user skips the splash screen
}
```

### Implementation Details

1. **Progress Simulation**: Random progress increments every 300ms
2. **Content Animation**: Staggered animations for logo, title, and progress bar
3. **Floating Icons**: Academic icons that float around the screen
4. **Background Effects**: Gradient overlays and grid patterns
5. **Exit Animation**: Smooth fade-out when transitioning to main content

## Background Decorations

### Location

- **Component**: `components/BackgroundDecorations.tsx`
- **Usage**: `app/[locale]/layout.tsx` (Applied to all pages)

### Features

- **Global Application**: Applied to all pages through the main layout
- **Academic Theme**: Floating academic icons and subtle animations
- **Performance Optimized**: Uses `pointer-events-none` to avoid interference
- **Responsive**: Adapts to different screen sizes
- **Subtle Effects**: Low opacity animations that don't distract from content

### Implementation Details

1. **Fixed Positioning**: Background elements are fixed to viewport
2. **Academic Icons**: Graduation cap, books, library, and notebook icons
3. **Grid Pattern**: Subtle grid overlay for depth
4. **Light Effects**: Gradient overlays at top and bottom
5. **Corner Decorations**: Small decorative elements in corners

## Usage

### Home Page Splash Screen

The splash screen is automatically shown when users visit the home page (`/`). It displays for approximately 3-4 seconds before transitioning to the main content.

### Background Decorations

The background decorations are automatically applied to all pages through the main layout. No additional configuration is needed.

## Customization

### Splash Screen Timing

To adjust the splash screen duration, modify the progress simulation in `SplashScreen.tsx`:

```typescript
// Adjust the interval timing (currently 300ms)
const interval = setInterval(() => {
  // Progress logic
}, 300); // Change this value
```

### Background Decorations

To modify the background decorations:

1. Edit `components/BackgroundDecorations.tsx`
2. Adjust the number of floating icons by changing the array length
3. Modify colors by changing the CSS classes
4. Add new academic icons by importing from lucide-react

## Technical Notes

- **Framer Motion**: Used for all animations
- **Tailwind CSS**: Styling and responsive design
- **Lucide React**: Icons (GraduationCap, BookOpen, Library, NotebookPen, LayoutDashboard)
- **Performance**: Background decorations use `pointer-events-none` to avoid interference
- **Accessibility**: Skip button allows users to bypass splash screen

## Browser Compatibility

- Modern browsers with CSS Grid and Flexbox support
- Framer Motion requires React 18+
- Tailwind CSS for styling
