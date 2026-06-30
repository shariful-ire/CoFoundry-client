'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { TbRocket } from 'react-icons/tb';
import { HiOutlineUserCircle } from 'react-icons/hi2';

const publicLinks = [
  { label: 'Home', href: '/' },
  { label: 'Browse Startups', href: '/startups' },
  { label: 'Opportunities', href: '/opportunities' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // placeholder — will be replaced by real auth context later
  const user = null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-border'
          : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
          >
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center shadow-md"
            >
              <TbRocket className="text-white text-lg" />
            </motion.div>
            <span className="text-xl font-bold tracking-tight">
              <span className="gradient-text">Co</span>
              <span className="text-text">Foundry</span>
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <div className="hidden md:flex items-center gap-1">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isActive(link.href)
                    ? 'text-brand-600'
                    : 'text-text-muted hover:text-text hover:bg-surface-alt'
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-brand-50 rounded-lg -z-10"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* ── Desktop Auth ── */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-text-muted hover:text-brand-600 transition-colors"
                >
                  Dashboard
                </Link>
                <Link href="/profile">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center"
                  >
                    <HiOutlineUserCircle className="text-brand-600 text-xl" />
                  </motion.div>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="text-sm font-medium px-4 py-2 rounded-lg border border-border text-text-muted hover:border-danger hover:text-danger transition-colors"
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-text-muted hover:text-brand-600 transition-colors px-3 py-2"
                >
                  Login
                </Link>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/register"
                    className="text-sm font-semibold px-5 py-2 rounded-lg gradient-brand text-white shadow-md shadow-brand-500/25 hover:shadow-lg hover:shadow-brand-500/30 transition-shadow"
                  >
                    Get Started
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          {/* ── Mobile Hamburger ── */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-alt transition-colors"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <HiX className="text-2xl" />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <HiMenuAlt3 className="text-2xl" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </nav>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden bg-white border-t border-border shadow-lg"
          >
            <div className="px-4 py-4 space-y-1">
              {publicLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive(link.href)
                        ? 'bg-brand-50 text-brand-600'
                        : 'text-text-muted hover:bg-surface-alt hover:text-text'
                    }`}
                  >
                    {link.label}
                    {isActive(link.href) && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-500" />
                    )}
                  </Link>
                </motion.div>
              ))}

              <div className="pt-3 mt-3 border-t border-border space-y-2">
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-text-muted hover:bg-surface-alt"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-text-muted hover:bg-surface-alt"
                    >
                      Profile
                    </Link>
                    <button className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-danger hover:bg-danger-light transition-colors">
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-medium border border-border text-text-muted hover:border-brand-300 hover:text-brand-600 transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold gradient-brand text-white shadow-md"
                    >
                      Get Started Free
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
