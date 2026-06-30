'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { TbQuote } from 'react-icons/tb';
import { HiStar } from 'react-icons/hi2';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Aisha Rahman',
    role: 'Founder',
    startup: 'NeuralCart',
    quote:
      'I posted a Full-Stack Developer role on CoFoundry and found my CTO within two weeks. The quality of applicants was incredible — everyone had a real portfolio and genuine interest in AI.',
    initials: 'AR',
    gradient: 'from-violet-500 to-purple-600',
    stars: 5,
  },
  {
    id: 2,
    name: 'James Osei',
    role: 'Lead Developer',
    startup: 'DevForge',
    quote:
      'As a developer looking to join an early-stage team, CoFoundry was exactly what I needed. The opportunity cards show everything upfront — skills needed, work type, deadline. No ambiguity.',
    initials: 'JO',
    gradient: 'from-brand-500 to-indigo-600',
    stars: 5,
  },
  {
    id: 3,
    name: 'Priya Nair',
    role: 'Founder',
    startup: 'MedBridge',
    quote:
      'We built our entire founding team through CoFoundry. Our designer, backend engineer, and growth lead all came through the platform. Six months later we just closed our seed round.',
    initials: 'PN',
    gradient: 'from-rose-500 to-pink-600',
    stars: 5,
  },
  {
    id: 4,
    name: 'Sofia Chen',
    role: 'UI/UX Designer',
    startup: 'MedBridge',
    quote:
      'I applied to three startups on my first day. The process was so simple — portfolio link, a short message, done. CoFoundry respects everyone\'s time, which is rare.',
    initials: 'SC',
    gradient: 'from-emerald-500 to-teal-600',
    stars: 5,
  },
  {
    id: 5,
    name: 'Marcus Liu',
    role: 'Founder',
    startup: 'GreenGrid',
    quote:
      'The admin approval flow means every startup listed is legitimate. Collaborators trust the platform, and that trust flows to your listing directly. Our application rate was 3× higher than other platforms.',
    initials: 'ML',
    gradient: 'from-amber-500 to-orange-600',
    stars: 5,
  },
  {
    id: 6,
    name: 'Sam Okafor',
    role: 'Founder & Developer',
    startup: 'DevForge',
    quote:
      'I was both a founder and a collaborator on CoFoundry — posted roles for my startup while also applying to learn from others. The dual-role experience is seamless.',
    initials: 'SO',
    gradient: 'from-sky-500 to-cyan-600',
    stars: 5,
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

function TestimonialCard({ t }) {
  return (
    <motion.div
      variants={cardVariant}
      whileHover={{ y: -4, transition: { duration: 0.18 } }}
      className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-4 shadow-sm hover:shadow-lg hover:shadow-brand-100/50 transition-shadow duration-300"
    >
      {/* Stars */}
      <div className="flex items-center gap-0.5">
        {Array.from({ length: t.stars }).map((_, i) => (
          <HiStar key={i} className="text-amber-400 text-sm" />
        ))}
      </div>

      {/* Quote icon + text */}
      <div className="relative">
        <TbQuote className="absolute -top-1 -left-1 text-brand-100 text-4xl" />
        <p className="text-sm text-text-muted leading-relaxed pt-4 pl-2 italic">
          "{t.quote}"
        </p>
      </div>

      {/* Author */}
      <div className="flex items-center gap-3 pt-2 mt-auto border-t border-border">
        <div
          className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white text-xs font-bold shrink-0`}
        >
          {t.initials}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-text truncate">{t.name}</p>
          <p className="text-xs text-text-muted truncate">
            {t.role} · {t.startup}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="stories" className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-xs font-semibold uppercase tracking-widest mb-4">
            Success Stories
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text leading-tight">
            Teams built on{' '}
            <span className="gradient-text">CoFoundry</span>
          </h2>
          <p className="mt-4 text-base text-text-muted max-w-xl mx-auto">
            Real founders and collaborators who found each other here and went
            on to build something remarkable.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.id} t={t} />
          ))}
        </motion.div>

        {/* Aggregate trust strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.65, duration: 0.4 }}
          className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 py-6 px-8 rounded-2xl bg-surface-alt border border-border"
        >
          {[
            { value: '4.9 / 5', label: 'Average rating' },
            { value: '98%',     label: 'Would recommend' },
            { value: '300+',    label: 'Teams formed' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-extrabold text-text">{value}</p>
              <p className="text-xs text-text-muted mt-0.5">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
