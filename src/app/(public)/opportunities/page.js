'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TbSearch, TbArrowRight, TbClock, TbMapPin, TbX,
  TbBriefcase, TbChevronLeft, TbChevronRight,
  TbCode, TbPalette, TbSpeakerphone, TbChartBar,
  TbDeviceMobile, TbCloud, TbDatabase, TbWriting, TbShieldCheck,
} from 'react-icons/tb';

/* ── Mock opportunities dataset ── */
const ALL_OPPORTUNITIES = [
  { _id: '1',  roleTitle: 'Full-Stack Developer',  startupName: 'NeuralCart',  startupId: '1', requiredSkills: ['React', 'Node.js', 'MongoDB'],         workType: 'Remote',   industry: 'AI / E-Commerce', commitmentLevel: 'Full-time',  deadline: Date.now() + 18*864e5, icon: TbCode },
  { _id: '2',  roleTitle: 'UI/UX Designer',         startupName: 'MedBridge',   startupId: '3', requiredSkills: ['Figma', 'Prototyping', 'User Research'], workType: 'Remote',   industry: 'HealthTech',      commitmentLevel: 'Part-time',  deadline: Date.now() + 10*864e5, icon: TbPalette },
  { _id: '3',  roleTitle: 'Growth Marketer',         startupName: 'GreenGrid',   startupId: '2', requiredSkills: ['SEO', 'Content Strategy', 'Analytics'],  workType: 'Hybrid',   industry: 'CleanTech',       commitmentLevel: 'Part-time',  deadline: Date.now() + 25*864e5, icon: TbSpeakerphone },
  { _id: '4',  roleTitle: 'Data Analyst',            startupName: 'DevForge',    startupId: '4', requiredSkills: ['Python', 'SQL', 'Tableau'],              workType: 'Remote',   industry: 'DevTools',        commitmentLevel: 'Full-time',  deadline: Date.now() + 14*864e5, icon: TbChartBar },
  { _id: '5',  roleTitle: 'Mobile Developer',        startupName: 'NeuralCart',  startupId: '1', requiredSkills: ['React Native', 'TypeScript', 'Expo'],    workType: 'Remote',   industry: 'AI / E-Commerce', commitmentLevel: 'Full-time',  deadline: Date.now() + 20*864e5, icon: TbDeviceMobile },
  { _id: '6',  roleTitle: 'DevOps Engineer',         startupName: 'GreenGrid',   startupId: '2', requiredSkills: ['AWS', 'Docker', 'Kubernetes'],           workType: 'Remote',   industry: 'CleanTech',       commitmentLevel: 'Part-time',  deadline: Date.now() + 30*864e5, icon: TbCloud },
  { _id: '7',  roleTitle: 'Backend Engineer',        startupName: 'FinStack',    startupId: '6', requiredSkills: ['Node.js', 'PostgreSQL', 'Redis'],        workType: 'Remote',   industry: 'FinTech',         commitmentLevel: 'Full-time',  deadline: Date.now() + 12*864e5, icon: TbDatabase },
  { _id: '8',  roleTitle: 'Technical Writer',        startupName: 'DevForge',    startupId: '4', requiredSkills: ['Markdown', 'API Docs', 'Git'],           workType: 'Remote',   industry: 'DevTools',        commitmentLevel: 'Part-time',  deadline: Date.now() + 22*864e5, icon: TbWriting },
  { _id: '9',  roleTitle: 'Cybersecurity Analyst',  startupName: 'FinStack',    startupId: '6', requiredSkills: ['Penetration Testing', 'SIEM', 'Python'], workType: 'On-site',  industry: 'FinTech',         commitmentLevel: 'Full-time',  deadline: Date.now() + 8*864e5,  icon: TbShieldCheck },
  { _id: '10', roleTitle: 'ML Engineer',             startupName: 'EduPath',     startupId: '5', requiredSkills: ['Python', 'TensorFlow', 'NLP'],           workType: 'Remote',   industry: 'EdTech',          commitmentLevel: 'Full-time',  deadline: Date.now() + 16*864e5, icon: TbCode },
  { _id: '11', roleTitle: 'Product Manager',         startupName: 'MedBridge',   startupId: '3', requiredSkills: ['Roadmapping', 'Agile', 'Figma'],         workType: 'Hybrid',   industry: 'HealthTech',      commitmentLevel: 'Full-time',  deadline: Date.now() + 28*864e5, icon: TbBriefcase },
  { _id: '12', roleTitle: 'Brand Designer',          startupName: 'EduPath',     startupId: '5', requiredSkills: ['Illustrator', 'Branding', 'Motion'],     workType: 'Remote',   industry: 'EdTech',          commitmentLevel: 'Part-time',  deadline: Date.now() + 6*864e5,  icon: TbPalette },
  { _id: '13', roleTitle: 'Data Engineer',           startupName: 'AgriSense',   startupId: '8', requiredSkills: ['Spark', 'Kafka', 'dbt'],                 workType: 'Remote',   industry: 'AgriTech',        commitmentLevel: 'Full-time',  deadline: Date.now() + 19*864e5, icon: TbDatabase },
  { _id: '14', roleTitle: 'iOS Developer',           startupName: 'LogiFlow',    startupId: '7', requiredSkills: ['Swift', 'SwiftUI', 'CoreLocation'],      workType: 'Hybrid',   industry: 'Logistics',       commitmentLevel: 'Full-time',  deadline: Date.now() + 24*864e5, icon: TbDeviceMobile },
  { _id: '15', roleTitle: 'Community Manager',       startupName: 'DevForge',    startupId: '4', requiredSkills: ['Discord', 'Twitter/X', 'Content'],       workType: 'Remote',   industry: 'DevTools',        commitmentLevel: 'Part-time',  deadline: Date.now() + 35*864e5, icon: TbSpeakerphone },
];

const WORK_TYPES  = ['All', 'Remote', 'Hybrid', 'On-site'];
const INDUSTRIES  = ['All', 'AI / E-Commerce', 'HealthTech', 'CleanTech', 'DevTools', 'FinTech', 'EdTech', 'AgriTech', 'Logistics'];
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
  const Icon     = opp.icon;
  const daysLeft = Math.ceil((opp.deadline - Date.now()) / 864e5);
  const urgent   = daysLeft <= 7;

  return (
    <motion.div
      variants={cardVariant}
      layout
      whileHover={{ y: -4, transition: { duration: 0.18 } }}
      className="group bg-white rounded-2xl border border-border p-5 flex flex-col gap-4 shadow-sm hover:shadow-lg hover:shadow-brand-100/50 transition-shadow duration-300"
    >
      {/* Role + startup */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0">
          <Icon className="text-brand-600 text-lg" />
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-text text-sm leading-snug group-hover:text-brand-600 transition-colors truncate">
            {opp.roleTitle}
          </h3>
          <p className="text-xs text-text-muted mt-0.5">@ {opp.startupName}</p>
        </div>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5">
        {opp.requiredSkills.map((s) => (
          <span key={s} className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-surface-alt border border-border text-text-muted">
            {s}
          </span>
        ))}
      </div>

      {/* Meta */}
      <div className="flex items-center justify-between text-xs pt-1 border-t border-border mt-auto">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border font-medium ${WORK_BADGE[opp.workType] ?? ''}`}>
          <TbMapPin /> {opp.workType}
        </span>
        <span className={`inline-flex items-center gap-1 font-medium ${urgent ? 'text-danger' : 'text-text-muted'}`}>
          <TbClock /> {daysLeft}d left
        </span>
      </div>

      <Link
        href={`/opportunities/${opp._id}`}
        className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-xs font-semibold border border-brand-200 text-brand-600 hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all duration-200"
      >
        View & Apply <TbArrowRight />
      </Link>
    </motion.div>
  );
}

function FilterPill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
        active
          ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
          : 'bg-white text-text-muted border-border hover:border-brand-300 hover:text-brand-600'
      }`}
    >
      {label}
    </button>
  );
}

export default function BrowseOpportunitiesPage() {
  const [search,   setSearch]   = useState('');
  const [workType, setWorkType] = useState('All');
  const [industry, setIndustry] = useState('All');
  const [page,     setPage]     = useState(1);

  /* Simulate server-side filtering + pagination */
  const filtered = useMemo(() => {
    return ALL_OPPORTUNITIES.filter((o) => {
      const q = search.toLowerCase();
      const matchSearch   = !q || o.roleTitle.toLowerCase().includes(q) ||
                            o.requiredSkills.some((s) => s.toLowerCase().includes(q));
      const matchWorkType = workType === 'All' || o.workType === workType;
      const matchIndustry = industry === 'All' || o.industry === industry;
      return matchSearch && matchWorkType && matchIndustry;
    });
  }, [search, workType, industry]);

  const totalPages = Math.ceil(filtered.length / PAGE_LIMIT);
  const paginated  = filtered.slice((page - 1) * PAGE_LIMIT, page * PAGE_LIMIT);

  const resetPage = () => setPage(1);
  const hasFilters = search || workType !== 'All' || industry !== 'All';

  const clearAll = () => { setSearch(''); setWorkType('All'); setIndustry('All'); setPage(1); };

  return (
    <div className="min-h-screen bg-surface-alt">

      {/* ── Page header ── */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold uppercase tracking-widest mb-3">
              Open Roles
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-text">Browse Opportunities</h1>
            <p className="text-text-muted mt-2 text-base">
              <span className="font-semibold text-text">{ALL_OPPORTUNITIES.length} open roles</span> across{' '}
              top early-stage startups. Find yours.
            </p>
          </motion.div>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="mt-6 relative"
          >
            <TbSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-lg" />
            <input
              type="text"
              placeholder="Search by role title or skill (e.g. React, Designer, Python)…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); resetPage(); }}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-border bg-surface-alt text-sm text-text placeholder:text-text-muted/60 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:bg-white transition-all"
            />
            {search && (
              <button onClick={() => { setSearch(''); resetPage(); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-danger transition-colors">
                <TbX />
              </button>
            )}
          </motion.div>

          {/* Filter pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.18, duration: 0.4 }}
            className="mt-5 space-y-3"
          >
            {/* Work type */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-text-muted w-20 shrink-0">Work Type</span>
              <div className="flex flex-wrap gap-2">
                {WORK_TYPES.map((w) => (
                  <FilterPill key={w} label={w} active={workType === w} onClick={() => { setWorkType(w); resetPage(); }} />
                ))}
              </div>
            </div>
            {/* Industry */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-text-muted w-20 shrink-0">Industry</span>
              <div className="flex flex-wrap gap-2">
                {INDUSTRIES.map((i) => (
                  <FilterPill key={i} label={i} active={industry === i} onClick={() => { setIndustry(i); resetPage(); }} />
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

      {/* ── Results ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Result info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-text-muted">
            Showing{' '}
            <span className="font-semibold text-text">
              {(page - 1) * PAGE_LIMIT + 1}–{Math.min(page * PAGE_LIMIT, filtered.length)}
            </span>{' '}
            of <span className="font-semibold text-text">{filtered.length}</span> results
            {totalPages > 1 && ` · Page ${page} of ${totalPages}`}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {paginated.length > 0 ? (
            <motion.div
              key={`page-${page}-${search}-${workType}-${industry}`}
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.07 } } }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {paginated.map((opp) => (
                <OpportunityCard key={opp._id} opp={opp} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-4">
                <TbBriefcase className="text-brand-400 text-3xl" />
              </div>
              <h3 className="text-lg font-bold text-text mb-1">No opportunities found</h3>
              <p className="text-sm text-text-muted max-w-xs mb-5">
                Try a different search term, work type, or industry.
              </p>
              <button onClick={clearAll} className="text-sm font-semibold text-brand-600 hover:underline">
                Clear all filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-2 mt-12"
          >
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-text-muted hover:border-brand-400 hover:text-brand-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <TbChevronLeft />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-lg border text-sm font-semibold transition-all ${
                  p === page
                    ? 'gradient-brand text-white border-brand-600 shadow-md'
                    : 'border-border text-text-muted hover:border-brand-300 hover:text-brand-600'
                }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-text-muted hover:border-brand-400 hover:text-brand-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <TbChevronRight />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
