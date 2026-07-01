'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const ROLE_REDIRECT = {
  admin:        '/dashboard/admin',
  founder:      '/dashboard/founder',
  collaborator: '/dashboard/collaborator',
};

export default function DashboardRedirect() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (user) router.replace(ROLE_REDIRECT[user.role] ?? '/dashboard/collaborator');
    else router.replace('/login');
  }, [user, loading, router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <span className="w-8 h-8 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
    </div>
  );
}
