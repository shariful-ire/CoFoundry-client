'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  TbClipboardList, TbCircleCheck, TbClock, TbX,
  TbArrowRight, TbLink, TbMessage, TbChevronDown, TbChevronUp,
} from 'react-icons/tb';
import api from '@/lib/axios';

const STATUS_STYLES = {
  pending:  'bg-amber-50  text-amber-700  border-amber-200',
  accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-rose-50   text-rose-700   border-rose-200',
};
const STATUS_ICON = { pending: <TbClock />, accepted: <TbCircleCheck />, rejected: <TbX /> };

export default function MyApplicationsPage() {
  const [filter,   setFilter]   = useState('all');
  const [expanded, setExpanded] = useState(null);

  const { data: apps = [], isLoading } = useQuery({
    queryKey: ['my-applications'],
    queryFn:  () => api.get('/api/applications/mine').then((r) => r.data),
  });

  const filtered = filter === 'all' ? apps : apps.filter((a) => a.status === filter);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <span className="w-8 h-8 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-extrabold text-text">My Applications</h1>
        <p className="text-text-muted text-sm mt-1">
          {apps.length} total · {apps.filter((a) => a.status === 'pending').length} awaiting response
        </p>
      </motion.div>

      <div className="flex flex-wrap gap-2">
        {['all', 'pending', 'accepted', 'rejected'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold border transition-all capitalize ${filter === f ? 'gradient-brand text-white border-brand-600' : 'bg-white border-border text-text-muted hover:border-brand-300 hover:text-brand-600'}`}>
            {f} {f !== 'all' && `(${apps.filter((a) => a.status === f).length})`}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {filtered.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-20 bg-white rounded-2xl border border-border">
            <TbClipboardList className="text-5xl text-brand-200 mx-auto mb-3" />
            <p className="text-text-muted text-sm mb-3">No {filter === 'all' ? '' : filter + ' '}applications.</p>
            <Link href="/opportunities" className="text-sm text-brand-600 font-semibold hover:underline flex items-center justify-center gap-1">
              Browse opportunities <TbArrowRight />
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {filtered.map((app, i) => (
              <motion.div key={app._id}
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 p-5">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-text truncate">
                      {app.opportunityId?.roleTitle ?? '—'}
                    </p>
                    <p className="text-xs text-text-muted">
                      {app.startupId ? (
                        <Link href={`/startups/${app.startupId._id}`} className="hover:text-brand-600 transition-colors">
                          {app.startupId.startupName}
                        </Link>
                      ) : '—'}
                      {' · '}{new Date(app.createdAt).toLocaleDateString()}
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
                        {app.portfolioLink && (
                          <div>
                            <p className="text-xs font-semibold text-text mb-1 flex items-center gap-1"><TbLink /> Portfolio submitted</p>
                            <a href={app.portfolioLink} target="_blank" rel="noopener noreferrer"
                              className="text-xs text-brand-600 hover:underline">{app.portfolioLink}</a>
                          </div>
                        )}
                        {app.motivationMessage && (
                          <div>
                            <p className="text-xs font-semibold text-text mb-1 flex items-center gap-1"><TbMessage /> Your message</p>
                            <p className="text-xs text-text-muted leading-relaxed">{app.motivationMessage}</p>
                          </div>
                        )}
                        {app.opportunityId?._id && (
                          <Link href={`/opportunities/${app.opportunityId._id}`}
                            className="inline-flex items-center gap-1 text-xs text-brand-600 font-semibold hover:underline mt-1">
                            View opportunity <TbArrowRight />
                          </Link>
                        )}
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
