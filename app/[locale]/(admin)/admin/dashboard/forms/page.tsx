"use client"

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { FormService } from "@/services/form-service"
import { CollegeService } from "@/services/collage-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
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
    ToggleLeft,
    Building2,
    Globe,
    Clock,
    CheckCircle,
    XCircle,
} from "lucide-react"
import { toast } from "sonner"
import { FormCreateDialog } from "@/components/_sharedforms/form/form-create-dialog"
import { FormEditDialog } from "@/components/_sharedforms/form/form-edit-dialog"
import { FormPreviewDialog } from "@/components/_sharedforms/form/form-preview-dialog"
import { FormSubmissionsDialog } from "@/components/_sharedforms/form/form-submissions-dialog"
import { FormStatisticsDialog } from "@/components/_sharedforms/form/form-statistics-dialog"
import type { FormSection } from "@/types/form"
import type { College } from "@/types/Collage"
import { useAuthStatus } from '@/hooks/use-auth'

function FormManagementPage() {
    const [isCreateFormOpen, setIsCreateFormOpen] = useState(false)
    const [editingForm, setEditingForm] = useState<FormSection | null>(null)
    const [previewingForm, setPreviewingForm] = useState<FormSection | null>(null)
    const [viewingSubmissions, setViewingSubmissions] = useState<FormSection | null>(null)
    const [viewingStatistics, setViewingStatistics] = useState<FormSection | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [collegeFilter, setCollegeFilter] = useState("all")
    const queryClient = useQueryClient()
    const { isOwner } = useAuthStatus()

    // Fetch all forms data
    const {
        data: formsData,
        isLoading: formsLoading,
        isError: formsError,
    } = useQuery({
        queryKey: ["all-forms"],
        queryFn: () => FormService.getFormsWithFields(),
    })

    // Fetch all colleges for filtering
    const {
        data: colleges,
        isLoading: collegesLoading,
    } = useQuery({
        queryKey: ["colleges"],
        queryFn: () => CollegeService.getColleges(),
    })

    const forms = formsData?.forms || []

    // Filter forms based on search, status, and college
    const filteredForms = forms.filter((form) => {
        const matchesSearch = form.title.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "all" ||
            (statusFilter === "active" && form.active) ||
            (statusFilter === "inactive" && !form.active)
        const matchesCollege = collegeFilter === "all" ||
            (collegeFilter === "custom" && !form.collegeId) ||
            form.collegeId === collegeFilter

        return matchesSearch && matchesStatus && matchesCollege
    })

    // Calculate statistics
    const stats = {
        totalForms: forms.length,
        totalSubmissions: forms.reduce((sum, form) => sum + (form._count?.submissions || 0), 0),
        totalFields: forms.reduce((sum, form) => sum + (form._count?.fields || 0), 0),
        activeForms: forms.filter(form => form.active).length,
        collegesWithForms: new Set(forms.map(form => form.collegeId).filter(Boolean)).size,
    }

    const copyFormLink = (form: FormSection) => {
        const link = form.college?.slug
            ? `${window.location.origin}/${form.college.slug}/form/${form.id}`
            : `${window.location.origin}/form/${form.id}`
        navigator.clipboard.writeText(link)
        toast.success("Form link copied to clipboard!")
    }

    const deleteFormMutation = useMutation({
        mutationFn: (formId: string) => FormService.deleteFormSection(formId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["all-forms"] })
            toast.success("Form deleted successfully")
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to delete form")
        },
    })

    const toggleFormActiveMutation = useMutation({
        mutationFn: (formId: string) => FormService.toggleFormActive(formId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["all-forms"] })
            toast.success("Form status updated successfully")
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to update form status")
        },
    })

    const getCollegeName = (collegeId: string | null) => {
        if (!collegeId) return "Custom Form"
        const college = colleges?.find(c => c.id === collegeId)
        return college?.name || "Unknown College"
    }

    const getCollegeSlug = (collegeId: string) => {
        const college = colleges?.find(c => c.id === collegeId)
        return college?.slug || ""
    }

    if (!isOwner) {
        return <div>You are not authorized to access this page</div>
    }

    if (formsLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Form Management</h1>
                        <p className="text-muted-foreground">Manage all forms across all colleges</p>
                    </div>
                    <Skeleton className="h-10 w-32" />
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-32" />
                    ))}
                </div>
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-24" />
                    ))}
                </div>
            </div>
        )
    }

    if (formsError) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Error loading forms</h3>
                    <p className="text-muted-foreground mb-4">Failed to load forms. Please try again.</p>
                    <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["all-forms"] })}>
                        Retry
                    </Button>
                </div>
            </div>
        )
    }



    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Form Management</h1>
                    <p className="text-muted-foreground">Manage all forms across all colleges</p>
                </div>
                <Button onClick={() => setIsCreateFormOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Form
                </Button>
            </div>

            {/* Statistics Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Forms</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalForms}</div>
                        <p className="text-xs text-muted-foreground">
                            Across all colleges
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Forms</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activeForms}</div>
                        <p className="text-xs text-muted-foreground">
                            Currently accepting submissions
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
                            All time submissions
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
                            Across all forms
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Colleges</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.collegesWithForms}</div>
                        <p className="text-xs text-muted-foreground">
                            With active forms
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Filters & Search
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search forms by title..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={collegeFilter} onValueChange={setCollegeFilter}>
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="Filter by college" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Forms</SelectItem>
                                <SelectItem value="custom">Custom Forms</SelectItem>
                                {colleges?.map((college) => (
                                    <SelectItem key={college.id} value={college.id}>
                                        {college.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Forms List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Forms ({filteredForms.length})</h2>
                    {filteredForms.length === 0 && forms.length > 0 && (
                        <p className="text-sm text-muted-foreground">
                            No forms match your current filters
                        </p>
                    )}
                </div>

                {filteredForms.length === 0 ? (
                    <Card>
                        <CardContent className="flex items-center justify-center h-32">
                            <div className="text-center">
                                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">
                                    {forms.length === 0 ? "No forms created yet" : "No forms found"}
                                </h3>
                                <p className="text-muted-foreground mb-4">
                                    {forms.length === 0
                                        ? "Create your first form to get started"
                                        : "Try adjusting your search or filters"
                                    }
                                </p>
                                {forms.length === 0 && (
                                    <Button onClick={() => setIsCreateFormOpen(true)}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create First Form
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {filteredForms.map((form) => (
                            <Card key={form.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="h-5 w-5 text-primary" />
                                                    <h3 className="text-lg font-semibold">{form.title}</h3>
                                                </div>
                                                <Badge variant={form.active ? "default" : "secondary"}>
                                                    {form.active ? "Active" : "Inactive"}
                                                </Badge>
                                            </div>

                                            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    {form.collegeId ? (
                                                        <Building2 className="h-4 w-4" />
                                                    ) : (
                                                        <Globe className="h-4 w-4" />
                                                    )}
                                                    <span>{getCollegeName(form.collegeId || null)}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Settings className="h-4 w-4" />
                                                    <span>{form._count?.fields || 0} fields</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-4 w-4" />
                                                    <span>{form._count?.submissions || 0} submissions</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4" />
                                                    <span>Created {new Date(form.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>

                                            {form.description && (
                                                <p className="text-sm text-muted-foreground">
                                                    {form.description}
                                                </p>
                                            )}
                                        </div>

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
                                                <DropdownMenuItem onClick={() => setViewingStatistics(form)}>
                                                    <BarChart3 className="h-4 w-4 mr-2" />
                                                    View Statistics
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => copyFormLink(form)}
                                                >
                                                    <Copy className="h-4 w-4 mr-2" />
                                                    Copy Link
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => toggleFormActiveMutation.mutate(form.id)}
                                                    disabled={toggleFormActiveMutation.isPending}
                                                >
                                                    <ToggleLeft className="h-4 w-4 mr-2" />
                                                    {form.active ? "Deactivate" : "Activate"}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        if (confirm("Are you sure you want to delete this form? This action cannot be undone.")) {
                                                            deleteFormMutation.mutate(form.id)
                                                        }
                                                    }}
                                                    className="text-red-600"
                                                    disabled={deleteFormMutation.isPending}
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete Form
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Dialogs */}
            <FormCreateDialog
                open={isCreateFormOpen}
                onOpenChange={setIsCreateFormOpen}
                collegeId="" // Empty for global form creation
                onSuccess={() => {
                    queryClient.invalidateQueries({ queryKey: ["all-forms"] })
                    setIsCreateFormOpen(false)
                }}
                isGlobalForm={true}
                colleges={colleges || []}
            />

            <FormEditDialog
                open={!!editingForm}
                onOpenChange={(open) => !open && setEditingForm(null)}
                form={editingForm}
                onSuccess={() => {
                    queryClient.invalidateQueries({ queryKey: ["all-forms"] })
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

            <FormStatisticsDialog
                open={!!viewingStatistics}
                onOpenChange={(open) => !open && setViewingStatistics(null)}
                form={viewingStatistics}
            />
        </div>
    )
}

export default FormManagementPage