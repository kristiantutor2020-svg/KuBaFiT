
import React, { useState, useEffect } from 'react';
import { Language, Currency, UserProfile, BusinessTransaction, AIInventoryPlan, WeightEntry } from './types';
import { AuthProvider, useAuth } from './components/AuthContext';
import { ThemeProvider } from './components/ThemeContext';
import Login from './components/Login';
import Register from './components/Register';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import InventoryPlanner from './components/InventoryPlanner';
import BusinessInsights from './components/BusinessInsights';
import Billing from './components/Billing';
import Settings from './components/Settings';
import AIChat from './components/AIChat';
import { saveUserData, loadUserData, getDefaultUserData, getWorkouts, UserData } from './services/db';
import WeightTracker from './components/WeightTracker';
import HikingPlanner from './components/HikingPlanner';
import WorkoutLibrary from './components/WorkoutLibrary';

// Main app content (when authenticated)
const AppContent: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [language, setLanguage] = useState<Language>(Language.RW);
  const [currency, setCurrency] = useState<Currency>(Currency.RWF);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: user?.displayName || '',
    inventoryVolume: 100,
    operationalScale: 1,
    businessGoal: 'Efficiency',
    marketFrequency: 'Moderate',
    githubUrl: ''
  });

  const [transactionHistory, setTransactionHistory] = useState<BusinessTransaction[]>([]);
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [currentPlan, setCurrentPlan] = useState<AIInventoryPlan | null>(null);

  // Load user data on mount
  useEffect(() => {
    if (user) {
      const loadData = async () => {
        const savedData = await Promise.resolve(loadUserData(user.uid));
        const plans = JSON.parse(localStorage.getItem(`kubafit_plans_${user.uid}`) || '[]');
        if (savedData) {
          setUserProfile(savedData.profile);
          setLanguage(savedData.language);
          // Force RWF for the rebranding
          setCurrency(Currency.RWF);
          setIsSubscribed(savedData.isSubscribed);
          setWeightEntries(savedData.weightEntries || []);
        } else {
          const defaults = getDefaultUserData(user.displayName);
          setUserProfile(defaults.profile);
          setLanguage(defaults.language);
          setCurrency(defaults.currency);
          setIsSubscribed(defaults.isSubscribed);
        }
        const transactions = await Promise.resolve(getWorkouts(user.uid));
        setTransactionHistory(transactions);
        setIsLoading(false);
      };
      loadData();
    }
  }, [user]);

  const triggerSync = async () => {
    if (!user) return;
    setIsSyncing(true);
    const data: UserData = {
      profile: userProfile,
      history: transactionHistory,
      weightEntries: weightEntries,
      language,
      currency,
      isSubscribed
    };
    await saveUserData(user.uid, data);
    setTimeout(() => setIsSyncing(false), 800);
  };

  // Auto-save when profile or settings change
  useEffect(() => {
    if (user && !isLoading) {
      const data: UserData = {
        profile: userProfile,
        history: transactionHistory,
        weightEntries: weightEntries,
        language,
        currency,
        isSubscribed
      };
      saveUserData(user.uid, data);
    }
  }, [userProfile, language, currency, isSubscribed, user, isLoading, transactionHistory, weightEntries]);

  const t = (en: string, rw: string) => language === Language.EN ? en : rw;

  const handleLogout = async () => {
    await logout();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard history={transactionHistory} profile={userProfile} language={language} onNavigate={setActiveTab} />;
      case 'ai-agent':
        return <AIChat language={language} />;
      case 'planner':
        return <InventoryPlanner
          profile={userProfile}
          setProfile={setUserProfile}
          currentPlan={currentPlan}
          setCurrentPlan={setCurrentPlan}
          language={language}
          isSubscribed={isSubscribed}
          onNavigate={setActiveTab}
        />;
      case 'insights':
        return <BusinessInsights profile={userProfile} history={transactionHistory} language={language} isSubscribed={isSubscribed} />;
      case 'billing':
        return <Billing currency={currency} isSubscribed={isSubscribed} setIsSubscribed={setIsSubscribed} language={language} />;
      case 'weight':
        return <WeightTracker language={language} profile={userProfile} entries={weightEntries} setEntries={setWeightEntries} />;
      case 'hiking':
        return <HikingPlanner language={language} profile={userProfile} />;
      case 'library':
        return <WorkoutLibrary language={language} profile={userProfile} />;
      case 'settings':
        return <Settings
          language={language}
          setLanguage={setLanguage}
          currency={currency}
          setCurrency={setCurrency}
          profile={userProfile}
          setProfile={setUserProfile}
          onSave={triggerSync}
        />;
      default:
        return <Dashboard history={transactionHistory} profile={userProfile} language={language} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-emerald-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-slate-500">{t('Loading your data...', 'Ibirimo gutunganya...')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} language={language} profile={userProfile} />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-24 md:pb-8">
        <header className="flex flex-wrap justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {t('Welcome back', 'Murakaza neza')}, {userProfile.name || user?.displayName}!
            </h1>
            <p className="text-slate-500 flex items-center">
              {t('Your business journey continues.', 'Urugendo rwawe rw\'ubucuruzi rurakomeje.')}
              {isSyncing && (
                <span className="ml-3 flex items-center text-xs text-emerald-600 animate-pulse">
                  <svg className="w-3 h-3 mr-1 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 4V2m0 20v-2m8-8h2M2 12h2m13.66-5.66l1.41-1.41M5.66 17.66l-1.41 1.41M18.34 17.66l1.41 1.41M5.66 5.66L4.25 4.25" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  {t('Syncing...', 'Ikirimo kubikwa...')}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={triggerSync}
              className="p-2 text-slate-400 hover:text-emerald-600 transition-colors bg-white rounded-full shadow-sm border border-slate-100"
              title={t('Sync Now', 'Bika ubu')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </button>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-500 transition-colors bg-white rounded-full shadow-sm border border-slate-100"
              title={t('Sign Out', 'Sohoka')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
              {isSubscribed ? t('Premium', 'Ibirenze') : t('Free Plan', 'Ubuntu')}
            </span>
          </div>
        </header>
        {renderContent()}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 glass border-t border-slate-200 flex justify-around p-3 md:hidden z-50">
        <button onClick={() => setActiveTab('dashboard')} className={`p-2 rounded-lg ${activeTab === 'dashboard' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-500'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
        </button>
        <button onClick={() => setActiveTab('ai-agent')} className={`p-2 rounded-lg ${activeTab === 'ai-agent' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-500'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        </button>
        <button onClick={() => setActiveTab('planner')} className={`p-2 rounded-lg ${activeTab === 'planner' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-500'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
        </button>
        <button onClick={() => setActiveTab('insights')} className={`p-2 rounded-lg ${activeTab === 'insights' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-500'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2" /></svg>
        </button>
        <button onClick={() => setActiveTab('settings')} className={`p-2 rounded-lg ${activeTab === 'settings' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-500'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        </button>
      </nav>
    </div>
  );
};

// Auth wrapper component
const AuthWrapper: React.FC = () => {
  const { user, loading, clearError } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [language] = useState<Language>(Language.RW);

  const switchToLogin = () => {
    clearError();
    setAuthView('login');
  };

  const switchToRegister = () => {
    clearError();
    setAuthView('register');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg mb-4 animate-pulse">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <p className="text-slate-500">KuBaFit</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (authView === 'register') {
      return <Register language={language} onSwitchToLogin={switchToLogin} />;
    }
    return <Login language={language} onSwitchToRegister={switchToRegister} />;
  }

  return <AppContent />;
};

// Root App component
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AuthWrapper />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
