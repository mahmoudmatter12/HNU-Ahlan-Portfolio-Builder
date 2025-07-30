"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Facebook, Twitter, Instagram, Linkedin, Youtube, MessageCircle, Phone, Mail, Globe } from "lucide-react"
import type { SocialMediaLinks } from "@/types/Collage"

interface SocialMediaDisplayProps {
    socialMedia: SocialMediaLinks | null
    onEdit?: () => void
}

// Icon mapping for preset platforms with brand colors
const platformIcons: Record<string, { icon: any; color: string; bgColor: string }> = {
    facebook: { icon: Facebook, color: "#1877F2", bgColor: "#E7F3FF" },
    twitter: { icon: Twitter, color: "#1DA1F2", bgColor: "#E8F5FE" },
    instagram: { icon: Instagram, color: "#E4405F", bgColor: "#FEE8EF" },
    linkedin: { icon: Linkedin, color: "#0A66C2", bgColor: "#E8F2FF" },
    youtube: { icon: Youtube, color: "#FF0000", bgColor: "#FFE8E8" },
    whatsapp: { icon: MessageCircle, color: "#25D366", bgColor: "#E8FFF0" },
    telegram: { icon: MessageCircle, color: "#0088CC", bgColor: "#E8F7FF" },
    email: { icon: Mail, color: "#EA4335", bgColor: "#FFE8E8" },
    phone: { icon: Phone, color: "#34A853", bgColor: "#E8FFF0" },
    website: { icon: Globe, color: "#4285F4", bgColor: "#E8F2FF" },
    tiktok: { icon: Globe, color: "#000000", bgColor: "#F0F0F0" },
    snapchat: { icon: Globe, color: "#FFFC00", bgColor: "#FFFEF0" },
}

// Icon mapping for custom links with colors
const customIcons: Record<string, { icon: any; color: string; bgColor: string }> = {
    globe: { icon: Globe, color: "#4285F4", bgColor: "#E8F2FF" },
    facebook: { icon: Facebook, color: "#1877F2", bgColor: "#E7F3FF" },
    twitter: { icon: Twitter, color: "#1DA1F2", bgColor: "#E8F5FE" },
    instagram: { icon: Instagram, color: "#E4405F", bgColor: "#FEE8EF" },
    linkedin: { icon: Linkedin, color: "#0A66C2", bgColor: "#E8F2FF" },
    youtube: { icon: Youtube, color: "#FF0000", bgColor: "#FFE8E8" },
    "message-circle": { icon: MessageCircle, color: "#25D366", bgColor: "#E8FFF0" },
    phone: { icon: Phone, color: "#34A853", bgColor: "#E8FFF0" },
    mail: { icon: Mail, color: "#EA4335", bgColor: "#FFE8E8" },
    "external-link": { icon: ExternalLink, color: "#6B7280", bgColor: "#F3F4F6" },
}

export function SocialMediaDisplay({ socialMedia, onEdit }: SocialMediaDisplayProps) {
    if (!socialMedia || Object.keys(socialMedia).length === 0) {
        return (
            <div className="">
                <div className="text-center py-8 text-gray-500">
                    <div className="h-12 w-12 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl">📱</span>
                    </div>
                    <p className="text-sm">No social media links added yet</p>
                    <p className="text-xs">Click &quot;Edit Social Media&quot; to add links</p>
                </div>
            </div>
        )
    }

    const presetPlatforms = [
        { key: "facebook", label: "Facebook" },
        { key: "twitter", label: "Twitter" },
        { key: "instagram", label: "Instagram" },
        { key: "linkedin", label: "LinkedIn" },
        { key: "youtube", label: "YouTube" },
        { key: "whatsapp", label: "WhatsApp" },
        { key: "telegram", label: "Telegram" },
        { key: "tiktok", label: "TikTok" },
        { key: "snapchat", label: "Snapchat" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "website", label: "Website" },
    ]

    const hasPresetLinks = presetPlatforms.some(platform => socialMedia[platform.key as keyof SocialMediaLinks])
    const hasCustomLinks = socialMedia.customLinks && socialMedia.customLinks.length > 0

    return (
        <div className="space-y-6">
            {/* Preset Platforms */}
            {hasPresetLinks && (
                <div>
                    <h4 className="font-medium mb-4">Social Media Platforms</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {presetPlatforms.map((platform) => {
                            const value = socialMedia[platform.key as keyof SocialMediaLinks]
                            if (!value || typeof value !== 'string') return null

                            const platformData = platformIcons[platform.key] || { icon: Globe, color: "#6B7280", bgColor: "#F3F4F6" }
                            const IconComponent = platformData.icon
                            const isPhone = platform.key === "phone"
                            const isEmail = platform.key === "email"
                            const isWhatsApp = platform.key === "whatsapp"

                            let href = value
                            if (isPhone) {
                                href = `tel:${value}`
                            } else if (isEmail) {
                                href = `mailto:${value}`
                            } else if (isWhatsApp) {
                                href = `https://wa.me/${value.replace(/\D/g, '')}`
                            } else if (!value.startsWith('http')) {
                                href = `https://${value}`
                            }

                            return (
                                <Card key={platform.key} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div
                                                    className="p-2 rounded-lg"
                                                    style={{ backgroundColor: platformData.bgColor }}
                                                >
                                                    <IconComponent
                                                        className="h-4 w-4"
                                                        style={{ color: platformData.color }}
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">{platform.label}</p>
                                                    <p className="text-xs text-gray-600 truncate max-w-[150px]">{value}</p>
                                                </div>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => window.open(href, '_blank')}
                                            >
                                                <ExternalLink className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Custom Links */}
            {hasCustomLinks && (
                <div>
                    <h4 className="font-medium mb-4">Custom Links</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {socialMedia.customLinks!.map((link, index) => {
                            const iconData = customIcons[link.icon] || { icon: Globe, color: "#6B7280", bgColor: "#F3F4F6" }
                            const IconComponent = iconData.icon

                            return (
                                <Card key={link.id || index} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div
                                                    className="p-2 rounded-lg"
                                                    style={{ backgroundColor: iconData.bgColor }}
                                                >
                                                    <IconComponent
                                                        className="h-4 w-4"
                                                        style={{ color: iconData.color }}
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">{link.name}</p>
                                                    <p className="text-xs text-gray-600 truncate max-w-[150px]">{link.url}</p>
                                                </div>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => window.open(link.url, '_blank')}
                                            >
                                                <ExternalLink className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Summary */}
            <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-gray-600">
                    {hasPresetLinks && hasCustomLinks && (
                        <span>
                            {presetPlatforms.filter(p => socialMedia[p.key as keyof SocialMediaLinks]).length} platforms • {socialMedia.customLinks?.length || 0} custom links
                        </span>
                    )}
                    {hasPresetLinks && !hasCustomLinks && (
                        <span>
                            {presetPlatforms.filter(p => socialMedia[p.key as keyof SocialMediaLinks]).length} social media platforms
                        </span>
                    )}
                    {!hasPresetLinks && hasCustomLinks && (
                        <span>
                            {socialMedia.customLinks?.length || 0} custom links
                        </span>
                    )}
                </div>

                {onEdit && (
                    <Button onClick={onEdit} variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Edit Links
                    </Button>
                )}
            </div>
        </div>
    )
} 