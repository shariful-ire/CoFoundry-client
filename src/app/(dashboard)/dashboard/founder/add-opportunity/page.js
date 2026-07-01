'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import {
  TbPlus, TbX, TbCheck, TbCrown, TbArrowRight, TbLock,
} from 'react-icons/tb';
import api from '@/lib/axios';

const FREE_LIMIT = 3;

const schema = z.object({
  roleTitle:       z.string().min(3, 'Role title is required'),
  workType:        z.enum(['Remote', 'Hybrid', 'On-site'], { required_error: 'Select a work type' }),
  commitmentLevel: z.enum(['Full-time', 'Part-time'], { required_error: 'Select commitment level' }),
  deadline:        z.string().min(1, 'Deadline is required'),
});

const WORK_TYPES       = ['Remote', 'Hybrid', 'On-site'];
const COMMITMENT_TYPES = ['Full-time', 'Part-time'];

export default function AddOpportunityPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [skills,     setSkills]     = useState([]);
  const [skillInput, setSkillInput] = useState('');

  const { data: oppsData } = useQuery({
    queryKey: ['my-opportunities'],
    queryFn:  () => api.get('/api/opportunities/mine').then((r) => r.data),
  });

  const currentCount = oppsData?.totalCount ?? 0;
  const isPremium    = user?.isPremium ?? false;
  const blocked      = currentCount >= FREE_LIMIT && !isPremium;

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s) && skills.length < 8) {
      setSkills((prev) => [...prev, s]);
      setSkillInput('');
    }
  };
  const removeSkill = (s) => setSkills((prev) => prev.filter((x) => x !== s));

  const postMutation = useMutation({
    mutationFn: (data) => api.post('/api/opportunities', { ...data, requiredSkills: skills }),
    onSuccess: () => {
      toast.success('Opportunity posted!');
      reset();
      setSkills([]);
      qc.invalidateQueries({ queryKey: ['my-opportunities'] });
    },
    onError: (err) => toast.error(err?.response?.data?.message ?? 'Failed to post.'),
  });

  const onSubmit = (data) => {
    if (skills.length === 0) { toast.error('Add at least one required skill'); return; }
    postMutation.mutate(data);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-extrabold text-text">Add Opportunity</h1>
        <p className="text-text-muted text-sm mt-1">Post a new role for collaborators to discover and apply to.</p>
      </motion.div>

      <AnimatePresence>
        {blocked && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl gradient-hero p-8 text-white text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto">
              <TbLock className="text-3xl text-white" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold mb-1">Free limit reached</h2>
              <p className="text-brand-200 text-sm max-w-sm mx-auto">
                You&apos;ve used all <strong>{FREE_LIMIT} free opportunity slots</strong>.
                Upgrade to CoFoundry Premium to post unlimited roles.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link href="/dashboard/founder/premium"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-white text-brand-700 font-bold text-sm shadow-xl">
                  <TbCrown /> Upgrade to Premium
                </Link>
              </motion.div>
              <Link href="/dashboard/founder/opportunities"
                className="inline-flex items-center gap-2 text-sm text-brand-200 hover:text-white font-semibold transition-colors">
                View my opportunities <TbArrowRight />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!blocked && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-border shadow-sm p-6">

          {!isPremium && (
            <div className="flex items-center justify-between mb-5 p-3 rounded-xl bg-amber-50 border border-amber-200">
              <p className="text-xs text-amber-700 font-medium">
                <TbCrown className="inline mr-1" />
                Free plan: <strong>{currentCount}/{FREE_LIMIT}</strong> opportunities used
              </p>
              <Link href="/dashboard/founder/premium" className="text-xs font-bold text-amber-700 hover:underline">
                Upgrade →
              </Link>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-text mb-1.5">Role Title <span className="text-danger">*</span></label>
              <input type="text" placeholder="e.g. Full-Stack Developer" {...register('roleTitle')}
                className={`w-full px-4 py-3 rounded-xl border text-sm text-text bg-surface-alt outline-none transition-all focus:bg-white focus:border-brand-400 focus:ring-2 focus:ring-brand-100 ${errors.roleTitle ? 'border-danger' : 'border-border'}`} />
              {errors.roleTitle && <p className="text-xs text-danger mt-1.5">{errors.roleTitle.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-text mb-1.5">
                Required Skills <span className="text-danger">*</span>
                <span className="font-normal text-text-muted ml-1">(press Enter or comma to add)</span>
              </label>
              <div className="w-full px-3 py-2.5 rounded-xl border border-border bg-surface-alt transition-all focus-within:bg-white focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100">
                <div className="flex flex-wrap gap-1.5 mb-1.5">
                  {skills.map((s) => (
                    <span key={s} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-medium">
                      {s}
                      <button type="button" onClick={() => removeSkill(s)} className="text-brand-400 hover:text-danger">
                        <TbX className="text-xs" />
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text" value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addSkill(); } }}
                  onBlur={addSkill}
                  placeholder={skills.length < 8 ? 'Type a skill and press Enter…' : 'Max 8 skills'}
                  disabled={skills.length >= 8}
                  className="w-full bg-transparent text-sm text-text outline-none placeholder:text-text-muted/60"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text mb-1.5">Work Type <span className="text-danger">*</span></label>
                <select {...register('workType')} className={`w-full px-4 py-3 rounded-xl border text-sm text-text bg-surface-alt outline-none focus:bg-white focus:border-brand-400 ${errors.workType ? 'border-danger' : 'border-border'}`}>
                  <option value="">Select…</option>
                  {WORK_TYPES.map((w) => <option key={w}>{w}</option>)}
                </select>
                {errors.workType && <p className="text-xs text-danger mt-1">{errors.workType.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-text mb-1.5">Commitment <span className="text-danger">*</span></label>
                <select {...register('commitmentLevel')} className={`w-full px-4 py-3 rounded-xl border text-sm text-text bg-surface-alt outline-none focus:bg-white focus:border-brand-400 ${errors.commitmentLevel ? 'border-danger' : 'border-border'}`}>
                  <option value="">Select…</option>
                  {COMMITMENT_TYPES.map((c) => <option key={c}>{c}</option>)}
                </select>
                {errors.commitmentLevel && <p className="text-xs text-danger mt-1">{errors.commitmentLevel.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text mb-1.5">Application Deadline <span className="text-danger">*</span></label>
              <input type="date" {...register('deadline')} min={new Date().toISOString().split('T')[0]}
                className={`w-full px-4 py-3 rounded-xl border text-sm text-text bg-surface-alt outline-none focus:bg-white focus:border-brand-400 focus:ring-2 focus:ring-brand-100 ${errors.deadline ? 'border-danger' : 'border-border'}`} />
              {errors.deadline && <p className="text-xs text-danger mt-1.5">{errors.deadline.message}</p>}
            </div>

            <motion.button type="submit" disabled={postMutation.isPending} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl gradient-brand text-white font-bold text-sm shadow-md disabled:opacity-60">
              {postMutation.isPending
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><TbPlus /> Post Opportunity</>}
            </motion.button>
          </form>
        </motion.div>
      )}
    </div>
  );
}
