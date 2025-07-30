"use client"
import { GlobalProviders } from "@/context/proiders"
import type React from "react"
import { AdminLayout } from "./_adminComponents/admin-layout"
import { AdminAuthGuard } from "@/components/AdminAuthGuard"
import BackgroundDecorations from "@/components/BackgroundDecorations"

interface AdminLayoutWrapperProps {
  children: React.ReactNode
}

export default function AdminLayoutWrapper({ children }: AdminLayoutWrapperProps) {
  return (
    <div className="relative admin-layout-wrapper min-h-screen">
      <GlobalProviders>
        <AdminAuthGuard requireAdmin={true}>
          <AdminLayout>
            <div className="relative min-h-screen overflow-hidden">
              {/* Main content container */}
              <div className="relative z-10 min-h-screen">
                <div className="min-h-screen">{children}</div>
              </div>
            </div>
          </AdminLayout>
        </AdminAuthGuard>
      </GlobalProviders>
    </div>
  )
}
