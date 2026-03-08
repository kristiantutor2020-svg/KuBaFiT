import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser, getCurrentUser, signIn, signUp, signOut, onAuthStateChange } from '../services/auth';

interface AuthContextType {
    user: AuthUser | null;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Check initial auth state
        const currentUser = getCurrentUser();
        setUser(currentUser);
        setLoading(false);

        // Listen for auth changes
        const unsubscribe = onAuthStateChange((authUser) => {
            setUser(authUser);
        });

        return () => unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            setError(null);
            setLoading(true);
            const authUser = await signIn(email, password);
            setUser(authUser);
        } catch (err: any) {
            setError(err.message || 'Login failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const register = async (email: string, password: string, name: string) => {
        try {
            setError(null);
            setLoading(true);
            const authUser = await signUp(email, password, name);
            setUser(authUser);
        } catch (err: any) {
            setError(err.message || 'Registration failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            setLoading(true);
            await signOut();
            setUser(null);
        } catch (err: any) {
            setError(err.message || 'Logout failed');
        } finally {
            setLoading(false);
        }
    };

    const clearError = () => setError(null);

    return (
        <AuthContext.Provider value={{ user, loading, error, login, register, logout, clearError }}>
            {children}
        </AuthContext.Provider>
    );
};
