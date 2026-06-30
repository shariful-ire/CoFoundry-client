'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  TbClipboardList, TbCircleCheck, TbClock, TbX,
  TbArrowRight, TbLink, TbMessage, TbChevronDown, TbChevronUp,
} from 'react-icons/tb';

const MOCK_APPS = [
  { _id: '1', role: 'Full-Stack Developer', startup: 'NeuralCart',  startupId: '1', opportunityId: '1', portfolioLink: 'https://github.com/jane', motivationMessage: 'I am passionate about AI-driven commerce and have 3 years of React + Node.js experience. Excited to bring those skills to NeuralCart.', status: 'pending',  appliedAt: '2 June 2026'  },
  { _id: '2', role: 'UI/UX Designer',       startup: 'MedBridge',   startupId: '3', opportunityId: '2', portfolioLink: 'https://jane.design',     motivationMessage: 'Healthcare UX is where I specialise. I have shipped 2 medical apps and understand WCAG accessibility deeply.', status: 'accepted', appliedAt: '28 May 2026'  },
  { _id: '3', role: 'DevOps Engineer',      startup: 'GreenGrid',   startupId: '2', opportunityId: '6', portfolioLink: 'https://jane.dev',         motivationMessage: 'AWS-certified with 4 years in DevOps. Would love to build the infra layer for green energy trading at scale.', status: 'rejected', appliedAt: '22 May 2026'  },
  { _id: '4', role: 'Data Analyst',         startup: 'DevForge',    startupId: '4', opportunityId: '4', portfolioLink: 'https://github.com/jane',  motivationMessage: 'I turn raw data into product decisions. Would build the analytics layer that shows DevForge how developers actually use the platform.', status: 'pending',  appliedAt: '18 May 2026'  },
  { _id: '5', role: 'Growth Marketer',      startup: 'GreenGrid',   startupId: '2', opportunityId: '3', portfolioLink: 'https://jane.marketing',   motivationMessage: 'Grew an EdTech newsletter to 40k subscribers in 6 months through organic SEO. Ready to do the same for CleanTech.', status: 'pending',  appliedAt: '10 May 2026'  },
];

const STATUS_STYLES = {
  pending:  'bg-amber-50  text-amber-700  border-amber-200',
  accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-rose-50   text-rose-700   border-rose-200',
};
const STATUS_ICON = { pending: <TbClock />, accepted: <TbCircleCheck />, rejected: <TbX /> };

export default function MyApplicationsPage() {
  const [filter,   setFilter]   = useState('all');
  const [expanded, setExpanded] = useState(null);

  const filtered = filter === 'all' ? MOCK_APPS : MOCK_APPS.filter((a) => a.status === filter);

  return (
    <div className="max-w-3xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-extrabold text-text">My Applications</h1>
        <p className="text-text-muted text-sm mt-1">{MOCK_APPS.length} total · {MOCK_APPS.filter(a => a.status === 'pending').length} awaiting response</p>
      </motion.div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {['all', 'pending', 'accepted', 'rejected'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold border transition-all capitalize ${filter === f ? 'gradient-brand text-white border-brand-600' : 'bg-white border-border text-text-muted hover:border-brand-300 hover:text-brand-600'}`}>
            {f} {f !== 'all' && `(${MOCK_APPS.filter(a => a.status === f).length})`}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {filtered.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-20 bg-white rounded-2xl border border-border">
            <TbClipboardList className="text-5xl text-brand-200 mx-auto mb-3" />
            <p className="text-text-muted text-sm mb-3">No {filter === 'all' ? '' : filter} applications.</p>
            <Link href="/opportunities" className="text-sm text-brand-600 font-semibold hover:underline flex items-center justify-center gap-1">
              Browse opportunities <TbArrowRight />
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {filtered.map((app, i) => (
              <motion.div key={app._id}
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden"
              >
                <div className="flex items-center gap-3 p-5">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-text truncate">{app.role}</p>
                    <p className="text-xs text-text-muted">
                      <Link href={`/startups/${app.startupId}`} className="hover:text-brand-600 transition-colors">
                        {app.startup}
                      </Link>
                      {' · '}{app.appliedAt}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-xs font-semibold ${STATUS_STYLES[app.status]}`}>
                      {STATUS_ICON[app.status]}
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                    <button onClick={() => setExpanded(expanded === app._id ? null : app._id)}
                      className="p-1.5 rounded-lg text-text-muted hover:bg-surface-alt transition-colors">
                      {expanded === app._id ? <TbChevronUp /> : <TbChevronDown />}
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {expanded === app._id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
                      <div className="px-5 pb-5 pt-3 border-t border-border space-y-3">
                        <div>
                          <p className="text-xs font-semibold text-text mb-1 flex items-center gap-1"><TbLink /> Portfolio submitted</p>
                          <a href={app.portfolioLink} target="_blank" rel="noopener noreferrer"
                            className="text-xs text-brand-600 hover:underline">{app.portfolioLink}</a>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-text mb-1 flex items-center gap-1"><TbMessage /> Your message</p>
                          <p className="text-xs text-text-muted leading-relaxed">{app.motivationMessage}</p>
                        </div>
                        <Link href={`/opportunities/${app.opportunityId}`}
                          className="inline-flex items-center gap-1 text-xs text-brand-600 font-semibold hover:underline mt-1">
                          View opportunity <TbArrowRight />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
