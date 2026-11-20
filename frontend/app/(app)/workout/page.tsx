'use client';

import { TopBar } from '@/components/navigation/TopBar';
import { Dumbbell, Play, UploadCloud, FileText } from 'lucide-react';

export default function WorkoutPage() {
  return (
    <div className="space-y-6">
      <TopBar
        title="Workout Telemetry"
        subtitle="Active logging, routine schedule & volume metrics"
        action={
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-canvas text-xs font-semibold hover:bg-accent-hover transition-colors">
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start Session</span>
          </button>
        }
      />

      {/* Active Workout Schedule Banner */}
      <div className="p-4 rounded-xl bg-card border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-elevated border border-border flex items-center justify-center text-accent">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-text-primary">Hypertrophy Upper/Lower Split</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-accent/10 border border-accent/30 text-accent">ACTIVE</span>
            </div>
            <div className="text-xs text-text-muted mt-0.5">4 days/week • 6–8 RPE progression</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-elevated hover:bg-elevated/80 border border-border text-xs text-text-primary cursor-pointer transition-colors">
            <UploadCloud className="w-3.5 h-3.5 text-accent" />
            <span>Upload Workout PDF</span>
            <input type="file" accept=".pdf" className="hidden" />
          </label>
        </div>
      </div>

      {/* Routine Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl bg-card border border-border hover:border-accent/40 transition-colors">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="text-xs font-mono text-accent uppercase">Session A</span>
              <h3 className="text-base font-semibold text-text-primary mt-0.5">Upper Body Hypertrophy</h3>
            </div>
            <span className="text-xs text-text-muted">~55 mins</span>
          </div>
          <p className="text-xs text-text-secondary mb-4">
            Incline DB Press, Overhead Press, Cable Pec Flyes, DB Lateral Raises, Tricep Pushdowns.
          </p>
          <button className="w-full py-2.5 rounded-lg bg-elevated hover:bg-accent hover:text-canvas border border-border hover:border-accent text-xs font-semibold text-text-primary transition-all flex items-center justify-center gap-1.5">
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Begin Session</span>
          </button>
        </div>

        <div className="p-5 rounded-xl bg-card border border-border hover:border-accent/40 transition-colors">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="text-xs font-mono text-text-muted uppercase">Session B</span>
              <h3 className="text-base font-semibold text-text-primary mt-0.5">Lower Body & Posterior</h3>
            </div>
            <span className="text-xs text-text-muted">~60 mins</span>
          </div>
          <p className="text-xs text-text-secondary mb-4">
            Barbell Back Squats, Romanian Deadlifts, Leg Press, Standing Calf Raises, Hanging Leg Raises.
          </p>
          <button className="w-full py-2.5 rounded-lg bg-elevated hover:bg-accent hover:text-canvas border border-border hover:border-accent text-xs font-semibold text-text-primary transition-all flex items-center justify-center gap-1.5">
            <Dumbbell className="w-3.5 h-3.5" />
            <span>View Routine</span>
          </button>
        </div>
      </div>
    </div>
  );
}
