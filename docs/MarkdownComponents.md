# Markdown Components

This document describes the markdown components available in the application for editing and displaying markdown content.

## Components

### MarkdownEditor

A rich markdown editor component that provides a toolbar and live preview.

**Location:** `components/ui/markdown-editor.tsx`

**Props:**
- `value: string` - The current markdown content
- `onChange: (value: string) => void` - Callback when content changes
- `height?: number` - Editor height in pixels (default: 200)
- `placeholder?: string` - Placeholder text (default: "Enter your content here...")
- `className?: string` - Additional CSS classes

**Usage:**
```tsx
import { MarkdownEditor } from "@/components/ui/markdown-editor"

<MarkdownEditor
  value={content}
  onChange={setContent}
  height={300}
  placeholder="Enter your markdown content..."
/>
```

### MarkdownPreview

A component for displaying rendered markdown content.

**Location:** `components/ui/markdown-preview.tsx`

**Props:**
- `content: string` - The markdown content to render
- `className?: string` - Additional CSS classes

**Usage:**
```tsx
import { MarkdownPreview } from "@/components/ui/markdown-preview"

<MarkdownPreview content={markdownContent} />
```

## Features

### Markdown Editor Features
- **Toolbar**: Rich formatting toolbar with buttons for common markdown syntax
- **Live Preview**: See rendered content as you type
- **Syntax Highlighting**: Proper highlighting for markdown syntax
- **Keyboard Shortcuts**: Common shortcuts for formatting
- **Dark Mode Support**: Automatically adapts to dark/light theme

### Markdown Preview Features
- **Responsive Design**: Adapts to different screen sizes
- **Theme Integration**: Uses application's color scheme
- **Typography**: Proper typography with Tailwind CSS prose classes
- **Empty State**: Shows helpful message when no content is provided

## Styling

The markdown components use Tailwind CSS with the `@tailwindcss/typography` plugin for consistent styling. Custom prose styles are defined in `app/[locale]/globals.css` to match the application's design system.

### Custom Prose Styles
- Headings use the application's font weights and colors
- Links use the primary color with hover effects
- Code blocks have proper background and padding
- Blockquotes have left border styling
- Lists and paragraphs have appropriate spacing and colors

## Dependencies

- `@uiw/react-md-editor` - Rich markdown editor
- `react-markdown` - Markdown rendering
- `@tailwindcss/typography` - Typography plugin for Tailwind CSS

## Example Implementation

See `components/_sharedforms/project/project-form-dialog.tsx` for a complete example of how to use both components together with tabs for editing and previewing markdown content. 