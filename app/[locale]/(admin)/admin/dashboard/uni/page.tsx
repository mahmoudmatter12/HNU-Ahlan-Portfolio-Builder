"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuthStatus } from "@/hooks/use-auth";
import {
    Building2,
    Edit,
    Trash2,
    Save,
    AlertTriangle,
    Shield,
    Users,
    GraduationCap,
    FileText,
    RefreshCw,
    Plus,
    ExternalLink,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Youtube,
    ChevronRight,
    Link,
    Globe2,
    Verified,
    Crown,
    TrendingUp,
    Activity,
    ImageIcon,
    VideoIcon,
    Target
} from "lucide-react";
import { SocialMediaLinks, University, UniversityContent } from "@/types/uni";
import { UniService } from "@/services/uni-service";
import { UploadService } from "@/services/upload-service";
import { CollegeType } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { College } from "@/types/Collage";
import { SocialMediaLinksDialog } from "@/components/_sharedforms/uni/social-media-links-dialog";
import { ContentConfigurationDialog } from "@/components/_sharedforms/uni/content-configuration-dialog";

// Initialize upload service
const uploadService = new UploadService();

// Social media platforms with icons
const socialMediaPlatforms = [
    { key: "facebook", label: "Facebook", icon: Facebook, color: "text-blue-600", bgColor: "bg-blue-50" },
    { key: "twitter", label: "Twitter", icon: Twitter, color: "text-blue-400", bgColor: "bg-blue-50" },
    { key: "instagram", label: "Instagram", icon: Instagram, color: "text-pink-500", bgColor: "bg-pink-50" },
    { key: "linkedin", label: "LinkedIn", icon: Linkedin, color: "text-blue-700", bgColor: "bg-blue-50" },
    { key: "youtube", label: "YouTube", icon: Youtube, color: "text-red-600", bgColor: "bg-red-50" },
];

// College type badges
const getCollegeTypeBadge = (type: CollegeType) => {
    const typeConfig = {
        TECHNICAL: { label: "Technical", variant: "default" as const, color: "bg-blue-100 text-blue-800" },
        MEDICAL: { label: "Medical", variant: "destructive" as const, color: "bg-red-100 text-red-800" },
        ARTS: { label: "Arts", variant: "secondary" as const, color: "bg-purple-100 text-purple-800" },
        OTHER: { label: "Other", variant: "outline" as const, color: "bg-gray-100 text-gray-800" },
    };

    return typeConfig[type] || typeConfig.OTHER;
};

const StatCard = ({ title, value, icon, trend, description }: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: number;
    description?: string;
}) => (
    <Card className="hover:shadow-md  border-2  bg-slate-900/50  border-dashed border-white/60 transition-all duration-200 shadow-sm">
        <CardContent className="p-6">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold">{value}</h3>
                        {trend !== undefined && (
                            <div className={cn("text-sm font-medium flex items-center gap-1",
                                trend >= 0 ? "text-green-600" : "text-red-600")}>
                                {trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <Activity className="h-3 w-3" />}
                                {trend >= 0 ? "+" : ""}{trend}%
                            </div>
                        )}
                    </div>
                    {description && (
                        <p className="text-xs text-muted-foreground">{description}</p>
                    )}
                </div>
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    {icon}
                </div>
            </div>
        </CardContent>
    </Card>
);

const SocialMediaLink = ({ platform, url }: { platform: string; url: string }) => {
    const platformConfig = socialMediaPlatforms.find(p => p.key === platform);
    const Icon = platformConfig?.icon || Globe2;

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 border border-dashed border-white/60 rounded-xl hover:bg-muted/50 transition-all duration-200"
        >
            <div className={cn("p-3 rounded-lg", platformConfig?.bgColor || "bg-gray-50")}>
                <Icon className={`h-5 w-5 ${platformConfig?.color || "text-gray-600"}`} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{platformConfig?.label || platform}</p>
                <p className="text-xs text-muted-foreground truncate">{url.replace(/^https?:\/\//, '')}</p>
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
        </a>
    );
};

export default function UniversityConfigPage() {
    const { toast } = useToast();
    const { isSuperAdmin } = useAuthStatus();
    const queryClient = useQueryClient();
    const { isOwner } = useAuthStatus();

    // State for edit form
    const [editForm, setEditForm] = useState<Partial<University>>({});
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editStep, setEditStep] = useState<"form" | "verify">("form");
    const [verificationCode, setVerificationCode] = useState("");
    const [generatedCode, setGeneratedCode] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    // State for link dialog
    const [linkDialogOpen, setLinkDialogOpen] = useState(false);

    // State for content dialog
    const [contentDialogOpen, setContentDialogOpen] = useState(false);

    // State for delete process
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deleteStep, setDeleteStep] = useState<"initiate" | "verify" | "confirm">("initiate");
    const [deleteVerificationCode, setDeleteVerificationCode] = useState("");
    const [deleteGeneratedCode, setDeleteGeneratedCode] = useState("");
    const [finalConfirmation, setFinalConfirmation] = useState("");
    const [deleteStats, setDeleteStats] = useState<any>(null);

    // Fetch university data
    const { data: university, isLoading, error } = useQuery({
        queryKey: ["university"],
        queryFn: UniService.getUniversity,
    });

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: UniService.updateUniversity,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["university"] });
            toast({
                title: "Success",
                description: "University updated successfully",
            });
            setIsEditDialogOpen(false);
            setEditStep("form");
            setVerificationCode("");
            setGeneratedCode("");
        },
        onError: (error: Error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: UniService.deleteUniversity,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["university"] });
            toast({
                title: "Success",
                description: "University deleted successfully",
            });
            setIsDeleteDialogOpen(false);
            setDeleteStep("initiate");
            setDeleteVerificationCode("");
            setDeleteGeneratedCode("");
            setFinalConfirmation("");
            setDeleteStats(null);
        },
        onError: (error: Error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    // Initialize edit form when university data loads
    useEffect(() => {
        if (university) {
            setEditForm({
                name: university.name,
                slug: university.slug,
                logoUrl: university.logoUrl,
                description: university.description,
                newsItems: university.newsItems,
            });
        }
    }, [university]);

    // Handle logo upload
    const handleLogoUpload = async (file: File) => {
        try {
            setIsUploading(true);
            const uploadResponse = await uploadService.uploadFile(file, {
                context: "university",
                subContext: "logo",
                fieldName: "logo",
            });

            setEditForm(prev => ({ ...prev, logoUrl: uploadResponse.url }));
            toast({
                title: "Success",
                description: "Logo uploaded successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to upload logo",
                variant: "destructive",
            });
        } finally {
            setIsUploading(false);
        }
    };



    // Handle edit form submission
    const handleEditSubmit = async () => {
        if (editStep === "form") {
            // Request verification code
            try {
                const response = await UniService.updateUniversity({
                    name: editForm.name || "",
                    slug: editForm.slug || "",
                    logoUrl: editForm.logoUrl || undefined,
                    description: editForm.description || undefined,
                    newsItems: editForm.newsItems || undefined,
                    verificationStep: "request",
                });
                setGeneratedCode(response.verificationCode);
                setEditStep("verify");
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to request verification code",
                    variant: "destructive",
                });
            }
        } else if (editStep === "verify") {
            // Submit with verification code
            updateMutation.mutate({
                name: editForm.name || "",
                slug: editForm.slug || "",
                logoUrl: editForm.logoUrl || undefined,
                description: editForm.description || undefined,
                newsItems: editForm.newsItems || undefined,
                verificationStep: "verify",
                verificationCode,
            });
        }
    };

    // Handle delete process
    const handleDeleteProcess = async () => {
        if (deleteStep === "initiate") {
            // Initiate deletion
            try {
                const response = await UniService.deleteUniversity({
                    verificationStep: "initiate",
                });
                setDeleteGeneratedCode(response.verificationCode);
                setDeleteStats(response.university);
                setDeleteStep("verify");
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to initiate deletion process",
                    variant: "destructive",
                });
            }
        } else if (deleteStep === "verify") {
            // Verify code
            try {
                const response = await UniService.deleteUniversity({
                    verificationStep: "verify",
                    verificationCode: deleteVerificationCode,
                });
                setDeleteStep("confirm");
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Invalid verification code",
                    variant: "destructive",
                });
            }
        } else if (deleteStep === "confirm") {
            // Final confirmation
            deleteMutation.mutate({
                verificationStep: "confirm",
                finalConfirmation,
            });
        }
    };

    if (!isOwner) {

        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <div className="text-red-500 text-lg font-semibold">You are not authorized to access this page</div>
                <div className="text-gray-600">Only Available to Owners</div>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="container mx-auto p-6 space-y-8">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-4 w-96" />
                    </div>
                    <Skeleton className="h-8 w-32" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-32 w-full" />
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Skeleton className="h-96 lg:col-span-2" />
                    <Skeleton className="h-96" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-6">
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        Failed to load university data. Please try again.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    if (!university) {
        return (
            <div className="container mx-auto p-6">
                <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Not Found</AlertTitle>
                    <AlertDescription>
                        University not found.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    function gethowmanygriditemsAreIn(uni: University) {
        let count = 1;
        if (uni.content?.images?.length && uni.content?.images?.length > 0) {
            count += 1;
        }
        if (uni.content?.videos?.length && uni.content?.videos?.length > 0) {
            count += 1;
        }
        if (uni.content?.admissionTerms) {
            count += 1;
        }
        if (uni.content?.objectives) {
            count += 1;
        }
        console.log(count);
        return count;
    }

    const totalUsers = university.colleges.reduce((acc, college) => acc + (college._count?.users || 0), 0);
    const totalForms = university.colleges.reduce((acc, college) => acc + (college._count?.forms || 0), 0);
    const socialLinksCount = university.socialMedia ? Object.keys(university.socialMedia).length : 0;
    const contentItemsCount = (university.content?.images?.length || 0) + (university.content?.videos?.length || 0);

    return (
        <div className="container mx-auto p-4 md:p-6 space-y-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-2 ">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Building2 className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">University Dashboard</h1>
                            <p className="text-muted-foreground">
                                Manage your university&apos;s configuration and settings
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="flex items-center gap-1.5 px-3 py-1">
                        <Shield className="h-3.5 w-3.5" />
                        {isSuperAdmin ? "Super Administrator" : "Administrator"}
                    </Badge>
                    {isSuperAdmin && (
                        <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1">
                            <Crown className="h-3.5 w-3.5" />
                            Admin Access
                        </Badge>
                    )}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <StatCard
                    title="Total Colleges"
                    value={university.colleges.length}
                    icon={<GraduationCap className="h-6 w-6" />}
                    trend={2.5}
                    description="Active colleges"
                />
                <StatCard
                    title="Active Users"
                    value={totalUsers}
                    icon={<Users className="h-6 w-6" />}
                    trend={5.8}
                    description="Registered users"
                />
                <StatCard
                    title="Forms Created"
                    value={totalForms}
                    icon={<FileText className="h-6 w-6" />}
                    trend={12.3}
                    description="Total forms"
                />
                <StatCard
                    title="Social Links"
                    value={socialLinksCount}
                    icon={<Link className="h-6 w-6" />}
                    description="Connected platforms"
                />
                <StatCard
                    title="Content Items"
                    value={contentItemsCount}
                    icon={<FileText className="h-6 w-6" />}
                    description="Images & videos"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* University Profile Card */}
                <Card className="lg:col-span-2 shadow-sm border-2  bg-slate-900/50">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <Building2 className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl">University Profile</CardTitle>
                                    <CardDescription>Basic information and settings</CardDescription>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsEditDialogOpen(true)}
                                className="flex items-center gap-2"
                            >
                                <Edit className="h-4 w-4" />
                                Edit Profile
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6 ">
                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="flex-shrink-0">
                                <Avatar className="h-24 w-24 border-2 border-border/50 shadow-sm">
                                    <AvatarImage src={university.logoUrl || undefined} alt={university.name} />
                                    <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                                        {university.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="space-y-4 flex-1">
                                <div className="border-2 flex justify-between border-dashed border-white/60 p-4 rounded-md">
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">University Name</Label>
                                        <p className="text-xl font-semibold mt-1">{university.name}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Identifier</Label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <p className="font-mono text-sm bg-muted px-3 py-1.5 rounded-md border">{university.slug}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-2 border-dashed border-white/60 p-4 rounded-md">
                                    <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                                    <p className="text-sm mt-1 leading-relaxed">
                                        {university.description || (
                                            <span className="text-muted-foreground italic">No description provided</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>


                {/* Social Media Card */}
                <Card className="border-0 shadow-sm bg-slate-900/50  border-dashed border-white/60">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-50">
                                    <Globe2 className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl">Social Media</CardTitle>
                                    <CardDescription>Connected platforms</CardDescription>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setLinkDialogOpen(true)}
                                className="flex items-center gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Manage Links
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {university.socialMedia && Object.keys(university.socialMedia).length > 0 ? (
                            Object.entries(university.socialMedia).map(([platform, url]) => (
                                <SocialMediaLink key={platform} platform={platform} url={url} />
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <div className="p-3 rounded-full bg-muted/50 mb-3">
                                    <Globe2 className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">No social media links configured</p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setLinkDialogOpen(true)}
                                    className="flex items-center gap-2"
                                >
                                    <Plus className="h-3 w-3" />
                                    Manage Links
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="col-span-4">
                    {/* div grid with 4 cols */}
                    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${gethowmanygriditemsAreIn(university)} gap-4`}>
                        {/* Content Card */}
                        <Card className="border-0 shadow-sm bg-slate-900/50 border-dashed border-white/60">
                            <CardHeader className="pb-4">
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-purple-50">
                                            <FileText className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl">Content Management</CardTitle>
                                            <CardDescription>Images, videos, terms & objectives</CardDescription>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setContentDialogOpen(true)}
                                        className="flex items-center gap-2"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Manage Content
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {university.content ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-4 border border-dashed border-white/60 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <ImageIcon className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium">Images</span>
                                                <Badge variant="secondary">{university.content.images?.length || 0}</Badge>
                                            </div>
                                            {university.content.images && university.content.images.length > 0 ? (
                                                <div className="grid grid-cols-3 gap-2">
                                                    {university.content.images.slice(0, 3).map((image) => (
                                                        <Avatar key={image.id} className="h-8 w-8">
                                                            <AvatarImage src={image.url} alt={image.alt} />
                                                            <AvatarFallback className="text-xs">
                                                                <ImageIcon className="h-3 w-3" />
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    ))}
                                                    {university.content.images.length > 3 && (
                                                        <div className="h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center">
                                                            <span className="text-xs font-medium">+{university.content.images.length - 3}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-muted-foreground">No images uploaded</p>
                                            )}
                                        </div>

                                        <div className="p-4 border border-dashed border-white/60 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <VideoIcon className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium">Videos</span>
                                                <Badge variant="secondary">{university.content.videos?.length || 0}</Badge>
                                            </div>
                                            {university.content.videos && university.content.videos.length > 0 ? (
                                                <div className="space-y-1">
                                                    {university.content.videos.slice(0, 2).map((video) => (
                                                        <div key={video.id} className="flex items-center gap-2 text-sm">
                                                            <VideoIcon className="h-3 w-3 text-muted-foreground" />
                                                            <span className="truncate">{video.title}</span>
                                                        </div>
                                                    ))}
                                                    {university.content.videos.length > 2 && (
                                                        <p className="text-xs text-muted-foreground">
                                                            +{university.content.videos.length - 2} more videos
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-muted-foreground">No videos added</p>
                                            )}
                                        </div>

                                        <div className="p-4 border border-dashed border-white/60 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <FileText className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium">Admission Terms</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {university.content.admissionTerms ? (
                                                    <span className="text-green-600">✓ Configured</span>
                                                ) : (
                                                    <span className="text-orange-600">Not configured</span>
                                                )}
                                            </p>
                                        </div>

                                        <div className="p-4 border border-dashed border-white/60 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Target className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium">Objectives</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {university.content.objectives ? (
                                                    <span className="text-green-600">✓ Configured</span>
                                                ) : (
                                                    <span className="text-orange-600">Not configured</span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <div className="p-3 rounded-full bg-muted/50 mb-3">
                                            <FileText className="h-6 w-6 text-muted-foreground" />
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-3">No content configured yet</p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setContentDialogOpen(true)}
                                            className="flex items-center gap-2"
                                        >
                                            <Plus className="h-3 w-3" />
                                            Configure Content
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* terms and objectives */}
                        {university.content?.objectives && (
                            <Card className="border-0 shadow-sm bg-slate-900/50  border-dashed border-white/60  ">
                                <CardHeader>
                                    <CardTitle>Objectives</CardTitle>
                                </CardHeader>
                                <CardContent className="max-h-[250px] overflow-y-auto">
                                    <p>{university.content.objectives}</p>
                                </CardContent>
                            </Card>
                        )}

                        {/* news */}
                        {university.content?.admissionTerms && (
                            <Card className="border-0 shadow-sm bg-slate-900/50  border-dashed border-white/60  ">
                                <CardHeader>
                                    <CardTitle>Admission Terms</CardTitle>
                                </CardHeader>
                                <CardContent className="max-h-[250px] overflow-y-auto">
                                    <p>{university.content.admissionTerms}</p>
                                </CardContent>
                            </Card>
                        )}

                        {university.content?.images && university.content?.images.length > 0 && (
                            <Card className="border-0 shadow-sm bg-slate-900/50  border-dashed border-white/60  ">
                                <CardHeader>
                                    <CardTitle>Images</CardTitle>
                                </CardHeader>
                                <CardContent className="max-h-[250px] overflow-y-auto">
                                    {/* <ImageSlider images={university.content.images} /> */}
                                </CardContent>
                            </Card>
                        )}

                        {/* videos */}
                        {university.content?.videos && university.content?.videos.length > 0 && (
                            <Card className="border-0 shadow-sm bg-slate-900/50  border-dashed border-white/60  ">
                                <CardHeader>
                                    <CardTitle>Videos</CardTitle>
                                </CardHeader>
                                <CardContent className="max-h-[250px] overflow-y-auto">
                                    {/* <VideoSlider videos={university.content.videos} /> */}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

            </div>

            {/* Colleges Section */}
            <Card className="border-0 shadow-sm bg-slate-900/50  border-dashed border-white/60  ">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-green-50">
                                <GraduationCap className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">Colleges</CardTitle>
                                <CardDescription>
                                    {university.colleges.length} colleges under this university
                                </CardDescription>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Add College
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {university.colleges.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {university.colleges.map((college: College) => {
                                const typeBadge = getCollegeTypeBadge(college.type);
                                return (
                                    <Card key={college.id} className="hover:shadow-md transition-all duration-200 border bg-slate-900/50  border-dashed border-white/60    ">
                                        <CardContent className="p-4">
                                            <div className="flex items-start gap-4">
                                                <Avatar className="h-12 w-12 flex-shrink-0 border-2 border-border/50">
                                                    <AvatarImage src={undefined} alt={college.name} />
                                                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                                        {college.name.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="min-w-0">
                                                            <h4 className="font-semibold truncate text-sm">{college.name}</h4>
                                                            <p className="text-xs text-muted-foreground truncate mt-1">{college.slug}</p>
                                                        </div>
                                                        <Badge
                                                            variant={typeBadge.variant}
                                                            className={`text-xs ${typeBadge.color}`}
                                                        >
                                                            {typeBadge.label}
                                                        </Badge>
                                                    </div>
                                                    <div className="mt-3 flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                                <Users className="h-3 w-3" />
                                                                {college._count?.users || 0}
                                                            </span>
                                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                                <FileText className="h-3 w-3" />
                                                                {college._count?.forms || 0}
                                                            </span>
                                                        </div>
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                            <ChevronRight className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="p-4 rounded-full bg-muted/50 mb-4">
                                <GraduationCap className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <p className="text-muted-foreground mb-4 text-center">No colleges found</p>
                            <Button className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Create First College
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Admin Section - Only for Super Admins */}
            {isSuperAdmin && (
                <Card className="border-destructive/30 border-2 bg-slate-950">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-destructive">
                            <AlertTriangle className="h-5 w-5" />
                            Administration
                        </CardTitle>
                        <CardDescription>
                            Critical actions that affect the entire university
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-lg border border-destructive/30 p-4 bg-destructive/5">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="space-y-1">
                                    <h4 className="font-semibold text-destructive">Delete University</h4>
                                    <p className="text-sm text-muted-foreground">
                                        This will permanently delete all university data including colleges, users, and forms.
                                    </p>
                                </div>
                                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="destructive" className="flex items-center gap-2">
                                            <Trash2 className="h-4 w-4" />
                                            Delete University
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle className="text-destructive">
                                                Delete University - {deleteStep === "initiate" ? "Step 1" : deleteStep === "verify" ? "Step 2" : "Step 3"}
                                            </DialogTitle>
                                            <DialogDescription>
                                                {deleteStep === "initiate" && "This action cannot be undone. This will permanently delete all university data."}
                                                {deleteStep === "verify" && "Enter the verification code to proceed with deletion."}
                                                {deleteStep === "confirm" && "Final confirmation required. Type the confirmation text exactly as shown."}
                                            </DialogDescription>
                                        </DialogHeader>

                                        <div className="space-y-4">
                                            {deleteStep === "initiate" && (
                                                <Alert variant="destructive">
                                                    <AlertTriangle className="h-4 w-4" />
                                                    <AlertDescription>
                                                        This action will permanently delete the entire university and all associated data.
                                                    </AlertDescription>
                                                </Alert>
                                            )}

                                            {deleteStep === "verify" && (
                                                <>
                                                    <Alert>
                                                        <AlertTriangle className="h-4 w-4" />
                                                        <AlertDescription className="space-y-2">
                                                            <p>We&apos;ve sent a verification code to your registered email address.</p>
                                                            <p className="font-medium">Demo Code: <span className="font-mono bg-muted px-2 py-1 rounded">{deleteGeneratedCode}</span></p>
                                                        </AlertDescription>
                                                    </Alert>

                                                    {deleteStats && (
                                                        <div className="p-4 border rounded-lg space-y-2 bg-muted/30">
                                                            <h4 className="font-semibold">Data to be deleted:</h4>
                                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                                <div>University: {deleteStats.name}</div>
                                                                <div>Colleges: {deleteStats.collegesCount}</div>
                                                                <div>Users: {deleteStats.totalUsers}</div>
                                                                <div>Forms: {deleteStats.totalForms}</div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="space-y-2">
                                                        <Label htmlFor="deleteVerificationCode">Verification Code</Label>
                                                        <Input
                                                            id="deleteVerificationCode"
                                                            value={deleteVerificationCode}
                                                            onChange={(e) => setDeleteVerificationCode(e.target.value)}
                                                            placeholder="Enter 6-digit code"
                                                        />
                                                    </div>
                                                </>
                                            )}

                                            {deleteStep === "confirm" && (
                                                <>
                                                    <Alert variant="destructive">
                                                        <AlertTriangle className="h-4 w-4" />
                                                        <AlertDescription>
                                                            This is your final warning. Type <strong>DELETE_UNIVERSITY_HNU</strong> to confirm deletion.
                                                        </AlertDescription>
                                                    </Alert>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="finalConfirmation">Confirmation Text</Label>
                                                        <Input
                                                            id="finalConfirmation"
                                                            value={finalConfirmation}
                                                            onChange={(e) => setFinalConfirmation(e.target.value)}
                                                            placeholder="DELETE_UNIVERSITY_HNU"
                                                        />
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        <DialogFooter>
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setIsDeleteDialogOpen(false);
                                                    setDeleteStep("initiate");
                                                    setDeleteVerificationCode("");
                                                    setDeleteGeneratedCode("");
                                                    setFinalConfirmation("");
                                                    setDeleteStats(null);
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                onClick={handleDeleteProcess}
                                                disabled={deleteMutation.isPending}
                                            >
                                                {deleteMutation.isPending ? (
                                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                                ) : deleteStep === "initiate" ? (
                                                    "Initiate Deletion"
                                                ) : deleteStep === "verify" ? (
                                                    "Verify Code"
                                                ) : (
                                                    "Confirm Deletion"
                                                )}
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Edit University Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editStep === "form" ? "Edit University" : "Verify Changes"}
                        </DialogTitle>
                        <DialogDescription>
                            {editStep === "form"
                                ? "Update your university&apos;s information below."
                                : "Enter the verification code to confirm your changes."}
                        </DialogDescription>
                    </DialogHeader>

                    {editStep === "form" ? (
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="font-medium text-lg">Basic Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">University Name</Label>
                                        <Input
                                            id="name"
                                            value={editForm.name || ""}
                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="slug">URL Slug</Label>
                                        <Input
                                            id="slug"
                                            value={editForm.slug || ""}
                                            onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={editForm.description || ""}
                                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                        rows={3}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-medium text-lg">University Logo</h3>
                                <div className="flex items-center gap-4">
                                    <div className="flex-shrink-0">
                                        <Avatar className="h-16 w-16 border-2 border-border/50">
                                            <AvatarImage src={editForm.logoUrl || undefined} alt="Logo" />
                                            <AvatarFallback className="text-lg font-semibold">
                                                {editForm.name?.charAt(0) || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <div className="space-y-2 flex-1">
                                        <Label htmlFor="logo-upload">Upload New Logo</Label>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                id="logo-upload"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        handleLogoUpload(file);
                                                    }
                                                }}
                                                disabled={isUploading}
                                                className="flex-1"
                                            />
                                            {isUploading && <RefreshCw className="h-4 w-4 animate-spin" />}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Recommended size: 512×512 pixels
                                        </p>
                                    </div>
                                </div>
                            </div>


                        </div>
                    ) : (
                        <div className="space-y-6">
                            <Alert>
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription className="space-y-2">
                                    <p>We&apos;ve sent a verification code to your registered email address.</p>
                                    <p className="font-medium">Demo Code: <span className="font-mono bg-muted px-2 py-1 rounded">{generatedCode}</span></p>
                                </AlertDescription>
                            </Alert>
                            <div className="space-y-2">
                                <Label htmlFor="verificationCode">Verification Code</Label>
                                <Input
                                    id="verificationCode"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    placeholder="Enter 6-digit code"
                                />
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsEditDialogOpen(false);
                                setEditStep("form");
                                setVerificationCode("");
                                setGeneratedCode("");
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleEditSubmit}
                            disabled={updateMutation.isPending}
                        >
                            {updateMutation.isPending ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : editStep === "form" ? (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Continue
                                </>
                            ) : (
                                <>
                                    <Verified className="h-4 w-4 mr-2" />
                                    Verify & Save
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Social Media Links Dialog */}
            <SocialMediaLinksDialog
                open={linkDialogOpen}
                onOpenChange={setLinkDialogOpen}
                currentLinks={university.socialMedia as SocialMediaLinks || {}}
                universityName={university.name}
                universitySlug={university.slug}
            />

            {/* Content Configuration Dialog */}
            <ContentConfigurationDialog
                open={contentDialogOpen}
                onOpenChange={setContentDialogOpen}
                currentContent={university.content}
            />
        </div>
    );
}