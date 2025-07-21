"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FAQDisplay } from "@/components/_sharedforms/faq/faq-display"
import { FAQManagementDialog } from "@/components/_sharedforms/faq/faq-management-dialog"
import { FAQItemDialog } from "@/components/_sharedforms/faq/faq-item-dialog"
import { FAQImportDialog } from "@/components/_sharedforms/faq/faq-import-dialog"
import { FAQGenerationDialog } from "@/components/_sharedforms/faq/faq-generation-dialog"
import { FAQSubmissionsDialog } from "@/components/_sharedforms/faq/faq-submissions-dialog"
import { FileText, Plus, Upload, Wand2, Users, Settings } from "lucide-react"
import type { FAQData, FAQItem } from "@/types/faq"

export default function FAQDemoPage() {
    const [faqData, setFaqData] = useState<FAQData>({
        items: [
            {
                id: "1",
                question: "What programs does the college offer?",
                answer: "Our college offers a wide range of programs including:\n\n- **Computer Science**\n- **Engineering**\n- **Business Administration**\n- **Arts and Design**\n\nEach program is designed to provide students with practical skills and theoretical knowledge.",
                order: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: "2",
                question: "How do I apply for admission?",
                answer: "To apply for admission, follow these steps:\n\n1. **Complete the online application form**\n2. **Submit required documents** (transcripts, letters of recommendation)\n3. **Pay the application fee**\n4. **Schedule an interview** (if required)\n5. **Wait for admission decision**\n\nFor more information, contact our admissions office.",
                order: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: "3",
                question: "What are the tuition fees?",
                answer: "Tuition fees vary by program and student status:\n\n| Program | Domestic Students | International Students |\n|---------|-------------------|----------------------|\n| Computer Science | $8,000/year | $12,000/year |\n| Engineering | $9,000/year | $13,000/year |\n| Business | $7,500/year | $11,500/year |\n\n*Fees are subject to change annually.*",
                order: 2,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ],
        title: "Frequently Asked Questions",
        description: "Find answers to common questions about our college",
        lastUpdated: new Date()
    })

    const [showManagementDialog, setShowManagementDialog] = useState(false)
    const [showItemDialog, setShowItemDialog] = useState(false)
    const [showImportDialog, setShowImportDialog] = useState(false)
    const [showGenerationDialog, setShowGenerationDialog] = useState(false)
    const [showSubmissionsDialog, setShowSubmissionsDialog] = useState(false)
    const [editingItem, setEditingItem] = useState<FAQItem | null>(null)

    const handleAddItem = () => {
        setEditingItem(null)
        setShowItemDialog(true)
    }

    const handleEditItem = (item: FAQItem) => {
        setEditingItem(item)
        setShowItemDialog(true)
    }

    const handleItemSuccess = () => {
        // In a real app, this would update the FAQ data
        setShowItemDialog(false)
    }

    const handleManagementSuccess = () => {
        // In a real app, this would refresh the FAQ data
        setShowManagementDialog(false)
    }

    return (
        <div className="container mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">FAQ System Demo</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    This page demonstrates the comprehensive FAQ management system with three approaches:
                    manual entry, CSV/Excel import, and automatic form generation.
                </p>
            </div>

            {/* Demo Controls */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Demo Controls
                    </CardTitle>
                    <CardDescription>
                        Test different aspects of the FAQ system
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Button onClick={() => setShowManagementDialog(true)} className="h-auto p-4 flex-col gap-2">
                            <FileText className="h-6 w-6" />
                            <span>Full Management</span>
                            <span className="text-xs opacity-75">Complete FAQ management</span>
                        </Button>

                        <Button onClick={handleAddItem} variant="outline" className="h-auto p-4 flex-col gap-2">
                            <Plus className="h-6 w-6" />
                            <span>Add Item</span>
                            <span className="text-xs opacity-75">Manual entry</span>
                        </Button>

                        <Button onClick={() => setShowImportDialog(true)} variant="outline" className="h-auto p-4 flex-col gap-2">
                            <Upload className="h-6 w-6" />
                            <span>Import FAQ</span>
                            <span className="text-xs opacity-75">CSV/Excel import</span>
                        </Button>

                        <Button onClick={() => setShowGenerationDialog(true)} variant="outline" className="h-auto p-4 flex-col gap-2">
                            <Wand2 className="h-6 w-6" />
                            <span>Generate Form</span>
                            <span className="text-xs opacity-75">Auto form creation</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{faqData.items.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Active FAQ items
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {faqData.lastUpdated ? new Date(faqData.lastUpdated).toLocaleDateString() : "Never"}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Most recent change
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Actions</CardTitle>
                        <Settings className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setShowSubmissionsDialog(true)}
                                className="w-full"
                            >
                                View Submissions
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* FAQ Display */}
            <Card>
                <CardHeader>
                    <CardTitle>Public FAQ Display</CardTitle>
                    <CardDescription>
                        This is how the FAQ appears to public users
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <FAQDisplay
                        faqData={faqData}
                        title="Demo College FAQ"
                        description="This is a demonstration of the FAQ system"
                    />
                </CardContent>
            </Card>

            {/* Sample Data */}
            <Card>
                <CardHeader>
                    <CardTitle>Sample FAQ Items</CardTitle>
                    <CardDescription>
                        Current FAQ items in the system
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {faqData.items.map((item, index) => (
                            <div key={item.id} className="border rounded-lg p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge variant="secondary">#{index + 1}</Badge>
                                            <h4 className="font-medium">{item.question}</h4>
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {item.answer.replace(/[#*`]/g, '').substring(0, 100)}...
                                        </p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEditItem(item)}
                                    >
                                        Edit
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Dialogs */}
            <FAQManagementDialog
                open={showManagementDialog}
                onOpenChange={setShowManagementDialog}
                collegeId="demo-college-id"
                collegeName="Demo College"
            />

            <FAQItemDialog
                open={showItemDialog}
                onOpenChange={setShowItemDialog}
                item={editingItem}
                collegeId="demo-college-id"
                onSuccess={handleItemSuccess}
            />

            <FAQImportDialog
                open={showImportDialog}
                onOpenChange={setShowImportDialog}
                collegeId="demo-college-id"
                onSuccess={handleItemSuccess}
            />

            <FAQGenerationDialog
                open={showGenerationDialog}
                onOpenChange={setShowGenerationDialog}
                collegeId="demo-college-id"
                collegeName="Demo College"
                onSuccess={handleItemSuccess}
            />

            <FAQSubmissionsDialog
                open={showSubmissionsDialog}
                onOpenChange={setShowSubmissionsDialog}
                collegeId="demo-college-id"
                onSuccess={handleItemSuccess}
            />
        </div>
    )
} 