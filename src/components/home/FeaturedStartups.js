'use client';

import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TbArrowRight, TbBuildingSkyscraper } from 'react-icons/tb';
import api from '@/lib/axios';

const STAGE_COLORS = {
  'Pre-Seed':    'bg-amber-50 text-amber-700 border-amber-200',
  'Seed':        'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Series A':    'bg-blue-50 text-blue-700 border-blue-200',
  'Series B+':   'bg-violet-50 text-violet-700 border-violet-200',
  'Bootstrapped':'bg-slate-50 text-slate-600 border-slate-200',
};

const GRADIENTS = [
  'from-violet-500 to-purple-700', 'from-emerald-500 to-teal-700',
  'from-rose-500 to-pink-700',     'from-brand-500 to-indigo-700',
  'from-sky-500 to-blue-700',      'from-amber-500 to-orange-700',
];

function getGradient(name = '') {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}

function getInitials(name = '') {
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const cardVariant = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

function StartupCard({ startup }) {
  const gradient = getGradient(startup.startupName);
  const initials  = getInitials(startup.startupName);
  return (
    <motion.div variants={cardVariant} whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group bg-white rounded-2xl border border-border shadow-sm hover:shadow-xl hover:shadow-brand-100/60 transition-shadow duration-300 flex flex-col overflow-hidden">
      <div className={`h-1.5 w-full bg-gradient-to-r ${gradient}`} />
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-base shadow-md shrink-0`}>
            {initials}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-text text-base truncate group-hover:text-brand-600 transition-colors">
              {startup.startupName}
            </h3>
            <p className="text-xs text-text-muted truncate">by {startup.founderId?.name ?? '—'}</p>
          </div>
        </div>
        <p className="text-sm text-text-muted leading-relaxed line-clamp-2 flex-1 mb-4">
          {startup.description}
        </p>
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-brand-50 text-brand-700 border border-brand-100">
            <TbBuildingSkyscraper className="text-sm" /> {startup.industry}
          </span>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-lg border ${STAGE_COLORS[startup.fundingStage] ?? 'bg-slate-50 text-slate-600 border-slate-200'}`}>
            {startup.fundingStage}
          </span>
        </div>
        <Link href={`/startups/${startup._id}`}
          className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-brand-200 text-brand-600 text-sm font-semibold hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all duration-200">
          View Startup <TbArrowRight />
        </Link>
      </div>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden animate-pulse">
      <div className="h-1.5 w-full bg-border" />
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-border shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-border rounded w-3/4" />
            <div className="h-3 bg-border rounded w-1/2" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-border rounded" />
          <div className="h-3 bg-border rounded w-4/5" />
        </div>
        <div className="h-9 bg-border rounded-xl" />
      </div>
    </div>
  );
}

export default function FeaturedStartups() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const { data, isLoading } = useQuery({
    queryKey: ['featured-startups'],
    queryFn:  () => api.get('/api/startups?limit=4').then((r) => r.data),
  });

  const startups = data?.data ?? [];

  return (
    <section className="py-20 px-4 bg-surface-alt">
      <div className="max-w-7xl mx-auto">
        <motion.div ref={ref} initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}
          className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-brand-600 text-xs font-semibold uppercase tracking-widest mb-4">
            Featured Startups
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text leading-tight">
            Startups looking for <span className="gradient-text">talented people</span>
          </h2>
          <p className="mt-4 text-base text-text-muted max-w-xl mx-auto">
            Discover early-stage startups actively building their founding teams.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : startups.length > 0 ? (
          <motion.div variants={container} initial="hidden" animate={isInView ? 'show' : 'hidden'}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {startups.map((s) => <StartupCard key={s._id} startup={s} />)}
          </motion.div>
        ) : (
          <p className="text-center text-text-muted py-12">No startups yet — check back soon.</p>
        )}

        <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.4 }} className="text-center mt-12">
          <Link href="/startups"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl gradient-brand text-white font-semibold text-sm shadow-lg shadow-brand-500/25 hover:shadow-xl hover:opacity-95 transition-all">
            Browse All Startups <TbArrowRight />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
