'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { TbCamera, TbX, TbCheck, TbUser, TbFileText } from 'react-icons/tb';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  bio:  z.string().max(300, 'Bio must be under 300 characters').optional(),
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

export default function CollaboratorProfilePage() {
  const [skills,       setSkills]       = useState(['React', 'TypeScript', 'Figma']);
  const [skillInput,   setSkillInput]   = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUrl,     setImageUrl]     = useState('');
  const [uploading,    setUploading]    = useState(false);
  const [loading,      setLoading]      = useState(false);
  const fileRef = useRef(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: 'Jane Smith', bio: 'Full-stack developer passionate about AI and product.' },
  });

  const bioLen = watch('bio', '').length;

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error('Max 2 MB'); return; }
    setImagePreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const url = await uploadToImgBB(file);
      setImageUrl(url);
      toast.success('Photo updated!');
    } catch {
      toast.error('Upload failed');
      setImagePreview(null);
    } finally { setUploading(false); }
  };

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s) && skills.length < 10) { setSkills(p => [...p, s]); setSkillInput(''); }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      // TODO: PATCH /api/users/profile  { ...data, skills, image: imageUrl || existing }
      toast.success('Profile saved!');
    } catch { toast.error('Save failed.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-extrabold text-text">My Profile</h1>
        <p className="text-text-muted text-sm mt-1">Keep your profile updated so founders know what you bring to the table.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-border shadow-sm p-6">

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">

          {/* Avatar */}
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

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-text mb-1.5">Full Name <span className="text-danger">*</span></label>
            <div className="relative">
              <TbUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-lg" />
              <input type="text" {...register('name')}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-text bg-surface-alt outline-none transition-all focus:bg-white focus:border-brand-400 focus:ring-2 focus:ring-brand-100 ${errors.name ? 'border-danger' : 'border-border'}`} />
            </div>
            {errors.name && <p className="text-xs text-danger mt-1.5">{errors.name.message}</p>}
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold text-text mb-1.5">Bio</label>
            <div className="relative">
              <TbFileText className="absolute left-3.5 top-3.5 text-text-muted text-lg" />
              <textarea rows={3} {...register('bio')} placeholder="Tell founders a bit about yourself…"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border text-sm text-text bg-surface-alt outline-none transition-all focus:bg-white focus:border-brand-400 focus:ring-2 focus:ring-brand-100 resize-none" />
            </div>
            <div className="flex justify-end mt-1">
              <span className={`text-xs ${bioLen > 270 ? 'text-danger' : 'text-text-muted'}`}>{bioLen}/300</span>
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-xs font-semibold text-text mb-1.5">
              Skills <span className="font-normal text-text-muted">(press Enter to add · max 10)</span>
            </label>
            <div className="w-full px-3 py-2.5 rounded-xl border border-border bg-surface-alt focus-within:bg-white focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100 transition-all">
              <div className="flex flex-wrap gap-1.5 mb-1.5">
                {skills.map((s) => (
                  <span key={s} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-medium">
                    {s}
                    <button type="button" onClick={() => setSkills(p => p.filter(x => x !== s))}
                      className="text-brand-400 hover:text-danger"><TbX className="text-xs" /></button>
                  </span>
                ))}
              </div>
              <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addSkill(); } }}
                onBlur={addSkill}
                placeholder={skills.length < 10 ? 'Add a skill…' : 'Max 10 skills reached'}
                disabled={skills.length >= 10}
                className="w-full bg-transparent text-sm text-text outline-none placeholder:text-text-muted/60" />
            </div>
          </div>

          <motion.button type="submit" disabled={loading || uploading}
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl gradient-brand text-white font-bold text-sm shadow-md disabled:opacity-60">
            {loading
              ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <><TbCheck /> Save Profile</>}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
