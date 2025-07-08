"use client"
import { AdminLayout } from "@/components/admin/admin-layout"
import { GlobalProviders } from "@/context/proiders"
// import AdminProvider from "@/components/admin/admin-providor"
import type React from "react"

interface AdminLayoutWrapperProps {
  children: React.ReactNode
}



export default function AdminLayoutWrapper({ children }: AdminLayoutWrapperProps) {
  return (
    <div className="relative admin-layout-wrapper min-h-screen">
      <GlobalProviders>
        <AdminLayout>
          {/* <AdminProvider> */}
          <div className="relative min-h-screen overflow-hidden">
            {/* Main content container */}
            <div className="relative z-10 min-h-screen">
              <div className="min-h-screen">{children}</div>
            </div>
          </div>
          {/* </AdminProvider> */}
        </AdminLayout>
      </GlobalProviders>
    </div>
  )
}
