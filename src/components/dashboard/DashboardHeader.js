'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { TbMenu2, TbBell, TbChevronRight } from 'react-icons/tb';
import { HiOutlineUserCircle } from 'react-icons/hi2';
import { usePathname } from 'next/navigation';

/* Build a readable breadcrumb from the current path */
function useBreadcrumb() {
  const pathname = usePathname();
  const parts = pathname.split('/').filter(Boolean);
  return parts.map((seg, i) => ({
    label: seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' '),
    href:  '/' + parts.slice(0, i + 1).join('/'),
  }));
}

export default function DashboardHeader({ user, onMenuClick }) {
  const crumbs = useBreadcrumb();
  const profileHref = user?.role === 'collaborator' ? '/dashboard/collaborator/profile'
    : user?.role === 'founder' ? '/dashboard/founder/startup'
    : '/dashboard';

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-border">
      <div className="flex items-center gap-3 px-4 sm:px-6 h-14">

        {/* Hamburger (mobile only) */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-alt transition-colors"
          aria-label="Open menu"
        >
          <TbMenu2 className="text-xl" />
        </motion.button>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-xs text-text-muted overflow-x-auto">
          {crumbs.map((crumb, i) => (
            <span key={crumb.href} className="flex items-center gap-1 shrink-0">
              {i > 0 && <TbChevronRight className="text-border" />}
              {i === crumbs.length - 1 ? (
                <span className="font-semibold text-text">{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="hover:text-brand-600 transition-colors capitalize">
                  {crumb.label}
                </Link>
              )}
            </span>
          ))}
        </nav>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-alt transition-colors"
            aria-label="Notifications"
          >
            <TbBell className="text-xl" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500" />
          </motion.button>

          <Link href={profileHref}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center"
            >
              {user?.image
                ? <img src={user.image} alt={user?.name} className="w-full h-full rounded-full object-cover" />
                : <HiOutlineUserCircle className="text-brand-600 text-xl" />
              }
            </motion.div>
          </Link>
        </div>
      </div>
    </header>
  );
}
