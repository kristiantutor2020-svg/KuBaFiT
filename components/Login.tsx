import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { Language } from '../types';

interface LoginProps {
    language: Language;
    onSwitchToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ language, onSwitchToRegister }) => {
    const { login, error, loading, clearError } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [localError, setLocalError] = useState('');

    const t = (en: string, rw: string) => (language === Language.EN ? en : rw);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError('');
        clearError();

        if (!email || !password) {
            setLocalError(t('Please fill in all fields', 'Uzuza imyanya yose'));
            return;
        }

        try {
            await login(email, password);
        } catch {
            // Error is handled by context
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4">
            <div className="w-full max-w-md">
                {/* Logo & Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800">KuBaFit</h1>
                    <p className="text-slate-500 mt-2">{t("AI Sport & Business Agent", "Umukozi w'ikoranabuhanga mu mikino n'ubucuruzi")}</p>
                </div>

                {/* Login Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/50">
                    <h2 className="text-xl font-semibold text-slate-800 mb-6">{t('Welcome Back', 'Murakaza neza')}</h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                {t('Email', 'Imeyili')}
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white/50"
                                placeholder={t('your@email.com', 'imeyili@yawe.com')}
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                {t('Password', 'Ijambo ry\'ibanga')}
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white/50"
                                placeholder="••••••••"
                            />
                        </div>

                        {/* Error Message */}
                        {(error || localError) && (
                            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center">
                                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {error || localError}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    {t('Signing in...', 'Kwinjira...')}
                                </>
                            ) : (
                                t('Sign In', 'Injira')
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white/80 text-slate-500">{t('or', 'cyangwa')}</span>
                        </div>
                    </div>

                    {/* Switch to Register */}
                    <p className="text-center text-slate-600">
                        {t("Don't have an account?", 'Ntabwo ufite konti?')}{' '}
                        <button
                            onClick={onSwitchToRegister}
                            className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
                        >
                            {t('Create one', 'Fungura')}
                        </button>
                    </p>
                </div>

                {/* Footer */}
                <p className="text-center text-slate-400 text-sm mt-6">
                    © 2026 KuBaFit. {t('All rights reserved.', 'Uburenganzira bwose burabitswe.')}
                </p>
            </div>
        </div>
    );
};

export default Login;
