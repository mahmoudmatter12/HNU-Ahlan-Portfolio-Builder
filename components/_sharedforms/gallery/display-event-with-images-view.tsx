import { GalleryEvent } from '@/types/Collage'
import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel'
import { Button } from '@/components/ui/button'
import { Calendar, Image as ImageIcon } from 'lucide-react'
import { format } from 'date-fns'
import Image from 'next/image'

export interface DisplayEventWithImagesViewProps {
    event: GalleryEvent
    trigger?: React.ReactNode
}

function DisplayEventWithImagesView({ event, trigger }: DisplayEventWithImagesViewProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="sm">
                        <ImageIcon className="w-4 h-4 mr-2" />
                        View Event
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">{event.eventName}</DialogTitle>
                    <DialogDescription className="flex items-center gap-2 text-base">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(event.eventDate), 'PPP')}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Event Description */}
                    <div className="bg-muted/50 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">Event Description</h3>
                        <p className="text-muted-foreground leading-relaxed">{event.description}</p>
                    </div>

                    {/* Images Carousel */}
                    {event.images && event.images.length > 0 ? (
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg">Event Images</h3>
                            <div className="relative">
                                <Carousel
                                    className="w-full"
                                    opts={{
                                        loop: true,
                                        align: 'start',
                                        dragFree: true,
                                    }}
                                >
                                    <CarouselContent>
                                        {event.images.map((image, index) => (
                                            <CarouselItem key={index} className="basis-full md:basis-1/2 lg:basis-1/3">
                                                <div className="p-1">
                                                    <div className="group relative aspect-video overflow-hidden rounded-lg border bg-muted transition-all hover:shadow-lg">
                                                        <Image
                                                            fill
                                                            src={image.url}
                                                            alt={image.description || `Event image ${index + 1}`}
                                                            className="object-cover transition-transform group-hover:scale-105"
                                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                            priority={index === 0}
                                                        />
                                                        {/* Image overlay with description */}
                                                        {image.description && (
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <p className="text-white text-sm">
                                                                    {image.description}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    {event.images.length > 1 && (
                                        <>
                                            <CarouselPrevious className="left-2 h-8 w-8" />
                                            <CarouselNext className="right-2 h-8 w-8" />
                                        </>
                                    )}
                                </Carousel>
                            </div>

                            {/* Image counter and indicators */}
                            {event.images.length > 1 && (
                                <div className="flex flex-col items-center gap-2">
                                    <div className="flex gap-1">
                                        {event.images.map((_, index) => (
                                            <div
                                                key={index}
                                                className="h-1 w-1 rounded-full bg-muted-foreground/30"
                                                aria-hidden="true"
                                            />
                                        ))}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {event.images.length} image{event.images.length !== 1 ? 's' : ''}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>No images available for this event</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default DisplayEventWithImagesView