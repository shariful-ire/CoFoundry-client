'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { TbSearch, TbCheck, TbTrash, TbX, TbClock } from 'react-icons/tb';

const MOCK_STARTUPS = [
  { _id: '1', startupName: 'NeuralCart',  founderEmail: 'aisha@nc.io',    industry: 'AI / E-Commerce', status: 'pending',  createdAt: '1 Jan 2026'  },
  { _id: '2', startupName: 'GreenGrid',   founderEmail: 'marcus@gg.io',   industry: 'CleanTech',       status: 'approved', createdAt: '5 Jan 2026'  },
  { _id: '3', startupName: 'MedBridge',   founderEmail: 'priya@mb.io',    industry: 'HealthTech',      status: 'approved', createdAt: '10 Jan 2026' },
  { _id: '4', startupName: 'DevForge',    founderEmail: 'sam@df.io',      industry: 'DevTools',        status: 'pending',  createdAt: '12 Jan 2026' },
  { _id: '5', startupName: 'EduPath',     founderEmail: 'zara@ep.io',     industry: 'EdTech',          status: 'rejected', createdAt: '15 Jan 2026' },
  { _id: '6', startupName: 'FinStack',    founderEmail: 'kofi@fs.io',     industry: 'FinTech',         status: 'pending',  createdAt: '18 Jan 2026' },
  { _id: '7', startupName: 'LogiFlow',    founderEmail: 'elena@lf.io',    industry: 'Logistics',       status: 'approved', createdAt: '20 Jan 2026' },
];

const STATUS_STYLES = {
  pending:  'bg-amber-50  text-amber-700  border-amber-200',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-rose-50   text-rose-700   border-rose-200',
};
const STATUS_ICON = { pending: <TbClock />, approved: <TbCheck />, rejected: <TbX /> };

export default function AdminStartupsPage() {
  const [startups, setStartups] = useState(MOCK_STARTUPS);
  const [search,   setSearch]   = useState('');
  const [delId,    setDelId]    = useState(null);

  const updateStatus = (id, status) => {
    setStartups((prev) => prev.map((s) => s._id === id ? { ...s, status } : s));
    toast.success(`Startup ${status}!`);
    // TODO: PATCH /api/admin/startups/:id  { status }
  };

  const handleRemove = (id) => {
    setStartups((prev) => prev.filter((s) => s._id !== id));
    setDelId(null);
    toast.success('Startup removed.');
    // TODO: DELETE /api/admin/startups/:id
  };

  const filtered = startups.filter((s) =>
    s.startupName.toLowerCase().includes(search.toLowerCase()) ||
    s.founderEmail.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-extrabold text-text">Manage Startups</h1>
        <p className="text-text-muted text-sm mt-1">
          {startups.filter(s => s.status === 'pending').length} pending approval · {startups.filter(s => s.status === 'approved').length} live
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
                  <td className="px-5 py-3.5 text-xs text-text-muted">{s.createdAt}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      {s.status !== 'approved' && (
                        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                          onClick={() => updateStatus(s._id, 'approved')}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-emerald-200 text-emerald-700 text-xs font-semibold hover:bg-emerald-50 transition-all">
                          <TbCheck /> Approve
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

      {/* Delete modal */}
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
                <button onClick={() => setDelId(null)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-text-muted hover:border-brand-300 transition-all">Cancel</button>
                <button onClick={() => handleRemove(delId)} className="flex-1 py-2.5 rounded-xl bg-danger text-white text-sm font-bold hover:opacity-90">Remove</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
