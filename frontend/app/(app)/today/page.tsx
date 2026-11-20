'use client';

import { TopBar } from '@/components/navigation/TopBar';
import { Flame, Dumbbell, Scale, Plus, Sparkles, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function TodayPage() {
  return (
    <div className="space-y-6">
      <TopBar
        title="Today Dashboard"
        subtitle="Daily Energy & Biometric Telemetry"
        action={
          <Link
            href="/food"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-canvas text-xs font-semibold hover:bg-accent-hover transition-colors"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Log Metric</span>
          </Link>
        }
      />

      {/* Telemetry Hero Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Calorie Progress Card */}
        <div className="p-5 rounded-xl bg-card border border-border relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-text-muted uppercase tracking-wider mb-2">
            <span>Energy Load</span>
            <Flame className="w-4 h-4 text-accent" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-4xl text-text-primary">1,840</span>
            <span className="text-xs text-text-secondary">/ 2,450 kcal</span>
          </div>
          <div className="w-full bg-elevated h-2 rounded-full mt-4 overflow-hidden border border-border/40">
            <div className="bg-accent h-full rounded-full transition-all" style={{ width: '75%' }} />
          </div>
          <div className="flex justify-between items-center text-xs text-text-secondary mt-2">
            <span>610 kcal remaining</span>
            <span className="text-accent font-mono text-[11px]">75%</span>
          </div>
        </div>

        {/* Macro Distribution Card */}
        <div className="p-5 rounded-xl bg-card border border-border">
          <div className="text-xs text-text-muted uppercase tracking-wider mb-2">
            Macro Telemetry
          </div>
          <div className="space-y-2 mt-3">
            <div>
              <div className="flex justify-between text-xs text-text-secondary mb-1">
                <span>Protein</span>
                <span className="font-mono text-text-primary">142g / 170g</span>
              </div>
              <div className="w-full bg-elevated h-1.5 rounded-full overflow-hidden">
                <div className="bg-accent h-full rounded-full" style={{ width: '83%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-text-secondary mb-1">
                <span>Carbohydrates</span>
                <span className="font-mono text-text-primary">185g / 240g</span>
              </div>
              <div className="w-full bg-elevated h-1.5 rounded-full overflow-hidden">
                <div className="bg-text-secondary h-full rounded-full" style={{ width: '77%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-text-secondary mb-1">
                <span>Fats</span>
                <span className="font-mono text-text-primary">52g / 65g</span>
              </div>
              <div className="w-full bg-elevated h-1.5 rounded-full overflow-hidden">
                <div className="bg-text-muted h-full rounded-full" style={{ width: '80%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Workout & Weight Snapshot */}
        <div className="p-5 rounded-xl bg-card border border-border flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-text-muted uppercase tracking-wider mb-2">
              <span>Biometric Status</span>
              <Scale className="w-4 h-4 text-accent" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-4xl text-text-primary">76.4</span>
              <span className="text-xs text-text-secondary">kg (7-day MA: 76.8 kg)</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <span className="text-xs text-text-primary font-medium">Upper Hypertrophy (Push)</span>
            </div>
            <Link
              href="/workout"
              className="text-xs text-accent hover:underline flex items-center gap-0.5"
            >
              <span>Session Ready</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          href="/food"
          className="p-4 rounded-xl bg-card hover:bg-elevated border border-border transition-all flex flex-col items-center justify-center text-center gap-2 group"
        >
          <div className="w-10 h-10 rounded-lg bg-elevated group-hover:bg-accent/10 border border-border group-hover:border-accent/40 flex items-center justify-center text-accent transition-colors">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-text-primary">Log Food</div>
            <div className="text-[10px] text-text-muted">Catalogue & Custom</div>
          </div>
        </Link>

        <Link
          href="/food?action=scan"
          className="p-4 rounded-xl bg-card hover:bg-elevated border border-border transition-all flex flex-col items-center justify-center text-center gap-2 group"
        >
          <div className="w-10 h-10 rounded-lg bg-elevated group-hover:bg-accent/10 border border-border group-hover:border-accent/40 flex items-center justify-center text-accent transition-colors">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-text-primary">AI Vision Scan</div>
            <div className="text-[10px] text-text-muted">Capture & Estimate</div>
          </div>
        </Link>

        <Link
          href="/workout"
          className="p-4 rounded-xl bg-card hover:bg-elevated border border-border transition-all flex flex-col items-center justify-center text-center gap-2 group"
        >
          <div className="w-10 h-10 rounded-lg bg-elevated group-hover:bg-accent/10 border border-border group-hover:border-accent/40 flex items-center justify-center text-accent transition-colors">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-text-primary">Active Workout</div>
            <div className="text-[10px] text-text-muted">Start Session</div>
          </div>
        </Link>

        <Link
          href="/progress"
          className="p-4 rounded-xl bg-card hover:bg-elevated border border-border transition-all flex flex-col items-center justify-center text-center gap-2 group"
        >
          <div className="w-10 h-10 rounded-lg bg-elevated group-hover:bg-accent/10 border border-border group-hover:border-accent/40 flex items-center justify-center text-accent transition-colors">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-text-primary">Weigh-in</div>
            <div className="text-[10px] text-text-muted">Trend & Photos</div>
          </div>
        </Link>
      </div>
    </div>
  );
}
