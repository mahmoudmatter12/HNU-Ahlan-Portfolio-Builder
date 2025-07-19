# Markdown Rendering in Program Descriptions

This document demonstrates how markdown content is rendered in program descriptions.

## Features

The markdown renderer supports:

### Headers

# H1 Header

## H2 Header

### H3 Header

### Text Formatting

- **Bold text** using `**text**`
- _Italic text_ using `*text*`
- `Inline code` using backticks
- ~~Strikethrough~~ using `~~text~~`

### Lists

- Unordered list item 1
- Unordered list item 2
  - Nested item
  - Another nested item

1. Ordered list item 1
2. Ordered list item 2
3. Ordered list item 3

### Links

[Link text](https://example.com)

### Code Blocks

```javascript
function hello() {
  console.log("Hello, World!");
}
```

### Blockquotes

> This is a blockquote
> It can span multiple lines

### Tables

| Header 1 | Header 2 | Header 3 |
| -------- | -------- | -------- |
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |

## Usage in Program Management

When creating or editing programs, you can use markdown in the description fields. The content will be:

1. **Preview Mode**: Shows truncated content (first 200 characters) with proper markdown rendering
2. **Full View**: Click "View full description" to see the complete markdown content in a dialog
3. **Styling**: Uses Tailwind Typography classes for consistent styling

## Example Program Description

Here's an example of how a program description might look:

# Computer Science Program

## Overview

Our **Computer Science** program provides students with a comprehensive foundation in software development, algorithms, and computer systems.

## Curriculum Highlights

- **Core Courses**: Data Structures, Algorithms, Database Systems
- **Electives**: Machine Learning, Web Development, Mobile Apps
- **Projects**: Real-world applications and research opportunities

## Career Opportunities

Graduates can pursue careers in:

1. Software Development
2. Data Science
3. Cybersecurity
4. Artificial Intelligence

> _"The best way to predict the future is to invent it."_ - Alan Kay

For more information, visit our [program website](https://example.com/cs-program).
