import Link from 'next/link';
import { TbRocket } from 'react-icons/tb';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen gradient-hero flex flex-col">

      {/* Decorative orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-violet-600/25 blur-3xl" />
        <div className="absolute -bottom-32 -right-20 w-[380px] h-[380px] rounded-full bg-cyan-500/15 blur-3xl" />
      </div>

      {/* Mini navbar */}
      <header className="relative z-10 px-6 py-5">
        <Link href="/" className="inline-flex items-center gap-2 group w-fit">
          <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center shadow-md">
            <TbRocket className="text-white text-base" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">
            Co<span className="text-brand-300">Foundry</span>
          </span>
        </Link>
      </header>

      {/* Centered card area */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-10">
        {children}
      </main>

      <footer className="relative z-10 py-4 text-center">
        <p className="text-xs text-brand-500">
          © {new Date().getFullYear()} CoFoundry. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
