"use client"
import { useState, useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CollegeService } from "@/services/collage-service"
import { UploadService } from "@/services/upload-service"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { Loader2, Plus, Trash2, Edit, ArrowLeft, ArrowRight, Users, Upload, X } from "lucide-react"
import type { College, CollageLeader, CollageLeadersData } from "@/types/Collage"
import { useQuery } from "@tanstack/react-query"

const leaderSchema = z.object({
    name: z.string().min(1, "Name is required"),
    image: z.string().optional(),
    collage: z.string().min(1, "Collage is required"),
    year: z.string().min(1, "Year is required"),
    program: z.string().min(1, "Program is required"),
    whatsapp: z.string().optional(),
    facebook: z.string().optional(),
})

type LeaderFormData = z.infer<typeof leaderSchema>

interface CollageLeadersDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    college: College
    onSuccess: () => void
}

export function CollageLeadersDialog({ open, onOpenChange, college, onSuccess }: CollageLeadersDialogProps) {
    const [step, setStep] = useState(1)
    const [leaderCount, setLeaderCount] = useState(1)
    const [leaders, setLeaders] = useState<CollageLeader[]>([])
    const [editingLeaderIndex, setEditingLeaderIndex] = useState<number | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Fetch programs for the current college
    const { data: programs } = useQuery({
        queryKey: ["programs", college.id],
        queryFn: () => CollegeService.getPrograms(college.id),
        enabled: !!college.id,
    })

    console.log(college.id)

    const form = useForm<LeaderFormData>({
        resolver: zodResolver(leaderSchema),
        defaultValues: {
            name: "",
            image: "",
            collage: college.id,
            year: "",
            program: "",
            whatsapp: "",
            facebook: "",
        },
        mode: "onBlur",
    })

    const uploadService = new UploadService()

    const updateMutation = useMutation({
        mutationFn: (data: CollageLeadersData) =>
            CollegeService.updateCollege(college.id, { collageLeaders: data }),
        onSuccess: () => {
            toast.success("Collage leaders updated successfully")
            onSuccess()
            onOpenChange(false)
            resetForm()
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to update collage leaders")
        },
    })

    const resetForm = () => {
        setStep(1)
        setLeaderCount(1)
        setLeaders([])
        setEditingLeaderIndex(null)
        setIsUploading(false)
        form.reset({
            name: "",
            image: "",
            collage: college.id,
            year: "",
            program: "",
            whatsapp: "",
            facebook: "",
        })
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    useEffect(() => {
        if (open) {
            // Load existing leaders if any
            if (college.collageLeaders) {
                const existingLeaders = college.collageLeaders as CollageLeadersData
                setLeaders(existingLeaders.leaders || [])
                setLeaderCount(existingLeaders.leaders?.length || 1)
            } else {
                resetForm()
            }
        }
    }, [open, college.collageLeaders])

    const handleImageUpload = async (file: File) => {
        if (!file) return

        setIsUploading(true)
        try {
            const uploadResponse = await uploadService.uploadFile(file, {
                context: "collage-leaders",
                subContext: "profile-images",
                fieldName: "leader-image",
                fileName: `leader-${Date.now()}-${file.name}`,
            })

            form.setValue("image", uploadResponse.url)
            toast.success("Image uploaded successfully")
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to upload image")
        } finally {
            setIsUploading(false)
        }
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            handleImageUpload(file)
        }
    }

    const removeImage = () => {
        form.setValue("image", "")
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const handleNext = () => {
        if (step === 1) {
            if (leaderCount < 1) {
                toast.error("Please enter a valid number of leaders")
                return
            }
            setStep(2)
        }
    }

    const handleBack = () => {
        if (step === 2) {
            setStep(1)
        }
    }

    const handleAddLeader = () => {
        const formData = form.getValues()
        const newLeader: CollageLeader = {
            id: Date.now().toString(),
            ...formData,
            collage: college.name, // Ensure collage is always set to current college
        }

        if (editingLeaderIndex !== null) {
            // Update existing leader
            const updatedLeaders = [...leaders]
            updatedLeaders[editingLeaderIndex] = newLeader
            setLeaders(updatedLeaders)
            setEditingLeaderIndex(null)
        } else {
            // Add new leader
            setLeaders([...leaders, newLeader])
        }

        form.reset({
            name: "",
            image: "",
            collage: college.id,
            year: "",
            program: "",
            whatsapp: "",
            facebook: "",
        })
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }
    console.log(form.getValues())

    const handleEditLeader = (index: number) => {
        const leader = leaders[index]
        form.reset({
            ...leader,
            collage: college.name, // Ensure collage is always set to current college
        })
        setEditingLeaderIndex(index)
    }

    const handleDeleteLeader = (index: number) => {
        const updatedLeaders = leaders.filter((_, i) => i !== index)
        setLeaders(updatedLeaders)
        if (editingLeaderIndex === index) {
            setEditingLeaderIndex(null)
            form.reset({
                name: "",
                image: "",
                collage: college.id,
                year: "",
                program: "",
                whatsapp: "",
                facebook: "",
            })
            if (fileInputRef.current) {
                fileInputRef.current.value = ""
            }
        }
    }

    const handleSave = () => {
        if (leaders.length === 0) {
            toast.error("Please add at least one leader")
            return
        }

        const collageLeadersData: CollageLeadersData = {
            leaders: leaders,
        }

        updateMutation.mutate(collageLeadersData)
    }

    const renderStep1 = () => (
        <div className="space-y-4">
            <div className="text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                <h3 className="text-lg font-semibold">How many collage leaders?</h3>
                <p className="text-sm text-gray-600">Enter the number of leaders you want to add</p>
            </div>

            <div className="flex items-center justify-center space-x-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLeaderCount(Math.max(1, leaderCount - 1))}
                >
                    -
                </Button>
                <Input
                    type="number"
                    min="1"
                    max="20"
                    value={leaderCount}
                    onChange={(e) => setLeaderCount(parseInt(e.target.value) || 1)}
                    className="w-20 text-center"
                />
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLeaderCount(Math.min(20, leaderCount + 1))}
                >
                    +
                </Button>
            </div>
        </div>
    )

    const renderStep2 = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Add Leader Details</h3>
                <div className="text-sm text-gray-600">
                    {leaders.length} of {leaderCount} leaders added
                </div>
            </div>

            {/* Leader Form */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">
                        {editingLeaderIndex !== null ? "Edit Leader" : "Add New Leader"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Leader name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Profile Image (Optional)</FormLabel>
                                            <FormControl>
                                                <div className="space-y-2">
                                                    {field.value ? (
                                                        <div className="flex items-center space-x-2">
                                                            <Avatar className="h-12 w-12">
                                                                <AvatarImage src={field.value} alt="Preview" />
                                                                <AvatarFallback>IMG</AvatarFallback>
                                                            </Avatar>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={removeImage}
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center space-x-2">
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                onClick={() => fileInputRef.current?.click()}
                                                                disabled={isUploading}
                                                            >
                                                                {isUploading ? (
                                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                                ) : (
                                                                    <Upload className="h-4 w-4 mr-2" />
                                                                )}
                                                                Upload Image
                                                            </Button>
                                                            <input
                                                                ref={fileInputRef}
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={handleFileChange}
                                                                className="hidden"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="year"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Year</FormLabel>
                                            <FormControl>
                                                <Input placeholder="2024" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="program"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Program</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select program" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {programs?.map((program: any) => (
                                                        <SelectItem key={program.id} value={program.name}>
                                                            {program.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="whatsapp"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>WhatsApp Number (Optional)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="+1234567890" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="facebook"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Facebook Link (Optional)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://facebook.com/username" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex justify-end space-x-2">
                                {editingLeaderIndex !== null && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setEditingLeaderIndex(null)
                                            form.reset({
                                                name: "",
                                                image: "",
                                                collage: college.id,
                                                year: "",
                                                program: "",
                                                whatsapp: "",
                                                facebook: "",
                                            })
                                            if (fileInputRef.current) {
                                                fileInputRef.current.value = ""
                                            }
                                        }}
                                    >
                                        Cancel Edit
                                    </Button>
                                )}
                                <Button
                                    type="button"
                                    onClick={handleAddLeader}
                                    disabled={!form.formState.isValid}
                                >
                                    {editingLeaderIndex !== null ? "Update Leader" : "Add Leader"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {/* Leaders List */}
            {leaders.length > 0 && (
                <div className="space-y-4">
                    <h4 className="font-medium">Added Leaders</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {leaders.map((leader, index) => (
                            <Card key={leader.id} className="relative">
                                <CardContent className="p-4">
                                    <div className="flex items-center space-x-3">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={leader.image} alt={leader.name} />
                                            <AvatarFallback>{leader.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <h5 className="font-medium truncate">{leader.name}</h5>
                                            <p className="text-sm text-gray-600 truncate">{college.name}</p>
                                            <p className="text-xs text-gray-500">{leader.year} • {leader.program}</p>
                                        </div>
                                        <div className="flex space-x-1">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleEditLeader(index)}
                                            >
                                                <Edit className="h-3 w-3" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleDeleteLeader(index)}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Manage Collage Leaders</DialogTitle>
                    <DialogDescription>
                        {step === 1
                            ? "Set the number of collage leaders you want to add"
                            : "Add details for each collage leader"
                        }
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    {step === 1 ? renderStep1() : renderStep2()}
                </div>

                <DialogFooter>
                    <div className="flex justify-between w-full">
                        {step === 2 && (
                            <Button variant="outline" onClick={handleBack}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back
                            </Button>
                        )}

                        <div className="flex space-x-2">
                            <Button variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>

                            {step === 1 ? (
                                <Button onClick={handleNext}>
                                    Next
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleSave}
                                    disabled={updateMutation.isPending || leaders.length === 0}
                                >
                                    {updateMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                    Save Leaders
                                </Button>
                            )}
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
} 