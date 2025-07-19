"use client"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import type { Program } from "@/types/program"

interface DeleteProgramDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    program: Program | null
    collegeId: string
    onConfirm: () => void
    isDeleting?: boolean
}

export function DeleteProgramDialog({ open, onOpenChange, program, collegeId, onConfirm, isDeleting = false }: DeleteProgramDialogProps) {
    const handleDelete = () => {
        if (!program) return
        onConfirm()
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        Delete Program
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete the program &quot;{program?.name}&quot;? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                        <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">
                            Warning
                        </h4>
                        <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                            <li>• This will permanently delete the program</li>
                            <li>• All program descriptions will be lost</li>
                            <li>• This action cannot be undone</li>
                        </ul>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isDeleting}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting && <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />}
                        Delete Program
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
} 