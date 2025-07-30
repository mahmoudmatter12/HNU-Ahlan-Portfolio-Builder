"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { FAQService } from "@/services/faq-service"
import MDEditor from "@uiw/react-md-editor"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2, FileText } from "lucide-react"
import type { FAQItem, CreateFAQItemRequest, UpdateFAQItemRequest } from "@/types/faq"

const faqItemSchema = z.object({
    question: z.string().min(1, "Question is required").max(500, "Question must be less than 500 characters"),
    answer: z.string().min(1, "Answer is required").max(5000, "Answer must be less than 5000 characters"),
})

type FAQItemFormData = z.infer<typeof faqItemSchema>

interface FAQItemDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    item: FAQItem | null
    collegeId: string
    onSuccess: () => void
}

export function FAQItemDialog({ open, onOpenChange, item, collegeId, onSuccess }: FAQItemDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const isEditing = !!item?.id

    const form = useForm<FAQItemFormData>({
        resolver: zodResolver(faqItemSchema),
        defaultValues: {
            question: "",
            answer: "",
        },
    })

    // Reset form when dialog opens/closes or item changes
    useEffect(() => {
        if (open) {
            if (item) {
                form.reset({
                    question: item.question,
                    answer: item.answer,
                })
            } else {
                form.reset({
                    question: "",
                    answer: "",
                })
            }
            setError(null)
        }
    }, [open, item, form])

    const createMutation = useMutation({
        mutationFn: (data: CreateFAQItemRequest) => FAQService.addFAQItem(collegeId, data),
        onSuccess: () => {
            toast.success("FAQ item created successfully")
            onSuccess()
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to create FAQ item")
        },
    })

    const updateMutation = useMutation({
        mutationFn: ({ itemId, data }: { itemId: string; data: UpdateFAQItemRequest }) =>
            FAQService.updateFAQItem(collegeId, itemId, data),
        onSuccess: () => {
            toast.success("FAQ item updated successfully")
            onSuccess()
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to update FAQ item")
        },
    })

    const onSubmit = async (data: FAQItemFormData) => {
        setIsSubmitting(true)
        setError(null)

        try {
            if (isEditing && item) {
                await updateMutation.mutateAsync({
                    itemId: item.id,
                    data: {
                        question: data.question,
                        answer: data.answer,
                    },
                })
            } else {
                await createMutation.mutateAsync({
                    question: data.question,
                    answer: data.answer,
                })
            }
        } catch (error) {
            setError("Failed to save FAQ item")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        {isEditing ? "Edit FAQ Item" : "Add FAQ Item"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Update the question and answer for this FAQ item."
                            : "Add a new frequently asked question and its answer."
                        }
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="question"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Question</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter the question..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        The question that users frequently ask
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="answer"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Answer</FormLabel>
                                    <FormControl>
                                        <div data-color-mode="light">
                                            <MDEditor
                                                value={field.value}
                                                onChange={(value) => field.onChange(value || "")}
                                                height={300}
                                                preview="edit"
                                                hideToolbar={false}
                                                textareaProps={{
                                                    placeholder: "Enter the answer in markdown format...",
                                                }}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormDescription>
                                        The answer to the question. You can use markdown formatting.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {error && (
                            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                                {error}
                            </div>
                        )}

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isEditing ? "Update" : "Create"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
} 