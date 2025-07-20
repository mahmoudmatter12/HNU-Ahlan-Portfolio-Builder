"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
    FileText,
    Users,
    CheckCircle,
    Clock,
    TrendingUp,
    Eye,
    Edit
} from "lucide-react"
import type { CollegeFormSection } from "@/types/Collage"

interface FormsOverviewProps {
    forms: CollegeFormSection[]
    onViewForm?: (form: CollegeFormSection) => void
    onEditForm?: (form: CollegeFormSection) => void
}

export function FormsOverview({ forms, onViewForm, onEditForm }: FormsOverviewProps) {
    if (!forms || forms.length === 0) {
        return (
            <Card className="border-dashed">
                <CardContent className="p-6">
                    <div className="text-center text-gray-500">
                        <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No forms created yet</p>
                        <p className="text-xs">Create your first form to start collecting data</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    const totalSubmissions = forms.reduce((total, form) => total + (form._count?.submissions || 0), 0)
    const totalFields = forms.reduce((total, form) => total + (form._count?.fields || 0), 0)
    const activeForms = forms.filter(form => (form._count?.submissions || 0) > 0).length

    return (
        <div className="space-y-6">
            {/* Forms Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-500" />
                            <div>
                                <div className="text-2xl font-bold">{forms.length}</div>
                                <div className="text-xs text-gray-600">Total Forms</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <div>
                                <div className="text-2xl font-bold">{activeForms}</div>
                                <div className="text-xs text-gray-600">Active Forms</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-purple-500" />
                            <div>
                                <div className="text-2xl font-bold">{totalSubmissions}</div>
                                <div className="text-xs text-gray-600">Total Submissions</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-orange-500" />
                            <div>
                                <div className="text-2xl font-bold">{totalFields}</div>
                                <div className="text-xs text-gray-600">Total Fields</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Forms List */}
            <Card>
                <CardHeader>
                    <CardTitle>Forms Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {forms.map((form) => {
                            const submissionCount = form._count?.submissions || 0
                            const fieldCount = form._count?.fields || 0
                            const isActive = submissionCount > 0
                            const avgSubmissionsPerField = fieldCount > 0 ? Math.round(submissionCount / fieldCount) : 0

                            return (
                                <div key={form.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="font-medium">{form.title}</h3>
                                                <Badge variant={isActive ? "default" : "secondary"} className="text-xs">
                                                    {isActive ? "Active" : "Inactive"}
                                                </Badge>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                <div>
                                                    <span className="text-gray-600">Fields:</span>
                                                    <span className="ml-1 font-medium">{fieldCount}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600">Submissions:</span>
                                                    <span className="ml-1 font-medium">{submissionCount}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600">Avg/Field:</span>
                                                    <span className="ml-1 font-medium">{avgSubmissionsPerField}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600">Created:</span>
                                                    <span className="ml-1 font-medium">
                                                        {new Date(form.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Progress bar for submission activity */}
                                            {isActive && (
                                                <div className="mt-3">
                                                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                                                        <span>Submission Activity</span>
                                                        <span>{submissionCount} submissions</span>
                                                    </div>
                                                    <Progress
                                                        value={Math.min((submissionCount / 100) * 100, 100)}
                                                        className="h-2"
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-2 ml-4">
                                            {onViewForm && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => onViewForm(form)}
                                                >
                                                    <Eye className="h-3 w-3 mr-1" />
                                                    View
                                                </Button>
                                            )}
                                            {onEditForm && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => onEditForm(form)}
                                                >
                                                    <Edit className="h-3 w-3 mr-1" />
                                                    Edit
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
} 