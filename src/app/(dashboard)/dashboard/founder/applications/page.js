'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  TbCircleCheck, TbX, TbClock, TbMail, TbLink,
  TbMessage, TbChevronDown, TbChevronUp,
} from 'react-icons/tb';

const MOCK_APPS = [
  { _id: '1', applicantEmail: 'james@dev.io',   role: 'Full-Stack Developer', portfolioLink: 'https://github.com/jamesosei',  motivationMessage: 'I have 4 years of experience with React and Node.js and am deeply passionate about AI-powered e-commerce. I built a recommendation engine at my last job that increased conversion by 23%.', status: 'pending',  appliedAt: '2 hours ago'  },
  { _id: '2', applicantEmail: 'sofia@design.io', role: 'UI/UX Designer',       portfolioLink: 'https://sofia.design',           motivationMessage: 'Design is my craft and HealthTech is my calling. I have shipped 3 healthcare apps and understand the accessibility challenges unique to medical platforms.', status: 'accepted', appliedAt: 'Yesterday'    },
  { _id: '3', applicantEmail: 'amir@mobile.dev', role: 'Mobile Developer',     portfolioLink: 'https://amirkhan.dev',           motivationMessage: "I've built 5 React Native apps from scratch, two of which have over 10k DAU. I want to bring that experience to NeuralCart and own the mobile roadmap.", status: 'pending',  appliedAt: '2 days ago'   },
  { _id: '4', applicantEmail: 'lena@growth.io',  role: 'Growth Marketer',     portfolioLink: 'https://linkedin.com/in/lena-m',  motivationMessage: 'I scaled two SaaS companies from 0 to 1,000 users through organic content strategy alone. Ready to do the same for GreenGrid.', status: 'rejected', appliedAt: '3 days ago'   },
  { _id: '5', applicantEmail: 'raj@data.io',     role: 'Data Analyst',         portfolioLink: 'https://github.com/rajdata',     motivationMessage: 'SQL and Python are my native languages. I can build you dashboards that give you real insight into how collaborators and founders interact on the platform.', status: 'pending',  appliedAt: '4 days ago'   },
];

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
  const [apps,     setApps]     = useState(MOCK_APPS);
  const [expanded, setExpanded] = useState(null);
  const [filter,   setFilter]   = useState('all');

  const updateStatus = (id, status) => {
    setApps((prev) => prev.map((a) => a._id === id ? { ...a, status } : a));
    toast.success(`Application ${status}!`);
    // TODO: PATCH /api/applications/:id  { status }
  };

  const filtered = filter === 'all' ? apps : apps.filter((a) => a.status === filter);

  return (
    <div className="max-w-3xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-extrabold text-text">Applications</h1>
        <p className="text-text-muted text-sm mt-1">
          {apps.filter((a) => a.status === 'pending').length} pending · {apps.filter((a) => a.status === 'accepted').length} accepted
        </p>
      </motion.div>

      {/* Filter tabs */}
      <div className="flex gap-2">
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
            <p className="text-text-muted text-sm">No {filter === 'all' ? '' : filter} applications yet.</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filtered.map((app, i) => (
              <motion.div key={app._id}
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -16 }} transition={{ delay: i * 0.06 }}
                className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden"
              >
                {/* Row header */}
                <div className="flex items-center gap-3 p-5">
                  <div className="w-9 h-9 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {app.applicantEmail[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text truncate">{app.applicantEmail}</p>
                    <p className="text-xs text-text-muted truncate">Applying for: {app.role}</p>
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

                {/* Expanded detail */}
                <AnimatePresence>
                  {expanded === app._id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t border-border pt-4 space-y-4">
                        <div className="flex items-center gap-2 text-xs text-text-muted">
                          <TbClock /> Applied {app.appliedAt}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-text mb-1 flex items-center gap-1"><TbLink /> Portfolio</p>
                          <a href={app.portfolioLink} target="_blank" rel="noopener noreferrer"
                            className="text-xs text-brand-600 hover:underline break-all">{app.portfolioLink}</a>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-text mb-1 flex items-center gap-1"><TbMessage /> Motivation</p>
                          <p className="text-xs text-text-muted leading-relaxed">{app.motivationMessage}</p>
                        </div>

                        {/* Actions */}
                        {app.status === 'pending' && (
                          <div className="flex gap-3 pt-1">
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                              onClick={() => updateStatus(app._id, 'accepted')}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-success text-white text-xs font-bold hover:opacity-90">
                              <TbCircleCheck /> Accept
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                              onClick={() => updateStatus(app._id, 'rejected')}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-danger text-white text-xs font-bold hover:opacity-90">
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
