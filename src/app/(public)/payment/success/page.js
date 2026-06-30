'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { TbCircleCheck, TbRocket, TbArrowRight } from 'react-icons/tb';
import toast from 'react-hot-toast';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      // TODO: POST /api/payment/verify  { sessionId }
      // Server verifies with Stripe, marks user as premium, clears free-limit counter
      toast.success('Premium activated!');
    }
  }, [sessionId]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, scale: 0.93, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="bg-white rounded-3xl border border-border shadow-xl p-10 max-w-md w-full text-center">

        {/* Animated tick */}
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 20 }}
          className="w-20 h-20 rounded-full bg-success-light flex items-center justify-center mx-auto mb-6">
          <TbCircleCheck className="text-success text-4xl" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <h1 className="text-2xl font-extrabold text-text mb-2">You're Premium!</h1>
          <p className="text-text-muted text-sm mb-2">
            Your payment was successful. Unlimited opportunity posts are now unlocked on your account.
          </p>
          {sessionId && (
            <p className="text-xs text-text-muted mt-1 font-mono bg-surface-alt px-3 py-1.5 rounded-lg inline-block">
              Ref: {sessionId.slice(0, 24)}…
            </p>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="mt-8 space-y-3">
          <Link href="/dashboard/founder/add-opportunity"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl gradient-brand text-white font-bold text-sm shadow">
            <TbRocket /> Post Your First Role
          </Link>
          <Link href="/dashboard/founder"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border border-border text-text font-semibold text-sm hover:border-brand-300 transition-all">
            Go to Dashboard <TbArrowRight />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
