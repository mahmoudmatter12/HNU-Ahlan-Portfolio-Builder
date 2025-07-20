"use client"
import { useState } from "react"
import { MarkdownPreview } from "@/components/markdown-preview"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, Tab } from "@heroui/tabs"
import {
    FileText,
    Code,
    Image as ImageIcon,
    Table,
    List,
    Quote,
    Calculator,
    Eye,
    EyeOff,
    Copy,
    BookOpen,
    Settings
} from "lucide-react"

const sampleMarkdown = `# Enhanced Markdown Preview Demo

## Features Overview

This enhanced markdown preview includes:

### 🎨 **Modern Styling**
- Beautiful typography with proper spacing
- Dark/light theme support
- Responsive design
- Custom component styling

### 📚 **Table of Contents**
- Automatic heading extraction
- Smooth scrolling navigation
- Active section highlighting
- Collapsible sidebar

### 💻 **Code Highlighting**
- Syntax highlighting for 100+ languages
- Line numbers
- Copy to clipboard functionality
- Multiple themes support

### 📊 **Enhanced Content**
- GitHub Flavored Markdown (GFM)
- Mathematical expressions with KaTeX
- Tables with proper styling
- Task lists and checkboxes

---

## Code Examples

### JavaScript
\`\`\`javascript
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // 55
\`\`\`

### Python
\`\`\`python
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)

# Example usage
numbers = [3, 6, 8, 10, 1, 2, 1]
sorted_numbers = quick_sort(numbers)
print(sorted_numbers)  # [1, 1, 2, 3, 6, 8, 10]
\`\`\`

### CSS
\`\`\`css
.markdown-preview {
    --primary-color: #3b82f6;
    --secondary-color: #64748b;
    --background-color: #ffffff;
    --text-color: #1f2937;
    
    font-family: 'Inter', system-ui, sans-serif;
    line-height: 1.6;
    color: var(--text-color);
    background: var(--background-color);
}

.markdown-preview h1 {
    font-size: 2.25rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: var(--primary-color);
}
\`\`\`

## Mathematical Expressions

### Inline Math
The quadratic formula is: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$

### Block Math
The Euler's identity is one of the most beautiful equations in mathematics:

$$e^{i\\pi} + 1 = 0$$

### Complex Equations
The Maxwell's equations in differential form:

$$\\nabla \\cdot \\mathbf{E} = \\frac{\\rho}{\\epsilon_0}$$

$$\\nabla \\cdot \\mathbf{B} = 0$$

$$\\nabla \\times \\mathbf{E} = -\\frac{\\partial \\mathbf{B}}{\\partial t}$$

$$\\nabla \\times \\mathbf{B} = \\mu_0\\mathbf{J} + \\mu_0\\epsilon_0\\frac{\\partial \\mathbf{E}}{\\partial t}$$

## Tables

| Feature | Description | Status |
|---------|-------------|--------|
| Syntax Highlighting | Code blocks with language-specific colors | ✅ Complete |
| Math Rendering | LaTeX/KaTeX support for equations | ✅ Complete |
| Table of Contents | Auto-generated navigation | ✅ Complete |
| Copy Code | One-click code copying | ✅ Complete |
| Responsive Design | Works on all screen sizes | ✅ Complete |
| Dark Mode | Theme switching support | ✅ Complete |

## Task Lists

- [x] Implement syntax highlighting
- [x] Add table of contents
- [x] Support mathematical expressions
- [x] Add copy functionality
- [x] Implement responsive design
- [ ] Add more themes
- [ ] Support for diagrams
- [ ] Export to PDF

## Blockquotes

> "The best way to predict the future is to implement it."
> 
> — Alan Kay

> **Note:** This is a comprehensive markdown preview component that supports all modern markdown features including:
> - GitHub Flavored Markdown
> - Mathematical expressions
> - Syntax highlighting
> - Table of contents
> - And much more!

## Links and Images

Visit [GitHub](https://github.com) for more information.

![Sample Image]()

## Lists

### Unordered List
- First item
- Second item
  - Nested item
  - Another nested item
- Third item

### Ordered List
1. First step
2. Second step
   1. Sub-step A
   2. Sub-step B
3. Third step

## Horizontal Rules

---

## Metadata Support

This component also supports metadata display including:
- Reading time estimation
- Word count
- Author information
- Publication date
- Tags and categories

---

*This demo showcases the comprehensive features of the enhanced markdown preview component.*`

export function MarkdownPreviewDemo() {
    const [showTableOfContents, setShowTableOfContents] = useState(true)
    const [showLineNumbers, setShowLineNumbers] = useState(true)
    const [allowCopy, setAllowCopy] = useState(true)
    const [allowExpand, setAllowExpand] = useState(true)

    const demoMetadata = {
        author: "Markdown Preview Team",
        date: new Date().toISOString(),
        tags: ["Demo", "Markdown", "React", "TypeScript"],
        readingTime: 8,
        wordCount: 1200
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Enhanced Markdown Preview Demo
                    </CardTitle>
                    <CardDescription>
                        Showcasing all features of the modern markdown preview component
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="outline" className="flex items-center gap-1">
                            <Code className="h-3 w-3" />
                            Syntax Highlighting
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                            <Calculator className="h-3 w-3" />
                            Math Support
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            Table of Contents
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                            <Copy className="h-3 w-3" />
                            Copy Code
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                            <Table className="h-3 w-3" />
                            Enhanced Tables
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                            <List className="h-3 w-3" />
                            Task Lists
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                            <Quote className="h-3 w-3" />
                            Blockquotes
                        </Badge>
                    </div>

                    <Tabs aria-label="Markdown preview options" className="space-y-4">
                        <Tab title="Preview">
                            <MarkdownPreview
                                content={sampleMarkdown}
                                showTableOfContents={showTableOfContents}
                                showLineNumbers={showLineNumbers}
                                allowCopy={allowCopy}
                                allowExpand={allowExpand}
                                metadata={demoMetadata}
                            />
                        </Tab>
                        <Tab title="Settings">
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Settings className="h-5 w-5" />
                                    Preview Settings
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm font-medium">
                                            <BookOpen className="h-4 w-4" />
                                            Table of Contents
                                        </label>
                                        <Button
                                            variant={showTableOfContents ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setShowTableOfContents(!showTableOfContents)}
                                            className="w-full justify-start"
                                        >
                                            {showTableOfContents ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                                            {showTableOfContents ? "Enabled" : "Disabled"}
                                        </Button>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm font-medium">
                                            <Code className="h-4 w-4" />
                                            Line Numbers
                                        </label>
                                        <Button
                                            variant={showLineNumbers ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setShowLineNumbers(!showLineNumbers)}
                                            className="w-full justify-start"
                                        >
                                            {showLineNumbers ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                                            {showLineNumbers ? "Enabled" : "Disabled"}
                                        </Button>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm font-medium">
                                            <Copy className="h-4 w-4" />
                                            Copy Code
                                        </label>
                                        <Button
                                            variant={allowCopy ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setAllowCopy(!allowCopy)}
                                            className="w-full justify-start"
                                        >
                                            {allowCopy ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                                            {allowCopy ? "Enabled" : "Disabled"}
                                        </Button>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm font-medium">
                                            <Eye className="h-4 w-4" />
                                            Fullscreen Mode
                                        </label>
                                        <Button
                                            variant={allowExpand ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setAllowExpand(!allowExpand)}
                                            className="w-full justify-start"
                                        >
                                            {allowExpand ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                                            {allowExpand ? "Enabled" : "Disabled"}
                                        </Button>
                                    </div>
                                </div>

                                <div className="pt-4 border-t">
                                    <h4 className="text-sm font-medium mb-2">Features Included:</h4>
                                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                        <li>• GitHub Flavored Markdown (GFM) support</li>
                                        <li>• Mathematical expressions with KaTeX</li>
                                        <li>• Syntax highlighting for 100+ languages</li>
                                        <li>• Automatic table of contents generation</li>
                                        <li>• Copy code functionality</li>
                                        <li>• Responsive design with dark/light themes</li>
                                        <li>• Metadata display (reading time, word count, etc.)</li>
                                        <li>• Enhanced typography and spacing</li>
                                        <li>• Custom component styling</li>
                                        <li>• Accessibility features</li>
                                    </ul>
                                </div>
                            </div>
                        </Tab>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
} 