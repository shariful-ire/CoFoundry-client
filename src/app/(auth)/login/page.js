'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  TbMail, TbLock, TbEye, TbEyeOff, TbArrowRight, TbBrandGoogle,
} from 'react-icons/tb';
import toast from 'react-hot-toast';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';

const ROLE_REDIRECT = {
  admin:        '/dashboard/admin',
  founder:      '/dashboard/founder',
  collaborator: '/dashboard/collaborator',
};

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const router       = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'blocked')          toast.error('Your account has been suspended.');
    else if (error === 'google_failed') toast.error('Google sign-in failed. Please try again.');
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onTouched' });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await api.post('/api/auth/login', {
        email:    data.email,
        password: data.password,
      });
      login(res.data.user);
      toast.success('Welcome back!');
      router.push(ROLE_REDIRECT[res.data.user.role] ?? '/dashboard');
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/api/auth/google`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="w-full max-w-md"
    >
      <div className="bg-white rounded-2xl shadow-2xl shadow-black/20 border border-white/10 p-8">

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-text">Welcome back</h1>
          <p className="text-sm text-text-muted mt-1">
            Sign in to your CoFoundry account
          </p>
        </div>

        {/* Google button */}
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
          <span className="text-xs text-text-muted font-medium">or sign in with email</span>
          <span className="flex-1 h-px bg-border" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-text mb-1.5" htmlFor="email">
              Email address
            </label>
            <div className="relative">
              <TbMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-lg" />
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Enter a valid email address',
                  },
                })}
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
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-text" htmlFor="password">
                Password
              </label>
              <Link href="#" className="text-xs text-brand-600 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <TbLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-lg" />
              <input
                id="password"
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' },
                })}
                className={`w-full pl-10 pr-11 py-3 rounded-xl border text-sm text-text placeholder:text-text-muted/60 bg-surface-alt outline-none transition-all focus:bg-white focus:border-brand-400 focus:ring-2 focus:ring-brand-100 ${
                  errors.password ? 'border-danger ring-2 ring-danger/10' : 'border-border'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? <TbEyeOff className="text-lg" /> : <TbEye className="text-lg" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-danger mt-1.5">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.01 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl gradient-brand text-white font-bold text-sm shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 transition-shadow disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Sign In
                <TbArrowRight className="text-base" />
              </>
            )}
          </motion.button>
        </form>

        {/* Register link */}
        <p className="text-center text-sm text-text-muted mt-6">
          Don't have an account?{' '}
          <Link href="/register" className="text-brand-600 font-semibold hover:underline">
            Create one free
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
