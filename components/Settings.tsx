
import React from 'react';
import { Language, Currency, UserProfile } from '../types';
import { useTheme } from './ThemeContext';

interface SettingsProps {
  language: Language;
  setLanguage: (l: Language) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
  onSave: () => void;
}

const Settings: React.FC<SettingsProps> = ({
  language,
  setLanguage,
  currency,
  setCurrency,
  profile,
  setProfile,
  onSave
}) => {
  const t = (en: string, rw: string) => language === Language.EN ? en : rw;
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('Preferences', 'Igenamiterere')}</h2>
          <button
            onClick={onSave}
            className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
          >
            {t('Save All Changes', 'Bika Imihindukire Yose')}
          </button>
        </div>

        <div className="space-y-8">
          {/* Dark Mode Toggle */}
          <div className="p-6 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-900 dark:bg-yellow-400 rounded-lg flex items-center justify-center text-white dark:text-slate-900 transition-colors">
                  {isDark ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white">
                    {t('Dark Mode', 'Uburyo bw\'icyitso cyijoro')}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isDark ? t('Currently dark', 'Ubu ni icyitso cyijoro') : t('Currently light', 'Ubu ni icyitso cy\'umurango')}
                  </p>
                </div>
              </div>
              {/* Toggle switch */}
              <button
                onClick={toggleTheme}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${isDark ? 'bg-indigo-600' : 'bg-slate-200'
                  }`}
                role="switch"
                aria-checked={isDark}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200 ${isDark ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
              </button>
            </div>
          </div>

          {/* GitHub Integration Section */}
          <div className="p-6 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-600">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white mr-4">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white">{t('GitHub Account', 'Kontu ya GitHub')}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t('Link your GitHub to sync and save your code logs.', 'Huza GitHub yawe kugirango ubike amakuru yawe.')}</p>
              </div>
            </div>
            <input
              type="url"
              placeholder="https://github.com/username"
              value={profile.githubUrl || ''}
              onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })}
              className="w-full px-4 py-3 bg-white dark:bg-slate-700 dark:text-white border border-slate-200 dark:border-slate-500 rounded-xl outline-none focus:border-indigo-500 transition-all text-sm"
            />
          </div>

          {/* Health Metrics Section */}
          <div className="p-6 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-600">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-rose-500 rounded-lg flex items-center justify-center text-white mr-4">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white">{t('Personal Wellbeing', 'Ubuzima bwawe')}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t('Track your height and weight for BMI calculations.', 'Gira amakuru y\'uburebure n\'ibiro byawe.')}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">{t('Weight (kg)', 'Ibiro (kg)')}</label>
                <input
                  type="number"
                  value={profile.weight || ''}
                  onChange={(e) => setProfile({ ...profile, weight: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-700 dark:text-white border border-slate-200 dark:border-slate-500 rounded-xl outline-none focus:border-indigo-500 transition-all text-sm font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">{t('Height (cm)', 'Uburebure (cm)')}</label>
                <input
                  type="number"
                  value={profile.height || ''}
                  onChange={(e) => setProfile({ ...profile, height: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-700 dark:text-white border border-slate-200 dark:border-slate-500 rounded-xl outline-none focus:border-indigo-500 transition-all text-sm font-bold"
                />
              </div>
            </div>
            <div className="mt-4 space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">{t('Health Goal', 'Intego y\'ubuzima')}</label>
              <input
                type="text"
                value={profile.healthGoal || ''}
                onChange={(e) => setProfile({ ...profile, healthGoal: e.target.value })}
                placeholder={t('e.g. Lose weight, Run 5k', 'Urugero: Kugabanya ibiro')}
                className="w-full px-4 py-3 bg-white dark:bg-slate-700 dark:text-white border border-slate-200 dark:border-slate-500 rounded-xl outline-none focus:border-indigo-500 transition-all text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-800 dark:text-white mb-4">{t('Language', 'Ururimi')}</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setLanguage(Language.EN)}
                className={`p-4 rounded-xl border-2 transition-all flex items-center justify-between ${language === Language.EN ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 shadow-sm' : 'border-slate-100 dark:border-slate-600 hover:border-slate-200 bg-white dark:bg-slate-700'}`}
              >
                <div className="flex flex-col items-start">
                  <span className="font-semibold text-slate-900 dark:text-white">English</span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-tighter">Global Standard</span>
                </div>
                {language === Language.EN && <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>}
              </button>
              <button
                onClick={() => setLanguage(Language.RW)}
                className={`p-4 rounded-xl border-2 transition-all flex items-center justify-between ${language === Language.RW ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 shadow-sm' : 'border-slate-100 dark:border-slate-600 hover:border-slate-200 bg-white dark:bg-slate-700'}`}
              >
                <div className="flex flex-col items-start">
                  <span className="font-semibold text-slate-900 dark:text-white">Kinyarwanda</span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-tighter">Ikaraze mu Rugo</span>
                </div>
                {language === Language.RW && <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-800 dark:text-white mb-4">{t('Currency', 'Ifaranga')}</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[Currency.RWF, Currency.USD, Currency.GBP].map((curr) => (
                <button
                  key={curr}
                  onClick={() => setCurrency(curr)}
                  className={`p-4 rounded-xl border-2 transition-all flex items-center justify-between ${currency === curr ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 shadow-sm' : 'border-slate-100 dark:border-slate-600 hover:border-slate-200 bg-white dark:bg-slate-700'}`}
                >
                  <span className="font-semibold text-slate-900 dark:text-white">{curr}</span>
                  {currency === curr && <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 dark:border-slate-600">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs text-slate-400">KuBaFit v1.2.0 🌍</p>
              <div className="flex items-center text-xs text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-800">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                {t('Secure & Local', 'Ibyo Utuye Nibizima')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
