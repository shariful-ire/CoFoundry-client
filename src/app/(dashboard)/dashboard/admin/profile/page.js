'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { TbCamera, TbCheck, TbUser, TbPhone, TbMail } from 'react-icons/tb';
import api from '@/lib/axios';

const schema = z.object({
  name:  z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().max(20, 'Phone number is too long').optional().or(z.literal('')),
});

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

export default function AdminProfilePage() {
  const { user, refetch } = useAuth();
  const [imageOverride, setImageOverride] = useState(null); // set only once the user picks a new file
  const [imageUrl,      setImageUrl]      = useState('');
  const [uploading,     setUploading]     = useState(false);
  const fileRef = useRef(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (user) {
      reset({ name: user.name ?? '', phone: user.phone ?? '' });
    }
  }, [user, reset]);

  const imagePreview = imageOverride ?? user?.image ?? null;

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error('Max 2 MB'); return; }
    setImageOverride(URL.createObjectURL(file));
    setUploading(true);
    try {
      const url = await uploadToImgBB(file);
      setImageUrl(url);
      toast.success('Photo ready — save to apply.');
    } catch {
      toast.error('Upload failed');
      setImageOverride(null);
    } finally { setUploading(false); }
  };

  const saveMutation = useMutation({
    mutationFn: (data) => api.patch('/api/users/profile', {
      ...data,
      ...(imageUrl && { image: imageUrl }),
    }),
    onSuccess: async () => {
      toast.success('Profile saved!');
      await refetch();
    },
    onError: (err) => toast.error(err?.response?.data?.message ?? 'Save failed.'),
  });

  return (
    <div className="max-w-2xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-extrabold text-text">My Profile</h1>
        <p className="text-text-muted text-sm mt-1">Update your admin account details.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-border shadow-sm p-6">
        <form onSubmit={handleSubmit((d) => saveMutation.mutate(d))} noValidate className="space-y-6">

          <div className="flex items-center gap-5">
            <button type="button" onClick={() => fileRef.current?.click()}
              className="relative w-20 h-20 rounded-full border-2 border-dashed border-border hover:border-brand-400 bg-surface-alt flex items-center justify-center overflow-hidden group transition-all">
              {imagePreview
                ? <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                : <TbCamera className="text-2xl text-text-muted group-hover:text-brand-500 transition-colors" />}
              {uploading && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                  <span className="w-5 h-5 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
                </div>
              )}
            </button>
            <div>
              <p className="text-sm font-semibold text-text">Profile photo</p>
              <p className="text-xs text-text-muted mt-0.5">JPG or PNG · Max 2 MB</p>
              <button type="button" onClick={() => fileRef.current?.click()}
                className="mt-2 text-xs text-brand-600 font-semibold hover:underline">
                {imagePreview ? 'Change photo' : 'Upload photo'}
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text mb-1.5">Full Name <span className="text-danger">*</span></label>
            <div className="relative">
              <TbUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-lg" />
              <input type="text" {...register('name')}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-text bg-surface-alt outline-none transition-all focus:bg-white focus:border-brand-400 focus:ring-2 focus:ring-brand-100 ${errors.name ? 'border-danger' : 'border-border'}`} />
            </div>
            {errors.name && <p className="text-xs text-danger mt-1.5">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-text mb-1.5">Contact Number</label>
            <div className="relative">
              <TbPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-lg" />
              <input type="tel" {...register('phone')} placeholder="+1 555 123 4567"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-text bg-surface-alt outline-none transition-all focus:bg-white focus:border-brand-400 focus:ring-2 focus:ring-brand-100 ${errors.phone ? 'border-danger' : 'border-border'}`} />
            </div>
            {errors.phone && <p className="text-xs text-danger mt-1.5">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-text mb-1.5">Email</label>
            <div className="relative">
              <TbMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-lg" />
              <input type="email" value={user?.email ?? ''} disabled readOnly
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border text-sm text-text-muted bg-surface-alt/60 outline-none cursor-not-allowed" />
            </div>
            <p className="text-xs text-text-muted mt-1.5">Your login email can&apos;t be changed.</p>
          </div>

          <motion.button type="submit" disabled={saveMutation.isPending || uploading}
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl gradient-brand text-white font-bold text-sm shadow-md disabled:opacity-60">
            {saveMutation.isPending
              ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <><TbCheck /> Save Profile</>}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
