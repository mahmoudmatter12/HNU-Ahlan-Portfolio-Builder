"use client"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2, AlertTriangle } from "lucide-react"

interface DeleteDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    description: string
    itemName?: string
    onConfirm: () => Promise<void>
    onSuccess?: () => void
    queryKey?: string[]
}

export function DeleteDialog({
    open,
    onOpenChange,
    title,
    description,
    itemName,
    onConfirm,
    onSuccess,
    queryKey
}: DeleteDialogProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const queryClient = useQueryClient()

    const deleteMutation = useMutation({
        mutationFn: async () => {
            setIsDeleting(true)
            await onConfirm()
        },
        onSuccess: () => {
            toast.success(`${itemName || "Item"} deleted successfully`)
            if (queryKey) {
                queryClient.invalidateQueries({ queryKey })
            }
            onSuccess?.()
            onOpenChange(false)
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || `Failed to delete ${itemName || "item"}`)
        },
        onSettled: () => {
            setIsDeleting(false)
        },
    })

    const handleConfirm = () => {
        deleteMutation.mutate()
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <DialogTitle className="text-left">{title}</DialogTitle>
                            <DialogDescription className="text-left">
                                {description}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isDeleting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={isDeleting}
                    >
                        {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
} 