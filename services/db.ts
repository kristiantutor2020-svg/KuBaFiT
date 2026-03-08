// Database Service - Firebase Firestore with localStorage fallback
import {
  doc, setDoc, getDoc,
  collection, addDoc, getDocs, updateDoc, deleteDoc,
  query, orderBy
} from 'firebase/firestore';
import { db as firestoreDb, isFirebaseConfigured } from './firebase';
import { UserProfile, BusinessTransaction, WeightEntry, AthleticActivity, Language, Currency } from '../types';

export interface UserData {
  profile: UserProfile;
  history: BusinessTransaction[];
  weightEntries: WeightEntry[];
  language: Language;
  currency: Currency;
  isSubscribed: boolean;
}

const getUserKey = (userId: string) => `kubafit_user_${userId}`;
const getWorkoutsKey = (userId: string) => `kubafit_workouts_${userId}`;

export const getDefaultUserData = (displayName: string): UserData => ({
  profile: {
    name: displayName,
    inventoryVolume: 100,
    operationalScale: 1,
    businessGoal: 'Efficiency',
    marketFrequency: 'Moderate',
    githubUrl: ''
  },
  history: [],
  weightEntries: [],
  language: Language.RW,
  currency: Currency.RWF,
  isSubscribed: false
});

// ==================== FIREBASE MODE ====================

const firebaseSaveUserData = async (userId: string, data: UserData): Promise<void> => {
  if (!firestoreDb) return;
  await setDoc(doc(firestoreDb, 'users', userId), {
    profile: data.profile,
    language: data.language,
    currency: data.currency,
    isSubscribed: data.isSubscribed,
    updatedAt: new Date().toISOString()
  });
};

const firebaseLoadUserData = async (userId: string): Promise<UserData | null> => {
  if (!firestoreDb) return null;
  const snap = await getDoc(doc(firestoreDb, 'users', userId));
  if (!snap.exists()) return null;
  const d = snap.data();
  return {
    profile: d.profile,
    history: [],
    weightEntries: d.weightEntries || [],
    language: d.language,
    currency: d.currency,
    isSubscribed: d.isSubscribed || false
  };
};

const firebaseAddWorkout = async (userId: string, workout: Omit<AthleticActivity, 'id'>): Promise<AthleticActivity> => {
  if (!firestoreDb) throw new Error('Firestore not configured');
  const ref = await addDoc(collection(firestoreDb, 'users', userId, 'workouts'), {
    ...workout,
    createdAt: new Date().toISOString()
  });
  return { ...workout, id: ref.id } as AthleticActivity;
};

const firebaseGetWorkouts = async (userId: string): Promise<BusinessTransaction[]> => {
  if (!firestoreDb) return [];
  const q = query(collection(firestoreDb, 'users', userId, 'workouts'), orderBy('date', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as BusinessTransaction));
};

const firebaseUpdateWorkout = async (userId: string, workoutId: string, updates: Partial<BusinessTransaction>): Promise<void> => {
  if (!firestoreDb) return;
  await updateDoc(doc(firestoreDb, 'users', userId, 'workouts', workoutId), updates);
};

const firebaseDeleteWorkout = async (userId: string, workoutId: string): Promise<void> => {
  if (!firestoreDb) return;
  await deleteDoc(doc(firestoreDb, 'users', userId, 'workouts', workoutId));
};

// ==================== LOCALSTORAGE FALLBACK ====================

const localSaveUserData = async (userId: string, data: UserData): Promise<void> => {
  localStorage.setItem(getUserKey(userId), JSON.stringify(data));
};

const localLoadUserData = (userId: string): UserData | null => {
  const data = localStorage.getItem(getUserKey(userId));
  if (!data) return null;
  try { return JSON.parse(data); }
  catch { return null; }
};

const localAddWorkout = async (userId: string, workout: Omit<BusinessTransaction, 'id'>): Promise<BusinessTransaction> => {
  const workouts = localGetWorkouts(userId);
  const newWorkout: BusinessTransaction = {
    ...workout,
    id: `workout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  };
  workouts.push(newWorkout);
  localStorage.setItem(getWorkoutsKey(userId), JSON.stringify(workouts));
  return newWorkout;
};

const localGetWorkouts = (userId: string): BusinessTransaction[] => {
  const data = localStorage.getItem(getWorkoutsKey(userId));
  if (!data) return [];
  try { return JSON.parse(data); }
  catch { return []; }
};

const localUpdateWorkout = async (userId: string, workoutId: string, updates: Partial<BusinessTransaction>): Promise<void> => {
  const workouts = localGetWorkouts(userId);
  const idx = workouts.findIndex(w => w.id === workoutId);
  if (idx !== -1) {
    workouts[idx] = { ...workouts[idx], ...updates };
    localStorage.setItem(getWorkoutsKey(userId), JSON.stringify(workouts));
  }
};

const localDeleteWorkout = async (userId: string, workoutId: string): Promise<void> => {
  const workouts = localGetWorkouts(userId).filter(w => w.id !== workoutId);
  localStorage.setItem(getWorkoutsKey(userId), JSON.stringify(workouts));
};

// ==================== EXPORTS (auto-select mode) ====================

// saveUserData and loadUserData need to handle both sync and async
export const saveUserData = isFirebaseConfigured ? firebaseSaveUserData : localSaveUserData;

export const loadUserData = isFirebaseConfigured
  ? firebaseLoadUserData
  : (userId: string): UserData | null => localLoadUserData(userId);

export const addWorkout = isFirebaseConfigured ? firebaseAddWorkout : localAddWorkout;

export const getWorkouts = isFirebaseConfigured
  ? firebaseGetWorkouts
  : (userId: string): BusinessTransaction[] => localGetWorkouts(userId);

export const updateWorkout = isFirebaseConfigured ? firebaseUpdateWorkout : localUpdateWorkout;
export const deleteWorkout = isFirebaseConfigured ? firebaseDeleteWorkout : localDeleteWorkout;

// GitHub sync (mock)
export const syncToGithub = async (githubUrl: string, workoutData: BusinessTransaction[]): Promise<boolean> => {
  if (!githubUrl) return false;
  console.log(`[GitHub] Syncing ${workoutData.length} workouts to ${githubUrl}/kubafit-logs`);
  return new Promise(resolve => setTimeout(() => resolve(true), 1500));
};
