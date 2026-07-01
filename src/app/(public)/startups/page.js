'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  TbSearch, TbArrowRight, TbUsers, TbBuildingSkyscraper,
  TbX, TbRocket,
} from 'react-icons/tb';
import api from '@/lib/axios';

const INDUSTRIES = ['All', 'AI / E-Commerce', 'CleanTech', 'HealthTech', 'FinTech', 'EdTech', 'DevTools', 'AgriTech', 'Logistics', 'LegalTech', 'Other'];
const ALL_STAGES = ['All Stages', 'Pre-Seed', 'Seed', 'Series A', 'Bootstrapped'];

const STAGE_COLORS = {
  'Pre-Seed':    'bg-amber-50   text-amber-700  border-amber-200',
  'Seed':        'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Series A':    'bg-blue-50    text-blue-700   border-blue-200',
  'Bootstrapped':'bg-slate-50   text-slate-600  border-slate-200',
};

const GRADIENTS = [
  'from-violet-500 to-purple-700',
  'from-emerald-500 to-teal-700',
  'from-rose-500 to-pink-700',
  'from-brand-500 to-indigo-700',
  'from-sky-500 to-blue-700',
  'from-amber-500 to-orange-700',
  'from-cyan-500 to-teal-700',
  'from-lime-500 to-green-700',
  'from-slate-500 to-gray-700',
];

function getGradient(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}

function getInitials(name) {
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

function StartupCard({ s }) {
  const gradient = getGradient(s.startupName);
  const initials = getInitials(s.startupName);
  return (
    <motion.div variants={cardVariant} layout
      whileHover={{ y: -4, transition: { duration: 0.18 } }}
      className="group bg-white rounded-2xl border border-border shadow-sm hover:shadow-xl hover:shadow-brand-100/50 transition-shadow duration-300 flex flex-col overflow-hidden">
      <div className={`h-1.5 w-full bg-gradient-to-r ${gradient}`} />
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-base shadow-md shrink-0`}>
            {initials}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-text text-base truncate group-hover:text-brand-600 transition-colors">
              {s.startupName}
            </h3>
            <p className="text-xs text-text-muted truncate">by {s.founderId?.name ?? '—'}</p>
          </div>
        </div>
        <p className="text-sm text-text-muted leading-relaxed line-clamp-2 flex-1 mb-4">
          {s.description}
        </p>
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-brand-50 text-brand-700 border border-brand-100">
            <TbBuildingSkyscraper className="text-sm" /> {s.industry}
          </span>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-lg border ${STAGE_COLORS[s.fundingStage] ?? ''}`}>
            {s.fundingStage}
          </span>
        </div>
        <Link href={`/startups/${s._id}`}
          className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-brand-200 text-brand-600 text-sm font-semibold hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all duration-200">
          View Startup <TbArrowRight />
        </Link>
      </div>
    </motion.div>
  );
}

export default function BrowseStartupsPage() {
  const [query,    setQuery]    = useState('');
  const [industry, setIndustry] = useState('All');
  const [stage,    setStage]    = useState('All Stages');

  const params = new URLSearchParams();
  if (industry !== 'All')       params.set('industry', industry);
  if (stage !== 'All Stages')   params.set('fundingStage', stage);
  params.set('limit', '9');

  const { data, isLoading } = useQuery({
    queryKey: ['startups', industry, stage],
    queryFn:  () => api.get(`/api/startups?${params}`).then((r) => r.data),
  });

  const all      = data?.data ?? [];
  const filtered = query
    ? all.filter((s) =>
        s.startupName.toLowerCase().includes(query.toLowerCase()) ||
        s.founderId?.name?.toLowerCase().includes(query.toLowerCase()))
    : all;

  const clearFilters = () => { setQuery(''); setIndustry('All'); setStage('All Stages'); };
  const hasFilters = query || industry !== 'All' || stage !== 'All Stages';

  return (
    <div className="min-h-screen bg-surface-alt">
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-600 text-xs font-semibold uppercase tracking-widest">
                Startups
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-text">Browse Startups</h1>
            <p className="text-text-muted mt-2 text-base">
              Discover{' '}
              <span className="font-semibold text-text">{data?.totalCount ?? '…'} approved startups</span>{' '}
              actively building their founding teams.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}
            className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <TbSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-lg" />
              <input type="text" placeholder="Search by startup or founder name…" value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-surface-alt text-sm text-text placeholder:text-text-muted/60 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:bg-white transition-all" />
            </div>
            <select value={industry} onChange={(e) => setIndustry(e.target.value)}
              className="py-3 px-4 rounded-xl border border-border bg-white text-sm text-text outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all cursor-pointer">
              {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
            </select>
            <select value={stage} onChange={(e) => setStage(e.target.value)}
              className="py-3 px-4 rounded-xl border border-border bg-white text-sm text-text outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all cursor-pointer">
              {ALL_STAGES.map((s) => <option key={s}>{s}</option>)}
            </select>
            {hasFilters && (
              <button onClick={clearFilters}
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl border border-border text-sm text-text-muted hover:border-danger hover:text-danger transition-colors">
                <TbX /> Clear
              </button>
            )}
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-text-muted">
            Showing <span className="font-semibold text-text">{filtered.length}</span>{' '}
            {filtered.length === 1 ? 'startup' : 'startups'}
            {hasFilters && ' for current filters'}
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <span className="w-10 h-10 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {filtered.length > 0 ? (
              <motion.div key="grid" initial="hidden" animate="show"
                variants={{ show: { transition: { staggerChildren: 0.07 } } }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((s) => <StartupCard key={s._id} s={s} />)}
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-4">
                  <TbRocket className="text-brand-400 text-3xl" />
                </div>
                <h3 className="text-lg font-bold text-text mb-1">No startups found</h3>
                <p className="text-sm text-text-muted max-w-xs mb-5">Try adjusting your search or filters.</p>
                <button onClick={clearFilters} className="text-sm font-semibold text-brand-600 hover:underline">
                  Clear all filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
