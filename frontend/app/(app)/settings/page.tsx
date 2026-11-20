'use client';

import { TopBar } from '@/components/navigation/TopBar';
import { Shield, KeyRound, Download, FileText, Trash2 } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <TopBar
        title="Settings & Security"
        subtitle="Passkey authentication, PIN recovery & data export"
      />

      {/* Security Credentials */}
      <div className="p-6 rounded-xl bg-card border border-border space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-semibold text-text-primary">Authentication & Access</h3>
        </div>

        <div className="p-4 rounded-lg bg-elevated border border-border flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-text-primary">Apple Passkey / WebAuthn</div>
            <div className="text-[11px] text-text-muted mt-0.5">Primary hardware biometric unlock (Face ID / Touch ID)</div>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-accent/10 border border-accent/30 text-accent">
            REGISTERED
          </span>
        </div>

        <div className="p-4 rounded-lg bg-elevated border border-border flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-text-primary">Master PIN Fallback</div>
            <div className="text-[11px] text-text-muted mt-0.5">Argon2id salted hash with progressive lockout delays</div>
          </div>
          <button className="text-xs text-accent hover:underline">Change PIN</button>
        </div>
      </div>

      {/* Export & Data Portability */}
      <div className="p-6 rounded-xl bg-card border border-border space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Download className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-semibold text-text-primary">Data Export & Schedules</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button className="p-4 rounded-lg bg-elevated hover:bg-elevated/80 border border-border text-left transition-colors flex items-center gap-3">
            <FileText className="w-5 h-5 text-accent" />
            <div>
              <div className="text-xs font-semibold text-text-primary">Export Diet Plan PDF</div>
              <div className="text-[10px] text-text-muted">Download printable meal schedule</div>
            </div>
          </button>

          <button className="p-4 rounded-lg bg-elevated hover:bg-elevated/80 border border-border text-left transition-colors flex items-center gap-3">
            <FileText className="w-5 h-5 text-accent" />
            <div>
              <div className="text-xs font-semibold text-text-primary">Export Workout Split PDF</div>
              <div className="text-[10px] text-text-muted">Download printable routine schedule</div>
            </div>
          </button>

          <button className="p-4 rounded-lg bg-elevated hover:bg-elevated/80 border border-border text-left transition-colors flex items-center gap-3">
            <Download className="w-5 h-5 text-accent" />
            <div>
              <div className="text-xs font-semibold text-text-primary">Export Complete Archive</div>
              <div className="text-[10px] text-text-muted">JSON / CSV raw biometric records</div>
            </div>
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="p-6 rounded-xl bg-card border border-critical/30 space-y-3">
        <div className="flex items-center gap-2">
          <Trash2 className="w-4 h-4 text-critical" />
          <h3 className="text-sm font-semibold text-critical">Danger Zone</h3>
        </div>
        <p className="text-xs text-text-secondary">
          Permanently delete all nutrition logs, workout history, and Cloudinary progress photos. This action requires re-authentication.
        </p>
        <button className="px-4 py-2 rounded-lg bg-critical/10 hover:bg-critical/20 border border-critical/30 text-xs font-semibold text-critical transition-colors">
          Purge Personal Telemetry Data
        </button>
      </div>
    </div>
  );
}
