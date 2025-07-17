"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { FormService } from "@/services/form-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
    Plus,
    FileText,
    Users,
    Calendar,
    BarChart3,
    Edit,
    Eye,
    Trash2,
    Copy,
    ExternalLink,
    MoreVertical,
    Settings,
    Download,
    Filter,
    Search,
} from "lucide-react"
import { toast } from "sonner"
import { FormCreateDialog } from "./form-create-dialog"
import { FormEditDialog } from "./form-edit-dialog"
import { FormPreviewDialog } from "./form-preview-dialog"
import { FormSubmissionsDialog } from "./form-submissions-dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import type { FormSection } from "@/types/form"

interface FormManagementDemoProps {
    collegeId: string
}

export function FormManagementDemo({ collegeId }: FormManagementDemoProps) {
    const [isCreateFormOpen, setIsCreateFormOpen] = useState(false)
    const [editingForm, setEditingForm] = useState<FormSection | null>(null)
    const [previewingForm, setPreviewingForm] = useState<FormSection | null>(null)
    const [viewingSubmissions, setViewingSubmissions] = useState<FormSection | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const queryClient = useQueryClient()

    // Fetch forms data
    const {
        data: formsData,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["forms", collegeId],
        queryFn: () => FormService.getFormsWithFields({ collegeId }),
    })

    const forms = formsData?.forms || []

    // Filter forms based on search and status
    const filteredForms = forms.filter((form) => {
        const matchesSearch = form.title.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "all" ||
            (statusFilter === "active" && (form._count?.submissions || 0) > 0) ||
            (statusFilter === "inactive" && (form._count?.submissions || 0) === 0)

        return matchesSearch && matchesStatus
    })

    // Calculate statistics
    const stats = {
        totalForms: forms.length,
        totalSubmissions: forms.reduce((sum, form) => sum + (form._count?.submissions || 0), 0),
        totalFields: forms.reduce((sum, form) => sum + (form._count?.fields || 0), 0),
        activeForms: forms.filter(form => (form._count?.submissions || 0) > 0).length,
    }

    const copyFormLink = (form: FormSection) => {
        const link = `${window.location.origin}/${form.college?.slug}/form/${form.id}`
        navigator.clipboard.writeText(link)
        toast.success("Form link copied to clipboard!")
    }

    const deleteFormMutation = useMutation({
        mutationFn: (formId: string) => FormService.deleteFormSection(formId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["forms", collegeId] })
            toast.success("Form deleted successfully")
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to delete form")
        },
    })

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i}>
                            <CardHeader className="pb-2">
                                <Skeleton className="h-4 w-24" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-8 w-16" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex items-center space-x-4">
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-4 w-48" />
                                    <Skeleton className="h-3 w-32" />
                                </div>
                                <Skeleton className="h-8 w-20" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (isError) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Failed to load forms</h3>
                    <p className="text-muted-foreground text-center mb-4">
                        There was an error loading the forms. Please try again.
                    </p>
                    <Button onClick={() => window.location.reload()}>
                        Retry
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Forms</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalForms}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.activeForms} active forms
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
                        <p className="text-xs text-muted-foreground">
                            Across all forms
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Fields</CardTitle>
                        <Settings className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalFields}</div>
                        <p className="text-xs text-muted-foreground">
                            Form fields created
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Forms</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activeForms}</div>
                        <p className="text-xs text-muted-foreground">
                            With submissions
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Forms Management */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Forms Management</CardTitle>
                        <CardDescription>
                            Create, edit, and manage forms for your college. Track submissions and analyze form performance.
                        </CardDescription>
                    </div>
                    <Button onClick={() => setIsCreateFormOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Form
                    </Button>
                </CardHeader>
                <CardContent>
                    {/* Filters and Search */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search forms..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Forms</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Forms List */}
                    {filteredForms.length === 0 ? (
                        <div className="text-center py-8">
                            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">
                                {forms.length === 0 ? "No forms created yet" : "No forms match your search"}
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                {forms.length === 0
                                    ? "Create your first form to start collecting submissions from students."
                                    : "Try adjusting your search terms or filters."
                                }
                            </p>
                            {forms.length === 0 && (
                                <Button onClick={() => setIsCreateFormOpen(true)}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Your First Form
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredForms.map((form) => (
                                <div
                                    key={form.id}
                                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                                <FileText className="h-5 w-5 text-primary" />
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-medium text-foreground truncate">
                                                {form.title}
                                            </h3>
                                            <div className="flex items-center space-x-4 mt-1">
                                                <p className="text-xs text-muted-foreground">
                                                    {form._count?.fields || 0} fields
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {form._count?.submissions || 0} submissions
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Created {new Date(form.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Badge variant={(form._count?.submissions || 0) > 0 ? "default" : "secondary"}>
                                            {(form._count?.submissions || 0) > 0 ? "Active" : "Inactive"}
                                        </Badge>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => setPreviewingForm(form)}>
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    Preview Form
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setEditingForm(form)}>
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Edit Form
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setViewingSubmissions(form)}>
                                                    <Users className="h-4 w-4 mr-2" />
                                                    View Submissions
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => copyFormLink(form)}>
                                                    <Copy className="h-4 w-4 mr-2" />
                                                    Copy Link
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Download className="h-4 w-4 mr-2" />
                                                    Export Data
                                                </DropdownMenuItem>
                                                <Separator />
                                                <DropdownMenuItem
                                                    onClick={() => deleteFormMutation.mutate(form.id)}
                                                    className="text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete Form
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Dialogs */}
            <FormCreateDialog
                open={isCreateFormOpen}
                onOpenChange={setIsCreateFormOpen}
                collegeId={collegeId}
                onSuccess={() => {
                    queryClient.invalidateQueries({ queryKey: ["forms", collegeId] })
                    setIsCreateFormOpen(false)
                }}
            />

            <FormEditDialog
                open={!!editingForm}
                onOpenChange={(open) => !open && setEditingForm(null)}
                form={editingForm}
                onSuccess={() => {
                    queryClient.invalidateQueries({ queryKey: ["forms", collegeId] })
                    setEditingForm(null)
                }}
            />

            <FormPreviewDialog
                open={!!previewingForm}
                onOpenChange={(open) => !open && setPreviewingForm(null)}
                form={previewingForm}
            />

            <FormSubmissionsDialog
                open={!!viewingSubmissions}
                onOpenChange={(open) => !open && setViewingSubmissions(null)}
                form={viewingSubmissions}
            />
        </div>
    )
} 