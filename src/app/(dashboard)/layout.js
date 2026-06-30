'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { useAuth } from '@/context/AuthContext';

function useRole() {
  const pathname = usePathname();
  if (pathname.startsWith('/dashboard/admin'))        return 'admin';
  if (pathname.startsWith('/dashboard/collaborator')) return 'collaborator';
  return 'founder';
}

export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const role = useRole();
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface-alt">
        <span className="w-8 h-8 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      </div>
    );
  }

  const activeUser = user ?? { name: 'User', email: '', image: null };

  return (
    <div className="flex min-h-screen bg-surface-alt">
      <DashboardSidebar
        role={role}
        user={activeUser}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onSignOut={logout}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          user={activeUser}
          onMenuClick={() => setMobileOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
