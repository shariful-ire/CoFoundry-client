'use client';

import { motion } from 'framer-motion';

export default function StatCard({ label, value, icon: Icon, color = 'brand', trend }) {
  const colors = {
    brand:   { bg: 'bg-brand-50',   border: 'border-brand-100',   icon: 'bg-brand-100   text-brand-600'   },
    emerald: { bg: 'bg-emerald-50', border: 'border-emerald-100', icon: 'bg-emerald-100 text-emerald-600' },
    amber:   { bg: 'bg-amber-50',   border: 'border-amber-100',   icon: 'bg-amber-100   text-amber-600'   },
    rose:    { bg: 'bg-rose-50',    border: 'border-rose-100',    icon: 'bg-rose-100    text-rose-600'    },
    violet:  { bg: 'bg-violet-50',  border: 'border-violet-100',  icon: 'bg-violet-100  text-violet-600'  },
  };
  const c = colors[color] ?? colors.brand;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className={`rounded-2xl border p-5 shadow-sm ${c.bg} ${c.border}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">{label}</p>
          <p className="text-3xl font-extrabold text-text">{value}</p>
          {trend && (
            <p className={`text-xs mt-1 font-medium ${trend.positive ? 'text-success' : 'text-danger'}`}>
              {trend.positive ? '↑' : '↓'} {trend.label}
            </p>
          )}
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${c.icon}`}>
          <Icon className="text-xl" />
        </div>
      </div>
    </motion.div>
  );
}
