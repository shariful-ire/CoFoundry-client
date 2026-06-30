'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { TbRocket, TbArrowLeft, TbHome } from 'react-icons/tb';

export default function NotFound() {
  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-4">

      {/* Decorative orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-violet-600/25 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-cyan-500/20 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="relative z-10 text-center max-w-lg mx-auto"
      >
        {/* Animated rocket */}
        <motion.div
          animate={{ y: [0, -14, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="flex justify-center mb-8"
        >
          <div className="w-24 h-24 rounded-3xl gradient-brand flex items-center justify-center shadow-2xl shadow-brand-900/50">
            <TbRocket className="text-white text-5xl" />
          </div>
        </motion.div>

        {/* 404 */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.45 }}
          className="text-8xl sm:text-9xl font-extrabold text-white/20 leading-none select-none"
        >
          404
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="-mt-4"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            This page launched into orbit
          </h2>
          <p className="text-brand-300 text-base leading-relaxed mb-10">
            The page you're looking for doesn't exist or has been moved.
            Let's get you back on track.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-brand-700 font-bold shadow-xl hover:shadow-2xl transition-shadow"
              >
                <TbHome className="text-lg" />
                Back to Home
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/opportunities"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-white/30 bg-white/10 backdrop-blur-sm text-white font-semibold hover:bg-white/20 transition-colors"
              >
                <TbArrowLeft className="text-lg" />
                Browse Opportunities
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
