"use client"

import React, { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { SectionService } from '@/services/section.service'
import { toast } from 'sonner'
import { Loader2, GripVertical, Eye, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { CollegeSection } from '@/types/Collage'
import type { ReorderSectionRequest } from '@/types/section'
import { SECTION_TYPE_CONFIGS } from '@/types/section'

interface DraggableSectionItemProps {
    section: CollegeSection
    onView: () => void
    onEdit: () => void
    onDelete: () => void
}

function DraggableSectionItem({ section, onView, onEdit, onDelete }: DraggableSectionItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: section.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    const sectionType = section.sectionType as keyof typeof SECTION_TYPE_CONFIGS
    const config = SECTION_TYPE_CONFIGS[sectionType]

    return (
        <Card
            ref={setNodeRef}
            style={style}
            className={`transition-all duration-200 ${isDragging
                ? 'shadow-lg scale-105 rotate-2 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800'
                : 'hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
        >
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                        <div
                            {...attributes}
                            {...listeners}
                            className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                        >
                            <GripVertical className="h-4 w-4 text-gray-400" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="text-lg">{config?.icon}</span>
                                <h3 className="font-medium truncate">
                                    {section.sectionType === "CUSTOM" && section.settings && 'title' in section.settings && section.settings.title
                                        ? section.settings.title
                                        : section.title
                                    }
                                </h3>
                                <Badge variant="secondary" className="text-xs">
                                    {config?.label}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                    Order: {section.order}
                                </Badge>
                            </div>
                            {section.sectionType === "CUSTOM" && section.settings && 'description' in section.settings && section.settings.description ? (
                                <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                                    {section.settings.description}
                                </div>
                            ) : section.content ? (
                                <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                                    {section.content.replace(/[#*`]/g, '').substring(0, 100)}...
                                </div>
                            ) : null}
                            <div className="text-xs text-gray-400 mt-1">
                                Updated: {new Date(section.updatedAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onView}
                            title="View Section"
                            className="h-8 w-8 p-0"
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onEdit}
                            title="Edit Section"
                            className="h-8 w-8 p-0"
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onDelete}
                            title="Delete Section"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

interface DraggableSectionListProps {
    sections: CollegeSection[]
    collegeId: string
    onView: (section: CollegeSection) => void
    onEdit: (section: CollegeSection) => void
    onDelete: (section: CollegeSection) => void
    queryKey: string[]
}

export function DraggableSectionList({
    sections,
    collegeId,
    onView,
    onEdit,
    onDelete,
    queryKey
}: DraggableSectionListProps) {
    const [localSections, setLocalSections] = useState<CollegeSection[]>(sections)
    const [isReordering, setIsReordering] = useState(false)
    const [activeSection, setActiveSection] = useState<CollegeSection | null>(null)
    const queryClient = useQueryClient()
    const sectionService = new SectionService()

    // Update local sections when props change
    useEffect(() => {
        setLocalSections(sections)
    }, [sections])

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Only start dragging after moving 8px
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const reorderMutation = useMutation({
        mutationFn: (reorderData: ReorderSectionRequest[]) => sectionService.reorderSections(reorderData),
        onSuccess: () => {
            toast.success('Sections reordered successfully')
            queryClient.invalidateQueries({ queryKey })
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Failed to reorder sections')
            // Revert to original order on error
            setLocalSections(sections)
        },
        onSettled: () => {
            setIsReordering(false)
        },
    })

    function handleDragStart(event: DragStartEvent) {
        const { active } = event
        const section = localSections.find(s => s.id === active.id)
        setActiveSection(section || null)
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        setActiveSection(null)

        if (active.id !== over?.id) {
            setLocalSections((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id)
                const newIndex = items.findIndex((item) => item.id === over?.id)

                const newSections = arrayMove(items, oldIndex, newIndex)

                // Update order numbers based on new positions
                const updatedSections = newSections.map((section, index) => ({
                    ...section,
                    order: index
                }))

                // Prepare reorder data for API
                const reorderData: ReorderSectionRequest[] = updatedSections.map((section, index) => ({
                    id: section.id,
                    order: index
                }))

                // Call API to update order
                setIsReordering(true)
                reorderMutation.mutate(reorderData)

                return updatedSections
            })
        }
    }

    if (sections.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <div className="text-lg font-medium mb-2">No sections found</div>
                <p className="text-sm">Add your first section to get started.</p>
            </div>
        )
    }

    if (sections.length === 1) {
        return (
            <div className="space-y-4">
                <div className="text-sm text-gray-500 text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    Add more sections to enable drag and drop reordering
                </div>
                <div className="space-y-3">
                    {localSections.map((section) => (
                        <DraggableSectionItem
                            key={section.id}
                            section={section}
                            onView={() => onView(section)}
                            onEdit={() => onEdit(section)}
                            onDelete={() => onDelete(section)}
                        />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="text-sm text-gray-500 text-center p-2 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-800">
                <GripVertical className="h-4 w-4 inline mr-1" />
                Drag sections to reorder them. Use the grip handle to drag.
            </div>

            {isReordering && (
                <div className="flex items-center justify-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    <span className="text-sm text-blue-600">Updating section order...</span>
                </div>
            )}

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={localSections.map(s => s.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-3">
                        {localSections.map((section) => (
                            <DraggableSectionItem
                                key={section.id}
                                section={section}
                                onView={() => onView(section)}
                                onEdit={() => onEdit(section)}
                                onDelete={() => onDelete(section)}
                            />
                        ))}
                    </div>
                </SortableContext>

                <DragOverlay>
                    {activeSection ? (
                        <Card className="shadow-xl scale-105 rotate-2 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <GripVertical className="h-4 w-4 text-blue-600" />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">{SECTION_TYPE_CONFIGS[activeSection.sectionType as keyof typeof SECTION_TYPE_CONFIGS]?.icon}</span>
                                            <h3 className="font-medium">
                                                {activeSection.sectionType === "CUSTOM" && activeSection.settings && 'title' in activeSection.settings && activeSection.settings.title
                                                    ? activeSection.settings.title
                                                    : activeSection.title
                                                }
                                            </h3>
                                            <Badge variant="secondary" className="text-xs">
                                                {SECTION_TYPE_CONFIGS[activeSection.sectionType as keyof typeof SECTION_TYPE_CONFIGS]?.label}
                                            </Badge>
                                        </div>
                                        <Badge variant="outline" className="text-xs">
                                            Order: {activeSection.order}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    )
} 