"use client"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Hash, FileText, Settings, Star } from "lucide-react"
import type { CollegeSection } from "@/types/Collage"
import type { SectionType, HeroSectionSettings, AboutSectionSettings, StudentActivitiesSectionSettings, WhyUsSectionSettings, CustomSectionSettings } from "@/types/section"
import { SECTION_TYPE_CONFIGS } from "@/types/section"
import ReactMarkdown from 'react-markdown'
import Image from "next/image"

interface ViewSectionDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    section: CollegeSection | null
    onEdit?: () => void
    onDelete?: () => void
}

export function ViewSectionDialog({ open, onOpenChange, section, onEdit, onDelete }: ViewSectionDialogProps) {
    if (!section) return null

    const sectionType = section.sectionType as SectionType
    const config = SECTION_TYPE_CONFIGS[sectionType]
    const settings = section.settings

    const renderSectionPreview = () => {
        switch (sectionType) {
            case "HERO":
                const heroSettings = settings as HeroSectionSettings
                return (
                    <div className="relative h-64 rounded-lg overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600">
                        {heroSettings?.backgroundImage && (
                            <Image
                                fill
                                src={heroSettings.backgroundImage}
                                alt="Hero background"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        )}

                        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center p-6">
                            {heroSettings?.catchphrase && (
                                <p className="text-xl max-w-2xl">{heroSettings.catchphrase}</p>
                            )}
                        </div>
                    </div>
                )

            case "ABOUT":
                const aboutSettings = settings as AboutSectionSettings
                return (
                    <div className="space-y-6">
                        {aboutSettings?.title && (
                            <h2 className="text-2xl font-bold">{aboutSettings.title}</h2>
                        )}
                        {aboutSettings?.description && (
                            <p className="text-gray-600">{aboutSettings.description}</p>
                        )}
                        {aboutSettings?.images && aboutSettings.images.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {aboutSettings.images.map((image: string, index: number) => (
                                    <div key={index} className="aspect-square rounded-lg overflow-hidden">
                                        <Image
                                            src={image}
                                            alt={`About ${index + 1}`}
                                            width={300}
                                            height={300}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                        {section.content && (
                            <div className="prose max-w-none">
                                <ReactMarkdown>{section.content}</ReactMarkdown>
                            </div>
                        )}
                    </div>
                )

            case "STUDENT_ACTIVITIES":
                const studentSettings = settings as StudentActivitiesSectionSettings
                return (
                    <div className="space-y-6">
                        {studentSettings?.title && (
                            <h2 className="text-2xl font-bold">{studentSettings.title}</h2>
                        )}
                        {studentSettings?.description && (
                            <p className="text-gray-600">{studentSettings.description}</p>
                        )}
                        {studentSettings?.images && studentSettings.images.length > 0 && (
                            <div className={`grid gap-4 grid-cols-1`}>
                                {studentSettings.images.map((image: string, index: number) => (
                                    <div key={index} className="aspect-video rounded-lg overflow-hidden">
                                        <Image
                                            src={image}
                                            alt={`Activity ${index + 1}`}
                                            width={600}
                                            height={400}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                        {section.content && (
                            <div className="prose max-w-none">
                                <ReactMarkdown>{section.content}</ReactMarkdown>
                            </div>
                        )}
                    </div>
                )

            case "WHY_US":
                const whyUsSettings = settings as WhyUsSectionSettings
                return (
                    <div className="space-y-6">
                        {whyUsSettings?.title && (
                            <h2 className="text-2xl font-bold">{whyUsSettings.title}</h2>
                        )}
                        {whyUsSettings?.description && (
                            <p className="text-gray-600">{whyUsSettings.description}</p>
                        )}
                        {whyUsSettings?.images && whyUsSettings.images.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                                {whyUsSettings.images.map((image: string, index: number) => (
                                    <div key={index} className="aspect-square rounded-lg overflow-hidden">
                                        <Image
                                            src={image}
                                            alt={`Why Us ${index + 1}`}
                                            width={300}
                                            height={300}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                        {whyUsSettings?.features && whyUsSettings.features.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {whyUsSettings.features.map((feature: { title: string; description: string; icon?: string }, index: number) => (
                                    <Card key={index}>
                                        <CardContent className="p-4">
                                            <div className="flex items-start gap-3">
                                                <Star className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <h3 className="font-semibold">{feature.title}</h3>
                                                    <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                        {section.content && (
                            <div className="prose max-w-none">
                                <ReactMarkdown>{section.content}</ReactMarkdown>
                            </div>
                        )}
                    </div>
                )

            case "CUSTOM":
                const customSettings = settings as CustomSectionSettings

                const renderCustomImages = () => {
                    if (!customSettings?.images || customSettings.images.length === 0) {
                        return null;
                    }

                    const displayType = customSettings.imageDisplayType || "slider";

                    switch (displayType) {
                        case "single":
                            return (
                                <div className="relative w-full h-64 rounded-lg overflow-hidden">
                                    <Image
                                        src={customSettings.images[0]}
                                        alt="Custom"
                                        width={800}
                                        height={400}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            );

                        case "grid":
                            return (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {customSettings.images.map((image: string, index: number) => (
                                        <div key={index} className="aspect-square rounded-lg overflow-hidden">
                                            <Image
                                                src={image}
                                                alt={`Custom ${index + 1}`}
                                                width={300}
                                                height={300}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            );

                        case "banner":
                            return (
                                <div className="relative w-full h-48 rounded-lg overflow-hidden">
                                    <Image
                                        src={customSettings.images[0]}
                                        alt="Banner"
                                        width={800}
                                        height={300}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                        <div className="text-white text-center">
                                            <h3 className="text-xl font-bold">{customSettings.title}</h3>
                                            {customSettings.description && (
                                                <p className="mt-2">{customSettings.description}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );

                        case "carousel":
                            return (
                                <div className="relative w-full h-64 rounded-lg overflow-hidden">
                                    <div className="flex overflow-x-auto snap-x snap-mandatory">
                                        {customSettings.images.map((image: string, index: number) => (
                                            <div key={index} className="flex-shrink-0 w-full h-full snap-start">
                                                <Image
                                                    src={image}
                                                    alt={`Carousel ${index + 1}`}
                                                    width={800}
                                                    height={400}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                        {customSettings.images.map((_, index) => (
                                            <div key={index} className="w-2 h-2 bg-white rounded-full opacity-60"></div>
                                        ))}
                                    </div>
                                </div>
                            );

                        case "gallery":
                            return (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {customSettings.images.map((image: string, index: number) => (
                                        <div key={index} className="aspect-video rounded-lg overflow-hidden group">
                                            <Image
                                                src={image}
                                                alt={`Gallery ${index + 1}`}
                                                width={400}
                                                height={300}
                                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all"></div>
                                        </div>
                                    ))}
                                </div>
                            );

                        case "list":
                            return (
                                <div className="space-y-4">
                                    {customSettings.images.map((image: string, index: number) => (
                                        <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                                            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={image}
                                                    alt={`List ${index + 1}`}
                                                    width={80}
                                                    height={80}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium">Image {index + 1}</h4>
                                                <p className="text-sm text-gray-500">Custom section image</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            );

                        case "background":
                            return (
                                <div className="relative w-full h-64 rounded-lg overflow-hidden">
                                    <Image
                                        src={customSettings.images[0]}
                                        alt="Background"
                                        width={800}
                                        height={400}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                    <div className="absolute bottom-6 left-6 text-white">
                                        <h3 className="text-xl font-bold">{customSettings.title}</h3>
                                        {customSettings.description && (
                                            <p className="mt-2 text-white/90">{customSettings.description}</p>
                                        )}
                                    </div>
                                </div>
                            );

                        case "slider":
                        default:
                            return (
                                <div className="relative w-full h-64 rounded-lg overflow-hidden">
                                    <div className="flex overflow-x-auto snap-x snap-mandatory">
                                        {customSettings.images.map((image: string, index: number) => (
                                            <div key={index} className="flex-shrink-0 w-full h-full snap-start">
                                                <Image
                                                    src={image}
                                                    alt={`Slider ${index + 1}`}
                                                    width={800}
                                                    height={400}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                                        {customSettings.images.length} image{customSettings.images.length !== 1 ? 's' : ''}
                                    </div>
                                </div>
                            );
                    }
                };

                return (
                    <div className="space-y-6">
                        {customSettings?.title && (
                            <h2 className="text-2xl font-bold">{customSettings.title}</h2>
                        )}
                        {customSettings?.description && (
                            <p className="text-gray-600">{customSettings.description}</p>
                        )}
                        {renderCustomImages()}
                        {section.content && (
                            <div className="prose max-w-none">
                                <ReactMarkdown>{section.content}</ReactMarkdown>
                            </div>
                        )}
                    </div>
                )

            default:
                return (
                    <div className="prose max-w-none">
                        {section.content ? (
                            <ReactMarkdown>{section.content}</ReactMarkdown>
                        ) : (
                            <p className="text-gray-500 italic">No content available</p>
                        )}
                    </div>
                )
        }
    }

    const renderSettingsDetails = () => {
        if (!settings) {
            return <p className="text-gray-500 italic">No settings configured</p>
        }

        switch (sectionType) {
            case "HERO":
                const heroSettings = settings as HeroSectionSettings
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-600">Background Image</label>
                            <div className="mt-1">
                                {heroSettings.backgroundImage ? (
                                    <div className="relative w-full h-32 rounded-lg overflow-hidden">
                                        <Image fill src={heroSettings.backgroundImage} alt="Background" className="object-cover" />
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">No background image set</p>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">Catchphrase</label>
                            <p className="mt-1 text-sm">{heroSettings.catchphrase || "No catchphrase set"}</p>
                        </div>
                    </div>
                )

            case "ABOUT":
                const aboutSettings = settings as AboutSectionSettings
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-600">Section Title</label>
                            <p className="mt-1 text-sm">{aboutSettings.title || "No title set"}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">Description</label>
                            <p className="mt-1 text-sm">{aboutSettings.description || "No description set"}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">Images ({aboutSettings.images?.length || 0})</label>
                            {aboutSettings.images && aboutSettings.images.length > 0 ? (
                                <div className="mt-2 grid grid-cols-3 gap-2">
                                    {aboutSettings.images.map((image: string, index: number) => (
                                        <div key={index} className="w-full h-16 rounded overflow-hidden">
                                            <Image
                                                src={image}
                                                alt={`Image ${index + 1}`}
                                                width={80}
                                                height={64}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="mt-1 text-sm text-gray-500">No images uploaded</p>
                            )}
                        </div>
                    </div>
                )

            case "STUDENT_ACTIVITIES":
                const studentSettings = settings as StudentActivitiesSectionSettings
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-600">Section Title</label>
                            <p className="mt-1 text-sm">{studentSettings.title || "No title set"}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">Description</label>
                            <p className="mt-1 text-sm">{studentSettings.description || "No description set"}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">Activity Images ({studentSettings.images?.length || 0})</label>
                            {studentSettings.images && studentSettings.images.length > 0 ? (
                                <div className="mt-2 grid grid-cols-3 gap-2">
                                    {studentSettings.images.map((image: string, index: number) => (
                                        <div key={index} className="w-full h-16 rounded overflow-hidden">
                                            <Image
                                                src={image}
                                                alt={`Activity ${index + 1}`}
                                                width={80}
                                                height={64}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="mt-1 text-sm text-gray-500">No images uploaded</p>
                            )}
                        </div>
                    </div>
                )

            case "WHY_US":
                const whyUsSettings = settings as WhyUsSectionSettings
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-600">Section Title</label>
                            <p className="mt-1 text-sm">{whyUsSettings.title || "No title set"}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">Description</label>
                            <p className="mt-1 text-sm">{whyUsSettings.description || "No description set"}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">Features ({whyUsSettings.features?.length || 0})</label>
                            {whyUsSettings.features && whyUsSettings.features.length > 0 ? (
                                <div className="mt-2 space-y-2">
                                    {whyUsSettings.features.map((feature: { title: string; description: string; icon?: string }, index: number) => (
                                        <div key={index} className="border rounded p-2">
                                            <p className="font-medium text-sm">{feature.title}</p>
                                            <p className="text-xs text-gray-600">{feature.description}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="mt-1 text-sm text-gray-500">No features added</p>
                            )}
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">Images ({whyUsSettings.images?.length || 0})</label>
                            {whyUsSettings.images && whyUsSettings.images.length > 0 ? (
                                <div className="mt-2 grid grid-cols-3 gap-2">
                                    {whyUsSettings.images.map((image: string, index: number) => (
                                        <div key={index} className="w-full h-16 rounded overflow-hidden">
                                            <Image
                                                src={image}
                                                alt={`Why Us ${index + 1}`}
                                                width={80}
                                                height={64}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="mt-1 text-sm text-gray-500">No images uploaded</p>
                            )}
                        </div>
                    </div>
                )

            case "CUSTOM":
                const customSettings = settings as CustomSectionSettings
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-600">Section Title</label>
                            <p className="mt-1 text-sm">{customSettings.title || "No title set"}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">Description</label>
                            <p className="mt-1 text-sm">{customSettings.description || "No description set"}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">Image Display Type</label>
                            <p className="mt-1 text-sm">
                                {customSettings.imageDisplayType ? (
                                    <Badge variant="outline" className="capitalize">
                                        {customSettings.imageDisplayType.replace('_', ' ')}
                                    </Badge>
                                ) : (
                                    "Slider (default)"
                                )}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">Images ({customSettings.images?.length || 0})</label>
                            {customSettings.images && customSettings.images.length > 0 ? (
                                <div className="mt-2 grid grid-cols-3 gap-2">
                                    {customSettings.images.map((image: string, index: number) => (
                                        <div key={index} className="w-full h-16 rounded overflow-hidden">
                                            <Image
                                                src={image}
                                                alt={`Custom ${index + 1}`}
                                                width={80}
                                                height={64}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="mt-1 text-sm text-gray-500">No images uploaded</p>
                            )}
                        </div>
                    </div>
                )

            default:
                return (
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600">Settings for this section type are not configured.</p>
                    </div>
                )
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <span>{config?.icon}</span>
                        {section.title}
                    </DialogTitle>
                    <DialogDescription>
                        {config?.description} • Order: {section.order}
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="preview" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                        <TabsTrigger value="details">Details</TabsTrigger>
                    </TabsList>

                    <TabsContent value="preview" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Section Preview</CardTitle>
                                <CardDescription>How this section will appear on the public page</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {renderSectionPreview()}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="settings" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Settings className="h-4 w-4" />
                                    Section Settings
                                </CardTitle>
                                <CardDescription>Configuration for this {sectionType.toLowerCase()} section</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {renderSettingsDetails()}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="details" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    Section Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Section ID</label>
                                        <div className="mt-1 flex items-center gap-2">
                                            <Hash className="h-4 w-4 text-gray-400" />
                                            <code className="text-sm bg-gray-100 px-2 py-1 rounded">{section.id}</code>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Section Type</label>
                                        <div className="mt-1">
                                            <Badge variant="outline" className="flex items-center gap-1 w-fit">
                                                <span>{config?.icon}</span>
                                                {config?.label}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Display Order</label>
                                        <div className="mt-1 flex items-center gap-2">
                                            <span className="text-sm">{section.order}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Created</label>
                                        <div className="mt-1 flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm">{new Date(section.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Last Updated</label>
                                        <div className="mt-1 flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm">{new Date(section.updatedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Has Content</label>
                                        <div className="mt-1">
                                            <Badge variant={section.content ? "default" : "secondary"}>
                                                {section.content ? "Yes" : "No"}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                {section.content && (
                                    <>
                                        <Separator />
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Markdown Content</label>
                                            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                                                <pre className="text-sm whitespace-pre-wrap">{section.content}</pre>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-2">
                    {onDelete && (
                        <Button variant="destructive" onClick={onDelete}>
                            Delete Section
                        </Button>
                    )}
                    {onEdit && (
                        <Button onClick={onEdit}>
                            Edit Section
                        </Button>
                    )}
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
} 