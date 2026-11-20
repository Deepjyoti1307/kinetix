'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Fingerprint, KeyRound, ShieldAlert, Activity, ArrowRight, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { startAuthentication } from '@simplewebauthn/browser';

export default function LoginPage() {
  const router = useRouter();
  const [showPinFallback, setShowPinFallback] = useState(false);
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [lockoutSeconds, setLockoutSeconds] = useState<number | null>(null);

  // Check if session already exists
  useEffect(() => {
    fetch('/api/v1/auth/session')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data?.authenticated) {
          router.replace('/today');
        }
      })
      .catch(() => {});
  }, [router]);

  // Lockout countdown timer
  useEffect(() => {
    if (!lockoutSeconds || lockoutSeconds <= 0) return;
    const interval = setInterval(() => {
      setLockoutSeconds((prev) => (prev && prev > 1 ? prev - 1 : null));
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutSeconds]);

  // Primary: Passkey / Face ID Authentication
  async function handlePasskeyLogin() {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // 1. Fetch WebAuthn Challenge Options
      const optionsRes = await fetch('/api/v1/auth/webauthn/auth-options');
      const optionsData = await optionsRes.json();

      if (!optionsRes.ok || !optionsData.success) {
        throw new Error(optionsData.error?.message || 'Failed to initialize biometric challenge');
      }

      // 2. Invoke Browser / OS Passkey & Biometric Prompt (Face ID / Touch ID / Windows Hello)
      const assertion = await startAuthentication(optionsData.data);

      // 3. Verify Signature with Backend
      const verifyRes = await fetch('/api/v1/auth/webauthn/auth-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assertion),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.success) {
        throw new Error(verifyData.error?.message || 'Biometric verification failed');
      }

      setSuccess('Biometrics verified. Access granted.');
      setTimeout(() => router.replace('/today'), 600);
    } catch (err: any) {
      console.warn('Passkey authentication error:', err);
      // If user cancelled, or hardware passkey is not enrolled on this browser
      if (err.name === 'NotAllowedError') {
        setError('Biometric prompt was dismissed or timed out.');
      } else {
        setError(err.message || 'Passkey unavailable on this device. Use recovery PIN.');
      }
    } finally {
      setLoading(false);
    }
  }

  // Secondary: PIN Fallback Authentication
  async function handlePinLogin(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!pin || pin.length < 4) {
      setError('Please enter your complete security PIN');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/v1/auth/pin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (res.status === 429) {
          setLockoutSeconds(60);
        }
        throw new Error(data.error?.message || 'Incorrect PIN code');
      }

      setSuccess('PIN verified. Access granted.');
      setTimeout(() => router.replace('/today'), 600);
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate PIN');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm p-6 rounded-2xl bg-card border border-border space-y-6 text-center shadow-2xl">
        {/* Brand Icon */}
        <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent mx-auto">
          <Activity className="w-8 h-8 stroke-[2.5]" />
        </div>

        <div>
          <h1 className="font-display tracking-wider text-2xl text-text-primary uppercase">Kinetix</h1>
          <p className="text-xs text-text-muted mt-1">Single-User Biometric Enclave</p>
        </div>

        {/* Feedback Messages */}
        {error && (
          <div className="p-3 rounded-lg bg-critical/10 border border-critical/30 text-xs text-critical flex items-start gap-2 text-left">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 rounded-lg bg-accent/10 border border-accent/30 text-xs text-accent flex items-start gap-2 text-left">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {/* PRIMARY AUTHENTICATION FLOW: Face ID / Passkey */}
        {!showPinFallback ? (
          <div className="space-y-4">
            <button
              onClick={handlePasskeyLogin}
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-accent hover:bg-accent-hover text-canvas font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent/15 disabled:opacity-50"
            >
              <Fingerprint className="w-5 h-5 stroke-[2.5]" />
              <span>{loading ? 'Verifying Hardware...' : 'Unlock with Passkey / Face ID'}</span>
            </button>

            <p className="text-[11px] text-text-muted">
              Fastest unlock using your device's biometric security
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setShowPinFallback(true);
                }}
                className="text-xs text-text-secondary hover:text-text-primary transition-colors underline-offset-4 hover:underline"
              >
                Passkey unavailable? Use recovery PIN
              </button>
            </div>
          </div>
        ) : (
          /* SECONDARY RECOVERY FLOW: Numeric PIN */
          <form onSubmit={handlePinLogin} className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-xs text-text-secondary">
              <KeyRound className="w-4 h-4 text-accent" />
              <span>Secondary Recovery PIN</span>
            </div>

            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={8}
              autoFocus
              disabled={loading || Boolean(lockoutSeconds)}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              placeholder="••••••••"
              className="w-full py-3 px-4 rounded-xl bg-elevated border border-border text-center text-xl tracking-widest text-text-primary focus:outline-none focus:border-accent font-mono disabled:opacity-40"
            />

            {lockoutSeconds ? (
              <div className="text-xs text-critical font-mono">
                Lockout active: retry in {lockoutSeconds}s
              </div>
            ) : (
              <button
                type="submit"
                disabled={loading || pin.length < 4}
                className="w-full py-3 rounded-xl bg-accent hover:bg-accent-hover text-canvas font-semibold text-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-40"
              >
                <span>{loading ? 'Verifying...' : 'Authenticate with PIN'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <div>
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setShowPinFallback(false);
                }}
                className="text-xs text-text-muted hover:text-text-secondary transition-colors"
              >
                Back to Face ID / Passkey
              </button>
            </div>
          </form>
        )}

        {/* Security Telemetry Badge */}
        <div className="pt-2 border-t border-border/50 text-[10px] text-text-muted font-mono flex items-center justify-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-accent" />
          <span>Argon2id Salted Hash • Rate-Limited</span>
        </div>
      </div>
    </div>
  );
}
