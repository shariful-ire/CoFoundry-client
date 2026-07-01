'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  TbRocket, TbBuildingSkyscraper, TbFileText, TbCamera,
  TbArrowRight, TbEdit, TbTrash, TbCheck, TbClock,
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

export default function MyStartupPage() {
  const [editing, setEditing] = useState(false);
  const [logoOverride, setLogoOverride] = useState(null); // set only once the user picks a new file
  const [logoUrl,       setLogoUrl]     = useState('');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const fileRef = useRef(null);
  const qc = useQueryClient();

  const { data: startup, isLoading } = useQuery({
    queryKey: ['my-startup'],
    queryFn:  async () => {
      try {
        const res = await api.get('/api/startups/mine');
        return res.data;
      } catch (err) {
        if (err.response?.status === 404) return null;
        throw err;
      }
    },
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (startup) {
      reset({ startupName: startup.startupName, industry: startup.industry, fundingStage: startup.fundingStage, description: startup.description });
    }
  }, [startup, reset]);

  const logoPreview = logoOverride ?? startup?.logo ?? null;

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
      return startup
        ? api.put(`/api/startups/${startup._id}`, payload)
        : api.post('/api/startups', payload);
    },
    onSuccess: () => {
      toast.success(startup ? 'Startup updated!' : 'Startup submitted for review!');
      setEditing(false);
      qc.invalidateQueries({ queryKey: ['my-startup'] });
      qc.invalidateQueries({ queryKey: ['my-opportunities'] });
    },
    onError: (err) => toast.error(err?.response?.data?.message ?? 'Something went wrong.'),
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/api/startups/${startup._id}`),
    onSuccess: () => {
      toast.success('Startup deleted.');
      qc.invalidateQueries({ queryKey: ['my-startup'] });
      reset({});
    },
    onError: (err) => toast.error(err?.response?.data?.message ?? 'Delete failed.'),
  });

  const handleDelete = () => {
    if (!confirm('Delete your startup? This cannot be undone.')) return;
    deleteMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <span className="w-8 h-8 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (startup && !editing) {
    return (
      <div className="max-w-2xl space-y-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-extrabold text-text">My Startup</h1>
          <p className="text-text-muted text-sm mt-1">Your startup profile visible to collaborators.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-border shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_STYLE[startup.status] ?? STATUS_STYLE.pending}`}>
              {startup.status === 'approved' ? <TbCheck /> : <TbClock />}
              {startup.status.charAt(0).toUpperCase() + startup.status.slice(1)}
            </span>
            <div className="flex items-center gap-2">
              <button onClick={() => setEditing(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-text-muted hover:border-brand-400 hover:text-brand-600 transition-all">
                <TbEdit /> Edit
              </button>
              <button onClick={handleDelete} disabled={deleteMutation.isPending}
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
              <p className="text-xs text-text-muted">Logo</p>
              <p className="text-sm font-semibold text-text">{startup.logo ? 'Uploaded' : 'Not set'}</p>
            </div>
          </div>

          {[
            { icon: TbRocket,            label: 'Startup Name',   value: startup.startupName  },
            { icon: TbBuildingSkyscraper, label: 'Industry',      value: startup.industry     },
            { icon: TbBuildingSkyscraper, label: 'Funding Stage', value: startup.fundingStage },
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
                : <><TbCheck /> {editing ? 'Save Changes' : 'Submit for Review'}</>}
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
