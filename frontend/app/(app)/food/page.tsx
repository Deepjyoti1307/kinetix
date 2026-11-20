'use client';

import { TopBar } from '@/components/navigation/TopBar';
import { Plus, Sparkles, FileText, UploadCloud } from 'lucide-react';

const MEAL_SLOTS = [
  { name: 'Breakfast', targetKcal: 550, consumedKcal: 480, itemsCount: 2 },
  { name: 'Lunch', targetKcal: 750, consumedKcal: 720, itemsCount: 3 },
  { name: 'Dinner', targetKcal: 700, consumedKcal: 640, itemsCount: 2 },
  { name: 'Snacks & Pre-Workout', targetKcal: 450, consumedKcal: 0, itemsCount: 0 },
];

export default function FoodPage() {
  return (
    <div className="space-y-6">
      <TopBar
        title="Food Diary & Diet"
        subtitle="Meal ledger, diet plan sync & nutrition analysis"
        action={
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-canvas text-xs font-semibold hover:bg-accent-hover transition-colors">
            <Sparkles className="w-3.5 h-3.5 stroke-[3]" />
            <span>AI Food Scan</span>
          </button>
        }
      />

      {/* Active Diet Plan Banner */}
      <div className="p-4 rounded-xl bg-card border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-elevated border border-border flex items-center justify-center text-accent">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-text-primary">Custom Diet Plan</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-accent/10 border border-accent/30 text-accent">ACTIVE</span>
            </div>
            <div className="text-xs text-text-muted mt-0.5">Target: 2,450 kcal • High Protein (170g)</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-elevated hover:bg-elevated/80 border border-border text-xs text-text-primary cursor-pointer transition-colors">
            <UploadCloud className="w-3.5 h-3.5 text-accent" />
            <span>Upload Diet PDF</span>
            <input type="file" accept=".pdf" className="hidden" />
          </label>
        </div>
      </div>

      {/* Meal Slots Ledger */}
      <div className="space-y-3">
        {MEAL_SLOTS.map((slot) => (
          <div
            key={slot.name}
            className="p-4 rounded-xl bg-card border border-border hover:border-border/80 transition-colors flex items-center justify-between"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-text-primary">{slot.name}</span>
                <span className="text-xs text-text-muted">({slot.itemsCount} logged)</span>
              </div>
              <div className="text-xs text-text-secondary mt-1">
                {slot.consumedKcal} kcal / {slot.targetKcal} kcal target
              </div>
            </div>

            <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-elevated border border-border hover:border-accent/40 text-xs text-text-primary transition-colors">
              <Plus className="w-3.5 h-3.5 text-accent" />
              <span>Add Food</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
