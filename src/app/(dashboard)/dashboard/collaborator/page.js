'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import StatCard from '@/components/dashboard/StatCard';
import {
  TbClipboardList, TbCircleCheck, TbClock, TbArrowRight,
  TbX, TbBriefcase,
} from 'react-icons/tb';

const STATS = [
  { label: 'Applications Sent', value: 5,  icon: TbClipboardList, color: 'brand',   trend: { positive: true,  label: '+2 this week'  } },
  { label: 'Accepted',          value: 1,  icon: TbCircleCheck,   color: 'emerald', trend: { positive: true,  label: 'Congrats!'     } },
  { label: 'Pending Review',    value: 3,  icon: TbClock,         color: 'amber',   trend: { positive: false, label: 'Awaiting reply' } },
];

const RECENT = [
  { id: '1', role: 'Full-Stack Developer', startup: 'NeuralCart',  status: 'pending',  date: '2 days ago'   },
  { id: '2', role: 'UI/UX Designer',       startup: 'MedBridge',   status: 'accepted', date: '5 days ago'   },
  { id: '3', role: 'DevOps Engineer',      startup: 'GreenGrid',   status: 'rejected', date: '1 week ago'   },
  { id: '4', role: 'Data Analyst',         startup: 'DevForge',    status: 'pending',  date: '1 week ago'   },
];

const STATUS_STYLES = {
  pending:  'bg-amber-50  text-amber-700  border-amber-200',
  accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-rose-50   text-rose-700   border-rose-200',
};
const STATUS_ICON = {
  pending:  <TbClock className="text-sm" />,
  accepted: <TbCircleCheck className="text-sm" />,
  rejected: <TbX className="text-sm" />,
};

export default function CollaboratorOverview() {
  return (
    <div className="space-y-8 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-extrabold text-text">Good morning, Jane 👋</h1>
        <p className="text-text-muted text-sm mt-1">Track your applications and discover new opportunities.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {STATS.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      {/* Quick actions */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <h2 className="text-base font-bold text-text mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'Browse Opportunities', href: '/opportunities',                    gradient: 'gradient-brand text-white' },
            { label: 'My Applications',      href: '/dashboard/collaborator/applications', gradient: 'bg-white border border-border text-text' },
            { label: 'Edit Profile',         href: '/dashboard/collaborator/profile',      gradient: 'bg-white border border-border text-text' },
          ].map(({ label, href, gradient }) => (
            <Link key={href} href={href}
              className={`flex items-center justify-between px-5 py-3.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity ${gradient}`}>
              {label} <TbArrowRight />
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Recent applications */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-text">My Recent Applications</h2>
          <Link href="/dashboard/collaborator/applications" className="text-xs text-brand-600 font-semibold hover:underline flex items-center gap-1">
            View all <TbArrowRight />
          </Link>
        </div>
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-alt text-left">
                <th className="px-5 py-3 text-xs font-semibold text-text-muted">Role</th>
                <th className="px-5 py-3 text-xs font-semibold text-text-muted hidden sm:table-cell">Startup</th>
                <th className="px-5 py-3 text-xs font-semibold text-text-muted">Status</th>
                <th className="px-5 py-3 text-xs font-semibold text-text-muted hidden md:table-cell">Applied</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {RECENT.map((a) => (
                <tr key={a.id} className="hover:bg-surface-alt transition-colors">
                  <td className="px-5 py-3.5 font-medium text-text">{a.role}</td>
                  <td className="px-5 py-3.5 text-text-muted hidden sm:table-cell">{a.startup}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-medium ${STATUS_STYLES[a.status]}`}>
                      {STATUS_ICON[a.status]} {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-text-muted hidden md:table-cell">{a.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
