'use client';

import { useState } from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { usePathname } from 'next/navigation';

/* ── Derive role from current URL path ── */
function useRole() {
  const pathname = usePathname();
  if (pathname.startsWith('/dashboard/admin'))        return 'admin';
  if (pathname.startsWith('/dashboard/collaborator')) return 'collaborator';
  return 'founder';
}

/* ── Placeholder user — replaced by real auth context later ── */
const MOCK_USER = { name: 'Jane Smith', email: 'jane@example.com', image: null };

export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const role = useRole();

  return (
    <div className="flex min-h-screen bg-surface-alt">
      <DashboardSidebar
        role={role}
        user={MOCK_USER}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          user={MOCK_USER}
          onMenuClick={() => setMobileOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
