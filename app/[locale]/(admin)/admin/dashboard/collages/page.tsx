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
import { useCurrentUser, useIsSuperAdmin } from "@/context/userContext"
import { useAuthStatus } from "@/hooks/use-auth"
import Image from "next/image"
import { CollageCard } from "../../../../../../components/_sharedforms/collage/CollageCard";

const collegeTypeColors = {
    TECHNICAL: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
    MEDICAL: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
    ARTS: "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300",
    OTHER: "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300",
}

function Collages() {
    const locale = useLocale()
    const queryClient = useQueryClient()
    const currentUser = useCurrentUser()
    const isSuperAdmin = useIsSuperAdmin()
    const { isOwner } = useAuthStatus()
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
        queryKey: ["colleges", currentUser?.id, isSuperAdmin],
        queryFn: () => {
            // If superadmin, get all colleges, otherwise get only user's colleges
            if (isSuperAdmin || isOwner) {
                return CollegeService.getColleges()
            } else {
                return CollegeService.getColleges({ createdById: currentUser?.id })
            }
        },
        enabled: !!currentUser, // Only run query when user is loaded
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    })

    const deleteMutation = useMutation({
        mutationFn: (id: string) => CollegeService.deleteCollege(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["colleges", currentUser?.id, isSuperAdmin] })
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

    if (isLoading || !currentUser) {
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
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-white">Colleges</h1>
                        {isSuperAdmin && (
                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                                Super Admin
                            </Badge>
                        )}
                    </div>
                    <p className="text-gray-400 mt-1">
                        {isSuperAdmin
                            ? "Manage all university colleges and their settings"
                            : "Manage your created colleges and their settings"
                        }
                    </p>
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
                        <div className="text-sm text-gray-400">
                            {isSuperAdmin ? "Total Colleges" : "My Colleges"}
                        </div>
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
                            : isSuperAdmin
                                ? "Get started by adding your first college"
                                : "You haven't created any colleges yet. Get started by adding your first college"
                        }
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
                        <CollageCard
                            key={college.id}
                            college={college}
                            isSuperAdmin={isSuperAdmin}
                            onEdit={setEditingCollege}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            {/* Dialogs */}
            <CollegeFormDialog
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                onSuccess={() => {
                    queryClient.invalidateQueries({ queryKey: ["colleges", currentUser?.id, isSuperAdmin] })
                    setIsAddDialogOpen(false)
                }}
            />

            <CollegeFormDialog
                open={!!editingCollege}
                onOpenChange={(open) => !open && setEditingCollege(null)}
                college={editingCollege}
                onSuccess={() => {
                    queryClient.invalidateQueries({ queryKey: ["colleges", currentUser?.id, isSuperAdmin] })
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
