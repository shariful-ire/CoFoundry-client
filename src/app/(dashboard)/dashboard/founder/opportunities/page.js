'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  TbPlus, TbTrash, TbClock, TbMapPin,
  TbBriefcase, TbUsers,
} from 'react-icons/tb';
import api from '@/lib/axios';

const WORK_BADGE = {
  Remote:   'bg-emerald-50 text-emerald-700 border-emerald-200',
  Hybrid:   'bg-amber-50  text-amber-700  border-amber-200',
  'On-site':'bg-rose-50   text-rose-700   border-rose-200',
};

export default function ManageOpportunitiesPage() {
  const qc = useQueryClient();
  const [delId, setDelId] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['my-opportunities'],
    queryFn:  () => api.get('/api/opportunities/mine').then((r) => r.data),
  });

  const opps = data?.data ?? [];

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/api/opportunities/${id}`),
    onSuccess: () => {
      toast.success('Opportunity deleted.');
      setDelId(null);
      qc.invalidateQueries({ queryKey: ['my-opportunities'] });
      qc.invalidateQueries({ queryKey: ['founder-applications'] });
    },
    onError: (err) => toast.error(err?.response?.data?.message ?? 'Delete failed.'),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <span className="w-8 h-8 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-text">Manage Opportunities</h1>
          <p className="text-text-muted text-sm mt-1">
            {opps.length} {opps.length === 1 ? 'opportunity' : 'opportunities'}
          </p>
        </div>
        <Link href="/dashboard/founder/add-opportunity"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl gradient-brand text-white text-sm font-bold shadow-md hover:opacity-90">
          <TbPlus /> Add New
        </Link>
      </motion.div>

      <AnimatePresence>
        {opps.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-20 bg-white rounded-2xl border border-border">
            <TbBriefcase className="text-5xl text-brand-200 mx-auto mb-3" />
            <p className="text-text-muted text-sm">No opportunities yet.</p>
            <Link href="/dashboard/founder/add-opportunity" className="text-brand-600 font-semibold text-sm mt-2 inline-block hover:underline">
              Post your first role →
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {opps.map((opp, i) => {
              const daysLeft = Math.ceil((new Date(opp.deadline) - Date.now()) / 864e5);
              return (
                <motion.div key={opp._id}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-white rounded-2xl border border-border shadow-sm p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-text text-base mb-2">{opp.roleTitle}</h3>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg border text-xs font-medium ${WORK_BADGE[opp.workType] ?? ''}`}>
                        <TbMapPin className="text-xs" /> {opp.workType}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-text-muted border border-border px-2.5 py-0.5 rounded-lg">
                        <TbBriefcase className="text-xs" /> {opp.commitmentLevel}
                      </span>
                      <span className={`inline-flex items-center gap-1 text-xs font-medium ${daysLeft <= 7 ? 'text-danger' : 'text-text-muted'}`}>
                        <TbClock className="text-xs" /> {daysLeft > 0 ? `${daysLeft}d left` : 'Expired'}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-text-muted">
                        <TbUsers className="text-xs" /> {opp.applicantCount ?? 0} applicants
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => setDelId(opp._id)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-danger/30 text-xs font-semibold text-danger hover:bg-danger-light transition-all">
                      <TbTrash /> Delete
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {delId && (
          <motion.div key="modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4"
            onClick={() => setDelId(null)}>
            <motion.div initial={{ scale: 0.93, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.93 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl p-7 max-w-sm w-full text-center">
              <div className="w-12 h-12 rounded-full bg-danger-light flex items-center justify-center mx-auto mb-4">
                <TbTrash className="text-danger text-xl" />
              </div>
              <h3 className="font-bold text-text text-lg mb-1">Delete opportunity?</h3>
              <p className="text-sm text-text-muted mb-6">This will remove the listing and all its applications permanently.</p>
              <div className="flex gap-3">
                <button onClick={() => setDelId(null)}
                  className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-text-muted hover:border-brand-300 transition-all">
                  Cancel
                </button>
                <button onClick={() => deleteMutation.mutate(delId)} disabled={deleteMutation.isPending}
                  className="flex-1 py-2.5 rounded-xl bg-danger text-white text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-60">
                  {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
