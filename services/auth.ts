// Authentication Service - Firebase Auth with localStorage fallback
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    updateProfile,
    User
} from 'firebase/auth';
import { auth as firebaseAuth, isFirebaseConfigured } from './firebase';

export interface AuthUser {
    uid: string;
    email: string;
    displayName: string;
}

// ==================== FIREBASE MODE ====================

const firebaseSignUp = async (
    email: string,
    password: string,
    displayName: string
): Promise<AuthUser> => {
    if (!firebaseAuth) throw new Error('Firebase not configured');

    const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    await updateProfile(credential.user, { displayName });

    return {
        uid: credential.user.uid,
        email: credential.user.email || email,
        displayName,
    };
};

const firebaseSignIn = async (email: string, password: string): Promise<AuthUser> => {
    if (!firebaseAuth) throw new Error('Firebase not configured');

    const credential = await signInWithEmailAndPassword(firebaseAuth, email, password);
    return {
        uid: credential.user.uid,
        email: credential.user.email || email,
        displayName: credential.user.displayName || '',
    };
};

const firebaseSignOutFn = async (): Promise<void> => {
    if (!firebaseAuth) throw new Error('Firebase not configured');
    await firebaseSignOut(firebaseAuth);
};

const firebaseGetCurrentUser = (): AuthUser | null => {
    if (!firebaseAuth?.currentUser) return null;
    const user = firebaseAuth.currentUser;
    return {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
    };
};

const firebaseOnAuthStateChange = (callback: (user: AuthUser | null) => void): (() => void) => {
    if (!firebaseAuth) {
        callback(null);
        return () => { };
    }

    return onAuthStateChanged(firebaseAuth, (user: User | null) => {
        if (user) {
            callback({
                uid: user.uid,
                email: user.email || '',
                displayName: user.displayName || '',
            });
        } else {
            callback(null);
        }
    });
};

// ==================== LOCALSTORAGE FALLBACK ====================

interface StoredUser {
    uid: string;
    email: string;
    displayName: string;
    password: string;
}

const USERS_KEY = 'kubafit_users';
const CURRENT_USER_KEY = 'kubafit_current_user';

const seedTestAccount = () => {
    const data = localStorage.getItem(USERS_KEY);
    const users: StoredUser[] = data ? JSON.parse(data) : [];
    if (!users.some(u => u.email === 'test@kubafit.com')) {
        users.push({
            uid: 'test_user_001',
            email: 'test@kubafit.com',
            displayName: 'Test User',
            password: 'test123'
        });
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
};

const getStoredUsers = (): StoredUser[] => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
};

const localSignUp = async (
    email: string,
    password: string,
    displayName: string
): Promise<AuthUser> => {
    await new Promise(r => setTimeout(r, 800));
    const users = getStoredUsers();

    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('Email already registered');
    }
    if (!email || !email.includes('@')) throw new Error('Invalid email address');
    if (password.length < 6) throw new Error('Password must be at least 6 characters');
    if (!displayName.trim()) throw new Error('Name is required');

    const newUser: StoredUser = {
        uid: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email: email.toLowerCase(),
        displayName: displayName.trim(),
        password,
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    const authUser: AuthUser = { uid: newUser.uid, email: newUser.email, displayName: newUser.displayName };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(authUser));
    return authUser;
};

const localSignIn = async (email: string, password: string): Promise<AuthUser> => {
    await new Promise(r => setTimeout(r, 600));
    const users = getStoredUsers();
    const user = users.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) throw new Error('Invalid email or password');

    const authUser: AuthUser = { uid: user.uid, email: user.email, displayName: user.displayName };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(authUser));
    return authUser;
};

const localSignOut = async (): Promise<void> => {
    await new Promise(r => setTimeout(r, 300));
    localStorage.removeItem(CURRENT_USER_KEY);
};

const localGetCurrentUser = (): AuthUser | null => {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
};

const localOnAuthStateChange = (callback: (user: AuthUser | null) => void): (() => void) => {
    callback(localGetCurrentUser());
    const handler = (e: StorageEvent) => {
        if (e.key === CURRENT_USER_KEY) {
            callback(e.newValue ? JSON.parse(e.newValue) : null);
        }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
};

// Seed test account for local mode
if (!isFirebaseConfigured) {
    seedTestAccount();
}

// ==================== EXPORTS (auto-select mode) ====================

export const signUp = isFirebaseConfigured ? firebaseSignUp : localSignUp;
export const signIn = isFirebaseConfigured ? firebaseSignIn : localSignIn;
export const signOut = isFirebaseConfigured ? firebaseSignOutFn : localSignOut;
export const getCurrentUser = isFirebaseConfigured ? firebaseGetCurrentUser : localGetCurrentUser;
export const onAuthStateChange = isFirebaseConfigured ? firebaseOnAuthStateChange : localOnAuthStateChange;
