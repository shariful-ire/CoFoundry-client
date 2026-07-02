'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  TbRocket, TbBuildingSkyscraper, TbFileText, TbCamera, TbPlus,
  TbArrowLeft, TbEdit, TbTrash, TbCheck, TbClock,
} from 'react-icons/tb';
import api from '@/lib/axios';

async function uploadToImgBB(file) {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!apiKey) throw new Error('ImgBB key not set');
  const form = new FormData();
  form.append('image', file);
  const res  = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, { method: 'POST', body: form });
  const json = await res.json();
  if (!json.success) throw new Error('Upload failed');
  return json.data.url;
}

const schema = z.object({
  startupName:  z.string().min(2, 'Name must be at least 2 characters').max(60),
  industry:     z.string().min(2, 'Select or enter an industry'),
  fundingStage: z.string().min(1, 'Select a funding stage'),
  description:  z.string().min(50, 'Write at least 50 characters').max(500),
});

const INDUSTRIES    = ['AI / E-Commerce', 'CleanTech', 'HealthTech', 'FinTech', 'EdTech', 'DevTools', 'AgriTech', 'Logistics', 'LegalTech', 'Other'];
const FUNDING_STAGES = ['Bootstrapped', 'Pre-Seed', 'Seed', 'Series A', 'Series B+'];

const STATUS_STYLE = {
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-rose-50   text-rose-700   border-rose-200',
  pending:  'bg-amber-50  text-amber-700  border-amber-200',
};

/* ── Card shown in the list view ── */
function StartupCard({ startup, onEdit, onDelete, deleting }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-border shadow-sm p-6 space-y-5">
      <div className="flex items-center justify-between">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_STYLE[startup.status] ?? STATUS_STYLE.pending}`}>
          {startup.status === 'approved' ? <TbCheck /> : <TbClock />}
          {startup.status.charAt(0).toUpperCase() + startup.status.slice(1)}
        </span>
        <div className="flex items-center gap-2">
          <button onClick={() => onEdit(startup)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-text-muted hover:border-brand-400 hover:text-brand-600 transition-all">
            <TbEdit /> Edit
          </button>
          <button onClick={() => onDelete(startup)} disabled={deleting}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-danger/30 text-xs font-semibold text-danger hover:bg-danger-light transition-all disabled:opacity-60">
            <TbTrash /> Delete
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-xl border border-border bg-surface-alt flex items-center justify-center overflow-hidden shrink-0">
          {startup.logo
            ? <img src={startup.logo} alt={startup.startupName} className="w-full h-full object-cover" />
            : <TbRocket className="text-2xl text-text-muted" />}
        </div>
        <div>
          <p className="text-base font-bold text-text">{startup.startupName}</p>
          <p className="text-xs text-text-muted">{startup.industry} · {startup.fundingStage}</p>
        </div>
      </div>

      <div>
        <p className="text-xs text-text-muted mb-1 flex items-center gap-1"><TbFileText /> Description</p>
        <p className="text-sm text-text-muted leading-relaxed line-clamp-3">{startup.description}</p>
      </div>
    </motion.div>
  );
}

export default function MyStartupPage() {
  const [mode, setMode] = useState('list'); // 'list' | 'form'
  const [activeStartup, setActiveStartup] = useState(null); // null = creating a new one
  const [logoOverride, setLogoOverride] = useState(null);
  const [logoUrl,       setLogoUrl]     = useState('');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [formTarget,    setFormTarget]  = useState(null); // tracks which startup the form fields currently belong to
  const fileRef = useRef(null);
  const qc = useQueryClient();

  const { data: startups, isLoading } = useQuery({
    queryKey: ['my-startups'],
    queryFn:  () => api.get('/api/startups/mine').then((r) => r.data),
  });

  const list = startups ?? [];

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
  });

  // Reset the form fields whenever we switch which startup we're editing (or
  // start a fresh create) — adjusted during render rather than in an effect,
  // since it's just resetting state in response to activeStartup changing.
  const target = mode === 'form' ? (activeStartup?._id ?? 'new') : null;
  if (mode === 'form' && target !== formTarget) {
    setFormTarget(target);
    reset(activeStartup
      ? { startupName: activeStartup.startupName, industry: activeStartup.industry, fundingStage: activeStartup.fundingStage, description: activeStartup.description }
      : { startupName: '', industry: '', fundingStage: '', description: '' });
    setLogoOverride(null);
    setLogoUrl('');
  }

  const logoPreview = logoOverride ?? activeStartup?.logo ?? null;

  const handleLogoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error('Max 2 MB'); return; }
    setLogoOverride(URL.createObjectURL(file));
    setUploadingLogo(true);
    try {
      const url = await uploadToImgBB(file);
      setLogoUrl(url);
      toast.success('Logo ready — save to apply.');
    } catch {
      toast.error('Upload failed');
      setLogoOverride(null);
    } finally { setUploadingLogo(false); }
  };

  const saveMutation = useMutation({
    mutationFn: (data) => {
      const payload = { ...data, ...(logoUrl && { logo: logoUrl }) };
      return activeStartup
        ? api.put(`/api/startups/${activeStartup._id}`, payload)
        : api.post('/api/startups', payload);
    },
    onSuccess: () => {
      toast.success(activeStartup ? 'Startup updated!' : 'Startup submitted for review!');
      setMode('list');
      setActiveStartup(null);
      qc.invalidateQueries({ queryKey: ['my-startups'] });
      qc.invalidateQueries({ queryKey: ['my-opportunities'] });
    },
    onError: (err) => toast.error(err?.response?.data?.message ?? 'Something went wrong.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (startup) => api.delete(`/api/startups/${startup._id}`),
    onSuccess: () => {
      toast.success('Startup deleted.');
      qc.invalidateQueries({ queryKey: ['my-startups'] });
      qc.invalidateQueries({ queryKey: ['my-opportunities'] });
    },
    onError: (err) => toast.error(err?.response?.data?.message ?? 'Delete failed.'),
  });

  const handleDelete = (startup) => {
    if (!confirm(`Delete "${startup.startupName}"? This cannot be undone.`)) return;
    deleteMutation.mutate(startup);
  };

  const openCreate = () => { setActiveStartup(null); setMode('form'); };
  const openEdit   = (startup) => { setActiveStartup(startup); setMode('form'); };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <span className="w-8 h-8 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (mode === 'list') {
    return (
      <div className="max-w-3xl space-y-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-text">My Startups</h1>
            <p className="text-text-muted text-sm mt-1">Manage your startup profiles visible to collaborators.</p>
          </div>
          <button onClick={openCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-brand text-white font-bold text-sm shadow-md hover:opacity-90 transition-opacity">
            <TbPlus /> Add Another Startup
          </button>
        </motion.div>

        {list.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-dashed border-border p-12 text-center">
            <TbRocket className="text-4xl text-brand-200 mx-auto mb-3" />
            <p className="text-text-muted text-sm mb-4">You haven&apos;t created a startup yet.</p>
            <button onClick={openCreate}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-brand text-white font-bold text-sm shadow-md">
              <TbPlus /> Create Your Startup
            </button>
          </motion.div>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {list.map((s) => (
                <StartupCard key={s._id} startup={s} onEdit={openEdit} onDelete={handleDelete} deleting={deleteMutation.isPending} />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <button onClick={() => setMode('list')}
          className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-brand-600 font-medium mb-4 transition-colors">
          <TbArrowLeft /> Back to My Startups
        </button>
        <h1 className="text-2xl font-extrabold text-text">{activeStartup ? 'Edit Startup' : 'Create a New Startup'}</h1>
        <p className="text-text-muted text-sm mt-1">
          {activeStartup ? 'Update your startup details.' : 'Submit your startup for review. Approved startups appear publicly.'}
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-border shadow-sm p-6">
        <form onSubmit={handleSubmit((d) => saveMutation.mutate(d))} noValidate className="space-y-5">

          <div className="flex items-center gap-5">
            <button type="button" onClick={() => fileRef.current?.click()}
              className="relative w-20 h-20 rounded-xl border-2 border-dashed border-border hover:border-brand-400 bg-surface-alt flex items-center justify-center overflow-hidden group transition-all">
              {logoPreview
                ? <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                : <TbCamera className="text-2xl text-text-muted group-hover:text-brand-500 transition-colors" />}
              {uploadingLogo && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                  <span className="w-5 h-5 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
                </div>
              )}
            </button>
            <div>
              <p className="text-sm font-semibold text-text">Startup logo</p>
              <p className="text-xs text-text-muted mt-0.5">JPG or PNG · Max 2 MB</p>
              <button type="button" onClick={() => fileRef.current?.click()}
                className="mt-2 text-xs text-brand-600 font-semibold hover:underline">
                {logoPreview ? 'Change logo' : 'Upload logo'}
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text mb-1.5">Startup Name <span className="text-danger">*</span></label>
            <input type="text" placeholder="e.g. NeuralCart" {...register('startupName')}
              className={`w-full px-4 py-3 rounded-xl border text-sm text-text bg-surface-alt outline-none transition-all focus:bg-white focus:border-brand-400 focus:ring-2 focus:ring-brand-100 ${errors.startupName ? 'border-danger' : 'border-border'}`} />
            {errors.startupName && <p className="text-xs text-danger mt-1.5">{errors.startupName.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-text mb-1.5">Industry <span className="text-danger">*</span></label>
            <select {...register('industry')}
              className={`w-full px-4 py-3 rounded-xl border text-sm text-text bg-surface-alt outline-none focus:bg-white focus:border-brand-400 ${errors.industry ? 'border-danger' : 'border-border'}`}>
              <option value="">Select industry…</option>
              {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
            </select>
            {errors.industry && <p className="text-xs text-danger mt-1.5">{errors.industry.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-text mb-1.5">Funding Stage <span className="text-danger">*</span></label>
            <select {...register('fundingStage')}
              className={`w-full px-4 py-3 rounded-xl border text-sm text-text bg-surface-alt outline-none focus:bg-white focus:border-brand-400 ${errors.fundingStage ? 'border-danger' : 'border-border'}`}>
              <option value="">Select stage…</option>
              {FUNDING_STAGES.map((s) => <option key={s}>{s}</option>)}
            </select>
            {errors.fundingStage && <p className="text-xs text-danger mt-1.5">{errors.fundingStage.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-text mb-1.5">Description <span className="text-danger">*</span></label>
            <textarea rows={4} placeholder="Describe what your startup does and the problem it solves (min 50 chars)…" {...register('description')}
              className={`w-full px-4 py-3 rounded-xl border text-sm text-text bg-surface-alt outline-none transition-all focus:bg-white focus:border-brand-400 focus:ring-2 focus:ring-brand-100 resize-none ${errors.description ? 'border-danger' : 'border-border'}`} />
            {errors.description && <p className="text-xs text-danger mt-1.5">{errors.description.message}</p>}
          </div>

          <div className="flex items-center gap-3 pt-1">
            <motion.button type="submit" disabled={saveMutation.isPending} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl gradient-brand text-white font-bold text-sm shadow-md disabled:opacity-60">
              {saveMutation.isPending
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><TbCheck /> {activeStartup ? 'Save Changes' : 'Submit for Review'}</>}
            </motion.button>
            <button type="button" onClick={() => setMode('list')}
              className="px-5 py-3 rounded-xl border border-border text-sm font-semibold text-text-muted hover:border-danger hover:text-danger transition-all">
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
