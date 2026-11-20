'use client';

import { useState } from 'react';
import { Fingerprint, KeyRound, ShieldAlert, Activity } from 'lucide-react';

export default function LoginPage() {
  const [usePinFallback, setUsePinFallback] = useState(false);
  const [pin, setPin] = useState('');

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm p-6 rounded-2xl bg-card border border-border space-y-6 text-center">
        {/* Brand Icon */}
        <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent mx-auto">
          <Activity className="w-8 h-8 stroke-[2.5]" />
        </div>

        <div>
          <h1 className="font-display tracking-wider text-2xl text-text-primary uppercase">Kinetix</h1>
          <p className="text-xs text-text-muted mt-1">Single-User Biometric Enclave</p>
        </div>

        {!usePinFallback ? (
          <div className="space-y-4">
            <button
              onClick={() => {
                alert('WebAuthn Passkey prompt will trigger here in Phase 2.');
              }}
              className="w-full py-3.5 rounded-xl bg-accent hover:bg-accent-hover text-canvas font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent/10"
            >
              <Fingerprint className="w-5 h-5 stroke-[2.5]" />
              <span>Unlock with Passkey</span>
            </button>

            <button
              onClick={() => setUsePinFallback(true)}
              className="text-xs text-text-muted hover:text-text-secondary transition-colors"
            >
              Or unlock with recovery PIN
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-xs text-text-muted">
              <KeyRound className="w-4 h-4 text-accent" />
              <span>Enter Security PIN</span>
            </div>

            <input
              type="password"
              maxLength={8}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••••••"
              className="w-full py-3 px-4 rounded-xl bg-elevated border border-border text-center text-xl tracking-widest text-text-primary focus:outline-none focus:border-accent font-mono"
            />

            <button
              onClick={() => {
                alert('PIN verification will connect to backend in Phase 2.');
              }}
              className="w-full py-3 rounded-xl bg-accent hover:bg-accent-hover text-canvas font-semibold text-sm transition-all"
            >
              Verify PIN
            </button>

            <button
              onClick={() => setUsePinFallback(false)}
              className="text-xs text-text-muted hover:text-text-secondary transition-colors"
            >
              Back to Passkey unlock
            </button>
          </div>
        )}

        <div className="pt-2 border-t border-border/50 text-[10px] text-text-muted font-mono flex items-center justify-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-accent" />
          <span>Strict Rate-Limiting & Secure Cookies Active</span>
        </div>
      </div>
    </div>
  );
}
