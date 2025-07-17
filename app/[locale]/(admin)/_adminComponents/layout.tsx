'use client';

import { Header } from '@/components/admin/header';
import { Sidebar } from '@/components/admin/sidebar';
import { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
  userRole: 'admin' | 'superadmin';
  user: {
    name: string;
    email: string;
    avatar?: string;
    role: 'admin' | 'superadmin';
  };
  onLogout: () => void;
}

export function AdminLayout({ children, userRole, user, onLogout }: AdminLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar userRole={userRole} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header user={user} onLogout={onLogout} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-muted/10 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}