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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { FileText, ExternalLink, Copy, Users, Calendar } from "lucide-react"
import { toast } from "sonner"
import { FormPreview } from "./form-preview"
import type { FormSection } from "@/types/form"

interface FormPreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  form: FormSection | null
}

export function FormPreviewDialog({ open, onOpenChange, form }: FormPreviewDialogProps) {
  if (!form) return null

  const copyFormLink = () => {
    const link = `${window.location.origin}/${form.college?.slug}/form/${form.id}`
    navigator.clipboard.writeText(link)
    toast.success("Form link copied to clipboard!")
  }

  const openFormInNewTab = () => {
    const link = `${window.location.origin}/${form.college?.slug}/form/${form.id}`
    window.open(link, '_blank')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Form Preview: {form.title}
          </DialogTitle>
          <DialogDescription>
            Preview how your form will appear to users. This is exactly how they will see it.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Form Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Form Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{form._count?.fields || 0}</div>
                  <div className="text-sm text-muted-foreground">Total Fields</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{form._count?.submissions || 0}</div>
                  <div className="text-sm text-muted-foreground">Submissions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {new Date(form.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Created</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Form Preview</CardTitle>
              <CardDescription>
                This is how users will see and interact with your form.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormPreview
                title={form.title}
                fields={form.fields || []}
                isPreview={true}
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button variant="outline" onClick={copyFormLink}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Form Link
            </Button>
            <Button onClick={openFormInNewTab}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Form in New Tab
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}