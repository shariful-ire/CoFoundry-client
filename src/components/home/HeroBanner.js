'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { TbRocket, TbUsers, TbBriefcase, TbArrowRight } from 'react-icons/tb';
import { HiSparkles } from 'react-icons/hi2';
import { useAuth } from '@/context/AuthContext';

const stats = [
  { icon: TbRocket,    value: '500+',  label: 'Startups Listed'   },
  { icon: TbUsers,     value: '2,000+', label: 'Collaborators'    },
  { icon: TbBriefcase, value: '300+',  label: 'Teams Formed'      },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0  },
};

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.12 } },
};

export default function HeroBanner() {
  const { user } = useAuth();

  return (
    <section className="relative overflow-hidden gradient-hero min-h-[92vh] flex flex-col items-center justify-center px-4">

      {/* ── Decorative blurred orbs ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-violet-600/30 blur-3xl" />
        <div className="absolute -bottom-40 -right-20 w-[420px] h-[420px] rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-600/10 blur-3xl" />
      </div>

      {/* ── Content ── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-4xl mx-auto text-center"
      >
        {/* Badge */}
        <motion.div variants={fadeUp} className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-sm text-brand-200 font-medium my-2">
            <HiSparkles className="text-brand-300 " />
            Where great teams are born
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight"
        >
          Find Your{' '}
          <span className="relative inline-block">
            <span className="relative z-10 bg-gradient-to-r from-brand-300 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
              Co-Founder
            </span>
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.7, duration: 0.5, ease: 'easeOut' }}
              className="absolute bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-brand-400 to-cyan-400 rounded-full origin-left"
            />
          </span>
          <br />
          Build Something{' '}
          <span className="bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">
            Great
          </span>
        </motion.h1>

        {/* Sub-heading */}
        <motion.p
          variants={fadeUp}
          className="mt-6 text-lg sm:text-xl text-brand-200 max-w-2xl mx-auto leading-relaxed"
        >
          CoFoundry connects startup founders with passionate developers, designers,
          and marketers ready to join early-stage teams. Post openings, discover
          opportunities, and build together.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              href={user ? '/dashboard' : '/register'}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-brand-700 font-bold text-base shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-black/30 transition-shadow"
            >
              <TbRocket className="text-lg" />
              {user ? 'Go to Dashboard' : 'Get Started Free'}
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/opportunities"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/30 bg-white/10 backdrop-blur-sm text-white font-semibold text-base hover:bg-white/20 transition-colors"
            >
              Browse Opportunities
              <TbArrowRight className="text-lg" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Trust line */}
        <motion.p variants={fadeUp} className="mt-6 text-sm text-brand-400">
          Free to join · No credit card required
        </motion.p>
      </motion.div>

      {/* ── Stats bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="relative z-10 mt-16 w-full max-w-3xl mx-auto"
      >
        <div className="grid grid-cols-3 gap-px bg-white/10 rounded-2xl overflow-hidden border border-white/10 backdrop-blur-sm">
          {stats.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1 py-5 px-4 bg-white/5 hover:bg-white/10 transition-colors"
            >
              <Icon className="text-brand-300 text-2xl mb-1" />
              <span className="text-2xl sm:text-3xl font-extrabold text-white">{value}</span>
              <span className="text-xs sm:text-sm text-brand-300 text-center">{label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Scroll hint ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="relative z-10 mt-12"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center pt-2 mx-auto"
        >
          <div className="w-1 h-2 rounded-full bg-white/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}
