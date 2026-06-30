import Link from 'next/link';
import { TbRocket } from 'react-icons/tb';
import {
  FaXTwitter,
  FaLinkedinIn,
  FaGithub,
  FaDiscord,
} from 'react-icons/fa6';
import { HiOutlineMail, HiOutlineLocationMarker } from 'react-icons/hi';

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Browse Startups', href: '/startups' },
  { label: 'Opportunities', href: '/opportunities' },
  { label: 'Login', href: '/login' },
  { label: 'Get Started', href: '/register' },
];

const exploreLinks = [
  { label: 'For Founders', href: '/register' },
  { label: 'For Collaborators', href: '/register' },
  { label: 'Success Stories', href: '/#stories' },
  { label: 'Why CoFoundry?', href: '/#why' },
];

const socialLinks = [
  { icon: FaXTwitter, label: 'Twitter / X', href: '#' },
  { icon: FaLinkedinIn, label: 'LinkedIn', href: '#' },
  { icon: FaGithub, label: 'GitHub', href: '#' },
  { icon: FaDiscord, label: 'Discord', href: '#' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-950 text-white mt-auto">
      {/* ── Main grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-1 space-y-5">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center shadow-lg">
                <TbRocket className="text-white text-lg" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Co<span className="text-brand-300">Foundry</span>
              </span>
            </Link>
            <p className="text-sm text-brand-300 leading-relaxed max-w-xs">
              The platform where startup founders meet talented collaborators.
              Build your dream team and ship the next big thing.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-brand-800 hover:bg-brand-600 flex items-center justify-center transition-colors duration-200"
                >
                  <Icon className="text-brand-200 text-sm" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-brand-400 mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-300 hover:text-white transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-brand-500 group-hover:bg-brand-300 transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-brand-400 mb-5">
              Explore
            </h3>
            <ul className="space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-300 hover:text-white transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-brand-500 group-hover:bg-brand-300 transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-brand-400 mb-5">
              Contact
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:hello@cofoundry.dev"
                  className="flex items-start gap-3 text-sm text-brand-300 hover:text-white transition-colors group"
                >
                  <HiOutlineMail className="text-brand-400 text-lg mt-0.5 shrink-0 group-hover:text-brand-200" />
                  hello@cofoundry.dev
                </a>
              </li>
              <li>
                <span className="flex items-start gap-3 text-sm text-brand-300">
                  <HiOutlineLocationMarker className="text-brand-400 text-lg mt-0.5 shrink-0" />
                  Remote-first · Worldwide
                </span>
              </li>
            </ul>

            {/* Mini CTA */}
            <div className="mt-8 p-4 rounded-xl bg-brand-900 border border-brand-800">
              <p className="text-xs text-brand-300 mb-3 leading-relaxed">
                Ready to find your co-founder?
              </p>
              <Link
                href="/register"
                className="inline-block w-full text-center text-xs font-semibold py-2 px-4 rounded-lg gradient-brand text-white hover:opacity-90 transition-opacity"
              >
                Join for Free →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-brand-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-brand-500">
            © {year} CoFoundry. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="#" className="text-xs text-brand-500 hover:text-brand-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-xs text-brand-500 hover:text-brand-300 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
