'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, UtensilsCrossed, Dumbbell, TrendingUp, Settings, Activity } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/today', label: 'Today', icon: LayoutDashboard },
  { href: '/food', label: 'Food Diary', icon: UtensilsCrossed },
  { href: '/workout', label: 'Workout Logger', icon: Dumbbell },
  { href: '/progress', label: 'Progress & Photos', icon: TrendingUp },
  { href: '/settings', label: 'Settings & Vault', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card/50 backdrop-blur-sm min-h-screen p-4 justify-between">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
            <Activity className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="font-display tracking-wider text-lg text-text-primary uppercase">Kinetix</div>
            <div className="text-[10px] text-text-muted tracking-widest uppercase">Telemetry v0.1</div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  isActive
                    ? 'bg-elevated text-accent border border-accent/20 font-medium'
                    : 'text-text-secondary hover:text-text-primary hover:bg-elevated/50 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-accent' : 'text-text-muted'}`} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / System Status */}
      <div className="px-3 py-3 rounded-lg bg-elevated/40 border border-border/50 text-xs">
        <div className="flex items-center gap-2 text-text-muted">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="font-mono text-[11px]">System Ready</span>
        </div>
        <div className="text-[10px] text-text-muted mt-1 truncate">Single-User Secure Enclave</div>
      </div>
    </aside>
  );
}
