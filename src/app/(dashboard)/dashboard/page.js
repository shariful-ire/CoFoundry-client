'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/* Redirect /dashboard → role-specific home. Role comes from auth later; stub uses founder. */
export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    // TODO: read real role from auth context and redirect accordingly
    // e.g. if (role === 'admin') router.replace('/dashboard/admin')
    router.replace('/dashboard/founder');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <span className="w-8 h-8 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
    </div>
  );
}
