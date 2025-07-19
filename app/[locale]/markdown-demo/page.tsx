"use client"
import { MarkdownPreviewDemo } from "@/components/_sharedforms/program/markdown-preview-demo"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    FileText,
    Code,
    Palette,
    BookOpen,
    Copy,
    Eye,
    Zap,
    CheckCircle
} from "lucide-react"

export default function MarkdownDemoPage() {
    return (
        <div className="container mx-auto py-8 px-4">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                        Enhanced Markdown Preview
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                        A comprehensive, modern markdown preview component with advanced features,
                        beautiful styling, and excellent user experience.
                    </p>

                    <div className="flex flex-wrap justify-center gap-2 mt-6">
                        <Badge variant="default" className="flex items-center gap-1">
                            <Code className="h-3 w-3" />
                            Syntax Highlighting
                        </Badge>
                        <Badge variant="default" className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            Table of Contents
                        </Badge>
                        <Badge variant="default" className="flex items-center gap-1">
                            <Copy className="h-3 w-3" />
                            Copy Code
                        </Badge>
                        <Badge variant="default" className="flex items-center gap-1">
                            <Palette className="h-3 w-3" />
                            Dark/Light Theme
                        </Badge>
                        <Badge variant="default" className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            Responsive
                        </Badge>
                        <Badge variant="default" className="flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            Fast & Modern
                        </Badge>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                    <Code className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <CardTitle className="text-lg">Syntax Highlighting</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 dark:text-gray-400">
                                Support for 100+ programming languages with beautiful syntax highlighting
                                and line numbers.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                                    <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
                                </div>
                                <CardTitle className="text-lg">Table of Contents</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 dark:text-gray-400">
                                Automatic generation of table of contents with smooth scrolling
                                and active section highlighting.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                                    <Copy className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <CardTitle className="text-lg">Copy Code</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 dark:text-gray-400">
                                One-click code copying with visual feedback and clipboard integration.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                                    <Palette className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                </div>
                                <CardTitle className="text-lg">Theme Support</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 dark:text-gray-400">
                                Beautiful dark and light themes with automatic system preference detection.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                                    <FileText className="h-5 w-5 text-red-600 dark:text-red-400" />
                                </div>
                                <CardTitle className="text-lg">Math Support</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 dark:text-gray-400">
                                Full LaTeX/KaTeX support for mathematical expressions and equations.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
                                    <CheckCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <CardTitle className="text-lg">GitHub Flavored</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 dark:text-gray-400">
                                Full GitHub Flavored Markdown support including tables, task lists, and more.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Demo Component */}
                <MarkdownPreviewDemo />

                {/* Usage Example */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Code className="h-5 w-5" />
                            Usage Example
                        </CardTitle>
                        <CardDescription>
                            Simple implementation of the enhanced markdown preview component
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                            <pre>{`import { MarkdownPreview } from "@/components/ui/markdown-preview"

function MyComponent() {
  const markdownContent = \`# Hello World
  
  This is **bold** and *italic* text.
  
  \`\`\`javascript
  console.log("Hello, World!")
  \`\`\`
  \`

  return (
    <MarkdownPreview
      content={markdownContent}
      showTableOfContents={true}
      showLineNumbers={true}
      allowCopy={true}
      allowExpand={true}
      metadata={{
        author: "John Doe",
        date: new Date().toISOString(),
        tags: ["Example", "Markdown"],
        readingTime: 2,
        wordCount: 50
      }}
    />
  )
}`}</pre>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
} 