# FAQ Component Documentation

## Overview

The `FQA_section` component is a comprehensive, user-friendly FAQ (Frequently Asked Questions) display component that provides an enhanced user experience with search functionality, markdown rendering, and form integration.

## Features

### 🎯 Core Features

- **Markdown Rendering**: Displays FAQ answers using the `MarkdownPreview` component
- **Search Functionality**: Real-time search through questions and answers
- **Accordion Interface**: Expandable/collapsible questions for better organization
- **Form Integration**: Links to ask new questions via generated forms
- **React Query Integration**: Efficient data fetching with caching and error handling

### 🔍 Search & Navigation

- **Real-time Search**: Filter questions and answers as you type
- **Search Results**: Shows count of filtered results
- **Expand/Collapse Controls**: Bulk expand or collapse all questions
- **Individual Controls**: Toggle individual questions

### 📱 User Experience

- **Responsive Design**: Works on all screen sizes
- **Loading States**: Shows loading indicators during data fetching
- **Error Handling**: Graceful error states with user-friendly messages
- **Empty States**: Helpful messages when no FAQ data is available

### 🎨 Visual Design

- **Modern UI**: Clean, professional appearance with hover effects
- **Icons**: Lucide React icons for better visual hierarchy
- **Color Coding**: Blue theme with proper contrast
- **Typography**: Well-structured text hierarchy

## Component Structure

```tsx
interface FQA_sectionProps {
  collage: College; // College data including FAQ information
}
```

## Data Flow

1. **FAQ Data**: Receives FAQ data from the college object
2. **Form Links**: Fetches form links using React Query
3. **Search State**: Manages search term and filtered results
4. **Expansion State**: Tracks which questions are expanded

## Key Sections

### Header Section

- Title and description display
- Question count and last updated information
- Visual icons for better UX

### Search & Controls

- Search input with icon
- Results counter with badges
- Expand/collapse all buttons

### FAQ Items

- Accordion-style question display
- Numbered questions for easy reference
- Markdown-rendered answers
- Creation and update timestamps

### Ask Question Section

- Form links for asking new questions
- Loading and error states
- Responsive grid layout

## React Query Integration

The component uses React Query for efficient data fetching:

```tsx
const {
  data: formLinks,
  isLoading: formsLoading,
  error: formsError,
} = useQuery({
  queryKey: ["faq-forms", collage.id],
  queryFn: () => FAQService.getFormsForCOllageByIdForFAQ(collage.id),
  staleTime: 5 * 60 * 1000, // 5 minutes cache
  retry: 2,
});
```

## Markdown Support

FAQ answers are rendered using the `MarkdownPreview` component which supports:

- **Headers**: H1-H6 with proper styling
- **Lists**: Ordered and unordered lists
- **Links**: External links with proper styling
- **Code**: Inline and block code with syntax highlighting
- **Tables**: Responsive table layouts
- **Blockquotes**: Styled quote blocks
- **Math**: KaTeX math rendering
- **GitHub Flavored Markdown**: Extended markdown features

## Styling

The component uses Tailwind CSS with:

- **Responsive Grid**: Adapts to different screen sizes
- **Hover Effects**: Interactive elements with smooth transitions
- **Color Scheme**: Blue-based theme with proper contrast
- **Typography**: Well-structured text hierarchy
- **Spacing**: Consistent spacing using Tailwind's spacing scale

## Error Handling

The component handles various error scenarios:

- **No FAQ Data**: Shows helpful empty state with form links
- **No Search Results**: Displays search-specific empty state
- **Form Loading Errors**: Shows error message for form loading
- **Network Errors**: Graceful degradation with retry options

## Accessibility

- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: Proper ARIA labels and descriptions
- **Focus Management**: Clear focus indicators
- **Color Contrast**: Meets WCAG accessibility standards

## Performance Optimizations

- **React Query Caching**: Reduces unnecessary API calls
- **Debounced Search**: Efficient search filtering
- **Lazy Loading**: Components load only when needed
- **Memoization**: Prevents unnecessary re-renders

## Usage Example

```tsx
import FQA_section from "@/app/[locale]/(collages)/_collageUserComponents/FQA_section";

// In your component
<FQA_section collage={collegeData} />;
```

## Dependencies

- `@tanstack/react-query`: Data fetching and caching
- `react-markdown`: Markdown rendering
- `lucide-react`: Icons
- `@radix-ui/react-accordion`: Accordion functionality
- `@/components/ui/*`: UI components
- `@/components/markdown-preview`: Markdown rendering component

## Future Enhancements

- **Categories**: Group questions by categories
- **Tags**: Add tagging system for better organization
- **Analytics**: Track popular questions and search terms
- **Export**: Allow users to export FAQ data
- **Print Styles**: Optimized printing layout
- **Dark Mode**: Enhanced dark mode support
- **Animations**: Smooth animations for interactions
