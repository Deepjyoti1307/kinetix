export type MuscleGroup =
  | 'CHEST'
  | 'BACK'
  | 'LEGS'
  | 'SHOULDERS'
  | 'ARMS'
  | 'CORE'
  | 'FULL_BODY';

export type EquipmentType =
  | 'BARBELL'
  | 'DUMBBELL'
  | 'CABLE'
  | 'MACHINE'
  | 'BODYWEIGHT'
  | 'BAND'
  | 'OTHER';

export interface ExerciseSummary {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  equipment: EquipmentType;
  instructions?: string;
}

export interface WorkoutSetEntry {
  id: string;
  setNumber: number;
  weightKg?: number;
  reps?: number;
  rpe?: number;
  durationSeconds?: number;
  distanceMeters?: number;
  completed: boolean;
  completedAt?: string;
}

export interface WorkoutExerciseEntry {
  id: string;
  exerciseId: string;
  exerciseName: string;
  muscleGroup: MuscleGroup;
  order: number;
  notes?: string;
  sets: WorkoutSetEntry[];
}

export interface WorkoutSessionSummary {
  id: string;
  title: string;
  startedAt: string;
  completedAt?: string;
  notes?: string;
  totalVolumeKg: number;
  exercises: WorkoutExerciseEntry[];
}

export interface WorkoutPlanRoutine {
  dayName: string;
  routineName: string;
  targetExercises: {
    name: string;
    targetSets: number;
    targetReps: string;
    notes?: string;
  }[];
}

export interface WorkoutPlanStructure {
  name: string;
  description?: string;
  sourcePdfFilename?: string;
  routines: WorkoutPlanRoutine[];
}
