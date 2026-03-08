
export enum Language {
  EN = 'English',
  RW = 'Kinyarwanda'
}

export enum Currency {
  RWF = 'Rwf',
  USD = 'USD',
  GBP = 'GBP'
}

export enum PaymentMethod {
  MPESA = 'M-Pesa',
  MTN_MO_MO = 'MTN Mobile Money',
  CREDIT_CARD = 'Credit Card'
}

export interface BusinessTransaction {
  id: string;
  date: string;
  type: string;
  amount: number; // in local currency
  units: number;  // inventory units involved
  notes?: string;
}

export interface Transaction {
  id: string;
  date: string;
  method: PaymentMethod;
  amount: number;
  currency: Currency;
  planName: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface UserProfile {
  name: string;
  inventoryVolume: number;
  operationalScale: number;
  businessGoal: string;
  marketFrequency: string;
  githubUrl?: string;
  // Health Metrics
  weight?: number; // in kg
  height?: number; // in cm
  healthGoal?: string;
}

export interface ActivityData {
  move: number; // percentage (0-100)
  exercise: number; // percentage (0-100)
  stand: number; // percentage (0-100)
  calories: number;
  exerciseMinutes: number;
  standHours: number;
}

export interface HeartRateData {
  current: number;
  min: number;
  max: number;
  history: { time: string; value: number }[];
}

export interface SleepData {
  totalDuration: number; // in minutes
  stages: { stage: 'Deep' | 'Core' | 'REM' | 'Awake'; duration: number }[];
}

export interface HealthData {
  activity: ActivityData;
  heartRate: HeartRateData;
  sleep: SleepData;
}

export interface AIInventoryPlan {
  title: string;
  description: string;
  phases: {
    phase: string;
    actions: {
      name: string;
      batches: number;
      target: string;
      frequency: string;
    }[];
  }[];
}

export interface BusinessInsight {
  metric: string;
  value: string;
  status: 'normal' | 'warning' | 'positive';
  advice: string;
}

// Athletics & Performance Metrics
export interface AthleticActivity {
  id: string;
  name: string;
  type: 'Run' | 'Ride' | 'Swim' | 'Walk' | 'Workout';
  startDate: string;
  distance: number; // in meters
  movingTime: number; // in seconds
  elapsedTime: number; // in seconds
  totalElevationGain: number; // in meters
  mapPolyline?: string;
  averageHeartRate?: number;
  maxHeartRate?: number;
  relativeEffort?: number;
  kudosCount: number;
  commentCount: number;
  photoUrl?: string;
}

export interface PerformanceStats {
  relativeEffortHistory: { date: string; value: number }[];
  fitnessLevel: number; // 0-10 score
  fatigueLevel: number; // 0-10 score
  formLevel: number; // fitness - fatigue
}

// Phase 2: Weight Tracking
export interface WeightEntry {
  id: string;
  date: string;
  weight: number; // in kg
  notes?: string;
}

// Phase 2: Hiking
export interface HikingSpot {
  id: string;
  name: string;
  location: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard' | 'Extreme';
  distance: number; // in km
  elevationGain: number; // in meters
  description: string;
  imageUrl?: string;
}

// Phase 2: Workout Library
export interface ExerciseVideo {
  id: string;
  name: string;
  description: string;
  category: 'Strength' | 'Cardio' | 'HIIT' | 'Flexibility' | 'Recovery';
  videoUrl: string;
  thumbnailUrl: string;
  duration: string; // e.g. "15 min"
}
