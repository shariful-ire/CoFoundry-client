'use client';

import { TbRocket, TbBriefcase, TbCheck } from 'react-icons/tb';

const ROLES = [
  { value: 'founder',      label: 'Founder',      icon: TbRocket,    description: "I'm building a startup and need team members" },
  { value: 'collaborator', label: 'Collaborator', icon: TbBriefcase, description: 'I want to join an early-stage startup' },
];

export default function RoleSelect({ value, onChange, error }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-text mb-2">
        I am joining as a…
      </label>
      <div className="flex gap-3 relative">
        {ROLES.map(({ value: roleValue, label, icon: Icon, description }) => {
          const selected = value === roleValue;
          return (
            <button
              key={roleValue}
              type="button"
              onClick={() => onChange(roleValue)}
              className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center cursor-pointer ${
                selected
                  ? 'border-brand-500 bg-brand-50'
                  : 'border-border bg-surface-alt hover:border-brand-200 hover:bg-white'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selected ? 'gradient-brand' : 'bg-white border border-border'}`}>
                <Icon className={`text-xl ${selected ? 'text-white' : 'text-text-muted'}`} />
              </div>
              <div>
                <p className={`text-sm font-bold ${selected ? 'text-brand-700' : 'text-text'}`}>{label}</p>
                <p className="text-xs text-text-muted leading-tight mt-0.5">{description}</p>
              </div>
              {selected && (
                <span className="absolute top-2 right-2">
                  <TbCheck className="text-brand-500 text-sm" />
                </span>
              )}
            </button>
          );
        })}
      </div>
      {error && <p className="text-xs text-danger mt-1.5">{error}</p>}
    </div>
  );
}
