'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import StatCard from '@/components/dashboard/StatCard';
import { TbUsers, TbRocket, TbBriefcase, TbCoin, TbArrowRight } from 'react-icons/tb';

const STATS = [
  { label: 'Total Users',        value: 284,  icon: TbUsers,     color: 'brand'   },
  { label: 'Total Startups',     value: 39,   icon: TbRocket,    color: 'violet'  },
  { label: 'Total Opportunities',value: 127,  icon: TbBriefcase, color: 'emerald' },
  { label: 'Total Revenue',      value: '$4,800', icon: TbCoin,  color: 'amber'   },
];

const RECENT_USERS = [
  { id: '1', name: 'James Osei',   email: 'james@dev.io',   role: 'collaborator', joinedAt: '2 hours ago',  isBlocked: false },
  { id: '2', name: 'Priya Nair',   email: 'priya@mb.io',    role: 'founder',      joinedAt: 'Yesterday',    isBlocked: false },
  { id: '3', name: 'Sam Okafor',   email: 'sam@forge.io',   role: 'founder',      joinedAt: '2 days ago',   isBlocked: true  },
];

const ROLE_BADGE = {
  founder:      'bg-brand-50   text-brand-700',
  collaborator: 'bg-emerald-50 text-emerald-700',
  admin:        'bg-rose-50    text-rose-700',
};

export default function AdminOverview() {
  return (
    <div className="space-y-8 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-extrabold text-text">Admin Overview</h1>
        <p className="text-text-muted text-sm mt-1">Platform health at a glance.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      {/* Quick nav */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="text-base font-bold text-text mb-3">Manage</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'Manage Users',    href: '/dashboard/admin/users',        gradient: 'gradient-brand text-white' },
            { label: 'Manage Startups', href: '/dashboard/admin/startups',     gradient: 'bg-white border border-border text-text' },
            { label: 'Transactions',    href: '/dashboard/admin/transactions', gradient: 'bg-white border border-border text-text' },
          ].map(({ label, href, gradient }) => (
            <Link key={href} href={href}
              className={`flex items-center justify-between px-5 py-3.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity ${gradient}`}>
              {label} <TbArrowRight />
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Recent users */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36 }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-text">Recent Users</h2>
          <Link href="/dashboard/admin/users" className="text-xs text-brand-600 font-semibold hover:underline flex items-center gap-1">
            View all <TbArrowRight />
          </Link>
        </div>
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-alt text-left">
                <th className="px-5 py-3 text-xs font-semibold text-text-muted">User</th>
                <th className="px-5 py-3 text-xs font-semibold text-text-muted hidden sm:table-cell">Role</th>
                <th className="px-5 py-3 text-xs font-semibold text-text-muted">Status</th>
                <th className="px-5 py-3 text-xs font-semibold text-text-muted hidden md:table-cell">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {RECENT_USERS.map((u) => (
                <tr key={u.id} className="hover:bg-surface-alt transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-text">{u.name}</p>
                    <p className="text-xs text-text-muted">{u.email}</p>
                  </td>
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${ROLE_BADGE[u.role]}`}>{u.role}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${u.isBlocked ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
                      {u.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-text-muted hidden md:table-cell">{u.joinedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
