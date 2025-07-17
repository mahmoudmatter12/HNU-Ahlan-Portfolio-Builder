"use client"
import { CollegeService } from "@/services/collage-service"
import { FormService } from "@/services/form-service"
import { SectionService } from "@/services/section-service"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Edit,
  Trash2,
  Users,
  FileText,
  Calendar,
  Settings,
  Plus,
  Eye,
  MoreVertical,
  ExternalLink,
  Copy,
  Check,
  Palette,
  Image as ImageIcon,
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import type { College, CollegeSection } from "@/types/Collage"
import { useLocale } from "next-intl"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CollegeFormDialog } from "../../../../../../../components/_sharedforms/collage/college-form-dialog"
import { DeleteCollegeDialog } from "../../../../../../../components/_sharedforms/collage/delete-college-dialog"
import { SectionFormDialog } from "../../../../../../../components/_sharedforms/section/section-form-dialog"
import { ViewSectionDialog } from "../../../../../../../components/_sharedforms/section/view-section-dialog"
import { DeleteDialog } from "../../../../../../../components/_sharedforms/section/delete-dialog"
import { DraggableSectionList } from "../../../../../../../components/_sharedforms/section/draggable-section-list"
import { ThemeFormDialog } from "../../../../../../../components/_sharedforms/theme/theme-form-dialog"
import { GalleryFormDialog } from "../../../../../../../components/_sharedforms/gallery/gallery-form-dialog"
import { GalleryPreview } from "../../../../../../../components/_sharedforms/gallery/gallery-preview"
import { FormManagementDemo } from "../../../../../../../components/_sharedforms/form/form-management-demo"
import { FormCreateDialog } from "../../../../../../../components/_sharedforms/form/form-create-dialog"

const collegeTypeColors = {
  TECHNICAL: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  MEDICAL: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  ARTS: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  OTHER: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
}

function CollegeDetails() {
  const params = useParams()
  const router = useRouter()
  const locale = useLocale()
  const queryClient = useQueryClient()
  const slug = params.slug as string

  const [editingCollege, setEditingCollege] = useState<College | null>(null)
  const [deletingCollege, setDeletingCollege] = useState<College | null>(null)
  const [copiedUrl, setCopiedUrl] = useState(false)
  const [creatingSection, setCreatingSection] = useState(false)
  const [editingSection, setEditingSection] = useState<CollegeSection | null>(null)
  const [viewingSection, setViewingSection] = useState<CollegeSection | null>(null)
  const [deletingSection, setDeletingSection] = useState<CollegeSection | null>(null)
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false)
  const [editingTheme, setEditingTheme] = useState(false)
  const [editingGallery, setEditingGallery] = useState(false)

  const {
    data: college,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["college", slug],
    queryFn: () => CollegeService.getCollegeBySlug(slug),
  })

  // Fetch forms data for better statistics
  const {
    data: formsData,
  } = useQuery({
    queryKey: ["forms", college?.id],
    queryFn: () => FormService.getFormsWithFields({ collegeId: college?.id }),
    enabled: !!college?.id,
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => CollegeService.deleteCollege(id),
    onSuccess: () => {
      toast.success("College deleted successfully")
      router.push(`/${locale}/admin/dashboard/collages`)
    },
    onError: (error) => {
      toast.error("Failed to delete college")
      console.error("Delete error:", error)
    },
  })

  const sectionService = new SectionService()

  const deleteSectionMutation = useMutation({
    mutationFn: (id: string) => sectionService.deleteSection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["college", slug] })
      toast.success("Section deleted successfully")
      setDeletingSection(null)
    },
    onError: (error) => {
      toast.error("Failed to delete section")
      console.error("Delete section error:", error)
    },
  })

  const handleDelete = () => {
    if (college) {
      setDeletingCollege(college)
    }
  }

  const confirmDelete = () => {
    if (deletingCollege) {
      deleteMutation.mutate(deletingCollege.id)
      setDeletingCollege(null)
    }
  }

  const copyPublicUrl = async () => {
    if (college) {
      const publicUrl = `${window.location.origin}/${locale}/${college.slug}`
      await navigator.clipboard.writeText(publicUrl)
      setCopiedUrl(true)
      toast.success("Public URL copied to clipboard")
      setTimeout(() => setCopiedUrl(false), 2000)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
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
          <div className="space-y-6">
            <Card className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (isError || !college) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-red-500 text-lg font-semibold">College not found</div>
        <div className="text-gray-600">{error?.toString()}</div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            Go Back
          </Button>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.push(`/${locale}/admin/dashboard/collages`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Colleges
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{college.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-gray-600">/{college.slug}</span>
              <Badge className={collegeTypeColors[college.type]} variant="secondary">
                {college.type}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={copyPublicUrl}>
            {copiedUrl ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
            {copiedUrl ? "Copied!" : "Copy URL"}
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/${locale}/${college.slug}`} target="_blank">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Public
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/${locale}/admin/dashboard/collages/${college.slug}/gallery-demo`}>
              <ImageIcon className="h-4 w-4 mr-2" />
              Gallery Demo
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditingCollege(college)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit College
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete College
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="sections">Sections</TabsTrigger>
              <TabsTrigger value="forms">Forms</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      <div>
                        <div className="text-2xl font-bold">{college._count?.users || 0}</div>
                        <div className="text-xs text-gray-600">Users</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-green-500" />
                      <div>
                        <div className="text-2xl font-bold">{college._count?.sections || 0}</div>
                        <div className="text-xs text-gray-600">Sections</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-purple-500" />
                      <div>
                        <div className="text-2xl font-bold">{formsData?.forms?.length || college._count?.forms || 0}</div>
                        <div className="text-xs text-gray-600">Forms</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4 text-orange-500" />
                      <div>
                        <div className="text-2xl font-bold">
                          {formsData?.forms?.reduce((total, form) => total + (form._count?.submissions || 0), 0) || college._count?.formSubmissions || 0}
                        </div>
                        <div className="text-xs text-gray-600">Submissions</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest updates and changes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">College created</div>
                        <div className="text-xs text-gray-600">{new Date(college.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">Last updated</div>
                        <div className="text-xs text-gray-600">{new Date(college.updatedAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sections" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Sections</CardTitle>
                    <CardDescription>
                      Manage college sections and content. Drag sections to reorder them.
                    </CardDescription>
                  </div>
                  <Button size="sm" onClick={() => setCreatingSection(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Section
                  </Button>
                </CardHeader>
                <CardContent>
                  <DraggableSectionList
                    sections={college.sections || []}
                    collegeId={college.id}
                    onView={(section) => setViewingSection(section)}
                    onEdit={(section) => setEditingSection(section)}
                    onDelete={(section) => setDeletingSection(section)}
                    queryKey={["college", slug]}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="forms" className="space-y-6">
              <FormManagementDemo collegeId={college.id} />
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Theme Settings</CardTitle>
                    <CardDescription>
                      Customize the appearance of your college page
                    </CardDescription>
                  </div>
                  <Button size="sm" onClick={() => setEditingTheme(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Theme
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {college.theme && Object.keys(college.theme).length > 0 ? (
                      <div className="space-y-4">
                        {college.theme.colors && (
                          <div>
                            <label className="text-sm font-medium">Colors</label>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {Object.entries(college.theme.colors).map(([key, value]) => (
                                <div key={key} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                  <div
                                    className="w-4 h-4 rounded border"
                                    style={{ backgroundColor: value as string }}
                                  />
                                  <span className="text-xs font-mono">{key}: {String(value)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {college.theme.fonts && (
                          <div>
                            <label className="text-sm font-medium">Fonts</label>
                            <div className="mt-2 space-y-1">
                              {Object.entries(college.theme.fonts).map(([key, value]) => (
                                <div key={key} className="text-xs">
                                  <span className="font-medium">{key}:</span> {String(value)}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {college.theme.mode && (
                          <div>
                            <label className="text-sm font-medium">Mode</label>
                            <div className="mt-2">
                              <Badge variant="outline" className="text-xs">
                                {college.theme.mode}
                              </Badge>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Palette className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No theme configuration set</p>
                        <p className="text-xs">Click &quot;Edit Theme&quot; to customize the appearance</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Gallery Images</CardTitle>
                    <CardDescription>Manage college gallery events and images</CardDescription>
                  </div>
                  <Button size="sm" onClick={() => setEditingGallery(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Gallery
                  </Button>
                </CardHeader>
                <CardContent>
                  <GalleryPreview
                    galleryData={college.galleryImages as any}
                    onEdit={() => setEditingGallery(true)}
                  />
                </CardContent>
              </Card>

            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* College Info */}
          <Card>
            <CardHeader>
              <CardTitle>College Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Name</label>
                <div className="mt-1">{college.name}</div>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-medium text-gray-600">Slug</label>
                <div className="mt-1 font-mono text-sm">/{college.slug}</div>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-medium text-gray-600">Type</label>
                <div className="mt-1">
                  <Badge className={collegeTypeColors[college.type]} variant="secondary">
                    {college.type}
                  </Badge>
                </div>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-medium text-gray-600">Created</label>
                <div className="mt-1 text-sm">{new Date(college.createdAt).toLocaleDateString()}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Updated</label>
                <div className="mt-1 text-sm">{new Date(college.updatedAt).toLocaleDateString()}</div>
              </div>
            </CardContent>
          </Card>

          {/* Creator Info */}
          {college.createdBy && (
            <Card>
              <CardHeader>
                <CardTitle>Created By</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar>
                    {college.createdBy.image ? <AvatarImage src={college.createdBy.image} /> : <AvatarFallback>
                      {college.createdBy.name?.charAt(0) || college.createdBy.email?.charAt(0)}
                    </AvatarFallback>}
                  </Avatar>
                  <div>
                    <div className="font-medium">{college.createdBy.name || "Unknown"}</div>
                    <div className="text-sm text-gray-600">{college.createdBy.email}</div>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {college.createdBy.userType}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => setEditingCollege(college)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit College
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => setIsCreateFormOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Form
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                <Link href={`/${locale}/${college.slug}`} target="_blank">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Public Page
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                <Link href={`/${locale}/admin/dashboard/collages/${slug}/project-demo`}>
                  <FileText className="h-4 w-4 mr-2" />
                  Project Demo
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-red-600 hover:text-red-600 bg-transparent"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete College
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialogs */}
      <CollegeFormDialog
        open={!!editingCollege}
        onOpenChange={(open) => !open && setEditingCollege(null)}
        college={editingCollege}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["college", slug] })
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

      <SectionFormDialog
        open={creatingSection || !!editingSection}
        onOpenChange={(open) => {
          if (!open) {
            setCreatingSection(false)
            setEditingSection(null)
          }
        }}
        section={editingSection}
        collegeId={college?.id || ""}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["college", slug] })
          setCreatingSection(false)
          setEditingSection(null)
        }}
        college={college}
      />

      <ViewSectionDialog
        open={!!viewingSection}
        onOpenChange={(open) => !open && setViewingSection(null)}
        section={viewingSection}
        onEdit={() => {
          setEditingSection(viewingSection)
          setViewingSection(null)
        }}
        onDelete={() => {
          setDeletingSection(viewingSection)
          setViewingSection(null)
        }}
      />

      <DeleteDialog
        open={!!deletingSection}
        onOpenChange={(open) => !open && setDeletingSection(null)}
        title="Delete Section"
        description={`Are you sure you want to delete the section "${deletingSection?.title}"? This action cannot be undone.`}
        itemName="Section"
        onConfirm={async () => {
          if (deletingSection) {
            await sectionService.deleteSection(deletingSection.id)
          }
        }}
        queryKey={["college", slug]}
      />

      <ThemeFormDialog
        open={editingTheme}
        onOpenChange={(open) => setEditingTheme(open)}
        college={college}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["college", slug] })
          setEditingTheme(false)
        }}
      />

      <GalleryFormDialog
        open={editingGallery}
        onOpenChange={(open) => setEditingGallery(open)}
        college={college}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["college", slug] })
          setEditingGallery(false)
        }}
      />

      <FormCreateDialog
        open={isCreateFormOpen}
        onOpenChange={setIsCreateFormOpen}
        collegeId={college?.id || ""}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["forms", college?.id] })
          setIsCreateFormOpen(false)
        }}
      />

    </div>
  )
}

export default CollegeDetails
