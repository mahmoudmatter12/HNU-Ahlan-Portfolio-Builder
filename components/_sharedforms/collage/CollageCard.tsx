import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Eye, Edit, Trash2, MoreVertical, Users, FileText, Calendar } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { College } from "@/types/Collage";
import { useLocale } from "next-intl";
import * as React from "react";

const collegeTypeColors = {
    TECHNICAL: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
    MEDICAL: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
    ARTS: "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300",
    OTHER: "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300",
};

type CollageCardProps = {
    college: College;
    isSuperAdmin?: boolean;
    onEdit?: (college: College) => void;
    onDelete?: (college: College) => void;
};

export function CollageCard({ college, isSuperAdmin, onEdit, onDelete }: CollageCardProps) {
    const locale = useLocale();
    const users = college.User?.length || 0;
    const sections = college.sections?.length || 0;
    const forms = college.forms?.length || 0;
    const programs = college.programs?.length || 0;

    return (
        <Card className="hover:shadow-lg transition-shadow duration-200 bg-gray-900/50 border-gray-800 hover:border-gray-700">
            <CardHeader className="flex flex-col items-center pt-6 pb-2">
                <div className="relative mb-2">
                    <Avatar className="size-20 border-4 border-gray-800 shadow-lg">
                        {college.logoUrl ? (
                            <AvatarImage src={college.logoUrl} alt={college.name} />
                        ) : (
                            <AvatarFallback className="bg-gradient-to-br from-gray-800 to-gray-900 text-gray-400 text-2xl font-bold">
                                {college.name.charAt(0)}
                            </AvatarFallback>
                        )}
                    </Avatar>
                    <div className="absolute -bottom-2 right-0">
                        <Badge className={collegeTypeColors[college.type]} variant="secondary">
                            {college.type}
                        </Badge>
                    </div>
                </div>
                <CardTitle className="text-lg line-clamp-1 text-white text-center w-full">{college.name}</CardTitle>
                <CardDescription className="mt-1 text-gray-400 text-center w-full">/{college.slug}</CardDescription>
            </CardHeader>
            <CardContent className="pb-3">
                <div className="grid grid-cols-4 gap-4 text-sm">
                    <div className="flex flex-col items-center gap-1 p-2 bg-gray-800/50 rounded">
                        <Users className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-300 font-medium">{users}</span>
                        <span className="text-xs text-gray-500">Users</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 p-2 bg-gray-800/50 rounded">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-300 font-medium">{sections}</span>
                        <span className="text-xs text-gray-500">Sections</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 p-2 bg-gray-800/50 rounded">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-300 font-medium">{forms}</span>
                        <span className="text-xs text-gray-500">Forms</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 p-2 bg-gray-800/50 rounded">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-300 font-medium">{programs}</span>
                        <span className="text-xs text-gray-500">Programs</span>
                    </div>
                </div>
                {college.createdBy && isSuperAdmin && (
                    <div className="mt-3 text-xs text-gray-500 flex items-center gap-2 justify-center">
                        <Avatar className="size-5">
                            {college.createdBy.image ? (
                                <AvatarImage src={college.createdBy.image} alt={college.createdBy.name || ''} />
                            ) : (
                                <AvatarFallback>
                                    {college.createdBy.name?.charAt(0) || college.createdBy.email?.charAt(0)}
                                </AvatarFallback>
                            )}
                        </Avatar>
                        <span>Created by {college.createdBy.name || college.createdBy.email}</span>
                    </div>
                )}
            </CardContent>
            <CardFooter className="pt-3 border-t border-gray-800 flex flex-col gap-2">
                <div className="flex gap-2 w-full">
                    <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800"
                    >
                        <Link href={`/${locale}/admin/dashboard/collages/${college.slug}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                        </Link>
                    </Button>
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
                            <DropdownMenuItem onClick={() => onEdit?.(college)} className="text-gray-300 hover:text-white hover:bg-gray-800">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onDelete?.(college)}
                                className="text-red-400 hover:text-red-300 hover:bg-gray-800"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardFooter>
        </Card>
    );
} 