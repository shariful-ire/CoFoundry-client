'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  TbSearch, TbArrowRight, TbClock, TbMapPin, TbX,
  TbBriefcase, TbChevronLeft, TbChevronRight,
} from 'react-icons/tb';
import api from '@/lib/axios';

const WORK_TYPES = ['Remote', 'Hybrid', 'On-site'];
const INDUSTRIES  = ['AI / E-Commerce', 'CleanTech', 'HealthTech', 'FinTech', 'EdTech', 'DevTools', 'AgriTech', 'Logistics', 'LegalTech', 'Other'];
const PAGE_LIMIT  = 6;

const WORK_BADGE = {
  Remote:   'bg-emerald-50 text-emerald-700 border-emerald-200',
  Hybrid:   'bg-amber-50  text-amber-700  border-amber-200',
  'On-site':'bg-rose-50   text-rose-700   border-rose-200',
};

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

function OpportunityCard({ opp }) {
  const [now] = useState(() => Date.now());
  const daysLeft = Math.ceil((new Date(opp.deadline) - now) / 864e5);
  const urgent   = daysLeft <= 7;

  return (
    <motion.div variants={cardVariant} layout
      whileHover={{ y: -4, transition: { duration: 0.18 } }}
      className="group bg-white rounded-2xl border border-border p-5 flex flex-col gap-4 shadow-sm hover:shadow-lg hover:shadow-brand-100/50 transition-shadow duration-300">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0">
          <TbBriefcase className="text-brand-600 text-lg" />
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-text text-sm leading-snug group-hover:text-brand-600 transition-colors truncate">
            {opp.roleTitle}
          </h3>
          <p className="text-xs text-text-muted mt-0.5">@ {opp.startupId?.startupName ?? '—'}</p>
        </div>
      </div>

      {opp.requiredSkills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {opp.requiredSkills.map((s) => (
            <span key={s} className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-surface-alt border border-border text-text-muted">
              {s}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between text-xs pt-1 border-t border-border mt-auto">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border font-medium ${WORK_BADGE[opp.workType] ?? ''}`}>
          <TbMapPin /> {opp.workType}
        </span>
        <span className={`inline-flex items-center gap-1 font-medium ${urgent ? 'text-danger' : 'text-text-muted'}`}>
          <TbClock /> {daysLeft > 0 ? `${daysLeft}d left` : 'Closing soon'}
        </span>
      </div>

      <Link href={`/opportunities/${opp._id}`}
        className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-xs font-semibold border border-brand-200 text-brand-600 hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all duration-200">
        View & Apply <TbArrowRight />
      </Link>
    </motion.div>
  );
}

function FilterPill({ label, active, onClick }) {
  return (
    <button onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
        active
          ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
          : 'bg-white text-text-muted border-border hover:border-brand-300 hover:text-brand-600'
      }`}>
      {label}
    </button>
  );
}

export default function BrowseOpportunitiesPage() {
  const [search,       setSearch]       = useState('');
  const [debounced,    setDebounced]    = useState('');
  const [workTypes,    setWorkTypes]    = useState([]);
  const [industries,   setIndustries]   = useState([]);
  const [page,         setPage]         = useState(1);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim()), 350);
    return () => clearTimeout(t);
  }, [search]);

  const params = new URLSearchParams({ page: String(page), limit: String(PAGE_LIMIT) });
  if (workTypes.length)  params.set('workType', workTypes.join(','));
  if (industries.length) params.set('industry', industries.join(','));
  if (debounced)          params.set('search', debounced);

  const { data, isLoading } = useQuery({
    queryKey: ['opportunities', workTypes, industries, debounced, page],
    queryFn:  () => api.get(`/api/opportunities?${params}`).then((r) => r.data),
    keepPreviousData: true,
  });

  const opps       = data?.data ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const toggleWorkType = (w) => {
    setWorkTypes((p) => (p.includes(w) ? p.filter((x) => x !== w) : [...p, w]));
    setPage(1);
  };
  const toggleIndustry = (i) => {
    setIndustries((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));
    setPage(1);
  };

  const hasFilters = search || workTypes.length > 0 || industries.length > 0;
  const clearAll   = () => { setSearch(''); setWorkTypes([]); setIndustries([]); setPage(1); };
  const resetPage  = () => setPage(1);

  return (
    <div className="min-h-screen bg-surface-alt">
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold uppercase tracking-widest mb-3">
              Open Roles
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-text">Browse Opportunities</h1>
            <p className="text-text-muted mt-2 text-base">
              <span className="font-semibold text-text">{totalCount} open roles</span> across top early-stage startups. Find yours.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}
            className="mt-6 relative">
            <TbSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-lg" />
            <input type="text" placeholder="Search by role title or skill (e.g. React, Designer, Python)…"
              value={search} onChange={(e) => { setSearch(e.target.value); resetPage(); }}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-border bg-surface-alt text-sm text-text placeholder:text-text-muted/60 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:bg-white transition-all" />
            {search && (
              <button onClick={() => { setSearch(''); resetPage(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-danger transition-colors">
                <TbX />
              </button>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18, duration: 0.4 }}
            className="mt-5 space-y-3">
            <div className="flex items-start gap-2 flex-wrap">
              <span className="text-xs font-semibold text-text-muted w-20 shrink-0 pt-1.5">Work Type</span>
              <div className="flex flex-wrap gap-2">
                {WORK_TYPES.map((w) => (
                  <FilterPill key={w} label={w} active={workTypes.includes(w)} onClick={() => toggleWorkType(w)} />
                ))}
              </div>
            </div>
            <div className="flex items-start gap-2 flex-wrap">
              <span className="text-xs font-semibold text-text-muted w-20 shrink-0 pt-1.5">Industry</span>
              <div className="flex flex-wrap gap-2">
                {INDUSTRIES.map((i) => (
                  <FilterPill key={i} label={i} active={industries.includes(i)} onClick={() => toggleIndustry(i)} />
                ))}
              </div>
            </div>
            {hasFilters && (
              <button onClick={clearAll} className="inline-flex items-center gap-1 text-xs text-danger font-semibold hover:underline mt-1">
                <TbX className="text-sm" /> Clear all filters
              </button>
            )}
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-text-muted">
            {isLoading ? 'Loading…' : (
              <>Showing <span className="font-semibold text-text">{opps.length}</span> of{' '}
              <span className="font-semibold text-text">{totalCount}</span> results</>
            )}
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <span className="w-10 h-10 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {opps.length > 0 ? (
              <motion.div key={`page-${page}`} initial="hidden" animate="show"
                variants={{ show: { transition: { staggerChildren: 0.07 } } }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {opps.map((opp) => <OpportunityCard key={opp._id} opp={opp} />)}
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-4">
                  <TbBriefcase className="text-brand-400 text-3xl" />
                </div>
                <h3 className="text-lg font-bold text-text mb-1">No opportunities found</h3>
                <p className="text-sm text-text-muted max-w-xs mb-5">Try a different search term or work type.</p>
                <button onClick={clearAll} className="text-sm font-semibold text-brand-600 hover:underline">
                  Clear all filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {totalPages > 1 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-2 mt-12">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-text-muted hover:border-brand-400 hover:text-brand-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              <TbChevronLeft />
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-lg border text-sm font-semibold transition-all ${
                  p === page
                    ? 'gradient-brand text-white border-brand-600 shadow-md'
                    : 'border-border text-text-muted hover:border-brand-300 hover:text-brand-600'
                }`}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-text-muted hover:border-brand-400 hover:text-brand-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              <TbChevronRight />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
