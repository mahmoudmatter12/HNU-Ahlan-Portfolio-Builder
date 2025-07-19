"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, MessageCircle, Facebook } from "lucide-react"
import type { CollageLeader } from "@/types/Collage"

interface CollageLeadersDisplayProps {
    leaders: CollageLeader[]
    onEdit?: () => void
}

export function CollageLeadersDisplay({ leaders, onEdit }: CollageLeadersDisplayProps) {
    if (!leaders || leaders.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <div className="h-12 w-12 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">👥</span>
                </div>
                <p className="text-sm">No collage leaders added yet</p>
                <p className="text-xs">Click &quot;Edit Collage Leaders&quot; to add leaders</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {leaders.map((leader) => (
                    <Card key={leader.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                            <div className="flex items-center space-x-3">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={leader.image} alt={leader.name} />
                                    <AvatarFallback className="bg-blue-100 text-blue-600">
                                        {leader.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <CardTitle className="text-lg truncate">{leader.name}</CardTitle>
                                    <p className="text-sm text-gray-600 truncate">{leader.collage}</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Badge variant="secondary" className="text-xs">
                                    {leader.year}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                    {leader.program}
                                </Badge>
                            </div>

                            <div className="flex space-x-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => window.open(`https://wa.me/${leader.whatsapp}`, '_blank')}
                                >
                                    <MessageCircle className="h-3 w-3 mr-1" />
                                    WhatsApp
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => window.open(leader.facebook, '_blank')}
                                >
                                    <Facebook className="h-3 w-3 mr-1" />
                                    Facebook
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {onEdit && (
                <div className="flex justify-center pt-4">
                    <Button onClick={onEdit} variant="outline">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Edit Leaders
                    </Button>
                </div>
            )}
        </div>
    )
} 