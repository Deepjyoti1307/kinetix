export interface WeightEntrySummary {
  id: string;
  date: string;
  weightKg: number;
  notes?: string;
}

export interface WeightTrendPoint {
  date: string;
  actualKg: number;
  movingAverageKg?: number;
}

export interface ProgressMediaSummary {
  id: string;
  date: string;
  mediaType: 'FRONT' | 'SIDE' | 'BACK' | 'OTHER';
  secureUrl: string;
  notes?: string;
}
