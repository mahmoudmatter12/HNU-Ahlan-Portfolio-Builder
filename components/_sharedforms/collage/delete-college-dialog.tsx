"use client"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle, Loader2, Users, FileText, Calendar, Database } from "lucide-react"
import type { College } from "@/types/Collage"

interface DeleteCollegeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  college: College | null
  onConfirm: () => void
  isDeleting: boolean
}

export function DeleteCollegeDialog({ open, onOpenChange, college, onConfirm, isDeleting }: DeleteCollegeDialogProps) {
  const [confirmationText, setConfirmationText] = useState("")
  const [step, setStep] = useState<"warning" | "confirmation">("warning")

  const isConfirmationValid = confirmationText === college?.name

  const handleClose = () => {
    setStep("warning")
    setConfirmationText("")
    onOpenChange(false)
  }

  const handleContinue = () => {
    setStep("confirmation")
  }

  const handleConfirm = () => {
    if (isConfirmationValid) {
      onConfirm()
    }
  }

  if (!college) return null

  const collegeTypeColors = {
    TECHNICAL: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    MEDICAL: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    ARTS: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    OTHER: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        {step === "warning" ? (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <DialogTitle className="text-lg">Delete College</DialogTitle>
                  <DialogDescription>This action cannot be undone</DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4">
              <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800 dark:text-red-200">
                  <strong>Warning:</strong> This will permanently delete the college and all associated data.
                </AlertDescription>
              </Alert>

              {/* College Info */}
              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{college.name}</h3>
                  <Badge className={collegeTypeColors[college.type]} variant="secondary">
                    {college.type}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600">
                  <div>Slug: /{college.slug}</div>
                  <div>Created: {new Date(college.createdAt).toLocaleDateString()}</div>
                </div>
              </div>

              {/* Data Impact */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">The following data will be permanently deleted:</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <Users className="h-4 w-4 text-gray-500" />
                    <div className="text-sm">
                      <div className="font-medium">{college._count?.users || 0}</div>
                      <div className="text-xs text-gray-600">Users</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <div className="text-sm">
                      <div className="font-medium">{college._count?.sections || 0}</div>
                      <div className="text-xs text-gray-600">Sections</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div className="text-sm">
                      <div className="font-medium">{college._count?.forms || 0}</div>
                      <div className="text-xs text-gray-600">Forms</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <Database className="h-4 w-4 text-gray-500" />
                    <div className="text-sm">
                      <div className="font-medium">{college._count?.formSubmissions || 0}</div>
                      <div className="text-xs text-gray-600">Submissions</div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="text-sm text-gray-600">
                <p>This action will:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Permanently delete the college and all its content</li>
                  <li>Remove all associated sections and forms</li>
                  <li>Delete all form submissions</li>
                  <li>Remove user associations with this college</li>
                  <li>Make the college URL permanently unavailable</li>
                </ul>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleContinue}>
                Continue
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <DialogTitle className="text-lg">Confirm Deletion</DialogTitle>
                  <DialogDescription>Type the college name to confirm</DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4">
              <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800 dark:text-red-200">
                  This action is <strong>irreversible</strong>. All data will be permanently lost.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="confirmation">
                  Type <strong>{college.name}</strong> to confirm:
                </Label>
                <Input
                  id="confirmation"
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  placeholder={college.name}
                  className={
                    confirmationText && !isConfirmationValid
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : ""
                  }
                />
                {confirmationText && !isConfirmationValid && (
                  <p className="text-sm text-red-600">
                    College name doesn&apos;t match. Please type &quot;{college.name}&quot; exactly.
                  </p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setStep("warning")} disabled={isDeleting}>
                Back
              </Button>
              <Button variant="destructive" onClick={handleConfirm} disabled={!isConfirmationValid || isDeleting}>
                {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isDeleting ? "Deleting..." : "Delete College"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
