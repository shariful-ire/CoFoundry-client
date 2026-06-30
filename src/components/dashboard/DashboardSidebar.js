'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TbLayoutDashboard, TbRocket, TbBriefcase, TbPlus,
  TbMail, TbClipboardList, TbUser, TbUsers, TbCoin,
  TbBuildingSkyscraper, TbLogout, TbX, TbChevronRight,
} from 'react-icons/tb';
import { HiOutlineUserCircle } from 'react-icons/hi2';

/* ── Nav config per role ── */
const NAV = {
  founder: [
    { label: 'Overview',            href: '/dashboard/founder',              icon: TbLayoutDashboard },
    { label: 'My Startup',          href: '/dashboard/founder/startup',      icon: TbRocket },
    { label: 'Add Opportunity',     href: '/dashboard/founder/add-opportunity', icon: TbPlus },
    { label: 'Manage Opportunities',href: '/dashboard/founder/opportunities', icon: TbBriefcase },
    { label: 'Applications',        href: '/dashboard/founder/applications',  icon: TbMail },
  ],
  collaborator: [
    { label: 'Overview',        href: '/dashboard/collaborator',              icon: TbLayoutDashboard },
    { label: 'My Applications', href: '/dashboard/collaborator/applications', icon: TbClipboardList },
    { label: 'Profile',         href: '/dashboard/collaborator/profile',      icon: TbUser },
  ],
  admin: [
    { label: 'Overview',         href: '/dashboard/admin',              icon: TbLayoutDashboard },
    { label: 'Manage Users',     href: '/dashboard/admin/users',        icon: TbUsers },
    { label: 'Manage Startups',  href: '/dashboard/admin/startups',     icon: TbBuildingSkyscraper },
    { label: 'Transactions',     href: '/dashboard/admin/transactions', icon: TbCoin },
  ],
};

const ROLE_BADGE = {
  founder:      { label: 'Founder',      bg: 'bg-brand-100   text-brand-700'   },
  collaborator: { label: 'Collaborator', bg: 'bg-emerald-100 text-emerald-700' },
  admin:        { label: 'Admin',        bg: 'bg-rose-100    text-rose-700'    },
};

/* ── Sidebar inner content (shared between desktop + mobile) ── */
function SidebarContent({ role, user, onClose }) {
  const pathname = usePathname();
  const links    = NAV[role] ?? [];
  const badge    = ROLE_BADGE[role];

  const isActive = (href) =>
    href.endsWith(`/dashboard/${role}`)
      ? pathname === href
      : pathname.startsWith(href);

  return (
    <div className="flex flex-col h-full">

      {/* Logo + close (mobile only) */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-border">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center shadow">
            <TbRocket className="text-white text-base" />
          </div>
          <span className="text-base font-bold text-text">
            Co<span className="text-brand-600">Foundry</span>
          </span>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface-alt transition-colors"
          >
            <TbX className="text-lg" />
          </button>
        )}
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b border-border">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-alt">
          <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
            {user?.image
              ? <img src={user.image} alt={user.name} className="w-full h-full rounded-full object-cover" />
              : <HiOutlineUserCircle className="text-brand-600 text-2xl" />
            }
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text truncate">{user?.name ?? 'User'}</p>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badge?.bg}`}>
              {badge?.label}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map(({ label, href, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                active
                  ? 'bg-brand-50 text-brand-700 shadow-sm'
                  : 'text-text-muted hover:bg-surface-alt hover:text-text'
              }`}
            >
              <Icon className={`text-xl shrink-0 ${active ? 'text-brand-600' : 'text-text-muted group-hover:text-text'}`} />
              <span className="flex-1 truncate">{label}</span>
              {active && <TbChevronRight className="text-brand-400 text-sm" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: logout */}
      <div className="px-3 py-4 border-t border-border">
        <button
          className="group flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-text-muted hover:bg-danger-light hover:text-danger transition-all"
        >
          <TbLogout className="text-xl" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

/* ── Main export ── */
export default function DashboardSidebar({ role, user, mobileOpen, setMobileOpen }) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-white border-r border-border min-h-screen sticky top-0">
        <SidebarContent role={role} user={user} />
      </aside>

      {/* Mobile overlay + drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            />

            {/* Drawer */}
            <motion.aside
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl flex flex-col"
            >
              <SidebarContent
                role={role}
                user={user}
                onClose={() => setMobileOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
