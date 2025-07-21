"use client"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { CollegeService } from "@/services/collage-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    Plus,
    Edit,
    Trash2,
    Image as ImageIcon,
    Video,
    Link as LinkIcon,
    FileText,
    Eye,
} from "lucide-react"
import { toast } from "sonner"
import { ProgramFormDialog } from "./program-form-dialog"
import { DeleteProgramDialog } from "./delete-program-dialog"
import { ProgramDescriptionDialog } from "./program-description-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react"
import type { Program, ProgramDescription } from "@/types/program"
import { MarkdownPreview } from "@/components/markdown-preview"

interface ProgramManagementProps {
    collegeId: string
}

export function ProgramManagement({ collegeId }: ProgramManagementProps) {
    const queryClient = useQueryClient()
    const [editingProgram, setEditingProgram] = useState<Program | null>(null)
    const [deletingProgram, setDeletingProgram] = useState<Program | null>(null)
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [viewingDescription, setViewingDescription] = useState<ProgramDescription | null>(null)

    const {
        data: programs,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["programs", collegeId],
        queryFn: () => CollegeService.getPrograms(collegeId),
    })

    const deleteMutation = useMutation({
        mutationFn: (programId: string) => CollegeService.deleteProgram(collegeId, programId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["programs", collegeId] })
            toast.success("Program deleted successfully")
            setDeletingProgram(null)
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to delete program")
        },
    })

    const handleDelete = (program: Program) => {
        setDeletingProgram(program)
    }

    const confirmDelete = () => {
        if (deletingProgram) {
            deleteMutation.mutate(deletingProgram.id)
        }
    }

    const getDescriptionStats = (program: Program) => {
        const descriptions = program.description || []
        let totalImages = 0
        let totalLinks = 0
        let totalVideos = 0

        descriptions.forEach(desc => {
            totalImages += desc.image?.length || 0
            totalLinks += desc.link?.length || 0
            totalVideos += desc.video?.length || 0
        })

        return { totalImages, totalLinks, totalVideos, totalDescriptions: descriptions.length }
    }

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <CardHeader>
                            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-full"></div>
                                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    if (isError) {
        return (
            <div className="text-center py-8">
                <div className="text-red-500 text-lg font-semibold">Failed to load programs</div>
                <div className="text-gray-600">{error?.toString()}</div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Programs</h3>
                    <p className="text-sm text-gray-600">
                        Manage college programs and their detailed descriptions
                    </p>
                </div>
                <Button onClick={() => setIsCreateOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Program
                </Button>
            </div>

            {/* Programs List */}
            <div className="space-y-4">
                {programs && programs.length > 0 ? (
                    programs.map((program) => {
                        const stats = getDescriptionStats(program)
                        return (
                            <Card key={program.id} className="hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-lg">{program.name}</CardTitle>
                                            <CardDescription className="mt-1">
                                                /{program.slug}
                                            </CardDescription>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => setEditingProgram(program)}>
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Edit Program
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDelete(program)} className="text-red-600 focus:text-red-600">
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete Program
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {/* Stats */}
                                        <div className="flex flex-wrap gap-2">
                                            <Badge variant="outline" className="text-xs">
                                                <FileText className="h-3 w-3 mr-1" />
                                                {stats.totalDescriptions} descriptions
                                            </Badge>
                                            <Badge variant="outline" className="text-xs">
                                                <ImageIcon className="h-3 w-3 mr-1" />
                                                {stats.totalImages} images
                                            </Badge>
                                            <Badge variant="outline" className="text-xs">
                                                <LinkIcon className="h-3 w-3 mr-1" />
                                                {stats.totalLinks} links
                                            </Badge>
                                            <Badge variant="outline" className="text-xs">
                                                <Video className="h-3 w-3 mr-1" />
                                                {stats.totalVideos} videos
                                            </Badge>
                                        </div>

                                        {/* Description Preview */}
                                        {program.description && program.description.length > 0 && (
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Program Descriptions
                                                    </h4>
                                                    <Badge variant="secondary" className="text-xs">
                                                        {program.description.length} description{program.description.length !== 1 ? 's' : ''}
                                                    </Badge>
                                                </div>
                                                <div className="space-y-3">
                                                    {program.description.slice(0, 1).map((desc, index) => (
                                                        <div key={index} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                                                            <div className="flex items-start justify-between mb-3">
                                                                <h5 className="font-semibold text-gray-900 dark:text-gray-100">
                                                                    {desc.title}
                                                                </h5>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => setViewingDescription(desc)}
                                                                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                                                                >
                                                                    <Eye className="h-4 w-4 mr-1" />
                                                                    View Full
                                                                </Button>
                                                            </div>
                                                            <MarkdownPreview
                                                                content={desc.description}
                                                            />
                                                        </div>
                                                    ))}
                                                    {program.description.length > 1 && (
                                                        <div className="text-center py-3">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => setViewingDescription(program.description![0])}
                                                                className="text-gray-600 hover:text-gray-700"
                                                            >
                                                                <FileText className="h-4 w-4 mr-2" />
                                                                View All {program.description.length} Descriptions
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 pt-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setEditingProgram(program)}
                                            >
                                                <Edit className="h-3 w-3 mr-1" />
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDelete(program)}
                                                className="text-red-600 hover:text-red-600"
                                            >
                                                <Trash2 className="h-3 w-3 mr-1" />
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })
                ) : (
                    <Card>
                        <CardContent className="text-center py-8">
                            <div className="text-gray-500">
                                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <h3 className="text-lg font-medium mb-2">No programs yet</h3>
                                <p className="text-sm mb-4">
                                    Create your first program to get started
                                </p>
                                <Button onClick={() => setIsCreateOpen(true)}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Program
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Dialogs */}
            <ProgramFormDialog
                open={isCreateOpen || !!editingProgram}
                onOpenChange={(open) => {
                    if (!open) {
                        setIsCreateOpen(false)
                        setEditingProgram(null)
                    }
                }}
                program={editingProgram}
                collegeId={collegeId}
                onSuccess={() => {
                    queryClient.invalidateQueries({ queryKey: ["programs", collegeId] })
                    setIsCreateOpen(false)
                    setEditingProgram(null)
                }}
            />

            <DeleteProgramDialog
                open={!!deletingProgram}
                onOpenChange={(open) => !open && setDeletingProgram(null)}
                program={deletingProgram}
                collegeId={collegeId}
                onConfirm={confirmDelete}
                isDeleting={deleteMutation.isPending}
            />

            <ProgramDescriptionDialog
                open={!!viewingDescription}
                onOpenChange={(open) => !open && setViewingDescription(null)}
                description={viewingDescription}
            />
        </div>
    )
} 