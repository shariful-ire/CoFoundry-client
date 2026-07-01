'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';

function GoogleCallbackContent() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const { login }    = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) { router.replace('/login?error=google_failed'); return; }

    api.post('/api/auth/google/complete', { token })
      .then(({ data }) => {
        login(data.user);
        router.replace('/');
      })
      .catch((err) => {
        const detail = encodeURIComponent(err?.response?.data?.message ?? err?.message ?? 'unknown');
        router.replace(`/login?error=google_failed&detail=${detail}`);
      });
  }, [searchParams, router, login]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-surface-alt">
      <span className="w-10 h-10 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      <p className="text-sm text-text-muted">Signing you in…</p>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-surface-alt">
        <span className="w-10 h-10 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      </div>
    }>
      <GoogleCallbackContent />
    </Suspense>
  );
}
