"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Youtube,
    Globe2,
    ExternalLink,
    Plus,
    Trash2,
    Save,
    AlertTriangle,
    RefreshCw,
    Verified,
    Link,
    Check,
    X
} from "lucide-react";
import { UniService } from "@/services/uni.service";
import { SocialMediaLinks } from "@/types/uni";
import { cn } from "@/lib/utils";

// Social media platforms with icons
const socialMediaPlatforms = [
    { key: "facebook", label: "Facebook", icon: Facebook, color: "text-blue-600", bgColor: "bg-blue-50", placeholder: "https://facebook.com/your-university" },
    { key: "twitter", label: "Twitter", icon: Twitter, color: "text-blue-400", bgColor: "bg-blue-50", placeholder: "https://twitter.com/your-university" },
    { key: "instagram", label: "Instagram", icon: Instagram, color: "text-pink-500", bgColor: "bg-pink-50", placeholder: "https://instagram.com/your-university" },
    { key: "linkedin", label: "LinkedIn", icon: Linkedin, color: "text-blue-700", bgColor: "bg-blue-50", placeholder: "https://linkedin.com/company/your-university" },
    { key: "youtube", label: "YouTube", icon: Youtube, color: "text-red-600", bgColor: "bg-red-50", placeholder: "https://youtube.com/@your-university" },
];

interface SocialMediaLinksDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    currentLinks: SocialMediaLinks;
    universityName: string;
    universitySlug: string;
}

export function SocialMediaLinksDialog({
    open,
    onOpenChange,
    currentLinks,
    universityName,
    universitySlug
}: SocialMediaLinksDialogProps) {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // State for form
    const [socialMedia, setSocialMedia] = useState<SocialMediaLinks>({});
    const [editStep, setEditStep] = useState<"form" | "verify">("form");
    const [verificationCode, setVerificationCode] = useState("");
    const [generatedCode, setGeneratedCode] = useState("");

    // Initialize form when dialog opens
    useEffect(() => {
        if (open) {
            setSocialMedia(currentLinks || {});
            setEditStep("form");
            setVerificationCode("");
            setGeneratedCode("");
        }
    }, [open, currentLinks]);



    // Update mutation
    const updateMutation = useMutation({
        mutationFn: UniService.updateUniversity,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["university"] });
            toast({
                title: "Success",
                description: "Social media links updated successfully",
            });
            onOpenChange(false);
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

    // Handle social media link update
    const handleSocialMediaUpdate = (platform: string, url: string) => {
        const updated = { ...socialMedia };
        if (url.trim()) {
            updated[platform] = url.trim();
        } else {
            delete updated[platform];
        }
        setSocialMedia(updated);
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (editStep === "form") {
            // Request verification code
            try {
                const response = await UniService.updateUniversity({
                    name: universityName,
                    slug: universitySlug,
                    socialMedia,
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
                name: universityName,
                slug: universitySlug,
                socialMedia,
                verificationStep: "verify",
                verificationCode,
            });
        }
    };

    // Handle cancel
    const handleCancel = () => {
        onOpenChange(false);
        setEditStep("form");
        setVerificationCode("");
        setGeneratedCode("");
    };

    // Get active links count
    const activeLinksCount = Object.keys(socialMedia).filter(key => socialMedia[key]?.trim()).length;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Link className="h-5 w-5" />
                        {editStep === "form" ? "Manage Social Media Links" : "Verify Changes"}
                    </DialogTitle>
                    <DialogDescription>
                        {editStep === "form"
                            ? "Add or update your university's social media links below."
                            : "Enter the verification code to confirm your changes."}
                    </DialogDescription>
                </DialogHeader>

                {editStep === "form" ? (
                    <div className="space-y-6">
                        {/* Current Links Summary */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg">Current Links</CardTitle>
                                <CardDescription>
                                    {activeLinksCount} of {socialMediaPlatforms.length} platforms configured
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {activeLinksCount > 0 ? (
                                    <div className="grid grid-cols-1 gap-3">
                                        {Object.entries(socialMedia).map(([platform, url]) => {
                                            if (!url?.trim()) return null;
                                            const platformConfig = socialMediaPlatforms.find(p => p.key === platform);
                                            const Icon = platformConfig?.icon || Globe2;

                                            return (
                                                <div key={platform} className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                                                    <div className={cn("p-2 rounded-lg", platformConfig?.bgColor || "bg-gray-50")}>
                                                        <Icon className={`h-4 w-4 ${platformConfig?.color || "text-gray-600"}`} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-sm">{platformConfig?.label || platform}</p>
                                                        <p className="text-xs text-muted-foreground truncate">{url}</p>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => window.open(url, '_blank')}
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <ExternalLink className="h-3 w-3" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleSocialMediaUpdate(platform, "")}
                                                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <div className="p-3 rounded-full bg-muted/50 mb-3">
                                            <Globe2 className="h-6 w-6 text-muted-foreground" />
                                        </div>
                                        <p className="text-sm text-muted-foreground">No social media links configured</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Separator />

                        {/* Add/Edit Links */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                <h3 className="font-medium text-lg">Add or Edit Links</h3>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {socialMediaPlatforms.map((platform) => {
                                    const Icon = platform.icon;
                                    const isActive = socialMedia[platform.key]?.trim();

                                    return (
                                        <div key={platform.key} className="space-y-2">
                                            <Label className="flex items-center gap-2">
                                                <Icon className={`h-4 w-4 ${platform.color}`} />
                                                {platform.label}
                                                {isActive && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        <Check className="h-3 w-3 mr-1" />
                                                        Active
                                                    </Badge>
                                                )}
                                            </Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    type="url"
                                                    placeholder={platform.placeholder}
                                                    value={socialMedia[platform.key] || ""}
                                                    onChange={(e) => handleSocialMediaUpdate(platform.key, e.target.value)}
                                                    className="flex-1"
                                                />
                                                {isActive && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => window.open(socialMedia[platform.key], '_blank')}
                                                        className="flex-shrink-0"
                                                    >
                                                        <ExternalLink className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Tips */}
                        <Alert>
                            <Globe2 className="h-4 w-4" />
                            <AlertDescription>
                                <p className="font-medium mb-1">Tips for social media links:</p>
                                <ul className="text-sm space-y-1 mt-2">
                                    <li>• Use the full URL including https://</li>
                                    <li>• Make sure the links are publicly accessible</li>
                                    <li>• Test your links before saving</li>
                                    <li>• Leave empty to remove a platform link</li>
                                </ul>
                            </AlertDescription>
                        </Alert>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <Alert>
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription className="space-y-2">
                                <p>We&apos;ve sent a verification code to your registered email address.</p>
                                <p className="font-medium">Demo Code: <span className="font-mono bg-muted px-2 py-1 rounded">{generatedCode || "Loading..."}</span></p>
                            </AlertDescription>
                        </Alert>

                        {/* Changes Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Changes Summary</CardTitle>
                                <CardDescription>Review what will be updated</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {Object.entries(socialMedia).map(([platform, url]) => {
                                        const platformConfig = socialMediaPlatforms.find(p => p.key === platform);
                                        const Icon = platformConfig?.icon || Globe2;
                                        const wasActive = currentLinks[platform]?.trim();
                                        const isActive = url?.trim();

                                        if (!wasActive && !isActive) return null;

                                        return (
                                            <div key={platform} className="flex items-center gap-3 p-3 rounded-lg border">
                                                <div className={cn("p-2 rounded-lg", platformConfig?.bgColor || "bg-gray-50")}>
                                                    <Icon className={`h-4 w-4 ${platformConfig?.color || "text-gray-600"}`} />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-sm">{platformConfig?.label || platform}</p>
                                                    {wasActive && !isActive && (
                                                        <p className="text-xs text-destructive">Will be removed</p>
                                                    )}
                                                    {!wasActive && isActive && (
                                                        <p className="text-xs text-green-600">Will be added</p>
                                                    )}
                                                    {wasActive && isActive && wasActive !== isActive && (
                                                        <p className="text-xs text-blue-600">Will be updated</p>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {wasActive && (
                                                        <span className="text-xs text-muted-foreground line-through">
                                                            {currentLinks[platform]}
                                                        </span>
                                                    )}
                                                    {isActive && (
                                                        <span className="text-xs font-medium">
                                                            {url}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>

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
                    <Button variant="outline" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
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
    );
} 