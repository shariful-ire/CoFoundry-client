'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { TbSearch, TbShieldOff, TbShieldCheck, TbX } from 'react-icons/tb';

const MOCK_USERS = [
  { _id: '1', name: 'Aisha Rahman',  email: 'aisha@neuralcart.io', role: 'founder',      isBlocked: false, createdAt: '1 Jan 2026'  },
  { _id: '2', name: 'Marcus Liu',    email: 'marcus@greengrid.io', role: 'founder',      isBlocked: false, createdAt: '5 Jan 2026'  },
  { _id: '3', name: 'James Osei',    email: 'james@dev.io',        role: 'collaborator', isBlocked: false, createdAt: '10 Jan 2026' },
  { _id: '4', name: 'Sofia Chen',    email: 'sofia@design.io',     role: 'collaborator', isBlocked: true,  createdAt: '12 Jan 2026' },
  { _id: '5', name: 'Sam Okafor',    email: 'sam@forge.io',        role: 'founder',      isBlocked: true,  createdAt: '14 Jan 2026' },
  { _id: '6', name: 'Priya Nair',    email: 'priya@mb.io',         role: 'founder',      isBlocked: false, createdAt: '20 Jan 2026' },
  { _id: '7', name: 'Lena Müller',   email: 'lena@growth.io',      role: 'collaborator', isBlocked: false, createdAt: '25 Jan 2026' },
  { _id: '8', name: 'Raj Kumar',     email: 'raj@data.io',         role: 'collaborator', isBlocked: false, createdAt: '30 Jan 2026' },
];

const ROLE_BADGE = {
  founder:      'bg-brand-50   text-brand-700',
  collaborator: 'bg-emerald-50 text-emerald-700',
  admin:        'bg-rose-50    text-rose-700',
};

export default function ManageUsersPage() {
  const [users,  setUsers]  = useState(MOCK_USERS);
  const [search, setSearch] = useState('');

  const toggleBlock = (id) => {
    setUsers((prev) => prev.map((u) => u._id === id ? { ...u, isBlocked: !u.isBlocked } : u));
    const user = users.find((u) => u._id === id);
    toast.success(`${user?.name} ${user?.isBlocked ? 'unblocked' : 'blocked'}.`);
    // TODO: PATCH /api/admin/users/:id/block
  };

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-text">Manage Users</h1>
          <p className="text-text-muted text-sm mt-1">{users.length} total · {users.filter(u => u.isBlocked).length} blocked</p>
        </div>
      </motion.div>

      {/* Search */}
      <div className="relative max-w-sm">
        <TbSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-lg" />
        <input type="text" placeholder="Search by name or email…" value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-border bg-white text-sm text-text outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all" />
        {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-danger"><TbX /></button>}
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-border bg-surface-alt text-left">
                <th className="px-5 py-3 text-xs font-semibold text-text-muted">User</th>
                <th className="px-5 py-3 text-xs font-semibold text-text-muted">Role</th>
                <th className="px-5 py-3 text-xs font-semibold text-text-muted">Status</th>
                <th className="px-5 py-3 text-xs font-semibold text-text-muted">Joined</th>
                <th className="px-5 py-3 text-xs font-semibold text-text-muted">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((u) => (
                <tr key={u._id} className="hover:bg-surface-alt transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-text">{u.name}</p>
                    <p className="text-xs text-text-muted">{u.email}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${ROLE_BADGE[u.role]}`}>{u.role}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${u.isBlocked ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
                      {u.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-text-muted">{u.createdAt}</td>
                  <td className="px-5 py-3.5">
                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                      onClick={() => toggleBlock(u._id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                        u.isBlocked
                          ? 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                          : 'border-rose-200   text-rose-700   hover:bg-rose-50'
                      }`}>
                      {u.isBlocked ? <><TbShieldCheck /> Unblock</> : <><TbShieldOff /> Block</>}
                    </motion.button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-sm text-text-muted py-12">No users match your search.</p>
        )}
      </motion.div>
    </div>
  );
}
