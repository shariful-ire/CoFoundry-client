'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  TbArrowLeft, TbUsers, TbBuildingSkyscraper,
  TbRocket, TbBriefcase, TbClock, TbMapPin, TbArrowRight,
} from 'react-icons/tb';
import api from '@/lib/axios';

const STAGE_COLORS = {
  'Pre-Seed':    'bg-amber-50   text-amber-700  border-amber-200',
  'Seed':        'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Series A':    'bg-blue-50    text-blue-700   border-blue-200',
  'Bootstrapped':'bg-slate-50   text-slate-600  border-slate-200',
};

const GRADIENTS = [
  'from-violet-500 to-purple-700', 'from-emerald-500 to-teal-700',
  'from-rose-500 to-pink-700',     'from-brand-500 to-indigo-700',
  'from-sky-500 to-blue-700',      'from-amber-500 to-orange-700',
];

const WORK_BADGE = {
  Remote:   'bg-emerald-50 text-emerald-700 border-emerald-200',
  Hybrid:   'bg-amber-50  text-amber-700  border-amber-200',
  'On-site':'bg-rose-50   text-rose-700   border-rose-200',
};

function getGradient(name) {
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}

function getInitials(name) {
  return (name || '').split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function StartupDetailPage() {
  const { id } = useParams();

  const { data: startup, isLoading: startupLoading } = useQuery({
    queryKey: ['startup', id],
    queryFn:  () => api.get(`/api/startups/${id}`).then((r) => r.data),
  });

  const { data: oppsData, isLoading: oppsLoading } = useQuery({
    queryKey: ['startup-opportunities', id],
    queryFn:  () => api.get(`/api/opportunities?startupId=${id}&limit=20`).then((r) => r.data),
    enabled:  !!id,
  });

  const openOpps = oppsData?.data ?? [];

  if (startupLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="w-10 h-10 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <TbRocket className="text-6xl text-brand-200 mb-4" />
        <h2 className="text-2xl font-bold text-text mb-2">Startup not found</h2>
        <p className="text-text-muted mb-6">This startup may have been removed or doesn&apos;t exist.</p>
        <Link href="/startups" className="text-brand-600 font-semibold hover:underline inline-flex items-center gap-1">
          <TbArrowLeft /> Back to Browse Startups
        </Link>
      </div>
    );
  }

  const gradient = getGradient(startup.startupName);
  const initials = getInitials(startup.startupName);

  return (
    <div className="min-h-screen bg-surface-alt">
      <div className={`bg-gradient-to-r ${gradient} py-14 px-4`}>
        <div className="max-w-4xl mx-auto">
          <Link href="/startups"
            className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-6 transition-colors">
            <TbArrowLeft /> Back to startups
          </Link>
          <motion.div variants={{ show: { transition: { staggerChildren: 0.1 } } }} initial="hidden" animate="show"
            className="flex items-center gap-5">
            <motion.div variants={fadeUp}
              className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white font-extrabold text-2xl shadow-xl shrink-0">
              {initials}
            </motion.div>
            <motion.div variants={fadeUp}>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{startup.startupName}</h1>
              <p className="text-white/70 mt-1 text-sm">
                Founded by {startup.founderId?.name ?? '—'}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4 }}
            className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
              <h2 className="font-bold text-text text-lg mb-3">About {startup.startupName}</h2>
              <p className="text-sm text-text-muted leading-relaxed">{startup.description}</p>
            </div>

            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
              <h2 className="font-bold text-text text-lg mb-4 flex items-center gap-2">
                <TbBriefcase className="text-brand-500" />
                Open Roles ({oppsLoading ? '…' : openOpps.length})
              </h2>
              {oppsLoading ? (
                <div className="flex items-center gap-2 text-sm text-text-muted py-4">
                  <span className="w-4 h-4 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
                  Loading…
                </div>
              ) : openOpps.length === 0 ? (
                <p className="text-sm text-text-muted py-4">No open roles right now.</p>
              ) : (
                <div className="space-y-3">
                  {openOpps.map((opp, i) => {
                    const daysLeft = Math.ceil((new Date(opp.deadline) - Date.now()) / 864e5);
                    return (
                      <motion.div key={opp._id}
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.05 }}
                        className="flex items-center justify-between p-3.5 rounded-xl bg-surface-alt border border-border hover:border-brand-200 hover:bg-brand-50 transition-all group">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-text group-hover:text-brand-700">{opp.roleTitle}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-0.5 rounded-md border font-medium ${WORK_BADGE[opp.workType] ?? ''}`}>
                              {opp.workType}
                            </span>
                            <span className={`text-xs font-medium ${daysLeft <= 7 ? 'text-danger' : 'text-text-muted'}`}>
                              <TbClock className="inline mr-0.5 text-xs" />{daysLeft}d left
                            </span>
                          </div>
                        </div>
                        <Link href={`/opportunities/${opp._id}`}
                          className="text-xs text-brand-600 font-semibold hover:underline opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-3">
                          Apply →
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.4 }}
            className="space-y-5">
            <div className="bg-white rounded-2xl border border-border p-5 shadow-sm space-y-4">
              <h3 className="font-bold text-text text-sm">Startup Details</h3>
              {[
                { icon: TbBuildingSkyscraper, label: 'Industry',      value: startup.industry },
                { icon: TbRocket,             label: 'Funding Stage', value: startup.fundingStage },
                { icon: TbUsers,              label: 'Open Roles',    value: `${openOpps.length} positions` },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0">
                    <Icon className="text-brand-500 text-base" />
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">{label}</p>
                    <p className="text-sm font-semibold text-text">{value}</p>
                  </div>
                </div>
              ))}
              <div className="pt-1">
                <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border ${STAGE_COLORS[startup.fundingStage] ?? ''}`}>
                  {startup.fundingStage}
                </span>
              </div>
            </div>

            <div className={`rounded-2xl bg-gradient-to-br ${gradient} p-5 text-white shadow-lg`}>
              <p className="font-bold text-base mb-1">Interested in joining?</p>
              <p className="text-white/70 text-xs leading-relaxed mb-4">
                Browse all open positions at {startup.startupName} and submit your application.
              </p>
              <Link href="/opportunities"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white text-brand-700 text-sm font-bold shadow hover:opacity-90 transition-opacity">
                See Opportunities <TbArrowRight />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
