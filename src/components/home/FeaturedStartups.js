'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { TbArrowRight, TbUsers, TbBuildingSkyscraper } from 'react-icons/tb';
import { HiOutlineLocationMarker } from 'react-icons/hi';

/* ── placeholder data (replaced by real API once server is wired) ── */
const MOCK_STARTUPS = [
  {
    _id: '1',
    startupName: 'NeuralCart',
    founderName: 'Aisha Rahman',
    industry: 'AI / E-Commerce',
    fundingStage: 'Pre-Seed',
    teamSizeNeeded: 4,
    description: 'AI-powered personalised shopping assistant that learns user preferences to boost conversion for D2C brands.',
    logo: null,
    initials: 'NC',
    color: 'from-violet-500 to-purple-700',
  },
  {
    _id: '2',
    startupName: 'GreenGrid',
    founderName: 'Marcus Liu',
    industry: 'CleanTech',
    fundingStage: 'Seed',
    teamSizeNeeded: 6,
    description: 'Peer-to-peer solar energy trading platform enabling neighbourhoods to share renewable energy credits.',
    logo: null,
    initials: 'GG',
    color: 'from-emerald-500 to-teal-700',
  },
  {
    _id: '3',
    startupName: 'MedBridge',
    founderName: 'Priya Nair',
    industry: 'HealthTech',
    fundingStage: 'Pre-Seed',
    teamSizeNeeded: 5,
    description: 'Connecting rural patients with specialist doctors through asynchronous video consultations and AI triage.',
    logo: null,
    initials: 'MB',
    color: 'from-rose-500 to-pink-700',
  },
  {
    _id: '4',
    startupName: 'DevForge',
    founderName: 'Sam Okafor',
    industry: 'DevTools',
    fundingStage: 'Bootstrapped',
    teamSizeNeeded: 3,
    description: 'Collaborative API testing platform with live team replay, smart diffing and one-click mock servers.',
    logo: null,
    initials: 'DF',
    color: 'from-brand-500 to-indigo-700',
  },
];

const STAGE_COLORS = {
  'Pre-Seed':    'bg-amber-50 text-amber-700 border-amber-200',
  'Seed':        'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Series A':    'bg-blue-50 text-blue-700 border-blue-200',
  'Bootstrapped':'bg-slate-50 text-slate-600 border-slate-200',
};

/* ── animation variants ── */
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

function StartupCard({ startup }) {
  return (
    <motion.div
      variants={cardVariant}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group bg-white rounded-2xl border border-border shadow-sm hover:shadow-xl hover:shadow-brand-100/60 transition-shadow duration-300 flex flex-col overflow-hidden"
    >
      {/* Card top accent */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${startup.color}`} />

      <div className="p-6 flex flex-col flex-1">
        {/* Logo + name row */}
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${startup.color} flex items-center justify-center text-white font-bold text-base shadow-md shrink-0`}>
            {startup.initials}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-text text-base truncate group-hover:text-brand-600 transition-colors">
              {startup.startupName}
            </h3>
            <p className="text-xs text-text-muted truncate">by {startup.founderName}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-text-muted leading-relaxed line-clamp-2 flex-1 mb-4">
          {startup.description}
        </p>

        {/* Tags row */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-brand-50 text-brand-700 border border-brand-100">
            <TbBuildingSkyscraper className="text-sm" />
            {startup.industry}
          </span>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-lg border ${STAGE_COLORS[startup.fundingStage] ?? 'bg-slate-50 text-slate-600 border-slate-200'}`}>
            {startup.fundingStage}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-text-muted ml-auto">
            <TbUsers className="text-sm" />
            {startup.teamSizeNeeded} roles open
          </span>
        </div>

        {/* CTA */}
        <Link
          href={`/startups/${startup._id}`}
          className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-brand-200 text-brand-600 text-sm font-semibold hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all duration-200"
        >
          View Startup
          <TbArrowRight className="text-base group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}

export default function FeaturedStartups() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-20 px-4 bg-surface-alt">
      <div className="max-w-7xl mx-auto">

        {/* ── Section header ── */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-brand-600 text-xs font-semibold uppercase tracking-widest mb-4">
            Featured Startups
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text leading-tight">
            Startups looking for{' '}
            <span className="gradient-text">talented people</span>
          </h2>
          <p className="mt-4 text-base text-text-muted max-w-xl mx-auto">
            Discover early-stage startups actively building their founding teams.
            Find one that matches your passion and skills.
          </p>
        </motion.div>

        {/* ── Cards grid ── */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {MOCK_STARTUPS.map((startup) => (
            <StartupCard key={startup._id} startup={startup} />
          ))}
        </motion.div>

        {/* ── View all link ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="text-center mt-12"
        >
          <Link
            href="/startups"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl gradient-brand text-white font-semibold text-sm shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/35 hover:opacity-95 transition-all"
          >
            Browse All Startups
            <TbArrowRight className="text-base" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
