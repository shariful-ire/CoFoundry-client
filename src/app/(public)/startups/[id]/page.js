'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  TbArrowLeft, TbUsers, TbBuildingSkyscraper,
  TbRocket, TbBriefcase, TbCalendar,
} from 'react-icons/tb';

/* ── Same mock data — in real app this would be a fetch by id ── */
const ALL_STARTUPS = [
  { _id: '1', startupName: 'NeuralCart',  founderName: 'Aisha Rahman',  founderEmail: 'aisha@neuralcart.io', industry: 'AI / E-Commerce', fundingStage: 'Pre-Seed', teamSizeNeeded: 4, description: 'AI-powered personalised shopping assistant that learns user preferences to boost conversion for D2C brands. We are building the recommendation engine that powers the next generation of online retail — helping shoppers find exactly what they want and helping brands sell more with less ad spend.', initials: 'NC', color: 'from-violet-500 to-purple-700', openRoles: ['Full-Stack Developer', 'ML Engineer', 'Product Designer', 'Growth Marketer'] },
  { _id: '2', startupName: 'GreenGrid',   founderName: 'Marcus Liu',    founderEmail: 'marcus@greengrid.earth', industry: 'CleanTech',  fundingStage: 'Seed',     teamSizeNeeded: 6, description: 'Peer-to-peer solar energy trading platform enabling neighbourhoods to share renewable energy credits. We believe energy independence starts at street level. Our platform creates micro-grids where every rooftop panel becomes a revenue source for its owner.', initials: 'GG', color: 'from-emerald-500 to-teal-700', openRoles: ['Backend Engineer', 'IoT Developer', 'Data Analyst', 'BD Manager', 'UX Designer', 'DevOps'] },
  { _id: '3', startupName: 'MedBridge',   founderName: 'Priya Nair',    founderEmail: 'priya@medbridge.health', industry: 'HealthTech', fundingStage: 'Pre-Seed', teamSizeNeeded: 5, description: 'Connecting rural patients with specialist doctors through asynchronous video consultations and AI triage. Healthcare quality should not depend on postcode. MedBridge is closing that gap — one consultation at a time.', initials: 'MB', color: 'from-rose-500 to-pink-700', openRoles: ['React Native Developer', 'Backend Engineer', 'UI Designer', 'Medical Advisor', 'Growth Marketer'] },
  { _id: '4', startupName: 'DevForge',    founderName: 'Sam Okafor',    founderEmail: 'sam@devforge.io',  industry: 'DevTools',        fundingStage: 'Bootstrapped', teamSizeNeeded: 3, description: 'Collaborative API testing platform with live team replay, smart diffing and one-click mock servers. Developer experience is a competitive advantage — we are making it measurable and improvable.', initials: 'DF', color: 'from-brand-500 to-indigo-700', openRoles: ['Frontend Engineer', 'Technical Writer', 'DevRel Engineer'] },
  { _id: '5', startupName: 'EduPath',     founderName: 'Zara Ahmed',    founderEmail: 'zara@edupath.io',  industry: 'EdTech',         fundingStage: 'Pre-Seed', teamSizeNeeded: 4, description: 'Adaptive learning platform that creates personalised study paths based on student performance and learning style.', initials: 'EP', color: 'from-sky-500 to-blue-700', openRoles: ['Full-Stack Developer', 'Learning Designer', 'Data Scientist', 'Product Manager'] },
];

const STAGE_COLORS = {
  'Pre-Seed':    'bg-amber-50   text-amber-700  border-amber-200',
  'Seed':        'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Series A':    'bg-blue-50    text-blue-700   border-blue-200',
  'Bootstrapped':'bg-slate-50   text-slate-600  border-slate-200',
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const stagger = { show: { transition: { staggerChildren: 0.1 } } };

export default function StartupDetailPage() {
  const { id } = useParams();
  const startup = ALL_STARTUPS.find((s) => s._id === id);

  if (!startup) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <TbRocket className="text-6xl text-brand-200 mb-4" />
        <h2 className="text-2xl font-bold text-text mb-2">Startup not found</h2>
        <p className="text-text-muted mb-6">This startup may have been removed or doesn't exist.</p>
        <Link href="/startups" className="text-brand-600 font-semibold hover:underline inline-flex items-center gap-1">
          <TbArrowLeft /> Back to Browse Startups
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-alt">

      {/* ── Hero banner ── */}
      <div className={`bg-gradient-to-r ${startup.color} py-14 px-4`}>
        <div className="max-w-4xl mx-auto">
          <Link
            href="/startups"
            className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-6 transition-colors"
          >
            <TbArrowLeft /> Back to startups
          </Link>
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="flex items-center gap-5"
          >
            <motion.div
              variants={fadeUp}
              className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white font-extrabold text-2xl shadow-xl shrink-0"
            >
              {startup.initials}
            </motion.div>
            <motion.div variants={fadeUp}>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{startup.startupName}</h1>
              <p className="text-white/70 mt-1 text-sm">Founded by {startup.founderName}</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* About */}
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
              <h2 className="font-bold text-text text-lg mb-3">About {startup.startupName}</h2>
              <p className="text-sm text-text-muted leading-relaxed">{startup.description}</p>
            </div>

            {/* Open roles */}
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
              <h2 className="font-bold text-text text-lg mb-4 flex items-center gap-2">
                <TbBriefcase className="text-brand-500" />
                Open Roles ({startup.openRoles.length})
              </h2>
              <div className="space-y-3">
                {startup.openRoles.map((role, i) => (
                  <motion.div
                    key={role}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-surface-alt border border-border hover:border-brand-200 hover:bg-brand-50 transition-all group"
                  >
                    <span className="text-sm font-medium text-text group-hover:text-brand-700">{role}</span>
                    <Link
                      href="/opportunities"
                      className="text-xs text-brand-600 font-semibold hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      View opening →
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="space-y-5"
          >
            {/* Details card */}
            <div className="bg-white rounded-2xl border border-border p-5 shadow-sm space-y-4">
              <h3 className="font-bold text-text text-sm">Startup Details</h3>

              {[
                { icon: TbBuildingSkyscraper, label: 'Industry',      value: startup.industry },
                { icon: TbRocket,             label: 'Funding Stage', value: startup.fundingStage },
                { icon: TbUsers,              label: 'Roles Open',    value: `${startup.teamSizeNeeded} positions` },
                { icon: TbCalendar,           label: 'Status',        value: 'Accepting Applications' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0">
                    <Icon className="text-brand-500 text-base" />
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">{label}</p>
                    <p className="text-sm font-semibold text-text">{value}</p>
                  </div>
                </div>
              ))}

              <div className="pt-1">
                <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border ${STAGE_COLORS[startup.fundingStage] ?? ''}`}>
                  {startup.fundingStage}
                </span>
              </div>
            </div>

            {/* CTA card */}
            <div className={`rounded-2xl bg-gradient-to-br ${startup.color} p-5 text-white shadow-lg`}>
              <p className="font-bold text-base mb-1">Interested in joining?</p>
              <p className="text-white/70 text-xs leading-relaxed mb-4">
                Browse all open positions at {startup.startupName} and submit your application.
              </p>
              <Link
                href="/opportunities"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white text-sm font-bold shadow hover:opacity-90 transition-opacity"
                style={{ color: 'inherit' }}
              >
                See Opportunities <TbArrowRight />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
