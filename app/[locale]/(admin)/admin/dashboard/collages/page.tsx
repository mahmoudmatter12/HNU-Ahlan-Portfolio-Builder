"use client"
import { CollegeService } from "@/services/collage.service"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Eye, Users, FileText, Calendar, MoreVertical, Crown, UserCheck, Building2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import type { College } from "@/types/Collage"
import { useLocale } from "next-intl"
import { CollegeFormDialog } from "../../../../../../components/_sharedforms/collage/college-form-dialog"
import { DeleteCollegeDialog } from "../../../../../../components/_sharedforms/collage/delete-college-dialog"
import { useCurrentUser, useIsSuperAdmin } from "@/context/userContext"
import { CollageCard } from "../../../../../../components/_sharedforms/collage/CollageCard"


function Collages() {
    const locale = useLocale()
    const queryClient = useQueryClient()
    const currentUser = useCurrentUser()
    const isSuperAdmin = useIsSuperAdmin()
    const [searchQuery, setSearchQuery] = useState("")
    const [typeFilter, setTypeFilter] = useState<string>("all")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [editingCollege, setEditingCollege] = useState<College | null>(null)
    const [deletingCollege, setDeletingCollege] = useState<College | null>(null)

    const {
        data: collageData,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["displayCollages", currentUser?.id],
        queryFn: () => {
            if (!currentUser?.id) throw new Error("User ID is required");
            return CollegeService.getDisplayCollages(currentUser.id);
        },
        enabled: !!currentUser?.id,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    })

    const deleteMutation = useMutation({
        mutationFn: (id: string) => CollegeService.deleteCollege(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["displayCollages", currentUser?.id] })
            toast.success("College deleted successfully")
            setDeletingCollege(null)
        },
        onError: (error) => {
            toast.error("Failed to delete college")
            console.error("Delete error:", error)
        },
    })

    const handleDelete = (college: College) => {
        setDeletingCollege(college)
    }

    const confirmDelete = () => {
        if (deletingCollege) {
            deleteMutation.mutate(deletingCollege.id)
        }
    }

    // Filter function for search and type
    const filterCollages = (collages: College[]) => {
        return collages.filter((college) => {
            const matchesSearch =
                college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                college.slug.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesType = typeFilter === "all" || college.type === typeFilter
            return matchesSearch && matchesType
        })
    }

    if (isLoading || !currentUser) {
        return (
            <div className="space-y-6 sm:space-y-8 p-4 sm:p-0">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Colleges</h1>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i} className="animate-pulse bg-gray-900/50 border-gray-800">
                            <CardHeader>
                                <div className="h-5 sm:h-6 bg-gray-800 rounded w-3/4"></div>
                                <div className="h-3 sm:h-4 bg-gray-800 rounded w-1/2"></div>
                            </CardHeader>
                            <CardContent>
                                <div className="h-3 sm:h-4 bg-gray-800 rounded w-full mb-2"></div>
                                <div className="h-3 sm:h-4 bg-gray-800 rounded w-2/3"></div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] space-y-4 p-4 sm:p-0">
                <div className="text-red-400 text-base sm:text-lg font-semibold text-center">Error loading colleges</div>
                <div className="text-gray-400 text-sm sm:text-base text-center">{error?.toString()}</div>
                <Button onClick={() => window.location.reload()} className="bg-gray-800 hover:bg-gray-700 text-white">Try Again</Button>
            </div>
        )
    }

    const data = collageData?.data?.data
    const createdCollages = filterCollages(data?.createdCollages?.collages || [])
    const memberCollages = filterCollages(data?.memberCollages?.collages || [])
    const totalCount = data?.totalCount || 0

    return (
        <div className="space-y-6 sm:space-y-8 p-4 sm:p-0">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
                <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">Colleges</h1>
                        {isSuperAdmin && (
                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 w-fit">
                                Super Admin
                            </Badge>
                        )}
                    </div>
                    <p className="text-gray-400 text-sm sm:text-base">
                        Manage your colleges and collaborate with others
                    </p>
                </div>
                <Button
                    onClick={() => setIsAddDialogOpen(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg w-full sm:w-auto"
                >
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Add College</span>
                    <span className="sm:hidden">Add</span>
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
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

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-700/50">
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl sm:text-3xl font-bold text-white">{totalCount}</div>
                                <div className="text-xs sm:text-sm text-blue-200">Total Colleges</div>
                            </div>
                            <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-300" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-700/50">
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl sm:text-3xl font-bold text-white">{data?.createdCollages?.count || 0}</div>
                                <div className="text-xs sm:text-sm text-purple-200">Created by You</div>
                            </div>
                            <Crown className="h-6 w-6 sm:h-8 sm:w-8 text-purple-300" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-900/50 to-green-800/30 border-green-700/50 sm:col-span-2 lg:col-span-1">
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl sm:text-3xl font-bold text-white">{data?.memberCollages?.count || 0}</div>
                                <div className="text-xs sm:text-sm text-green-200">Member Of</div>
                            </div>
                            <UserCheck className="h-6 w-6 sm:h-8 sm:w-8 text-green-300" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Created Colleges Section */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <Crown className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400" />
                            <h2 className="text-xl sm:text-2xl font-semibold text-white">Colleges You Created</h2>
                        </div>
                        <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 w-fit">
                            {createdCollages.length}
                        </Badge>
                    </div>
                    {createdCollages.length === 0 && (
                        <Button
                            onClick={() => setIsAddDialogOpen(true)}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white w-full sm:w-auto"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">Create Your First College</span>
                            <span className="sm:hidden">Create College</span>
                        </Button>
                    )}
                </div>

                {createdCollages.length === 0 ? (
                    <Card className="p-8 sm:p-12 text-center bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-700/30">
                        <Crown className="h-10 w-10 sm:h-12 sm:w-12 text-purple-400 mx-auto mb-4" />
                        <div className="text-purple-200 text-base sm:text-lg mb-2">No colleges created yet</div>
                        <div className="text-purple-300 text-sm sm:text-base mb-6">
                            Start building your college portfolio by creating your first college
                        </div>
                        <Button
                            onClick={() => setIsAddDialogOpen(true)}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white w-full sm:w-auto"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Create College
                        </Button>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {createdCollages.map((college) => (
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
            </div>

            {/* Member Colleges Section */}
            {data?.memberCollages && data.memberCollages.count > 0 && (
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <UserCheck className="h-5 w-5 sm:h-6 sm:w-6 text-green-400" />
                            <h2 className="text-xl sm:text-2xl font-semibold text-white">Colleges You&apos;re Member Of</h2>
                        </div>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 w-fit">
                            {memberCollages.length}
                        </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {memberCollages.map((college) => (
                            <CollageCard
                                key={college.id}
                                college={college}
                                isSuperAdmin={isSuperAdmin}
                                onEdit={setEditingCollege}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* No Results Message */}
            {searchQuery && totalCount > 0 && createdCollages.length === 0 && memberCollages.length === 0 && (
                <Card className="p-8 sm:p-12 text-center bg-gray-900/50 border-gray-800">
                    <Search className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
                    <div className="text-gray-400 text-base sm:text-lg mb-2">No colleges found</div>
                    <div className="text-gray-500 text-sm sm:text-base">
                        Try adjusting your search or filters
                    </div>
                </Card>
            )}

            {/* Dialogs */}
            <CollegeFormDialog
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                onSuccess={() => {
                    queryClient.invalidateQueries({ queryKey: ["displayCollages", currentUser?.id] })
                    setIsAddDialogOpen(false)
                }}
            />

            <CollegeFormDialog
                open={!!editingCollege}
                onOpenChange={(open) => !open && setEditingCollege(null)}
                college={editingCollege}
                onSuccess={() => {
                    queryClient.invalidateQueries({ queryKey: ["displayCollages", currentUser?.id] })
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
