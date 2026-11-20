'use client';

import { Activity, ShieldCheck } from 'lucide-react';

interface TopBarProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function TopBar({ title, subtitle, action }: TopBarProps) {
  return (
    <header className="sticky top-0 z-40 bg-canvas/80 backdrop-blur-md border-b border-border px-4 py-3 md:px-8 flex items-center justify-between safe-area-top">
      <div>
        <div className="flex items-center gap-2">
          <span className="font-display tracking-wide text-xl md:text-2xl text-text-primary uppercase">
            {title}
          </span>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-elevated border border-border text-text-muted">
            <ShieldCheck className="w-3 h-3 text-accent" />
            LIVE
          </span>
        </div>
        {subtitle && (
          <p className="text-xs text-text-secondary mt-0.5 tracking-tight">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {action}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-elevated/60 border border-border text-xs text-text-muted font-mono">
          <Activity className="w-3.5 h-3.5 text-accent" />
          <span>STANDALONE</span>
        </div>
      </div>
    </header>
  );
}
