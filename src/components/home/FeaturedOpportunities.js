'use client';

import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TbArrowRight, TbClock, TbMapPin, TbBriefcase } from 'react-icons/tb';
import api from '@/lib/axios';

const WORK_TYPE_STYLES = {
  Remote:   'bg-emerald-50 text-emerald-700 border-emerald-200',
  Hybrid:   'bg-amber-50  text-amber-700  border-amber-200',
  'On-site':'bg-rose-50   text-rose-700   border-rose-200',
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const cardVariant = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

function OpportunityCard({ opp }) {
  const daysLeft = Math.ceil((new Date(opp.deadline) - Date.now()) / 864e5);
  return (
    <motion.div variants={cardVariant} whileHover={{ y: -3, transition: { duration: 0.18 } }}
      className="group bg-white rounded-2xl border border-border p-5 flex flex-col gap-4 shadow-sm hover:shadow-lg hover:shadow-brand-100/50 transition-shadow duration-300">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl border border-brand-100 bg-brand-50 flex items-center justify-center shrink-0">
          <TbBriefcase className="text-brand-600 text-lg" />
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-text text-sm leading-snug group-hover:text-brand-600 transition-colors truncate">
            {opp.roleTitle}
          </h3>
          <p className="text-xs text-text-muted mt-0.5">@ {opp.startupId?.startupName ?? '—'}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {opp.requiredSkills?.map((skill) => (
          <span key={skill} className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-surface-alt border border-border text-text-muted">
            {skill}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-text-muted pt-1 border-t border-border mt-auto">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs font-medium ${WORK_TYPE_STYLES[opp.workType] ?? ''}`}>
          <TbMapPin /> {opp.workType}
        </span>
        <span className={`inline-flex items-center gap-1 ${daysLeft <= 7 ? 'text-danger font-semibold' : ''}`}>
          <TbClock /> {daysLeft > 0 ? `${daysLeft}d left` : 'Closing soon'}
        </span>
      </div>

      <Link href={`/opportunities/${opp._id}`}
        className="inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-semibold border border-brand-200 text-brand-600 hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all duration-200">
        View & Apply <TbArrowRight />
      </Link>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-border p-5 space-y-4 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-border shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-border rounded w-3/4" />
          <div className="h-3 bg-border rounded w-1/2" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="h-5 bg-border rounded-full w-16" />
        <div className="h-5 bg-border rounded-full w-20" />
      </div>
      <div className="h-8 bg-border rounded-xl" />
    </div>
  );
}

export default function FeaturedOpportunities() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const { data, isLoading } = useQuery({
    queryKey: ['featured-opportunities'],
    queryFn:  () => api.get('/api/opportunities?limit=6').then((r) => r.data),
  });

  const opps = data?.data ?? [];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div ref={ref} initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}
          className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold uppercase tracking-widest mb-4">
            Open Roles
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text leading-tight">
            Latest <span className="gradient-text">Opportunities</span>
          </h2>
          <p className="mt-4 text-base text-text-muted max-w-xl mx-auto">
            Startups are actively hiring. Find a role that matches your skills.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1,2,3,4,5,6].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : opps.length > 0 ? (
          <motion.div variants={container} initial="hidden" animate={isInView ? 'show' : 'hidden'}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {opps.map((opp) => <OpportunityCard key={opp._id} opp={opp} />)}
          </motion.div>
        ) : (
          <p className="text-center text-text-muted py-12">No open roles yet — check back soon.</p>
        )}

        <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.55, duration: 0.4 }} className="text-center mt-12">
          <Link href="/opportunities"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-text text-white font-semibold text-sm shadow-lg hover:bg-brand-700 transition-colors">
            Browse All Opportunities <TbArrowRight />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
