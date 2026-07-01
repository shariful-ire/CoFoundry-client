'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  TbUser, TbMail, TbLock, TbEye, TbEyeOff,
  TbArrowRight, TbBrandGoogle, TbCamera,
} from 'react-icons/tb';
import toast from 'react-hot-toast';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import RoleSelect from '@/components/RoleSelect';

/* ── Zod schema ── */
const schema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(60),
    email: z.string().email('Enter a valid email address'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Must contain at least one lowercase letter'),
    confirmPassword: z.string(),
    role: z.enum(['founder', 'collaborator'], {
      required_error: 'Please select a role',
    }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

/* ── Password strength helper ── */
function getStrength(pw = '') {
  let score = 0;
  if (pw.length >= 6)          score++;
  if (pw.length >= 10)         score++;
  if (/[A-Z]/.test(pw))        score++;
  if (/[a-z]/.test(pw))        score++;
  if (/[0-9!@#$%^&*]/.test(pw)) score++;
  return score; // 0‑5
}

const STRENGTH_LABEL  = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very strong'];
const STRENGTH_COLOR  = ['', 'bg-danger', 'bg-warning', 'bg-amber-400', 'bg-success', 'bg-emerald-400'];
const STRENGTH_TEXT   = ['', 'text-danger', 'text-warning', 'text-amber-500', 'text-success', 'text-emerald-500'];

/* ── ImgBB upload helper ── */
async function uploadToImgBB(file) {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!apiKey) throw new Error('ImgBB API key not configured');
  const form = new FormData();
  form.append('image', file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: 'POST',
    body: form,
  });
  const json = await res.json();
  if (!json.success) throw new Error('Image upload failed');
  return json.data.url;
}

export default function RegisterPage() {
  const [showPass, setShowPass]        = useState(false);
  const [showConfirm, setShowConfirm]  = useState(false);
  const [loading, setLoading]          = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUrl, setImageUrl]        = useState('');
  const [uploadingImg, setUploadingImg] = useState(false);
  const fileRef  = useRef(null);
  const router   = useRouter();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema), mode: 'onTouched' });

  const password = watch('password', '');
  const role     = watch('role');
  const strength = getStrength(password);

  const handleGoogle = () => {
    if (!role) { toast.error('Please select whether you are a Founder or Collaborator first'); return; }
    window.location.href = `/api/auth/google?role=${role}`; // Next.js rewrite proxies to server
  };

  /* Image selection & upload */
  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be under 2 MB');
      return;
    }
    setImagePreview(URL.createObjectURL(file));
    setUploadingImg(true);
    try {
      const url = await uploadToImgBB(file);
      setImageUrl(url);
      toast.success('Photo uploaded!');
    } catch {
      toast.error('Photo upload failed. Try again.');
      setImagePreview(null);
    } finally {
      setUploadingImg(false);
    }
  };

  const onSubmit = async (data) => {
    if (!imageUrl) {
      toast.error('Please upload a profile photo');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/api/auth/register', {
        name:     data.name,
        email:    data.email,
        password: data.password,
        role:     data.role,
        image:    imageUrl,
      });
      login(res.data.user);
      toast.success('Account created! Welcome to CoFoundry 🚀');
      router.push('/');
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="w-full max-w-lg"
    >
      <div className="bg-white rounded-2xl shadow-2xl shadow-black/20 border border-white/10 p-8">

        {/* Heading */}
        <div className="text-center mb-7">
          <h1 className="text-2xl font-extrabold text-text">Create your account</h1>
          <p className="text-sm text-text-muted mt-1">
            Join CoFoundry and start building your dream team
          </p>
        </div>

        {/* Role selection — required before either sign-up method */}
        <div className="mb-6">
          <RoleSelect
            value={role}
            onChange={(v) => setValue('role', v, { shouldValidate: true })}
            error={errors.role?.message}
          />
        </div>

        {/* Google */}
        <motion.button
          type="button"
          onClick={handleGoogle}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-border bg-surface-alt hover:bg-white hover:border-brand-200 transition-all text-sm font-semibold text-text shadow-sm mb-6"
        >
          <TbBrandGoogle className="text-xl text-red-500" />
          Continue with Google
        </motion.button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <span className="flex-1 h-px bg-border" />
          <span className="text-xs text-text-muted font-medium">or register with email</span>
          <span className="flex-1 h-px bg-border" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

          {/* Profile photo */}
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="relative w-20 h-20 rounded-full border-2 border-dashed border-border hover:border-brand-400 bg-surface-alt hover:bg-brand-50 transition-all flex items-center justify-center group overflow-hidden"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <TbCamera className="text-2xl text-text-muted group-hover:text-brand-500 transition-colors" />
              )}
              {uploadingImg && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                  <span className="w-5 h-5 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
                </div>
              )}
            </button>
            <p className="text-xs text-text-muted">
              {imagePreview ? (imageUrl ? '✓ Photo uploaded' : 'Uploading…') : 'Upload profile photo'}
            </p>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-text mb-1.5" htmlFor="name">
              Full name
            </label>
            <div className="relative">
              <TbUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-lg" />
              <input
                id="name"
                type="text"
                placeholder="Jane Smith"
                autoComplete="name"
                {...register('name')}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-text placeholder:text-text-muted/60 bg-surface-alt outline-none transition-all focus:bg-white focus:border-brand-400 focus:ring-2 focus:ring-brand-100 ${
                  errors.name ? 'border-danger ring-2 ring-danger/10' : 'border-border'
                }`}
              />
            </div>
            {errors.name && (
              <p className="text-xs text-danger mt-1.5">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-text mb-1.5" htmlFor="reg-email">
              Email address
            </label>
            <div className="relative">
              <TbMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-lg" />
              <input
                id="reg-email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                {...register('email')}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-text placeholder:text-text-muted/60 bg-surface-alt outline-none transition-all focus:bg-white focus:border-brand-400 focus:ring-2 focus:ring-brand-100 ${
                  errors.email ? 'border-danger ring-2 ring-danger/10' : 'border-border'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-danger mt-1.5">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-text mb-1.5" htmlFor="reg-password">
              Password
            </label>
            <div className="relative">
              <TbLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-lg" />
              <input
                id="reg-password"
                type={showPass ? 'text' : 'password'}
                placeholder="Min 6 chars, upper & lowercase"
                autoComplete="new-password"
                {...register('password')}
                className={`w-full pl-10 pr-11 py-3 rounded-xl border text-sm text-text placeholder:text-text-muted/60 bg-surface-alt outline-none transition-all focus:bg-white focus:border-brand-400 focus:ring-2 focus:ring-brand-100 ${
                  errors.password ? 'border-danger ring-2 ring-danger/10' : 'border-border'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
              >
                {showPass ? <TbEyeOff className="text-lg" /> : <TbEye className="text-lg" />}
              </button>
            </div>

            {/* Strength bar */}
            {password && (
              <div className="mt-2 space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        i <= strength ? STRENGTH_COLOR[strength] : 'bg-border'
                      }`}
                    />
                  ))}
                </div>
                <p className={`text-xs font-medium ${STRENGTH_TEXT[strength]}`}>
                  {STRENGTH_LABEL[strength]}
                </p>
              </div>
            )}
            {errors.password && (
              <p className="text-xs text-danger mt-1.5">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <label className="block text-xs font-semibold text-text mb-1.5" htmlFor="confirm-password">
              Confirm password
            </label>
            <div className="relative">
              <TbLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-lg" />
              <input
                id="confirm-password"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Repeat your password"
                autoComplete="new-password"
                {...register('confirmPassword')}
                className={`w-full pl-10 pr-11 py-3 rounded-xl border text-sm text-text placeholder:text-text-muted/60 bg-surface-alt outline-none transition-all focus:bg-white focus:border-brand-400 focus:ring-2 focus:ring-brand-100 ${
                  errors.confirmPassword ? 'border-danger ring-2 ring-danger/10' : 'border-border'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
              >
                {showConfirm ? <TbEyeOff className="text-lg" /> : <TbEye className="text-lg" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-danger mt-1.5">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={loading || uploadingImg}
            whileHover={{ scale: loading ? 1 : 1.01 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl gradient-brand text-white font-bold text-sm shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 transition-shadow disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Create Account
                <TbArrowRight className="text-base" />
              </>
            )}
          </motion.button>
        </form>

        {/* Login link */}
        <p className="text-center text-sm text-text-muted mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-brand-600 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
