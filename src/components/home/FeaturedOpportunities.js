'use client';

import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  TbArrowRight,
  TbClock,
  TbMapPin,
  TbCode,
  TbPalette,
  TbSpeakerphone,
  TbChartBar,
  TbDeviceMobile,
  TbCloud,
} from 'react-icons/tb';
import { format } from 'date-fns';

/* ── placeholder data ── */
const MOCK_OPPORTUNITIES = [
  {
    _id: '1',
    roleTitle: 'Full-Stack Developer',
    startupName: 'NeuralCart',
    startupId: '1',
    requiredSkills: ['React', 'Node.js', 'MongoDB'],
    workType: 'Remote',
    commitmentLevel: 'Full-time',
    deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
    icon: TbCode,
    color: 'bg-violet-50 text-violet-600 border-violet-100',
    dot: 'bg-violet-500',
  },
  {
    _id: '2',
    roleTitle: 'UI/UX Designer',
    startupName: 'MedBridge',
    startupId: '3',
    requiredSkills: ['Figma', 'Prototyping', 'User Research'],
    workType: 'Remote',
    commitmentLevel: 'Part-time',
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    icon: TbPalette,
    color: 'bg-rose-50 text-rose-600 border-rose-100',
    dot: 'bg-rose-500',
  },
  {
    _id: '3',
    roleTitle: 'Growth Marketer',
    startupName: 'GreenGrid',
    startupId: '2',
    requiredSkills: ['SEO', 'Content Strategy', 'Analytics'],
    workType: 'Hybrid',
    commitmentLevel: 'Part-time',
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    icon: TbSpeakerphone,
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    dot: 'bg-emerald-500',
  },
  {
    _id: '4',
    roleTitle: 'Data Analyst',
    startupName: 'DevForge',
    startupId: '4',
    requiredSkills: ['Python', 'SQL', 'Tableau'],
    workType: 'Remote',
    commitmentLevel: 'Full-time',
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    icon: TbChartBar,
    color: 'bg-brand-50 text-brand-600 border-brand-100',
    dot: 'bg-brand-500',
  },
  {
    _id: '5',
    roleTitle: 'Mobile Developer',
    startupName: 'NeuralCart',
    startupId: '1',
    requiredSkills: ['React Native', 'TypeScript', 'Expo'],
    workType: 'Remote',
    commitmentLevel: 'Full-time',
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    icon: TbDeviceMobile,
    color: 'bg-amber-50 text-amber-600 border-amber-100',
    dot: 'bg-amber-500',
  },
  {
    _id: '6',
    roleTitle: 'DevOps Engineer',
    startupName: 'GreenGrid',
    startupId: '2',
    requiredSkills: ['AWS', 'Docker', 'Kubernetes'],
    workType: 'Remote',
    commitmentLevel: 'Part-time',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    icon: TbCloud,
    color: 'bg-sky-50 text-sky-600 border-sky-100',
    dot: 'bg-sky-500',
  },
];

const WORK_TYPE_STYLES = {
  Remote: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Hybrid: 'bg-amber-50  text-amber-700  border-amber-200',
  'On-site': 'bg-rose-50   text-rose-700   border-rose-200',
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

function OpportunityCard({ opp }) {
  const Icon = opp.icon;
  const daysLeft = Math.ceil((opp.deadline - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <motion.div
      variants={cardVariant}
      whileHover={{ y: -3, transition: { duration: 0.18 } }}
      className="group bg-white rounded-2xl border border-border p-5 flex flex-col gap-4 shadow-sm hover:shadow-lg hover:shadow-brand-100/50 transition-shadow duration-300"
    >
      {/* Role icon + title */}
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${opp.color}`}>
          <Icon className="text-lg" />
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
        {opp.requiredSkills.map((skill) => (
          <span
            key={skill}
            className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-surface-alt border border-border text-text-muted"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Meta row */}
      <div className="flex items-center justify-between text-xs text-text-muted pt-1 border-t border-border mt-auto">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs font-medium ${WORK_TYPE_STYLES[opp.workType] ?? ''}`}>
          <TbMapPin className="text-sm" />
          {opp.workType}
        </span>
        <span className={`inline-flex items-center gap-1 ${daysLeft <= 7 ? 'text-danger font-semibold' : ''}`}>
          <TbClock className="text-sm" />
          {daysLeft}d left
        </span>
      </div>

      {/* Apply link */}
      <Link
        href={`/opportunities/${opp._id}`}
        className="inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-semibold border border-brand-200 text-brand-600 hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all duration-200"
      >
        View & Apply <TbArrowRight />
      </Link>
    </motion.div>
  );
}

export default function FeaturedOpportunities() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold uppercase tracking-widest mb-4">
            Open Roles
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text leading-tight">
            Latest{' '}
            <span className="gradient-text">Opportunities</span>
          </h2>
          <p className="mt-4 text-base text-text-muted max-w-xl mx-auto">
            Startups are actively hiring. Find a role that matches your skills
            and start building the future today.
          </p>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {MOCK_OPPORTUNITIES.map((opp) => (
            <OpportunityCard key={opp._id} opp={opp} />
          ))}
        </motion.div>

        {/* View all */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.55, duration: 0.4 }}
          className="text-center mt-12"
        >
          <Link
            href="/opportunities"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-text text-white font-semibold text-sm shadow-lg hover:bg-brand-700 transition-colors"
          >
            Browse All Opportunities
            <TbArrowRight />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
