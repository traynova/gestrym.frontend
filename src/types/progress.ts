export interface ProgressMetrics {
  id?: number;
  date: string;
  weight: number;
  height?: number; // Optional on get, usually provided on post
  bodyFat: number;
  muscleMass: number;
}

export interface MetricsResponse {
  metrics: ProgressMetrics[];
  total: number;
}

export interface CreateMetricsDto {
  date: string;
  weight: number;
  height: number;
  bodyFat: number;
  muscleMass: number;
}

export interface ChartPoint {
  date: string;
  weight: number;
}

export interface ChartResponse {
  points: ChartPoint[];
}

export interface ProgressPhoto {
  id?: number;
  type: 'front' | 'back' | 'side';
  imageUrl?: string;
  date: string;
}

export interface PhotosResponse {
  photos: ProgressPhoto[];
  total: number;
}

export interface UploadPhotoDto {
  file: File;
  type: 'front' | 'back' | 'side';
  date: string; // YYYY-MM-DD
}

export interface ComparisonResponse {
  firstPhoto: ProgressPhoto;
  latestPhoto: ProgressPhoto;
  firstMetrics: {
    weight: number;
    bodyFat: number;
    date: string;
  };
  latestMetrics: {
    weight: number;
    bodyFat: number;
    date: string;
  };
}

export interface WorkoutProgress {
  id?: number;
  workoutId: number;
  date: string;
  duration: number;
  notes: string;
}

export interface WorkoutProgressResponse {
  progress: WorkoutProgress[];
  total: number;
}

export interface CreateWorkoutProgressDto {
  workoutId: number;
  date: string;
  duration: number;
  notes: string;
}

export interface TrainerNote {
  id?: number;
  message: string;
  trainerId?: number;
  date?: string;
}

export interface TrainerNotesResponse {
  notes: TrainerNote[];
  total: number;
}

export interface CreateTrainerNoteDto {
  userId: number;
  message: string;
}
