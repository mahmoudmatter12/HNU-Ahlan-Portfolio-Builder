"use client"
import { CollegeService } from "@/services/collage-service"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Eye, Users, FileText, Calendar, MoreVertical } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import type { College } from "@/types/Collage"
import { useLocale } from "next-intl"
import { CollegeFormDialog } from "../../../../../../components/_sharedforms/collage/college-form-dialog"
import { DeleteCollegeDialog } from "../../../../../../components/_sharedforms/collage/delete-college-dialog"

const collegeTypeColors = {
    TECHNICAL: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
    MEDICAL: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
    ARTS: "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300",
    OTHER: "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300",
}

function Collages() {
    const locale = useLocale()
    const queryClient = useQueryClient()
    const [searchQuery, setSearchQuery] = useState("")
    const [typeFilter, setTypeFilter] = useState<string>("all")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [editingCollege, setEditingCollege] = useState<College | null>(null)
    const [deletingCollege, setDeletingCollege] = useState<College | null>(null)

    const {
        data: colleges,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["colleges"],
        queryFn: () => CollegeService.getColleges(),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    })

    const deleteMutation = useMutation({
        mutationFn: (id: string) => CollegeService.deleteCollege(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["colleges"] })
            toast.success("College deleted successfully")
            setDeletingCollege(null)
        },
        onError: (error) => {
            toast.error("Failed to delete college")
            console.error("Delete error:", error)
        },
    })

    const filteredColleges =
        colleges?.filter((college) => {
            const matchesSearch =
                college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                college.slug.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesType = typeFilter === "all" || college.type === typeFilter
            return matchesSearch && matchesType
        }) || []

    const handleDelete = (college: College) => {
        setDeletingCollege(college)
    }

    const confirmDelete = () => {
        if (deletingCollege) {
            deleteMutation.mutate(deletingCollege.id)
        }
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-white">Colleges</h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i} className="animate-pulse bg-gray-900/50 border-gray-800">
                            <CardHeader>
                                <div className="h-6 bg-gray-800 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-800 rounded w-1/2"></div>
                            </CardHeader>
                            <CardContent>
                                <div className="h-4 bg-gray-800 rounded w-full mb-2"></div>
                                <div className="h-4 bg-gray-800 rounded w-2/3"></div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <div className="text-red-400 text-lg font-semibold">Error loading colleges</div>
                <div className="text-gray-400">{error?.toString()}</div>
                <Button onClick={() => window.location.reload()} className="bg-gray-800 hover:bg-gray-700 text-white">Try Again</Button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Colleges</h1>
                    <p className="text-gray-400 mt-1">Manage university colleges and their settings</p>
                </div>
                <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white">
                    <Plus className="h-4 w-4" />
                    Add College
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Search colleges..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-400 focus:border-gray-600 focus:ring-gray-600"
                    />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full sm:w-48 bg-gray-900/50 border-gray-700 text-white focus:border-gray-600 focus:ring-gray-600">
                        <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700">
                        <SelectItem value="all" className="text-gray-300 hover:text-white hover:bg-gray-800">All Types</SelectItem>
                        <SelectItem value="TECHNICAL" className="text-gray-300 hover:text-white hover:bg-gray-800">Technical</SelectItem>
                        <SelectItem value="MEDICAL" className="text-gray-300 hover:text-white hover:bg-gray-800">Medical</SelectItem>
                        <SelectItem value="ARTS" className="text-gray-300 hover:text-white hover:bg-gray-800">Arts</SelectItem>
                        <SelectItem value="OTHER" className="text-gray-300 hover:text-white hover:bg-gray-800">Other</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <Card className="bg-gray-900/50 border-gray-800">
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-white">{colleges?.length || 0}</div>
                        <div className="text-sm text-gray-400">Total Colleges</div>
                    </CardContent>
                </Card>
                <Card className="bg-gray-900/50 border-gray-800">
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-white">{colleges?.filter((c) => c.type === "TECHNICAL").length || 0}</div>
                        <div className="text-sm text-gray-400">Technical</div>
                    </CardContent>
                </Card>
                <Card className="bg-gray-900/50 border-gray-800">
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-white">{colleges?.filter((c) => c.type === "MEDICAL").length || 0}</div>
                        <div className="text-sm text-gray-400">Medical</div>
                    </CardContent>
                </Card>
                <Card className="bg-gray-900/50 border-gray-800">
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-white">{colleges?.filter((c) => c.type === "ARTS").length || 0}</div>
                        <div className="text-sm text-gray-400">Arts</div>
                    </CardContent>
                </Card>
            </div>

            {/* Colleges Grid */}
            {filteredColleges.length === 0 ? (
                <Card className="p-12 text-center bg-gray-900/50 border-gray-800">
                    <div className="text-gray-400 text-lg mb-2">No colleges found</div>
                    <div className="text-gray-500 mb-4">
                        {searchQuery || typeFilter !== "all"
                            ? "Try adjusting your search or filters"
                            : "Get started by adding your first college"}
                    </div>
                    {!searchQuery && typeFilter === "all" && (
                        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-gray-800 hover:bg-gray-700 text-white">
                            <Plus className="h-4 w-4 mr-2" />
                            Add College
                        </Button>
                    )}
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredColleges.map((college) => (
                        <Card key={college.id} className="hover:shadow-lg transition-shadow duration-200 bg-gray-900/50 border-gray-800 hover:border-gray-700">
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg line-clamp-1 text-white">{college.name}</CardTitle>
                                        <CardDescription className="mt-1 text-gray-400">/{college.slug}</CardDescription>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-800">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="bg-gray-900 border-gray-700">
                                            <DropdownMenuItem asChild className="text-gray-300 hover:text-white hover:bg-gray-800">
                                                <Link href={`/${locale}/admin/dashboard/collages/${college.slug}`}>
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    View Details
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setEditingCollege(college)} className="text-gray-300 hover:text-white hover:bg-gray-800">
                                                <Edit className="h-4 w-4 mr-2" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleDelete(college)}
                                                className="text-red-400 hover:text-red-300 hover:bg-gray-800"
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <Badge className={collegeTypeColors[college.type]} variant="secondary">
                                    {college.type}
                                </Badge>
                            </CardHeader>

                            <CardContent className="pb-3">
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div className="flex items-center gap-1">
                                        <Users className="h-4 w-4 text-gray-400" />
                                        <span className="text-gray-300">{college._count?.users || 0}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <FileText className="h-4 w-4 text-gray-400" />
                                        <span className="text-gray-300">{college._count?.sections || 0}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                        <span className="text-gray-300">{college._count?.forms || 0}</span>
                                    </div>
                                </div>

                                {college.createdBy && (
                                    <div className="mt-3 text-xs text-gray-500">
                                        Created by {college.createdBy.name || college.createdBy.email}
                                    </div>
                                )}
                            </CardContent>

                            <CardFooter className="pt-3">
                                <div className="flex gap-2 w-full">
                                    <Button asChild variant="outline" size="sm" className="flex-1 bg-transparent border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800">
                                        <Link href={`/${locale}/admin/dashboard/collages/${college.slug}`}>
                                            <Eye className="h-4 w-4 mr-1" />
                                            View
                                        </Link>
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => setEditingCollege(college)} className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            {/* Dialogs */}
            <CollegeFormDialog
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                onSuccess={() => {
                    queryClient.invalidateQueries({ queryKey: ["colleges"] })
                    setIsAddDialogOpen(false)
                }}
            />

            <CollegeFormDialog
                open={!!editingCollege}
                onOpenChange={(open) => !open && setEditingCollege(null)}
                college={editingCollege}
                onSuccess={() => {
                    queryClient.invalidateQueries({ queryKey: ["colleges"] })
                    setEditingCollege(null)
                }}
            />

            <DeleteCollegeDialog
                open={!!deletingCollege}
                onOpenChange={(open) => !open && setDeletingCollege(null)}
                college={deletingCollege}
                onConfirm={confirmDelete}
                isDeleting={deleteMutation.isPending}
            />
        </div>
    )
}

export default Collages
