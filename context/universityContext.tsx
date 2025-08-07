"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DeleteUniversityData, SocialMediaLinks, University, UpdateUniversityData, UniversityContent } from '@/types/uni';
import { UniService } from '@/services/uni.service';
import { useToast } from '@/hooks/use-toast';

interface UniversityContextType {
    // Data
    university: University | null;
    loading: boolean;
    error: string | null;

    // Basic operations
    refetchUniversity: () => Promise<void>;

    // Update operations
    updateUniversity: (data: UpdateUniversityData) => Promise<any>;
    updateUniversityLoading: boolean;

    // Delete operations
    deleteUniversity: (data: DeleteUniversityData) => Promise<any>;
    deleteUniversityLoading: boolean;

    // Social media operations
    updateSocialMedia: (socialMedia: SocialMediaLinks) => Promise<any>;

    // Content operations
    updateContent: (content: UniversityContent) => Promise<any>;
    updateContentLoading: boolean;
    addImage: (image: { url: string; alt: string; caption?: string }) => Promise<any>;
    removeImage: (imageId: string) => Promise<any>;
    addVideo: (video: { title: string; url: string; description?: string }) => Promise<any>;
    removeVideo: (videoId: string) => Promise<any>;

    // Utility functions
    getUniversityStats: () => {
        collegesCount: number;
        totalUsers: number;
        totalSections: number;
        totalForms: number;
    };

    // Verification states
    verificationCode: string;
    setVerificationCode: (code: string) => void;
    generatedCode: string;
    setGeneratedCode: (code: string) => void;

    // Delete verification states
    deleteVerificationCode: string;
    setDeleteVerificationCode: (code: string) => void;
    deleteGeneratedCode: string;
    setDeleteGeneratedCode: (code: string) => void;
    finalConfirmation: string;
    setFinalConfirmation: (text: string) => void;
    deleteStats: any;
    setDeleteStats: (stats: any) => void;
}

const UniversityContext = createContext<UniversityContextType | undefined>(undefined);

interface UniversityProviderProps {
    children: ReactNode;
}

export const UniversityProvider: React.FC<UniversityProviderProps> = ({ children }) => {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // State for verification codes
    const [verificationCode, setVerificationCode] = useState("");
    const [generatedCode, setGeneratedCode] = useState("");
    const [deleteVerificationCode, setDeleteVerificationCode] = useState("");
    const [deleteGeneratedCode, setDeleteGeneratedCode] = useState("");
    const [finalConfirmation, setFinalConfirmation] = useState("");
    const [deleteStats, setDeleteStats] = useState<any>(null);

    // Fetch university data
    const {
        data: university,
        isLoading: loading,
        error: fetchError,
        refetch: refetchUniversity
    } = useQuery({
        queryKey: ["university"],
        queryFn: UniService.getUniversity,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });

    // Update university mutation
    const updateMutation = useMutation({
        mutationFn: UniService.updateUniversity,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["university"] });
            toast({
                title: "Success",
                description: "University updated successfully",
            });
            // Reset verification states
            setVerificationCode("");
            setGeneratedCode("");
            return data;
        },
        onError: (error: Error) => {
            toast({
                title: "Error",
                description: error.message || "Failed to update university",
                variant: "destructive",
            });
            throw error;
        },
    });

    // Delete university mutation
    const deleteMutation = useMutation({
        mutationFn: UniService.deleteUniversity,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["university"] });
            toast({
                title: "Success",
                description: "University deleted successfully",
            });
            // Reset all verification states
            setVerificationCode("");
            setGeneratedCode("");
            setDeleteVerificationCode("");
            setDeleteGeneratedCode("");
            setFinalConfirmation("");
            setDeleteStats(null);
            return data;
        },
        onError: (error: Error) => {
            toast({
                title: "Error",
                description: error.message || "Failed to delete university",
                variant: "destructive",
            });
            throw error;
        },
    });

    // Update content mutation
    const updateContentMutation = useMutation({
        mutationFn: UniService.updateUniversity,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["university"] });
            toast({
                title: "Success",
                description: "University content updated successfully",
            });
            return data;
        },
        onError: (error: Error) => {
            toast({
                title: "Error",
                description: error.message || "Failed to update university content",
                variant: "destructive",
            });
            throw error;
        },
    });

    // Update university function
    const updateUniversity = async (data: UpdateUniversityData) => {
        return updateMutation.mutateAsync(data);
    };

    // Delete university function
    const deleteUniversity = async (data: DeleteUniversityData) => {
        return deleteMutation.mutateAsync(data);
    };

    // Update social media function
    const updateSocialMedia = async (socialMedia: SocialMediaLinks) => {
        if (!university) {
            throw new Error("University data not available");
        }

        return updateMutation.mutateAsync({
            name: university.name,
            slug: university.slug,
            socialMedia,
        });
    };

    // Update content function
    const updateContent = async (content: UniversityContent) => {
        if (!university) {
            throw new Error("University data not available");
        }

        return updateContentMutation.mutateAsync({
            name: university.name,
            slug: university.slug,
            content,
        });
    };

    // Add image function
    const addImage = async (image: { url: string; alt: string; caption?: string }) => {
        if (!university) {
            throw new Error("University data not available");
        }

        const currentContent = university.content || {
            images: [],
            videos: [],
            admissionTerms: "",
            objectives: "",
            lastUpdated: new Date(),
        };

        const newImage = {
            id: Date.now().toString(),
            ...image,
        };

        const updatedContent = {
            ...currentContent,
            images: [...currentContent.images, newImage],
            lastUpdated: new Date(),
        };

        return updateContentMutation.mutateAsync({
            name: university.name,
            slug: university.slug,
            content: updatedContent,
        });
    };

    // Remove image function
    const removeImage = async (imageId: string) => {
        if (!university) {
            throw new Error("University data not available");
        }

        const currentContent = university.content;
        if (!currentContent) {
            throw new Error("No content available");
        }

        const updatedContent = {
            ...currentContent,
            images: currentContent.images.filter(img => img.id !== imageId),
            lastUpdated: new Date(),
        };

        return updateContentMutation.mutateAsync({
            name: university.name,
            slug: university.slug,
            content: updatedContent,
        });
    };

    // Add video function
    const addVideo = async (video: { title: string; url: string; description?: string }) => {
        if (!university) {
            throw new Error("University data not available");
        }

        const currentContent = university.content || {
            images: [],
            videos: [],
            admissionTerms: "",
            objectives: "",
            lastUpdated: new Date(),
        };

        const newVideo = {
            id: Date.now().toString(),
            ...video,
        };

        const updatedContent = {
            ...currentContent,
            videos: [...currentContent.videos, newVideo],
            lastUpdated: new Date(),
        };

        return updateContentMutation.mutateAsync({
            name: university.name,
            slug: university.slug,
            content: updatedContent,
        });
    };

    // Remove video function
    const removeVideo = async (videoId: string) => {
        if (!university) {
            throw new Error("University data not available");
        }

        const currentContent = university.content;
        if (!currentContent) {
            throw new Error("No content available");
        }

        const updatedContent = {
            ...currentContent,
            videos: currentContent.videos.filter(video => video.id !== videoId),
            lastUpdated: new Date(),
        };

        return updateContentMutation.mutateAsync({
            name: university.name,
            slug: university.slug,
            content: updatedContent,
        });
    };

    // Get university statistics
    const getUniversityStats = () => {
        if (!university) {
            return {
                collegesCount: 0,
                totalUsers: 0,
                totalSections: 0,
                totalForms: 0,
            };
        }

        const collegesCount = university.colleges.length;
        const totalUsers = university.colleges.reduce(
            (acc, college) => acc + (college.User?.length || 0),
            0
        );
        const totalSections = university.colleges.reduce(
            (acc, college) => acc + (college.sections?.length || 0),
            0
        );
        const totalForms = university.colleges.reduce(
            (acc, college) => acc + (college.forms?.length || 0),
            0
        );

        return {
            collegesCount,
            totalUsers,
            totalSections,
            totalForms,
        };
    };

    const value: UniversityContextType = {
        // Data
        university: university || null,
        loading,
        error: fetchError ? (fetchError as Error).message : null,

        // Basic operations
        refetchUniversity: async () => {
            await refetchUniversity();
        },

        // Update operations
        updateUniversity,
        updateUniversityLoading: updateMutation.isPending,

        // Delete operations
        deleteUniversity,
        deleteUniversityLoading: deleteMutation.isPending,

        // Social media operations
        updateSocialMedia,

        // Content operations
        updateContent,
        updateContentLoading: updateContentMutation.isPending,
        addImage,
        removeImage,
        addVideo,
        removeVideo,

        // Utility functions
        getUniversityStats,

        // Verification states
        verificationCode,
        setVerificationCode,
        generatedCode,
        setGeneratedCode,

        // Delete verification states
        deleteVerificationCode,
        setDeleteVerificationCode,
        deleteGeneratedCode,
        setDeleteGeneratedCode,
        finalConfirmation,
        setFinalConfirmation,
        deleteStats,
        setDeleteStats,
    };

    return (
        <UniversityContext.Provider value={value}>
            {children}
        </UniversityContext.Provider>
    );
};

export const useUniversity = (): UniversityContextType => {
    const context = useContext(UniversityContext);
    if (context === undefined) {
        throw new Error('useUniversity must be used within a UniversityProvider');
    }
    return context;
};

// Convenience hooks for common use cases
export const useUniversityData = (): University | null => {
    const { university } = useUniversity();
    return university;
};

export const useUniversityLoading = (): boolean => {
    const { loading } = useUniversity();
    return loading;
};

export const useUniversityError = (): string | null => {
    const { error } = useUniversity();
    return error;
};

export const useUniversityStats = () => {
    const { getUniversityStats } = useUniversity();
    return getUniversityStats();
};

export const useUniversityUpdate = () => {
    const { updateUniversity, updateUniversityLoading } = useUniversity();
    return { updateUniversity, updateUniversityLoading };
};

export const useUniversityDelete = () => {
    const { deleteUniversity, deleteUniversityLoading } = useUniversity();
    return { deleteUniversity, deleteUniversityLoading };
};

export const useUniversitySocialMedia = () => {
    const { updateSocialMedia, university } = useUniversity();
    return {
        updateSocialMedia,
        socialMedia: university?.socialMedia || null
    };
};

export const useUniversityVerification = () => {
    const {
        verificationCode,
        setVerificationCode,
        generatedCode,
        setGeneratedCode
    } = useUniversity();

    return {
        verificationCode,
        setVerificationCode,
        generatedCode,
        setGeneratedCode,
    };
};

export const useUniversityDeleteVerification = () => {
    const {
        deleteVerificationCode,
        setDeleteVerificationCode,
        deleteGeneratedCode,
        setDeleteGeneratedCode,
        finalConfirmation,
        setFinalConfirmation,
        deleteStats,
        setDeleteStats,
    } = useUniversity();

    return {
        deleteVerificationCode,
        setDeleteVerificationCode,
        deleteGeneratedCode,
        setDeleteGeneratedCode,
        finalConfirmation,
        setFinalConfirmation,
        deleteStats,
        setDeleteStats,
    };
};

export const useUniversityContent = () => {
    const {
        updateContent,
        updateContentLoading,
        addImage,
        removeImage,
        addVideo,
        removeVideo,
        university
    } = useUniversity();

    return {
        updateContent,
        updateContentLoading,
        addImage,
        removeImage,
        addVideo,
        removeVideo,
        content: university?.content || null,
    };
}; 