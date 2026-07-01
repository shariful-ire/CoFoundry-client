'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';
import {
  TbArrowLeft, TbClock, TbMapPin, TbBriefcase,
  TbLink, TbMessage, TbMail, TbCheck, TbArrowRight, TbLock,
} from 'react-icons/tb';
import api from '@/lib/axios';

const WORK_BADGE = {
  Remote:   'bg-emerald-50 text-emerald-700 border-emerald-200',
  Hybrid:   'bg-amber-50  text-amber-700  border-amber-200',
  'On-site':'bg-rose-50   text-rose-700   border-rose-200',
};

const applySchema = z.object({
  portfolioLink:     z.string().url('Enter a valid URL (include https://)'),
  motivationMessage: z.string()
    .min(80,  'Please write at least 80 characters')
    .max(1000, 'Keep it under 1000 characters'),
});

function ApplyForm({ opp }) {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(applySchema),
    mode: 'onTouched',
  });

  const msgLen = watch('motivationMessage', '').length;

  const applyMutation = useMutation({
    mutationFn: (data) => api.post('/api/applications', {
      opportunityId:    opp._id,
      portfolioLink:    data.portfolioLink,
      motivationMessage: data.motivationMessage,
    }),
    onSuccess: () => {
      setSubmitted(true);
      toast.success('Application submitted!');
    },
    onError: (err) => {
      const msg = err?.response?.data?.message ?? 'Submission failed. Please try again.';
      toast.error(msg);
    },
  });

  if (!user) {
    return (
      <div className="text-center py-8 space-y-4">
        <div className="w-14 h-14 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center mx-auto">
          <TbLock className="text-brand-400 text-2xl" />
        </div>
        <h3 className="font-bold text-text text-base">Sign in to apply</h3>
        <p className="text-sm text-text-muted">You must be logged in as a Collaborator to apply for this role.</p>
        <Link href="/login"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-brand text-white font-bold text-sm shadow-md">
          Sign In <TbArrowRight />
        </Link>
      </div>
    );
  }

  if (user.role !== 'collaborator') {
    return (
      <div className="text-center py-8 space-y-3">
        <p className="text-sm text-text-muted">Only Collaborators can apply for opportunities.</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-success flex items-center justify-center mx-auto mb-4 shadow-lg">
          <TbCheck className="text-white text-2xl" />
        </div>
        <h3 className="font-bold text-text text-lg mb-1">Application sent!</h3>
        <p className="text-sm text-text-muted">
          The team at <strong>{opp.startupId?.startupName ?? 'the startup'}</strong> will review your application
          and reach out if there&apos;s a match.
        </p>
        <Link href="/opportunities" className="inline-flex items-center gap-1 text-sm text-brand-600 font-semibold mt-5 hover:underline">
          <TbArrowLeft /> Browse more opportunities
        </Link>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit((d) => applyMutation.mutate(d))} noValidate className="space-y-5">
      <div>
        <label className="block text-xs font-semibold text-text mb-1.5">Your Email</label>
        <div className="relative">
          <TbMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-lg" />
          <input type="email" value={user.email} readOnly
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-surface-alt text-sm text-text-muted cursor-not-allowed" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-text mb-1.5" htmlFor="portfolio">
          Portfolio / GitHub / LinkedIn URL <span className="text-danger">*</span>
        </label>
        <div className="relative">
          <TbLink className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-lg" />
          <input id="portfolio" type="url" placeholder="https://github.com/yourname" {...register('portfolioLink')}
            className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-text placeholder:text-text-muted/60 bg-surface-alt outline-none transition-all focus:bg-white focus:border-brand-400 focus:ring-2 focus:ring-brand-100 ${errors.portfolioLink ? 'border-danger ring-2 ring-danger/10' : 'border-border'}`} />
        </div>
        {errors.portfolioLink && <p className="text-xs text-danger mt-1.5">{errors.portfolioLink.message}</p>}
      </div>

      <div>
        <label className="block text-xs font-semibold text-text mb-1.5" htmlFor="motivation">
          Why do you want to join? <span className="text-danger">*</span>
        </label>
        <div className="relative">
          <TbMessage className="absolute left-3.5 top-3.5 text-text-muted text-lg" />
          <textarea id="motivation" rows={5}
            placeholder="Tell the team why you're excited about this role and what you'd bring to the startup…"
            {...register('motivationMessage')}
            className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-text placeholder:text-text-muted/60 bg-surface-alt outline-none transition-all focus:bg-white focus:border-brand-400 focus:ring-2 focus:ring-brand-100 resize-none ${errors.motivationMessage ? 'border-danger ring-2 ring-danger/10' : 'border-border'}`} />
        </div>
        <div className="flex items-start justify-between mt-1.5">
          {errors.motivationMessage ? (
            <p className="text-xs text-danger">{errors.motivationMessage.message}</p>
          ) : <span />}
          <span className={`text-xs ${msgLen > 900 ? 'text-danger' : 'text-text-muted'}`}>{msgLen}/1000</span>
        </div>
      </div>

      <motion.button type="submit" disabled={applyMutation.isPending}
        whileHover={{ scale: applyMutation.isPending ? 1 : 1.01 }}
        whileTap={{ scale: applyMutation.isPending ? 1 : 0.98 }}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl gradient-brand text-white font-bold text-sm shadow-lg shadow-brand-500/30 disabled:opacity-60 disabled:cursor-not-allowed">
        {applyMutation.isPending
          ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          : <> Submit Application <TbArrowRight /> </>}
      </motion.button>
    </form>
  );
}

export default function OpportunityDetailPage() {
  const { id } = useParams();

  const { data: opp, isLoading } = useQuery({
    queryKey: ['opportunity', id],
    queryFn:  () => api.get(`/api/opportunities/${id}`).then((r) => r.data),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="w-10 h-10 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!opp) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <TbBriefcase className="text-6xl text-brand-200 mb-4" />
        <h2 className="text-2xl font-bold text-text mb-2">Opportunity not found</h2>
        <p className="text-text-muted mb-6">This role may have been filled or removed.</p>
        <Link href="/opportunities" className="text-brand-600 font-semibold hover:underline inline-flex items-center gap-1">
          <TbArrowLeft /> Browse all opportunities
        </Link>
      </div>
    );
  }

  const daysLeft = Math.ceil((new Date(opp.deadline) - Date.now()) / 864e5);

  return (
    <div className="min-h-screen bg-surface-alt">
      <div className="bg-white border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/opportunities"
            className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-brand-600 mb-5 transition-colors">
            <TbArrowLeft /> Back to opportunities
          </Link>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-text">{opp.roleTitle}</h1>
              <p className="text-text-muted mt-1">
                at{' '}
                <Link href={`/startups/${opp.startupId?._id}`} className="text-brand-600 font-semibold hover:underline">
                  {opp.startupId?.startupName ?? '—'}
                </Link>
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-medium ${WORK_BADGE[opp.workType] ?? ''}`}>
                  <TbMapPin /> {opp.workType}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border bg-surface-alt text-xs font-medium text-text-muted">
                  <TbBriefcase /> {opp.commitmentLevel}
                </span>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${daysLeft <= 7 ? 'text-danger bg-danger-light' : 'text-text-muted bg-surface-alt border border-border'}`}>
                  <TbClock /> {daysLeft > 0 ? `${daysLeft} days left` : 'Closing soon'} · Deadline {format(new Date(opp.deadline), 'MMM d, yyyy')}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}
            className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
              <h2 className="font-bold text-text text-lg mb-3">About this role</h2>
              <p className="text-sm text-text-muted leading-relaxed">
                {opp.startupId?.description ?? 'No additional description provided.'}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
              <h2 className="font-bold text-text text-lg mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {opp.requiredSkills?.map((s) => (
                  <span key={s} className="px-3 py-1.5 rounded-xl bg-brand-50 border border-brand-100 text-brand-700 text-xs font-semibold">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
              <h2 className="font-bold text-text text-lg mb-3">About the Startup</h2>
              <p className="text-sm text-text-muted font-semibold mb-1">{opp.startupId?.startupName}</p>
              <p className="text-xs text-text-muted">Industry: {opp.startupId?.industry}</p>
              <Link href={`/startups/${opp.startupId?._id}`}
                className="inline-flex items-center gap-1 text-xs text-brand-600 font-semibold hover:underline mt-3">
                View startup profile <TbArrowRight />
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }}
            className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm sticky top-20">
              <h2 className="font-bold text-text text-lg mb-5">Apply for this role</h2>
              <ApplyForm opp={opp} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
