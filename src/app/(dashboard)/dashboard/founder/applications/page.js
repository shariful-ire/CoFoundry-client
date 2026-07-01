'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  TbCircleCheck, TbX, TbClock, TbMail, TbLink,
  TbMessage, TbChevronDown, TbChevronUp,
} from 'react-icons/tb';
import api from '@/lib/axios';

const STATUS_STYLES = {
  pending:  'bg-amber-50  text-amber-700  border-amber-200',
  accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-rose-50   text-rose-700   border-rose-200',
};
const STATUS_ICON = {
  pending:  <TbClock />,
  accepted: <TbCircleCheck />,
  rejected: <TbX />,
};

export default function FounderApplicationsPage() {
  const qc = useQueryClient();
  const [expanded, setExpanded] = useState(null);
  const [filter,   setFilter]   = useState('all');

  const { data: apps = [], isLoading } = useQuery({
    queryKey: ['founder-applications'],
    queryFn:  () => api.get('/api/applications/founder').then((r) => r.data),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => api.patch(`/api/applications/${id}`, { status }),
    onSuccess: (_, { status }) => {
      toast.success(`Application ${status}!`);
      qc.invalidateQueries({ queryKey: ['founder-applications'] });
    },
    onError: (err) => toast.error(err?.response?.data?.message ?? 'Update failed.'),
  });

  const pending  = apps.filter((a) => a.status === 'pending').length;
  const accepted = apps.filter((a) => a.status === 'accepted').length;
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
        <h1 className="text-2xl font-extrabold text-text">Applications</h1>
        <p className="text-text-muted text-sm mt-1">
          {pending} pending · {accepted} accepted
        </p>
      </motion.div>

      <div className="flex gap-2 flex-wrap">
        {['all', 'pending', 'accepted', 'rejected'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold border transition-all capitalize ${filter === f ? 'gradient-brand text-white border-brand-600' : 'bg-white border-border text-text-muted hover:border-brand-300 hover:text-brand-600'}`}>
            {f}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {filtered.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-20 bg-white rounded-2xl border border-border">
            <TbMail className="text-5xl text-brand-200 mx-auto mb-3" />
            <p className="text-text-muted text-sm">No {filter === 'all' ? '' : filter + ' '}applications yet.</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filtered.map((app, i) => (
              <motion.div key={app._id}
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -16 }} transition={{ delay: i * 0.06 }}
                className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 p-5">
                  <div className="w-9 h-9 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {(app.applicantId?.name ?? app.applicantEmail ?? '?')[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text truncate">
                      {app.applicantId?.name ?? app.applicantEmail}
                    </p>
                    <p className="text-xs text-text-muted truncate">
                      Applying for: {app.opportunityId?.roleTitle ?? '—'}
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
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                      className="overflow-hidden">
                      <div className="px-5 pb-5 border-t border-border pt-4 space-y-4">
                        <div className="flex items-center gap-2 text-xs text-text-muted">
                          <TbClock /> Applied {new Date(app.createdAt).toLocaleDateString()}
                        </div>
                        {app.applicantId?.email && (
                          <div className="flex items-center gap-2 text-xs text-text-muted">
                            <TbMail /> {app.applicantId.email}
                          </div>
                        )}
                        {app.portfolioLink && (
                          <div>
                            <p className="text-xs font-semibold text-text mb-1 flex items-center gap-1"><TbLink /> Portfolio</p>
                            <a href={app.portfolioLink} target="_blank" rel="noopener noreferrer"
                              className="text-xs text-brand-600 hover:underline break-all">{app.portfolioLink}</a>
                          </div>
                        )}
                        {app.motivationMessage && (
                          <div>
                            <p className="text-xs font-semibold text-text mb-1 flex items-center gap-1"><TbMessage /> Motivation</p>
                            <p className="text-xs text-text-muted leading-relaxed">{app.motivationMessage}</p>
                          </div>
                        )}
                        {app.status === 'pending' && (
                          <div className="flex gap-3 pt-1">
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                              onClick={() => statusMutation.mutate({ id: app._id, status: 'accepted' })}
                              disabled={statusMutation.isPending}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-success text-white text-xs font-bold hover:opacity-90 disabled:opacity-60">
                              <TbCircleCheck /> Accept
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                              onClick={() => statusMutation.mutate({ id: app._id, status: 'rejected' })}
                              disabled={statusMutation.isPending}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-danger text-white text-xs font-bold hover:opacity-90 disabled:opacity-60">
                              <TbX /> Reject
                            </motion.button>
                          </div>
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
