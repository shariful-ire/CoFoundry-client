'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import StatCard from '@/components/dashboard/StatCard';
import {
  TbBriefcase, TbMail, TbUsers, TbArrowRight,
  TbCircleCheck, TbClock, TbX,
} from 'react-icons/tb';
import api from '@/lib/axios';

const STATUS_STYLES = {
  pending:  'bg-amber-50  text-amber-700  border-amber-200',
  accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-rose-50   text-rose-700   border-rose-200',
};
const STATUS_ICON = {
  pending:  <TbClock className="text-amber-500" />,
  accepted: <TbCircleCheck className="text-emerald-500" />,
  rejected: <TbX className="text-rose-500" />,
};

export default function FounderOverview() {
  const { user } = useAuth();

  const { data: oppsData } = useQuery({
    queryKey: ['my-opportunities'],
    queryFn:  () => api.get('/api/opportunities/mine').then((r) => r.data),
  });

  const { data: appsData, isLoading: appsLoading } = useQuery({
    queryKey: ['founder-applications'],
    queryFn:  () => api.get('/api/applications/founder').then((r) => r.data),
  });

  const totalOpps = oppsData?.totalCount ?? 0;
  const allApps   = Array.isArray(appsData) ? appsData : [];
  const accepted  = allApps.filter((a) => a.status === 'accepted').length;
  const recentApps = allApps.slice(0, 5);

  const stats = [
    { label: 'Total Opportunities', value: totalOpps, icon: TbBriefcase, color: 'brand',   trend: { positive: true, label: 'Active listings'  } },
    { label: 'Total Applications',  value: allApps.length, icon: TbMail, color: 'violet',  trend: { positive: true, label: 'Across all roles' } },
    { label: 'Accepted Members',    value: accepted,  icon: TbUsers,     color: 'emerald', trend: { positive: true, label: 'Joined your team' } },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-extrabold text-text">
          Good {getGreeting()}, {user?.name?.split(' ')[0] ?? 'Founder'} 👋
        </h1>
        <p className="text-text-muted text-sm mt-1">Here&apos;s what&apos;s happening with your startup today.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <h2 className="text-base font-bold text-text mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'Add Opportunity',   href: '/dashboard/founder/add-opportunity', gradient: 'gradient-brand bg-brand-600', text: 'text-white' },
            { label: 'Manage Startup',    href: '/dashboard/founder/startup',          gradient: 'bg-surface-alt border border-border', text: 'text-text' },
            { label: 'View Applications', href: '/dashboard/founder/applications',     gradient: 'bg-surface-alt border border-border', text: 'text-text' },
          ].map(({ label, href, gradient, text }) => (
            <Link key={href} href={href}
              className={`flex items-center justify-between px-5 py-3.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 ${gradient} ${text}`}>
              {label} <TbArrowRight />
            </Link>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-text">Recent Applications</h2>
          <Link href="/dashboard/founder/applications" className="text-xs text-brand-600 font-semibold hover:underline flex items-center gap-1">
            View all <TbArrowRight />
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          {appsLoading ? (
            <div className="flex items-center justify-center py-12">
              <span className="w-6 h-6 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
            </div>
          ) : recentApps.length === 0 ? (
            <div className="text-center py-12">
              <TbMail className="text-4xl text-brand-200 mx-auto mb-2" />
              <p className="text-text-muted text-sm">No applications yet.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-alt text-left">
                  <th className="px-5 py-3 text-xs font-semibold text-text-muted">Applicant</th>
                  <th className="px-5 py-3 text-xs font-semibold text-text-muted hidden sm:table-cell">Role</th>
                  <th className="px-5 py-3 text-xs font-semibold text-text-muted">Status</th>
                  <th className="px-5 py-3 text-xs font-semibold text-text-muted hidden md:table-cell">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentApps.map((app) => (
                  <tr key={app._id} className="hover:bg-surface-alt transition-colors">
                    <td className="px-5 py-3.5 font-medium text-text">
                      {app.applicantId?.name ?? app.applicantEmail}
                    </td>
                    <td className="px-5 py-3.5 text-text-muted hidden sm:table-cell">
                      {app.opportunityId?.roleTitle ?? '—'}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-medium ${STATUS_STYLES[app.status]}`}>
                        {STATUS_ICON[app.status]} {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-text-muted text-xs hidden md:table-cell">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
