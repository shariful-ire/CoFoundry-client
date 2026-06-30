'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  TbRocket, TbBuildingSkyscraper, TbFileText,
  TbArrowRight, TbEdit, TbTrash, TbCheck,
} from 'react-icons/tb';

const schema = z.object({
  startupName:  z.string().min(2,  'Name must be at least 2 characters').max(60),
  industry:     z.string().min(2,  'Select or enter an industry'),
  fundingStage: z.string().min(1,  'Select a funding stage'),
  description:  z.string().min(50, 'Write at least 50 characters').max(500),
});

const INDUSTRIES   = ['AI / E-Commerce', 'CleanTech', 'HealthTech', 'FinTech', 'EdTech', 'DevTools', 'AgriTech', 'Logistics', 'LegalTech', 'Other'];
const FUNDING_STAGES = ['Pre-Seed', 'Seed', 'Series A', 'Bootstrapped'];

/* Mock: founder already has a startup */
const EXISTING_STARTUP = null; // set to an object to simulate having one

export default function MyStartupPage() {
  const [startup, setStartup] = useState(EXISTING_STARTUP);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: startup ?? {},
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 700));
      // TODO: POST /api/startups with { ...data, founderEmail: from JWT }
      setStartup({ ...data, _id: 'new', status: 'pending', founderEmail: 'jane@example.com' });
      setEditing(false);
      toast.success(startup ? 'Startup updated!' : 'Startup submitted for review!');
    } catch {
      toast.error('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete your startup? This cannot be undone.')) return;
    // TODO: DELETE /api/startups/:id
    setStartup(null);
    reset({});
    toast.success('Startup deleted.');
  };

  /* ── Startup exists: show details ── */
  if (startup && !editing) {
    return (
      <div className="max-w-2xl space-y-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-extrabold text-text">My Startup</h1>
          <p className="text-text-muted text-sm mt-1">Your startup profile visible to collaborators.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-border shadow-sm p-6 space-y-5">

          {/* Status badge */}
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
              startup.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
              startup.status === 'rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' :
              'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              {startup.status === 'approved' ? <TbCheck /> : null}
              {startup.status.charAt(0).toUpperCase() + startup.status.slice(1)}
            </span>
            <div className="flex items-center gap-2">
              <button onClick={() => setEditing(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-text-muted hover:border-brand-400 hover:text-brand-600 transition-all">
                <TbEdit /> Edit
              </button>
              <button onClick={handleDelete}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-danger/30 text-xs font-semibold text-danger hover:bg-danger-light transition-all">
                <TbTrash /> Delete
              </button>
            </div>
          </div>

          {[
            { icon: TbRocket,            label: 'Startup Name',  value: startup.startupName  },
            { icon: TbBuildingSkyscraper, label: 'Industry',     value: startup.industry     },
            { icon: TbBuildingSkyscraper, label: 'Funding Stage',value: startup.fundingStage },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0">
                <Icon className="text-brand-500 text-base" />
              </div>
              <div>
                <p className="text-xs text-text-muted">{label}</p>
                <p className="text-sm font-semibold text-text">{value}</p>
              </div>
            </div>
          ))}

          <div>
            <p className="text-xs text-text-muted mb-1 flex items-center gap-1"><TbFileText /> Description</p>
            <p className="text-sm text-text-muted leading-relaxed">{startup.description}</p>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ── No startup yet or editing: show form ── */
  return (
    <div className="max-w-2xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-extrabold text-text">{editing ? 'Edit Startup' : 'Create Your Startup'}</h1>
        <p className="text-text-muted text-sm mt-1">
          {editing ? 'Update your startup details.' : 'Submit your startup for review. Approved startups appear publicly.'}
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-border shadow-sm p-6">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

          {/* Startup name */}
          <div>
            <label className="block text-xs font-semibold text-text mb-1.5">Startup Name <span className="text-danger">*</span></label>
            <input type="text" placeholder="e.g. NeuralCart" {...register('startupName')}
              className={`w-full px-4 py-3 rounded-xl border text-sm text-text bg-surface-alt outline-none transition-all focus:bg-white focus:border-brand-400 focus:ring-2 focus:ring-brand-100 ${errors.startupName ? 'border-danger' : 'border-border'}`} />
            {errors.startupName && <p className="text-xs text-danger mt-1.5">{errors.startupName.message}</p>}
          </div>

          {/* Industry */}
          <div>
            <label className="block text-xs font-semibold text-text mb-1.5">Industry <span className="text-danger">*</span></label>
            <select {...register('industry')}
              className={`w-full px-4 py-3 rounded-xl border text-sm text-text bg-surface-alt outline-none transition-all focus:bg-white focus:border-brand-400 ${errors.industry ? 'border-danger' : 'border-border'}`}>
              <option value="">Select industry…</option>
              {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
            </select>
            {errors.industry && <p className="text-xs text-danger mt-1.5">{errors.industry.message}</p>}
          </div>

          {/* Funding stage */}
          <div>
            <label className="block text-xs font-semibold text-text mb-1.5">Funding Stage <span className="text-danger">*</span></label>
            <select {...register('fundingStage')}
              className={`w-full px-4 py-3 rounded-xl border text-sm text-text bg-surface-alt outline-none transition-all focus:bg-white focus:border-brand-400 ${errors.fundingStage ? 'border-danger' : 'border-border'}`}>
              <option value="">Select stage…</option>
              {FUNDING_STAGES.map((s) => <option key={s}>{s}</option>)}
            </select>
            {errors.fundingStage && <p className="text-xs text-danger mt-1.5">{errors.fundingStage.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-text mb-1.5">Description <span className="text-danger">*</span></label>
            <textarea rows={4} placeholder="Describe what your startup does and the problem it solves (min 50 chars)…" {...register('description')}
              className={`w-full px-4 py-3 rounded-xl border text-sm text-text bg-surface-alt outline-none transition-all focus:bg-white focus:border-brand-400 focus:ring-2 focus:ring-brand-100 resize-none ${errors.description ? 'border-danger' : 'border-border'}`} />
            {errors.description && <p className="text-xs text-danger mt-1.5">{errors.description.message}</p>}
          </div>

          <div className="flex items-center gap-3 pt-1">
            <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl gradient-brand text-white font-bold text-sm shadow-md disabled:opacity-60">
              {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><TbCheck /> {editing ? 'Save Changes' : 'Submit for Review'}</>}
            </motion.button>
            {editing && (
              <button type="button" onClick={() => setEditing(false)}
                className="px-5 py-3 rounded-xl border border-border text-sm font-semibold text-text-muted hover:border-danger hover:text-danger transition-all">
                Cancel
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
}
