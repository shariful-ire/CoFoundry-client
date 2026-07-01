'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { useAuth } from '@/context/AuthContext';

export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router   = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace('/login'); return; }
    // Redirect if user is on wrong role's dashboard
    const expected = `/dashboard/${user.role}`;
    if (!pathname.startsWith(expected) && pathname !== '/dashboard') {
      router.replace(expected);
    }
  }, [loading, user, pathname, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface-alt">
        <span className="w-8 h-8 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      </div>
    );
  }

  const activeUser = user;

  return (
    <div className="flex min-h-screen bg-surface-alt">
      <DashboardSidebar
        role={user.role}
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
