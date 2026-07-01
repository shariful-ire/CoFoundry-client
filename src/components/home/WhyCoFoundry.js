'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  TbShieldCheck,
  TbRocket,
  TbUsers,
  TbSearch,
  TbCoin,
  TbBolt,
} from 'react-icons/tb';

const FEATURES = [
  {
    icon: TbRocket,
    title: 'Launch Faster',
    description:
      'Stop searching alone. CoFoundry surfaces the right co-founders and team members so you can go from idea to MVP in weeks, not months.',
    color: 'from-brand-500 to-indigo-600',
    bg: 'bg-brand-50',
    border: 'border-brand-100',
  },
  {
    icon: TbSearch,
    title: 'Smart Discovery',
    description:
      'Filter opportunities by role, skills, work type, and industry. Find exactly what fits your background without endless scrolling.',
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
  },
  {
    icon: TbUsers,
    title: 'Curated Community',
    description:
      'Every startup on CoFoundry is reviewed before going live. You get quality connections, not noise.',
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
  },
  {
    icon: TbShieldCheck,
    title: 'Secure & Private',
    description:
      'Your data stays yours. Role-based access controls and end-to-end secure sessions protect your information at every step.',
    color: 'from-rose-500 to-pink-600',
    bg: 'bg-rose-50',
    border: 'border-rose-100',
  },
  {
    icon: TbCoin,
    title: 'Free to Start',
    description:
      'Post up to 3 team openings completely free. Upgrade only when you are ready to scale your hiring.',
    color: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
  },
  {
    icon: TbBolt,
    title: 'Apply in Minutes',
    description:
      'No lengthy profiles required. Share your portfolio, write a short motivation note, and apply to any opportunity in under two minutes.',
    color: 'from-sky-500 to-cyan-600',
    bg: 'bg-sky-50',
    border: 'border-sky-100',
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

export default function WhyCoFoundry() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="why" className="py-20 px-4 bg-surface-alt">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-violet-50 border border-violet-100 text-violet-700 text-xs font-semibold uppercase tracking-widest mb-4">
            Why CoFoundry
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text leading-tight">
            Everything you need to{' '}
            <span className="gradient-text">build your team</span>
          </h2>
          <p className="mt-4 text-base text-text-muted max-w-xl mx-auto">
            We built CoFoundry because finding the right early team member
            shouldn&apos;t be harder than building the product itself.
          </p>
        </motion.div>

        {/* Feature grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                variants={item}
                whileHover={{ y: -4, transition: { duration: 0.18 } }}
                className={`group p-6 rounded-2xl border ${feat.border} ${feat.bg} flex flex-col gap-4 cursor-default`}
              >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.color} flex items-center justify-center shadow-md`}>
                  <Icon className="text-white text-2xl" />
                </div>

                {/* Text */}
                <div>
                  <h3 className="font-bold text-text text-base mb-1.5 group-hover:text-brand-600 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.65, duration: 0.45 }}
          className="mt-16 rounded-2xl gradient-hero p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 text-white"
        >
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold mb-2">
              Ready to find your team?
            </h3>
            <p className="text-brand-200 text-sm max-w-md">
              Join thousands of founders and collaborators already building on
              CoFoundry. It&apos;s free to get started.
            </p>
          </div>
          <a
            href="/register"
            className="shrink-0 inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-brand-700 font-bold text-sm shadow-xl hover:shadow-2xl hover:opacity-95 transition-all"
          >
            <TbRocket />
            Start for Free
          </a>
        </motion.div>
      </div>
    </section>
  );
}
