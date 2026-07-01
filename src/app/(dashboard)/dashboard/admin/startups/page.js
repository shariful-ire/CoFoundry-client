'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TbSearch, TbCheck, TbTrash, TbX, TbClock, TbBan } from 'react-icons/tb';
import api from '@/lib/axios';

const STATUS_STYLES = {
  pending:  'bg-amber-50  text-amber-700  border-amber-200',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-rose-50   text-rose-700   border-rose-200',
};
const STATUS_ICON = { pending: <TbClock />, approved: <TbCheck />, rejected: <TbX /> };

export default function AdminStartupsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [delId,  setDelId]  = useState(null);

  const { data: startups = [], isLoading } = useQuery({
    queryKey: ['admin-startups'],
    queryFn:  () => api.get('/api/admin/startups').then((r) => r.data),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => api.patch(`/api/admin/startups/${id}`, { status }),
    onSuccess: (_, { status }) => {
      toast.success(`Startup ${status}!`);
      qc.invalidateQueries({ queryKey: ['admin-startups'] });
      qc.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onError: (err) => toast.error(err?.response?.data?.message ?? 'Update failed.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/api/admin/startups/${id}`),
    onSuccess: () => {
      toast.success('Startup removed.');
      setDelId(null);
      qc.invalidateQueries({ queryKey: ['admin-startups'] });
      qc.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onError: (err) => toast.error(err?.response?.data?.message ?? 'Delete failed.'),
  });

  const filtered = startups.filter((s) =>
    s.startupName?.toLowerCase().includes(search.toLowerCase()) ||
    s.founderEmail?.toLowerCase().includes(search.toLowerCase())
  );

  const pendingCount  = startups.filter((s) => s.status === 'pending').length;
  const approvedCount = startups.filter((s) => s.status === 'approved').length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <span className="w-8 h-8 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-extrabold text-text">Manage Startups</h1>
        <p className="text-text-muted text-sm mt-1">
          {pendingCount} pending approval · {approvedCount} live
        </p>
      </motion.div>

      <div className="relative max-w-sm">
        <TbSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-lg" />
        <input type="text" placeholder="Search startup or founder…" value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm text-text outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all" />
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-border bg-surface-alt text-left">
                <th className="px-5 py-3 text-xs font-semibold text-text-muted">Startup</th>
                <th className="px-5 py-3 text-xs font-semibold text-text-muted">Industry</th>
                <th className="px-5 py-3 text-xs font-semibold text-text-muted">Status</th>
                <th className="px-5 py-3 text-xs font-semibold text-text-muted">Submitted</th>
                <th className="px-5 py-3 text-xs font-semibold text-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((s) => (
                <tr key={s._id} className="hover:bg-surface-alt transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-text">{s.startupName}</p>
                    <p className="text-xs text-text-muted">{s.founderEmail}</p>
                  </td>
                  <td className="px-5 py-3.5 text-text-muted text-xs">{s.industry}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-xs font-semibold ${STATUS_STYLES[s.status]}`}>
                      {STATUS_ICON[s.status]} {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-text-muted">{new Date(s.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      {s.status !== 'approved' && (
                        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                          onClick={() => statusMutation.mutate({ id: s._id, status: 'approved' })}
                          disabled={statusMutation.isPending}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-emerald-200 text-emerald-700 text-xs font-semibold hover:bg-emerald-50 transition-all disabled:opacity-60">
                          <TbCheck /> Approve
                        </motion.button>
                      )}
                      {s.status !== 'rejected' && (
                        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                          onClick={() => statusMutation.mutate({ id: s._id, status: 'rejected' })}
                          disabled={statusMutation.isPending}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-amber-200 text-amber-700 text-xs font-semibold hover:bg-amber-50 transition-all disabled:opacity-60">
                          <TbBan /> Reject
                        </motion.button>
                      )}
                      <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                        onClick={() => setDelId(s._id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-rose-200 text-rose-700 text-xs font-semibold hover:bg-rose-50 transition-all">
                        <TbTrash /> Remove
                      </motion.button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <p className="text-center text-sm text-text-muted py-12">No startups found.</p>}
      </motion.div>

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
              <h3 className="font-bold text-text text-lg mb-1">Remove startup?</h3>
              <p className="text-sm text-text-muted mb-6">This will permanently remove the listing and all associated opportunities.</p>
              <div className="flex gap-3">
                <button onClick={() => setDelId(null)}
                  className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-text-muted hover:border-brand-300 transition-all">
                  Cancel
                </button>
                <button onClick={() => deleteMutation.mutate(delId)} disabled={deleteMutation.isPending}
                  className="flex-1 py-2.5 rounded-xl bg-danger text-white text-sm font-bold hover:opacity-90 disabled:opacity-60">
                  {deleteMutation.isPending ? 'Removing…' : 'Remove'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
