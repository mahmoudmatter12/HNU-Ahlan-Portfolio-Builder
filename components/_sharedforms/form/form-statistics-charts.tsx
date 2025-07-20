"use client"

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
    Filler,
} from 'chart.js'
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, PieChart as PieChartIcon, TrendingUp, Activity } from "lucide-react"

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
    Filler
)

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

interface FormStatisticsChartsProps {
    analytics: FormAnalytics
}

const COLORS = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1',
    '#F43F5E', '#A855F7', '#14B8A6', '#FBBF24', '#34D399'
]

export function FormStatisticsCharts({ analytics }: FormStatisticsChartsProps) {
    // Response Rate Chart Data
    const responseRateData = {
        labels: analytics.fieldStatistics.map(field =>
            field.fieldLabel.length > 15 ? field.fieldLabel.substring(0, 15) + "..." : field.fieldLabel
        ),
        datasets: [
            {
                label: 'Response Rate (%)',
                data: analytics.fieldStatistics.map(field => field.responseRate),
                backgroundColor: COLORS[0],
                borderColor: COLORS[0],
                borderWidth: 1,
                borderRadius: 4,
            },
        ],
    }

    const responseRateOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    title: (context: any) => {
                        const index = context[0].dataIndex
                        return analytics.fieldStatistics[index].fieldLabel
                    },
                    label: (context: any) => {
                        const index = context[0].dataIndex
                        const field = analytics.fieldStatistics[index]
                        return [
                            `Response Rate: ${field.responseRate.toFixed(1)}%`,
                            `Total Responses: ${field.totalResponses}`,
                            `Field Type: ${field.fieldType}`,
                        ]
                    },
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    callback: (value: any) => `${value}%`,
                },
            },
            x: {
                ticks: {
                    maxRotation: 45,
                    minRotation: 45,
                },
            },
        },
    }

    // Submission Trend Chart Data
    const trendData = {
        labels: analytics.submissionTrend.map(day =>
            new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        ),
        datasets: [
            {
                label: 'Submissions',
                data: analytics.submissionTrend.map(day => day.count),
                borderColor: COLORS[2],
                backgroundColor: COLORS[2] + '20',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: COLORS[2],
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
            },
        ],
    }

    const trendOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => `${context.parsed.y} submissions`,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                },
            },
        },
    }

    // Field Type Distribution Chart Data
    const fieldTypeCounts = analytics.fieldStatistics.reduce((acc, field) => {
        acc[field.fieldType] = (acc[field.fieldType] || 0) + 1
        return acc
    }, {} as Record<string, number>)

    const fieldTypeData = {
        labels: Object.keys(fieldTypeCounts),
        datasets: [
            {
                data: Object.values(fieldTypeCounts),
                backgroundColor: COLORS.slice(0, Object.keys(fieldTypeCounts).length),
                borderWidth: 2,
                borderColor: '#fff',
            },
        ],
    }

    const fieldTypeOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => `${context.label}: ${context.parsed} fields`,
                },
            },
        },
    }

    // Top Performing Fields Chart Data
    const topFieldsData = {
        labels: analytics.topPerformingFields.slice(0, 5).map(field =>
            field.fieldLabel.length > 12 ? field.fieldLabel.substring(0, 12) + "..." : field.fieldLabel
        ),
        datasets: [
            {
                label: 'Total Responses',
                data: analytics.topPerformingFields.slice(0, 5).map(field => field.totalResponses),
                backgroundColor: COLORS[3],
                borderColor: COLORS[3],
                borderWidth: 1,
                borderRadius: 4,
            },
        ],
    }

    const topFieldsOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    title: (context: any) => {
                        const index = context[0].dataIndex
                        return analytics.topPerformingFields[index].fieldLabel
                    },
                    label: (context: any) => {
                        const index = context[0].dataIndex
                        const field = analytics.topPerformingFields[index]
                        return [
                            `Total Responses: ${field.totalResponses}`,
                            `Response Rate: ${field.responseRate.toFixed(1)}%`,
                            `Field Type: ${field.fieldType}`,
                        ]
                    },
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                },
            },
            x: {
                ticks: {
                    maxRotation: 45,
                    minRotation: 45,
                },
            },
        },
    }

    // Response Distribution for Select/Radio/Checkbox Fields
    const createResponseDistributionChart = (field: FieldStatistics) => {
        const data = {
            labels: field.responseDistribution.slice(0, 5).map(item =>
                item.value.length > 15 ? item.value.substring(0, 15) + "..." : item.value
            ),
            datasets: [
                {
                    data: field.responseDistribution.slice(0, 5).map(item => item.count),
                    backgroundColor: COLORS.slice(0, field.responseDistribution.slice(0, 5).length),
                    borderWidth: 2,
                    borderColor: '#fff',
                },
            ],
        }

        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom' as const,
                },
                tooltip: {
                    callbacks: {
                        title: (context: any) => {
                            const index = context[0].dataIndex
                            return field.responseDistribution[index].value
                        },
                        label: (context: any) => {
                            const index = context[0].dataIndex
                            const item = field.responseDistribution[index]
                            return [
                                `Count: ${item.count}`,
                                `Percentage: ${item.percentage.toFixed(1)}%`,
                            ]
                        },
                    },
                },
            },
        }

        return { data, options }
    }

    // Completion Rate Doughnut Chart
    const completionRateData = {
        labels: ['Completed', 'Incomplete'],
        datasets: [
            {
                data: [analytics.completionRate, 100 - analytics.completionRate],
                backgroundColor: [COLORS[2], '#E5E7EB'],
                borderWidth: 0,
            },
        ],
    }

    const completionRateOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => `${context.label}: ${context.parsed.toFixed(1)}%`,
                },
            },
        },
    }

    return (
        <div className="space-y-6">
            {/* Response Rate Chart */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Field Response Rates
                    </CardTitle>
                    <CardDescription>
                        Response rates for all form fields
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-80">
                        <Bar data={responseRateData} options={responseRateOptions} />
                    </div>
                </CardContent>
            </Card>

            {/* Submission Trend Chart */}
            {analytics.submissionTrend.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Submission Trend
                        </CardTitle>
                        <CardDescription>
                            Daily submission activity over the last 7 days
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80">
                            <Line data={trendData} options={trendOptions} />
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Completion Rate Overview */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Overall Completion Rate
                    </CardTitle>
                    <CardDescription>
                        Average completion rate across all fields
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-64">
                        <Doughnut data={completionRateData} options={completionRateOptions} />
                    </div>
                </CardContent>
            </Card>

            {/* Field Type Distribution */}
            {Object.keys(fieldTypeCounts).length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PieChartIcon className="h-5 w-5" />
                            Field Type Distribution
                        </CardTitle>
                        <CardDescription>
                            Distribution of field types in the form
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80">
                            <Pie data={fieldTypeData} options={fieldTypeOptions} />
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Top Performing Fields */}
            {analytics.topPerformingFields.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" />
                            Top Performing Fields
                        </CardTitle>
                        <CardDescription>
                            Fields with highest response rates
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80">
                            <Bar data={topFieldsData} options={topFieldsOptions} />
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Response Distribution for Select/Radio/Checkbox Fields */}
            {analytics.fieldStatistics
                .filter(field => ["SELECT", "RADIO", "CHECKBOX"].includes(field.fieldType))
                .slice(0, 3)
                .map(field => {
                    const { data, options } = createResponseDistributionChart(field)
                    return (
                        <Card key={field.fieldId}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <PieChartIcon className="h-5 w-5" />
                                    {field.fieldLabel} - Response Distribution
                                </CardTitle>
                                <CardDescription>
                                    How users responded to this {field.fieldType.toLowerCase()} field
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-80">
                                    <Pie data={data} options={options} />
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
        </div>
    )
} 