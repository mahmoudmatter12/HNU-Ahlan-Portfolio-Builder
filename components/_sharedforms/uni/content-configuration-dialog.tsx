"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useUniversityContent } from "@/context/universityContext";
import { UniversityContent } from "@/types/uni";
import { UploadService } from "@/services/upload-service";
import {
    ImageIcon,
    VideoIcon,
    FileText,
    Target,
    Plus,
    Trash2,
    Upload,
    ExternalLink,
    Save,
    RefreshCw,
    AlertTriangle,
    CheckCircle,
} from "lucide-react";

interface ContentConfigurationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    currentContent: UniversityContent | null;
}

const uploadService = new UploadService();

export const ContentConfigurationDialog: React.FC<ContentConfigurationDialogProps> = ({
    open,
    onOpenChange,
    currentContent,
}) => {
    const { toast } = useToast();
    const {
        updateContent,
        updateContentLoading,
        addImage,
        removeImage,
        addVideo,
        removeVideo,
    } = useUniversityContent();

    // Form state
    const [formData, setFormData] = useState<UniversityContent>({
        images: currentContent?.images || [],
        videos: currentContent?.videos || [],
        admissionTerms: currentContent?.admissionTerms || "",
        objectives: currentContent?.objectives || "",
        lastUpdated: currentContent?.lastUpdated || new Date(),
    });

    // Upload states
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [newVideo, setNewVideo] = useState({
        title: "",
        url: "",
        description: "",
    });

    // Update form data when currentContent changes
    React.useEffect(() => {
        if (currentContent) {
            setFormData({
                images: currentContent.images || [],
                videos: currentContent.videos || [],
                admissionTerms: currentContent.admissionTerms || "",
                objectives: currentContent.objectives || "",
                lastUpdated: currentContent.lastUpdated || new Date(),
            });
        }
    }, [currentContent]);

    // Handle image upload
    const handleImageUpload = async (file: File) => {
        try {
            setIsUploadingImage(true);
            const uploadResponse = await uploadService.uploadFile(file, {
                context: "university",
                subContext: "content",
                fieldName: "images",
            });

            await addImage({
                url: uploadResponse.url,
                alt: file.name,
                caption: "",
            });

            toast({
                title: "Success",
                description: "Image uploaded successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to upload image",
                variant: "destructive",
            });
        } finally {
            setIsUploadingImage(false);
        }
    };

    // Handle image removal
    const handleRemoveImage = async (imageId: string) => {
        try {
            await removeImage(imageId);
            toast({
                title: "Success",
                description: "Image removed successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to remove image",
                variant: "destructive",
            });
        }
    };

    // Handle video addition
    const handleAddVideo = async () => {
        if (!newVideo.title || !newVideo.url) {
            toast({
                title: "Error",
                description: "Please fill in all required fields",
                variant: "destructive",
            });
            return;
        }

        try {
            await addVideo(newVideo);
            setNewVideo({ title: "", url: "", description: "" });
            toast({
                title: "Success",
                description: "Video added successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add video",
                variant: "destructive",
            });
        }
    };

    // Handle video removal
    const handleRemoveVideo = async (videoId: string) => {
        try {
            await removeVideo(videoId);
            toast({
                title: "Success",
                description: "Video removed successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to remove video",
                variant: "destructive",
            });
        }
    };

    // Handle form submission
    const handleSubmit = async () => {
        try {
            await updateContent({
                ...formData,
                lastUpdated: new Date(),
            });

            toast({
                title: "Success",
                description: "Content updated successfully",
            });
            onOpenChange(false);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update content",
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Content Configuration
                    </DialogTitle>
                    <DialogDescription>
                        Manage your university&apos;s content including images, videos, admission terms, and objectives.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="media" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="media" className="flex items-center gap-2">
                            <ImageIcon className="h-4 w-4" />
                            Media
                        </TabsTrigger>
                        <TabsTrigger value="terms" className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Terms
                        </TabsTrigger>
                        <TabsTrigger value="objectives" className="flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            Objectives
                        </TabsTrigger>
                        <TabsTrigger value="preview" className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Preview
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="media" className="space-y-6">
                        {/* Images Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ImageIcon className="h-5 w-5" />
                                    University Images
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <Label htmlFor="image-upload">Upload New Image</Label>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Input
                                                id="image-upload"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        handleImageUpload(file);
                                                    }
                                                }}
                                                disabled={isUploadingImage}
                                                className="flex-1"
                                            />
                                            {isUploadingImage && <RefreshCw className="h-4 w-4 animate-spin" />}
                                        </div>
                                    </div>
                                </div>

                                {formData.images.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {formData.images.map((image) => (
                                            <Card key={image.id} className="relative group">
                                                <CardContent className="p-4">
                                                    <div className="relative">
                                                        <Avatar className="h-32 w-full rounded-lg">
                                                            <AvatarImage src={image.url} alt={image.alt} />
                                                            <AvatarFallback className="text-lg">
                                                                <ImageIcon className="h-8 w-8" />
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            onClick={() => handleRemoveImage(image.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                    <div className="mt-3 space-y-2">
                                                        <Input
                                                            placeholder="Alt text"
                                                            value={image.alt}
                                                            onChange={(e) => {
                                                                const updatedImages = formData.images.map(img =>
                                                                    img.id === image.id ? { ...img, alt: e.target.value } : img
                                                                );
                                                                setFormData({ ...formData, images: updatedImages });
                                                            }}
                                                        />
                                                        <Input
                                                            placeholder="Caption (optional)"
                                                            value={image.caption || ""}
                                                            onChange={(e) => {
                                                                const updatedImages = formData.images.map(img =>
                                                                    img.id === image.id ? { ...img, caption: e.target.value } : img
                                                                );
                                                                setFormData({ ...formData, images: updatedImages });
                                                            }}
                                                        />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <div className="p-3 rounded-full bg-muted/50 mb-3">
                                            <ImageIcon className="h-6 w-6 text-muted-foreground" />
                                        </div>
                                        <p className="text-sm text-muted-foreground">No images uploaded yet</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Videos Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <VideoIcon className="h-5 w-5" />
                                    University Videos
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor="video-title">Video Title</Label>
                                        <Input
                                            id="video-title"
                                            value={newVideo.title}
                                            onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                                            placeholder="Enter video title"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="video-url">Video URL</Label>
                                        <Input
                                            id="video-url"
                                            value={newVideo.url}
                                            onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
                                            placeholder="https://youtube.com/..."
                                        />
                                    </div>
                                    <div className="flex items-end">
                                        <Button
                                            onClick={handleAddVideo}
                                            className="flex items-center gap-2"
                                            disabled={!newVideo.title || !newVideo.url}
                                        >
                                            <Plus className="h-4 w-4" />
                                            Add Video
                                        </Button>
                                    </div>
                                </div>

                                {formData.videos.length > 0 ? (
                                    <div className="space-y-3">
                                        {formData.videos.map((video) => (
                                            <Card key={video.id} className="relative group">
                                                <CardContent className="p-4">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <VideoIcon className="h-4 w-4 text-muted-foreground" />
                                                                <h4 className="font-semibold">{video.title}</h4>
                                                            </div>
                                                            <p className="text-sm text-muted-foreground mb-2">
                                                                {video.url}
                                                            </p>
                                                            {video.description && (
                                                                <p className="text-sm">{video.description}</p>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => window.open(video.url, '_blank')}
                                                            >
                                                                <ExternalLink className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => handleRemoveVideo(video.id)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <div className="p-3 rounded-full bg-muted/50 mb-3">
                                            <VideoIcon className="h-6 w-6 text-muted-foreground" />
                                        </div>
                                        <p className="text-sm text-muted-foreground">No videos added yet</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="terms" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Admission Terms and Conditions
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="admission-terms">Terms and Conditions</Label>
                                        <Textarea
                                            id="admission-terms"
                                            value={formData.admissionTerms}
                                            onChange={(e) => setFormData({ ...formData, admissionTerms: e.target.value })}
                                            placeholder="Enter admission terms and conditions..."
                                            rows={12}
                                            className="font-mono text-sm"
                                        />
                                    </div>
                                    <Alert>
                                        <AlertTriangle className="h-4 w-4" />
                                        <AlertDescription>
                                            This content will be displayed to students during the admission process.
                                            Use clear, concise language and ensure all terms are legally compliant.
                                        </AlertDescription>
                                    </Alert>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="objectives" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="h-5 w-5" />
                                    University Objectives
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="objectives">University Objectives</Label>
                                        <Textarea
                                            id="objectives"
                                            value={formData.objectives}
                                            onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                                            placeholder="Enter university objectives and goals..."
                                            rows={12}
                                        />
                                    </div>
                                    <Alert>
                                        <Target className="h-4 w-4" />
                                        <AlertDescription>
                                            Describe your university&apos;s mission, vision, and strategic objectives.
                                            This content helps students and stakeholders understand your institution&apos;s goals.
                                        </AlertDescription>
                                    </Alert>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="preview" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Content Preview</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Images Preview */}
                                {formData.images.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold mb-3">Images ({formData.images.length})</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {formData.images.map((image) => (
                                                <div key={image.id} className="text-center">
                                                    <Avatar className="h-16 w-16 mx-auto mb-2">
                                                        <AvatarImage src={image.url} alt={image.alt} />
                                                        <AvatarFallback>
                                                            <ImageIcon className="h-6 w-6" />
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <p className="text-xs text-muted-foreground truncate">{image.alt}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Videos Preview */}
                                {formData.videos.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold mb-3">Videos ({formData.videos.length})</h4>
                                        <div className="space-y-2">
                                            {formData.videos.map((video) => (
                                                <div key={video.id} className="flex items-center gap-3 p-3 border rounded-lg">
                                                    <VideoIcon className="h-4 w-4 text-muted-foreground" />
                                                    <div className="flex-1">
                                                        <p className="font-medium text-sm">{video.title}</p>
                                                        <p className="text-xs text-muted-foreground truncate">{video.url}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Terms Preview */}
                                {formData.admissionTerms && (
                                    <div>
                                        <h4 className="font-semibold mb-3">Admission Terms</h4>
                                        <div className="p-4 border rounded-lg bg-muted/30">
                                            <p className="text-sm whitespace-pre-wrap">{formData.admissionTerms}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Objectives Preview */}
                                {formData.objectives && (
                                    <div>
                                        <h4 className="font-semibold mb-3">University Objectives</h4>
                                        <div className="p-4 border rounded-lg bg-muted/30">
                                            <p className="text-sm whitespace-pre-wrap">{formData.objectives}</p>
                                        </div>
                                    </div>
                                )}

                                {!formData.images.length && !formData.videos.length && !formData.admissionTerms && !formData.objectives && (
                                    <div className="text-center py-8">
                                        <p className="text-muted-foreground">No content configured yet</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={updateContentLoading}>
                        {updateContentLoading ? (
                            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                            <Save className="h-4 w-4 mr-2" />
                        )}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}; 