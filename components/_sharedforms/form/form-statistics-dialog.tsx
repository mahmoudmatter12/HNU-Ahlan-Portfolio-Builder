"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { FormService } from "@/services/form-service"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
    BarChart3,
    PieChart,
    TrendingUp,
    Users,
    Calendar,
    Clock,
    FileText,
    Download,
    Eye,
    BarChart,
    Activity,
    Target,
    CheckCircle,
    XCircle,
    AlertCircle,
    Building2,
    Globe,
} from "lucide-react"
import { toast } from "sonner"
import type { FormSection, FormField, FormSubmission } from "@/types/form"
import type { College } from "@/types/Collage"
import { FormStatisticsCharts } from "./form-statistics-charts"

interface FormStatisticsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    form: FormSection | null
}

interface FieldStatistics {
    fieldId: string
    fieldLabel: string
    fieldType: string
    totalResponses: number
    responseRate: number
    uniqueResponses: number
    mostCommonResponse?: string
    responseDistribution: { value: string; count: number; percentage: number }[]
    averageValue?: number
    minValue?: number
    maxValue?: number
    requiredField: boolean
    requiredCompletionRate: number
}

interface FormAnalytics {
    totalSubmissions: number
    totalFields: number
    averageCompletionTime: number
    submissionTrend: { date: string; count: number }[]
    fieldStatistics: FieldStatistics[]
    topPerformingFields: FieldStatistics[]
    lowResponseFields: FieldStatistics[]
    completionRate: number
    averageFieldsPerSubmission: number
    recentActivity: { date: string; submissions: number }[]
}

export function FormStatisticsDialog({ open, onOpenChange, form }: FormStatisticsDialogProps) {
    const [activeTab, setActiveTab] = useState("overview")

    // Fetch form submissions
    const {
        data: submissions,
        isLoading: submissionsLoading,
        isError: submissionsError,
    } = useQuery({
        queryKey: ["form-submissions", form?.id],
        queryFn: () => form ? FormService.getFormSubmissions(form.id) : Promise.resolve([]),
        enabled: !!form,
    })

    // Fetch form with fields
    const {
        data: formWithFields,
        isLoading: formLoading,
    } = useQuery({
        queryKey: ["form-with-fields", form?.id],
        queryFn: () => form ? FormService.getFormSectionWithFields(form.id) : Promise.resolve(null),
        enabled: !!form,
    })

    const isLoading = submissionsLoading || formLoading
    const isError = submissionsError

    // Calculate analytics
    const calculateAnalytics = (): FormAnalytics | null => {
        if (!submissions || !formWithFields) return null

        const fields = formWithFields.fields || []
        const totalSubmissions = submissions.length

        if (totalSubmissions === 0) {
            return {
                totalSubmissions: 0,
                totalFields: fields.length,
                averageCompletionTime: 0,
                submissionTrend: [],
                fieldStatistics: [],
                topPerformingFields: [],
                lowResponseFields: [],
                completionRate: 0,
                averageFieldsPerSubmission: 0,
                recentActivity: [],
            }
        }

        // Calculate field statistics
        const fieldStats: FieldStatistics[] = fields.map(field => {
            const responses = submissions
                .map((sub: FormSubmission) => sub.data[field.label])
                .filter((response: any) => response !== undefined && response !== null && response !== "")

            const totalResponses = responses.length
            const responseRate = (totalResponses / totalSubmissions) * 100

            // Calculate response distribution
            const responseCounts: { [key: string]: number } = {}
            responses.forEach((response: any) => {
                const value = String(response)
                responseCounts[value] = (responseCounts[value] || 0) + 1
            })

            const responseDistribution = Object.entries(responseCounts)
                .map(([value, count]) => ({
                    value,
                    count,
                    percentage: (count / totalResponses) * 100
                }))
                .sort((a, b) => b.count - a.count)

            const mostCommonResponse = responseDistribution[0]?.value

            // Calculate numeric statistics for number fields
            let averageValue, minValue, maxValue
            if (field.type === "NUMBER") {
                const numericResponses = responses
                    .map((r: any) => parseFloat(String(r)))
                    .filter((n: number) => !isNaN(n))

                if (numericResponses.length > 0) {
                    averageValue = numericResponses.reduce((a: number, b: number) => a + b, 0) / numericResponses.length
                    minValue = Math.min(...numericResponses)
                    maxValue = Math.max(...numericResponses)
                }
            }

            // Calculate required field completion rate
            const requiredCompletionRate = field.isRequired
                ? (totalResponses / totalSubmissions) * 100
                : 100

            return {
                fieldId: field.id,
                fieldLabel: field.label,
                fieldType: field.type,
                totalResponses,
                responseRate,
                uniqueResponses: responseDistribution.length,
                mostCommonResponse,
                responseDistribution,
                averageValue,
                minValue,
                maxValue,
                requiredField: field.isRequired,
                requiredCompletionRate,
            }
        })

        // Calculate submission trend (last 7 days)
        const now = new Date()
        const submissionTrend = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(now)
            date.setDate(date.getDate() - i)
            const dateStr = date.toISOString().split('T')[0]
            const count = submissions.filter((sub: FormSubmission) =>
                new Date(sub.submittedAt).toISOString().split('T')[0] === dateStr
            ).length
            return { date: dateStr, count }
        }).reverse()

        // Calculate average completion time (simplified - using submission timestamps)
        const averageCompletionTime = 0 // Would need more detailed timing data

        // Sort fields by performance
        const topPerformingFields = [...fieldStats]
            .sort((a, b) => b.responseRate - a.responseRate)
            .slice(0, 5)

        const lowResponseFields = [...fieldStats]
            .sort((a, b) => a.responseRate - b.responseRate)
            .slice(0, 5)

        // Calculate overall completion rate
        const completionRate = fields.length > 0
            ? fieldStats.reduce((sum, field) => sum + field.responseRate, 0) / fields.length
            : 0

        // Calculate average fields per submission
        const averageFieldsPerSubmission = fields.length > 0
            ? fieldStats.reduce((sum, field) => sum + field.totalResponses, 0) / totalSubmissions
            : 0

        // Recent activity (last 5 submissions)
        const recentActivity = submissions
            .slice(-5)
            .map((sub: FormSubmission) => ({
                date: new Date(sub.submittedAt).toLocaleDateString(),
                submissions: 1
            }))

        return {
            totalSubmissions,
            totalFields: fields.length,
            averageCompletionTime,
            submissionTrend,
            fieldStatistics: fieldStats,
            topPerformingFields,
            lowResponseFields,
            completionRate,
            averageFieldsPerSubmission,
            recentActivity,
        }
    }

    const analytics = calculateAnalytics()

    const exportData = () => {
        if (!analytics) return

        const csvData = [
            ["Field", "Type", "Total Responses", "Response Rate (%)", "Most Common Response", "Unique Responses"],
            ...analytics.fieldStatistics.map(field => [
                field.fieldLabel,
                field.fieldType,
                field.totalResponses.toString(),
                field.responseRate.toFixed(1),
                field.mostCommonResponse || "N/A",
                field.uniqueResponses.toString(),
            ])
        ]

        const csvContent = csvData.map(row => row.join(",")).join("\n")
        const blob = new Blob([csvContent], { type: "text/csv" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${form?.title || "form"}-statistics.csv`
        a.click()
        window.URL.revokeObjectURL(url)
        toast.success("Statistics exported successfully!")
    }

    if (!form) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Form Statistics: {form.title}
                    </DialogTitle>
                    <DialogDescription>
                        Detailed analytics and insights for form responses and field performance.
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {[...Array(4)].map((_, i) => (
                                <Skeleton key={i} className="h-32" />
                            ))}
                        </div>
                        <Skeleton className="h-64" />
                    </div>
                ) : isError ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Error loading statistics</h3>
                            <p className="text-muted-foreground">Failed to load form statistics. Please try again.</p>
                        </div>
                    </div>
                ) : analytics ? (
                    <div className="space-y-6">
                        {/* Overview Statistics */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{analytics.totalSubmissions}</div>
                                    <p className="text-xs text-muted-foreground">
                                        All time responses
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                                    <Target className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{analytics.completionRate.toFixed(1)}%</div>
                                    <p className="text-xs text-muted-foreground">
                                        Average field completion
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Fields</CardTitle>
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{analytics.totalFields}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Form fields
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Avg Fields/Response</CardTitle>
                                    <Activity className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{analytics.averageFieldsPerSubmission.toFixed(1)}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Per submission
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Detailed Analytics */}
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-5">
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="fields">Field Analysis</TabsTrigger>
                                <TabsTrigger value="performance">Performance</TabsTrigger>
                                <TabsTrigger value="trends">Trends</TabsTrigger>
                                <TabsTrigger value="charts">Charts</TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="space-y-6">
                                <div className="grid gap-6 md:grid-cols-2">
                                    {/* Top Performing Fields */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <TrendingUp className="h-5 w-5" />
                                                Top Performing Fields
                                            </CardTitle>
                                            <CardDescription>
                                                Fields with highest response rates
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {analytics.topPerformingFields.map((field, index) => (
                                                    <div key={field.fieldId} className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <Badge variant="outline" className="w-8 h-8 rounded-full p-0 flex items-center justify-center">
                                                                {index + 1}
                                                            </Badge>
                                                            <div>
                                                                <p className="font-medium">{field.fieldLabel}</p>
                                                                <p className="text-sm text-muted-foreground">{field.fieldType}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-semibold">{field.responseRate.toFixed(1)}%</p>
                                                            <p className="text-sm text-muted-foreground">{field.totalResponses} responses</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Low Response Fields */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <AlertCircle className="h-5 w-5" />
                                                Low Response Fields
                                            </CardTitle>
                                            <CardDescription>
                                                Fields that need attention
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {analytics.lowResponseFields.map((field, index) => (
                                                    <div key={field.fieldId} className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <Badge variant="outline" className="w-8 h-8 rounded-full p-0 flex items-center justify-center">
                                                                {index + 1}
                                                            </Badge>
                                                            <div>
                                                                <p className="font-medium">{field.fieldLabel}</p>
                                                                <p className="text-sm text-muted-foreground">{field.fieldType}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-semibold">{field.responseRate.toFixed(1)}%</p>
                                                            <p className="text-sm text-muted-foreground">{field.totalResponses} responses</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>

                            <TabsContent value="fields" className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold">Field-by-Field Analysis</h3>
                                    <Button onClick={exportData} variant="outline" size="sm">
                                        <Download className="h-4 w-4 mr-2" />
                                        Export Data
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    {analytics.fieldStatistics.map((field) => (
                                        <Card key={field.fieldId}>
                                            <CardHeader>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <CardTitle className="flex items-center gap-2">
                                                            {field.fieldLabel}
                                                            <Badge variant={field.requiredField ? "default" : "secondary"}>
                                                                {field.requiredField ? "Required" : "Optional"}
                                                            </Badge>
                                                        </CardTitle>
                                                        <CardDescription>
                                                            {field.fieldType} • {field.totalResponses} responses ({field.responseRate.toFixed(1)}% response rate)
                                                        </CardDescription>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-2xl font-bold">{field.responseRate.toFixed(1)}%</p>
                                                        <p className="text-sm text-muted-foreground">Response Rate</p>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-4">
                                                    {/* Response Distribution */}
                                                    {field.responseDistribution.length > 0 && (
                                                        <div>
                                                            <h4 className="font-medium mb-2">Response Distribution</h4>
                                                            <div className="space-y-2">
                                                                {field.responseDistribution.slice(0, 5).map((response, index) => (
                                                                    <div key={index} className="flex items-center justify-between">
                                                                        <span className="text-sm truncate flex-1">{response.value}</span>
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="w-24 bg-muted rounded-full h-2">
                                                                                <div
                                                                                    className="bg-primary h-2 rounded-full"
                                                                                    style={{ width: `${response.percentage}%` }}
                                                                                />
                                                                            </div>
                                                                            <span className="text-sm text-muted-foreground w-12 text-right">
                                                                                {response.count}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {field.responseDistribution.length > 5 && (
                                                                    <p className="text-sm text-muted-foreground">
                                                                        +{field.responseDistribution.length - 5} more responses
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Numeric Statistics */}
                                                    {field.fieldType === "NUMBER" && field.averageValue !== undefined && (
                                                        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                                                            <div className="text-center">
                                                                <p className="text-2xl font-bold">{field.averageValue.toFixed(1)}</p>
                                                                <p className="text-sm text-muted-foreground">Average</p>
                                                            </div>
                                                            <div className="text-center">
                                                                <p className="text-2xl font-bold">{field.minValue}</p>
                                                                <p className="text-sm text-muted-foreground">Minimum</p>
                                                            </div>
                                                            <div className="text-center">
                                                                <p className="text-2xl font-bold">{field.maxValue}</p>
                                                                <p className="text-sm text-muted-foreground">Maximum</p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Most Common Response */}
                                                    {field.mostCommonResponse && (
                                                        <div className="pt-4 border-t">
                                                            <h4 className="font-medium mb-2">Most Common Response</h4>
                                                            <p className="text-sm bg-muted p-2 rounded">{field.mostCommonResponse}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="performance" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <BarChart className="h-5 w-5" />
                                            Field Performance Overview
                                        </CardTitle>
                                        <CardDescription>
                                            Response rates for all fields
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {analytics.fieldStatistics.map((field) => (
                                                <div key={field.fieldId} className="flex items-center justify-between p-4 border rounded-lg">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                                            <FileText className="h-5 w-5 text-primary" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">{field.fieldLabel}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {field.fieldType} • {field.totalResponses} responses
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-32 bg-muted rounded-full h-3">
                                                                <div
                                                                    className={`h-3 rounded-full ${field.responseRate >= 80 ? 'bg-green-500' :
                                                                        field.responseRate >= 60 ? 'bg-yellow-500' :
                                                                            'bg-red-500'
                                                                        }`}
                                                                    style={{ width: `${field.responseRate}%` }}
                                                                />
                                                            </div>
                                                            <span className="font-semibold w-12 text-right">
                                                                {field.responseRate.toFixed(1)}%
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">
                                                            {field.uniqueResponses} unique values
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="trends" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <TrendingUp className="h-5 w-5" />
                                            Submission Trends
                                        </CardTitle>
                                        <CardDescription>
                                            Daily submission activity over the last 7 days
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {analytics.submissionTrend.length > 0 ? (
                                            <div className="space-y-4">
                                                {analytics.submissionTrend.map((day) => (
                                                    <div key={day.date} className="flex items-center justify-between">
                                                        <span className="text-sm">{new Date(day.date).toLocaleDateString()}</span>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-32 bg-muted rounded-full h-2">
                                                                <div
                                                                    className="bg-primary h-2 rounded-full"
                                                                    style={{
                                                                        width: `${Math.max((day.count / Math.max(...analytics.submissionTrend.map(d => d.count))) * 100, 5)}%`
                                                                    }}
                                                                />
                                                            </div>
                                                            <span className="text-sm font-medium w-8 text-right">
                                                                {day.count}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-muted-foreground text-center py-8">
                                                No submission data available for trend analysis
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="charts" className="space-y-6">
                                <FormStatisticsCharts analytics={analytics} />
                            </TabsContent>
                        </Tabs>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
                            <p className="text-muted-foreground">This form has no submissions yet.</p>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
} 