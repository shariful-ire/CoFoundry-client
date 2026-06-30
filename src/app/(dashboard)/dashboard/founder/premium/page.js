'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { TbCrown, TbCheck, TbArrowLeft, TbLock } from 'react-icons/tb';
import Link from 'next/link';
import api from '@/lib/axios';

const PLANS = [
  {
    id: 'monthly',
    label: 'Monthly',
    price: '$12',
    per: '/month',
    description: 'Billed month-to-month. Cancel anytime.',
    badge: null,
  },
  {
    id: 'annual',
    label: 'Annual',
    price: '$99',
    per: '/year',
    description: 'Save $45 vs monthly. Billed once per year.',
    badge: 'Best Value',
  },
];

const FEATURES = [
  'Unlimited opportunity posts',
  'Priority listing in search results',
  'Access to applicant contact details',
  'Advanced analytics on your startup',
  'Dedicated support',
];

export default function PremiumUpgradePage() {
  const [selected, setSelected] = useState('annual');
  const [loading,  setLoading]  = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      // TODO: POST /api/payment/create-checkout  { plan: selected }
      // Returns { url: 'https://checkout.stripe.com/...' }
      const { data } = await api.post('/api/payment/create-checkout', { plan: selected });
      window.location.href = data.url;
    } catch {
      // Dev fallback — server not yet running
      toast.error('Server not connected yet. Stripe will be wired when the server is ready.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/dashboard/founder/add-opportunity"
          className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-brand-600 font-medium mb-4 transition-colors">
          <TbArrowLeft /> Back
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center shadow">
            <TbCrown className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-text">CoFoundry Premium</h1>
            <p className="text-text-muted text-sm">Unlock unlimited posts and grow your team faster.</p>
          </div>
        </div>
      </motion.div>

      {/* Plan cards */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-4">
        {PLANS.map((plan) => {
          const active = selected === plan.id;
          return (
            <motion.button key={plan.id} type="button" onClick={() => setSelected(plan.id)}
              whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
              className={`relative text-left p-6 rounded-2xl border-2 transition-all ${active ? 'border-brand-500 bg-brand-50 shadow-md' : 'border-border bg-white hover:border-brand-300'}`}>
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-brand text-white text-xs font-bold px-3 py-0.5 rounded-full shadow">
                  {plan.badge}
                </span>
              )}
              <p className="text-sm font-bold text-text mb-1">{plan.label}</p>
              <p className="text-3xl font-extrabold text-brand-600">{plan.price}<span className="text-sm font-medium text-text-muted">{plan.per}</span></p>
              <p className="text-xs text-text-muted mt-2">{plan.description}</p>
              {active && <TbCheck className="absolute top-4 right-4 text-brand-500 text-lg" />}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Feature list */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
        className="bg-white rounded-2xl border border-border shadow-sm p-6">
        <p className="text-sm font-bold text-text mb-4">Everything in Premium:</p>
        <ul className="space-y-2.5">
          {FEATURES.map((f) => (
            <li key={f} className="flex items-center gap-2.5 text-sm text-text">
              <span className="w-5 h-5 rounded-full bg-success-light flex items-center justify-center shrink-0">
                <TbCheck className="text-success text-xs" />
              </span>
              {f}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* CTA */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}>
        <motion.button type="button" onClick={handleUpgrade} disabled={loading}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl gradient-brand text-white font-bold text-base shadow-lg disabled:opacity-70">
          {loading
            ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : <><TbLock /> Upgrade to Premium — {PLANS.find(p => p.id === selected)?.price}{PLANS.find(p => p.id === selected)?.per}</>}
        </motion.button>
        <p className="text-center text-xs text-text-muted mt-3 flex items-center justify-center gap-1">
          <TbLock className="text-sm" /> Secured by Stripe — your card details are never stored on our servers
        </p>
      </motion.div>
    </div>
  );
}
