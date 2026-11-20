'use client';

import { TopBar } from '@/components/navigation/TopBar';
import { Scale, Camera, Lock, ArrowUpRight } from 'lucide-react';

export default function ProgressPage() {
  return (
    <div className="space-y-6">
      <TopBar
        title="Biometric Progress"
        subtitle="Weight trends, moving average & private visual vault"
        action={
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-canvas text-xs font-semibold hover:bg-accent-hover transition-colors">
            <Scale className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Log Weight</span>
          </button>
        }
      />

      {/* Weight Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-card border border-border">
          <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Current Weight</div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-4xl text-text-primary">76.4</span>
            <span className="text-sm text-text-secondary">kg</span>
          </div>
          <div className="text-xs text-accent mt-2 flex items-center gap-1">
            <span>-0.4 kg vs last week</span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-card border border-border">
          <div className="text-xs text-text-muted uppercase tracking-wider mb-1">7-Day Moving Avg</div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-4xl text-text-primary">76.8</span>
            <span className="text-sm text-text-secondary">kg</span>
          </div>
          <div className="text-xs text-text-muted mt-2">Smooth trend filter</div>
        </div>

        <div className="p-5 rounded-xl bg-card border border-border">
          <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Target Horizon</div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-4xl text-text-primary">74.0</span>
            <span className="text-sm text-text-secondary">kg</span>
          </div>
          <div className="text-xs text-text-muted mt-2">2.4 kg to target</div>
        </div>
      </div>

      {/* Private Progress Photo Vault Card */}
      <div className="p-6 rounded-xl bg-card border border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold text-text-primary">Private Visual Vault</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-elevated border border-border text-text-muted">
              AUTHENTICATED ONLY
            </span>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-elevated hover:bg-elevated/80 border border-border text-xs text-text-primary transition-colors">
            <Camera className="w-3.5 h-3.5 text-accent" />
            <span>Upload Photo</span>
          </button>
        </div>

        <p className="text-xs text-text-secondary mb-4">
          All progress photos are stored with private authenticated Cloudinary delivery. Location and EXIF metadata are stripped prior to storage.
        </p>

        <div className="grid grid-cols-3 gap-3">
          <div className="aspect-[3/4] rounded-lg bg-elevated border border-dashed border-border flex flex-col items-center justify-center text-text-muted p-2 text-center text-xs">
            <span>Front Pose</span>
          </div>
          <div className="aspect-[3/4] rounded-lg bg-elevated border border-dashed border-border flex flex-col items-center justify-center text-text-muted p-2 text-center text-xs">
            <span>Side Pose</span>
          </div>
          <div className="aspect-[3/4] rounded-lg bg-elevated border border-dashed border-border flex flex-col items-center justify-center text-text-muted p-2 text-center text-xs">
            <span>Back Pose</span>
          </div>
        </div>
      </div>
    </div>
  );
}
