'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TbSearch, TbCircleCheck, TbClock, TbX, TbCoin } from 'react-icons/tb';

const MOCK_TXN = [
  { _id: 'txn_001', userEmail: 'aisha@nc.io',   userName: 'Aisha Rahman', plan: 'Premium Monthly', amount: 12.00, status: 'paid',    paidAt: '1 Jun 2026'  },
  { _id: 'txn_002', userEmail: 'marcus@gg.io',  userName: 'Marcus Liu',   plan: 'Premium Annual',  amount: 99.00, status: 'paid',    paidAt: '28 May 2026' },
  { _id: 'txn_003', userEmail: 'priya@mb.io',   userName: 'Priya Nair',   plan: 'Premium Monthly', amount: 12.00, status: 'paid',    paidAt: '20 May 2026' },
  { _id: 'txn_004', userEmail: 'zara@ep.io',    userName: 'Zara Patel',   plan: 'Premium Monthly', amount: 12.00, status: 'pending', paidAt: '15 May 2026' },
  { _id: 'txn_005', userEmail: 'kofi@fs.io',    userName: 'Kofi Asante',  plan: 'Premium Annual',  amount: 99.00, status: 'failed',  paidAt: '10 May 2026' },
  { _id: 'txn_006', userEmail: 'elena@lf.io',   userName: 'Elena Vasil',  plan: 'Premium Monthly', amount: 12.00, status: 'paid',    paidAt: '2 May 2026'  },
  { _id: 'txn_007', userEmail: 'sam@forge.io',  userName: 'Sam Okafor',   plan: 'Premium Annual',  amount: 99.00, status: 'paid',    paidAt: '28 Apr 2026' },
];

const STATUS_STYLES = {
  paid:    'bg-emerald-50 text-emerald-700 border-emerald-200',
  pending: 'bg-amber-50   text-amber-700  border-amber-200',
  failed:  'bg-rose-50    text-rose-700   border-rose-200',
};
const STATUS_ICON = {
  paid:    <TbCircleCheck />,
  pending: <TbClock />,
  failed:  <TbX />,
};

const totalRevenue = MOCK_TXN.filter(t => t.status === 'paid').reduce((a, t) => a + t.amount, 0);

export default function AdminTransactionsPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = MOCK_TXN.filter((t) => {
    const matchSearch = t.userEmail.toLowerCase().includes(search.toLowerCase()) ||
                        t.userName.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || t.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="max-w-5xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-extrabold text-text">Transactions</h1>
        <p className="text-text-muted text-sm mt-1">
          {MOCK_TXN.filter(t => t.status === 'paid').length} successful payments · Total revenue: <span className="font-bold text-success">${totalRevenue.toFixed(2)}</span>
        </p>
      </motion.div>

      {/* Revenue summary */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Revenue',    value: `$${totalRevenue.toFixed(2)}`,                       color: 'bg-success text-white', icon: TbCoin },
          { label: 'Paid',             value: MOCK_TXN.filter(t => t.status === 'paid').length,    color: 'bg-white border border-border', icon: TbCircleCheck },
          { label: 'Failed / Pending', value: MOCK_TXN.filter(t => t.status !== 'paid').length,   color: 'bg-white border border-border', icon: TbX },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className={`rounded-2xl p-5 shadow-sm ${color}`}>
            <p className={`text-xs font-semibold mb-1 ${color.includes('bg-success') ? 'text-white/80' : 'text-text-muted'}`}>{label}</p>
            <p className={`text-2xl font-extrabold ${color.includes('bg-success') ? 'text-white' : 'text-text'}`}>{value}</p>
          </div>
        ))}
      </motion.div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative">
          <TbSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-lg" />
          <input type="text" placeholder="Search user…" value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm text-text outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all w-56" />
        </div>
        <div className="flex gap-2">
          {['all', 'paid', 'pending', 'failed'].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border capitalize transition-all ${filter === f ? 'gradient-brand text-white border-brand-600' : 'bg-white border-border text-text-muted hover:border-brand-300'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-border bg-surface-alt text-left">
                <th className="px-5 py-3 text-xs font-semibold text-text-muted">Transaction ID</th>
                <th className="px-5 py-3 text-xs font-semibold text-text-muted">User</th>
                <th className="px-5 py-3 text-xs font-semibold text-text-muted">Plan</th>
                <th className="px-5 py-3 text-xs font-semibold text-text-muted">Amount</th>
                <th className="px-5 py-3 text-xs font-semibold text-text-muted">Status</th>
                <th className="px-5 py-3 text-xs font-semibold text-text-muted">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((t) => (
                <tr key={t._id} className="hover:bg-surface-alt transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-text-muted">{t._id}</td>
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-text">{t.userName}</p>
                    <p className="text-xs text-text-muted">{t.userEmail}</p>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-text-muted">{t.plan}</td>
                  <td className="px-5 py-3.5 font-bold text-text">${t.amount.toFixed(2)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-xs font-semibold ${STATUS_STYLES[t.status]}`}>
                      {STATUS_ICON[t.status]} {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-text-muted">{t.paidAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <p className="text-center text-sm text-text-muted py-12">No transactions found.</p>}
      </motion.div>
    </div>
  );
}
