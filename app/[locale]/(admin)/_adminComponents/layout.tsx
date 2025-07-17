'use client';

import { Header } from '@/app/[locale]/(admin)/_adminComponents/header';
import { Sidebar } from '@/app/[locale]/(admin)/_adminComponents/sidebar';
import { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
  userRole: 'admin' | 'superadmin';
}

export function AdminLayout({ children, userRole }: AdminLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar userRole={userRole} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-muted/10 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}