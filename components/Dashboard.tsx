import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BusinessTransaction, UserProfile, Language, AIInventoryPlan, HealthData, AthleticActivity, PerformanceStats } from '../types';
import { useAuth } from './AuthContext';
import ActivityRings from './ActivityRings';
import HealthModule from './HealthModule';
import ActivityFeed from './ActivityFeed';
import PerformanceMetric from './PerformanceMetric';

interface DashboardProps {
  history: BusinessTransaction[];
  profile: UserProfile;
  language: Language;
  onNavigate?: (tab: string) => void;
}

interface SavedPlan extends AIInventoryPlan {
  id: string;
  createdAt: string;
}

const Dashboard: React.FC<DashboardProps> = ({ history, profile, language, onNavigate }) => {
  const { user } = useAuth();
  const t = (en: string, rw: string) => language === Language.EN ? en : rw;

  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedPlan, setSelectedPlan] = useState<SavedPlan | null>(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedDateWorkouts, setSelectedDateWorkouts] = useState<BusinessTransaction[]>([]);
  const [showDateModal, setShowDateModal] = useState(false);
  const [selectedDateStr, setSelectedDateStr] = useState('');

  // Mock Health Data (In a real app, this would come from a context/store or iWatch API)
  const [healthData, setHealthData] = useState<HealthData>({
    activity: {
      move: 85,
      exercise: 70,
      stand: 90,
      calories: 420,
      exerciseMinutes: 42,
      standHours: 11
    },
    heartRate: {
      current: 72,
      min: 58,
      max: 145,
      history: [
        { time: '08:00', value: 65 },
        { time: '10:00', value: 85 },
        { time: '12:00', value: 72 },
        { time: '14:00', value: 110 },
        { time: '16:00', value: 75 },
      ]
    },
    sleep: {
      totalDuration: 442,
      stages: [
        { stage: 'Awake', duration: 15 },
        { stage: 'REM', duration: 90 },
        { stage: 'Core', duration: 250 },
        { stage: 'Deep', duration: 87 },
      ]
    }
  });

  // Mock Athletics & Performance Data
  const [athleticActivities] = useState<AthleticActivity[]>([
    {
      id: 'strava_1',
      name: 'Evening Trail Run in Kigali',
      type: 'Run',
      startDate: 'Yesterday',
      distance: 8200,
      movingTime: 2880,
      elapsedTime: 3100,
      totalElevationGain: 120,
      mapPolyline: 'points...',
      relativeEffort: 42,
      kudosCount: 12,
      commentCount: 2,
      photoUrl: 'https://images.unsplash.com/photo-1594882645126-14020914d58d?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'strava_2',
      name: 'Morning Ride to Lake Kivu',
      type: 'Ride',
      startDate: '2 days ago',
      distance: 45000,
      movingTime: 7200,
      elapsedTime: 8400,
      totalElevationGain: 850,
      mapPolyline: 'points...',
      relativeEffort: 110,
      kudosCount: 45,
      commentCount: 8
    }
  ]);

  const [performanceStats] = useState<PerformanceStats>({
    relativeEffortHistory: [
      { date: 'Mon', value: 20 },
      { date: 'Tue', value: 45 },
      { date: 'Wed', value: 10 },
      { date: 'Thu', value: 85 },
      { date: 'Fri', value: 30 },
      { date: 'Sat', value: 120 },
      { date: 'Sun', value: 50 },
    ],
    fitnessLevel: 68,
    fatigueLevel: 42,
    formLevel: 26
  });


  // Load saved plans
  useEffect(() => {
    if (user) {
      const plans = JSON.parse(localStorage.getItem(`kubafit_plans_${user.uid}`) || '[]');
      setSavedPlans(plans);
    }
  }, [user]);

  // Get today's workout from the active plan
  const getTodayWorkout = () => {
    if (savedPlans.length === 0) return null;
    const activePlan = savedPlans[savedPlans.length - 1];
    const dayOfWeek = new Date().getDay();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = dayNames[dayOfWeek];
    return activePlan.phases?.find(p => p.phase.toLowerCase() === todayName.toLowerCase()) || activePlan.phases?.[0];
  };

  const todayWorkout = getTodayWorkout();

  // Calendar logic
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const days: (number | null)[] = [];
    for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  };

  const getWorkoutsForDate = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return history.filter(w => w.date === dateStr);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && currentMonth.getMonth() === today.getMonth() && currentMonth.getFullYear() === today.getFullYear();
  };

  const handleDateClick = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const workouts = getWorkoutsForDate(day);
    setSelectedDateStr(dateStr);
    setSelectedDateWorkouts(workouts);
    setShowDateModal(true);
  };

  const handlePlanClick = (plan: SavedPlan) => {
    setSelectedPlan(plan);
    setShowPlanModal(true);
  };

  const handleGoToAIAgent = () => {
    if (onNavigate) onNavigate('ai-agent');
  };

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

  const monthNames = language === Language.EN
    ? ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    : ['Mutarama', 'Gashyantare', 'Werurwe', 'Mata', 'Gicurasi', 'Kamena', 'Nyakanga', 'Kanama', 'Nzeri', 'Ukwakira', 'Ugushyingo', 'Ukuboza'];

  const dayNames = language === Language.EN
    ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    : ['Cyu', 'Mbe', 'Kab', 'Gat', 'Kan', 'Gat', 'Muk'];

  // Stats
  const performanceRate = 85; // Fixed score for now
  const totalRevenue = history.reduce((acc, curr) => acc + curr.amount, 0);
  const totalTransactions = history.length;

  // Weekly chart data
  const weekDays = language === Language.EN ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] : ['Mbe', 'Kab', 'Gat', 'Kan', 'Gat', 'Gat', 'Cyu'];
  const chartData = weekDays.map((day, idx) => ({
    name: day,
    amount: history[idx]?.amount || 0,
    isToday: idx === (new Date().getDay() + 6) % 7
  }));

  const statCards = [
    { label: t('Inventory', 'Ibikoresho'), value: profile.inventoryVolume > 0 ? `${profile.inventoryVolume}` : '0', unit: 'units', gradient: 'from-emerald-500 to-teal-600' },
    { label: t('Efficiency', 'Umusaruro'), value: `${performanceRate}%`, unit: '', gradient: 'from-orange-500 to-amber-600' },
    { label: t('Transactions', 'Ibikorwa'), value: `${totalTransactions}`, unit: '', gradient: 'from-blue-500 to-indigo-600' },
    { label: t('Revenue', 'Inyungu'), value: `${totalRevenue.toLocaleString()}`, unit: 'RWF', gradient: 'from-rose-500 to-pink-600' },
  ];

  return (
    <div className="space-y-8">
      {/* Activity Overview Header */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-1">
            {t('Good Evening', 'Bugenewe umugoroba mwiza')}, {profile.name}!
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            {t("Here's your business and health status for today.", "Dore uko ubucuruzi n'ubuzima byawe bihagaze uyu munsi.")}
          </p>
        </div>
        <ActivityRings data={healthData.activity} language={language} />
      </div>

      {/* Feature Summaries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Weight Tracker Summary */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between group hover:border-indigo-200 transition-all cursor-pointer" onClick={() => onNavigate && onNavigate('weight-tracker')}>
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Weight Progress</p>
              <h3 className="text-xl font-black text-slate-800">{profile.weight || '--'} <span className="text-xs font-normal text-slate-400">kg</span></h3>
            </div>
          </div>
          <div className="flex items-center text-indigo-600 font-bold text-xs">
            <span>{t('View Trends', 'Reba imiterere')}</span>
            <svg className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </div>
        </div>

        {/* Hiking Planner Summary */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between group hover:border-emerald-200 transition-all cursor-pointer" onClick={() => onNavigate && onNavigate('hiking-planner')}>
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" /></svg>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Next Adventure</p>
              <h3 className="text-xl font-black text-slate-800">Bisoke <span className="text-xs font-normal text-slate-400">3711m</span></h3>
            </div>
          </div>
          <div className="flex items-center text-emerald-600 font-bold text-xs">
            <span>{t('Plan Trail', 'Tegura urugendo')}</span>
            <svg className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </div>
        </div>

        {/* Workout Library Summary */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between group hover:border-orange-200 transition-all cursor-pointer" onClick={() => onNavigate && onNavigate('workout-library')}>
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl group-hover:bg-orange-600 group-hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Daily Workout</p>
              <h3 className="text-xl font-black text-slate-800">HIIT Flow <span className="text-xs font-normal text-slate-400">15m</span></h3>
            </div>
          </div>
          <div className="flex items-center text-orange-600 font-bold text-xs">
            <span>{t('Start Training', 'Tangira siporo')}</span>
            <svg className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </div>
        </div>
      </div>

      {/* Plan Detail Modal */}
      {showPlanModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowPlanModal(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-800">{selectedPlan.title}</h2>
              <button onClick={() => setShowPlanModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-slate-600 mb-4">{selectedPlan.description}</p>
            <div className="space-y-4">
              {selectedPlan.phases?.map((phase, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-xl">
                  <h4 className="font-semibold text-slate-800 mb-2">{phase.phase}</h4>
                  <div className="space-y-2">
                    {phase.actions?.map((act, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-emerald-50 transition-colors"
                      >
                        <span className="text-slate-700">{act.name}</span>
                        <span className="text-slate-500">{act.batches} × {act.target}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => { setShowPlanModal(false); handleGoToAIAgent(); }}
              className="w-full mt-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-teal-700 transition-all"
            >
              {t('Modify with AI Agent', 'Hindura na Agent ya AI')}
            </button>
          </div>
        </div>
      )}

      {/* Date Workouts Modal */}
      {showDateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDateModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800">{selectedDateStr}</h2>
              <button onClick={() => setShowDateModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {selectedDateWorkouts.length > 0 ? (
              <div className="space-y-3">
                {selectedDateWorkouts.map((workout, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-800">{workout.type}</p>
                        <p className="text-sm text-slate-500">{workout.units} units</p>
                      </div>
                      <span className="font-bold text-emerald-600">{workout.amount.toLocaleString()} RWF</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-500">{t('No transactions on this day', 'Nta bikorwa kuri uyu munsi')}</p>
                <button
                  onClick={() => { setShowDateModal(false); handleGoToAIAgent(); }}
                  className="mt-4 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg font-medium hover:bg-emerald-200 transition-colors"
                >
                  {t('Log a Transaction', 'Andika igikorwa')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}


      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <div
            key={idx}
            onClick={() => onNavigate && onNavigate('insights')}
            className={`relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-6 translate-x-6" />
            <p className="text-white/80 text-xs uppercase font-medium tracking-wide">{stat.label}</p>
            <div className="flex items-baseline mt-1">
              <span className="text-3xl font-bold">{stat.value}</span>
              {stat.unit && <span className="ml-1 text-white/70 text-sm">{stat.unit}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Widget */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800">{t('Calendar', 'Karendari')}</h3>
            <div className="flex items-center gap-2">
              <button onClick={prevMonth} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="text-sm font-medium text-slate-700 min-w-[120px] text-center">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </span>
              <button onClick={nextMonth} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day, idx) => (
              <div key={idx} className="text-center text-xs font-medium text-slate-400 py-1">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth(currentMonth).map((day, idx) => {
              const workouts = day ? getWorkoutsForDate(day) : [];
              const hasWorkout = workouts.length > 0;
              const isTodayDate = day ? isToday(day) : false;
              return (
                <div
                  key={idx}
                  onClick={() => day && handleDateClick(day)}
                  className={`aspect-square flex flex-col items-center justify-center rounded-lg text-sm cursor-pointer transition-all ${day === null ? '' :
                    isTodayDate ? 'bg-emerald-500 text-white font-bold hover:bg-emerald-600' :
                      hasWorkout ? 'bg-emerald-100 text-emerald-700 font-medium hover:bg-emerald-200' :
                        'hover:bg-slate-100 text-slate-600'
                    }`}
                >
                  {day && (
                    <>
                      <span>{day}</span>
                      {hasWorkout && !isTodayDate && <span className="w-1 h-1 rounded-full bg-emerald-500 mt-0.5" />}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Today's Workout Widget */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800">{t("Today's Actions", "Ibikorwa by'uyu munsi")}</h3>
            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
              {new Date().toLocaleDateString(language === Language.EN ? 'en-US' : 'rw-RW', { weekday: 'short' })}
            </span>
          </div>
          {todayWorkout ? (
            <div className="space-y-3">
              {todayWorkout.actions?.slice(0, 4).map((action, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${idx === 0 ? 'bg-emerald-100 text-emerald-600' :
                      idx === 1 ? 'bg-blue-100 text-blue-600' :
                        idx === 2 ? 'bg-orange-100 text-orange-600' : 'bg-purple-100 text-purple-600'
                      }`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 text-sm">{action.name}</p>
                      <p className="text-xs text-slate-500">{action.batches} batches × {action.target}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">{action.frequency}</span>
                </div>
              ))}
              {todayWorkout.actions && todayWorkout.actions.length > 4 && (
                <button onClick={handleGoToAIAgent} className="w-full text-center text-sm text-emerald-600 font-medium hover:text-emerald-700">
                  +{todayWorkout.actions.length - 4} {t('more actions', 'izindi')}
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <button
                onClick={handleGoToAIAgent}
                className="w-16 h-16 bg-slate-100 hover:bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors cursor-pointer group"
              >
                <svg className="w-8 h-8 text-slate-400 group-hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
              <p className="text-slate-500 text-sm">{t('No inventory strategy yet', 'Nta gahunda yarekozwe')}</p>
              <button onClick={handleGoToAIAgent} className="text-emerald-600 text-xs mt-1 font-medium hover:text-emerald-700">
                {t('Ask AI to create one!', 'Saba AI akukorere!')}
              </button>
            </div>
          )}
        </div>

        {/* Activity Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800">{t('Weekly Revenue', "Inyungu y'icyumweru")}</h3>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis hide />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.2)' }} />
                <Bar dataKey="amount" radius={[6, 6, 6, 6]} maxBarSize={35}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.isToday ? '#10B981' : '#E2E8F0'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Saved Plans + Scheduled */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Plans */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800">{t('Strategies', 'Igenamigambi')}</h3>
            <button
              onClick={handleGoToAIAgent}
              className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-lg hover:bg-emerald-200 transition-colors"
            >
              + {t('New', 'Nshya')}
            </button>
          </div>
          {savedPlans.length > 0 ? (
            <div className="space-y-3">
              {savedPlans.slice(-3).reverse().map((plan, idx) => (
                <div
                  key={plan.id}
                  onClick={() => handlePlanClick(plan)}
                  className="p-4 rounded-xl bg-slate-50 hover:bg-emerald-50 transition-colors cursor-pointer border border-transparent hover:border-emerald-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-800">{plan.title}</h4>
                      <p className="text-sm text-slate-500 mt-1 line-clamp-1">{plan.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-slate-400">{plan.phases?.length || 0} {t('phases', 'ibice')}</span>
                        <span className="text-xs text-slate-400">{new Date(plan.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${idx === 0 ? 'bg-emerald-100 text-emerald-600' :
                      idx === 1 ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
                      }`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-slate-500 text-sm">{t('No strategies saved', 'Nta gahunda yabitswe')}</p>
              <button onClick={handleGoToAIAgent} className="text-emerald-600 text-xs mt-1 font-medium hover:text-emerald-700">
                {t('Create a strategy with AI Agent', 'Kora gahunda na AI Agent')}
              </button>
            </div>
          )}
        </div>

        {/* Scheduled Workouts */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800">{t('Scheduled', 'Byateganyijwe')}</h3>
          </div>
          <div className="space-y-2">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, idx) => {
              const activePlan = savedPlans[savedPlans.length - 1];
              const dayWorkout = activePlan?.phases?.find(p => p.phase.toLowerCase() === day.toLowerCase());
              const dayInKiny = ['Kuwa mbere', 'Kuwa kabiri', 'Kuwa gatatu', 'Kuwa kane', 'Kuwa gatanu'][idx];
              const isCurrentDay = new Date().getDay() === idx + 1;
              return (
                <div
                  key={day}
                  onClick={() => dayWorkout && activePlan && handlePlanClick(activePlan)}
                  className={`flex items-center justify-between p-3 rounded-xl transition-colors cursor-pointer ${isCurrentDay ? 'bg-emerald-50 border border-emerald-200 hover:bg-emerald-100' : 'bg-slate-50 hover:bg-slate-100'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isCurrentDay ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                      <span className="text-xs font-bold">{day.slice(0, 2)}</span>
                    </div>
                    <div>
                      <p className={`font-medium text-sm ${isCurrentDay ? 'text-emerald-700' : 'text-slate-700'}`}>
                        {language === Language.EN ? day : dayInKiny}
                      </p>
                      <p className="text-xs text-slate-500">
                        {dayWorkout ? `${dayWorkout.actions?.length || 0} ${t('actions', 'ibikorwa')}` : t('Review day', 'Umunsi wo gusuzuma')}
                      </p>
                    </div>
                  </div>
                  {isCurrentDay && <span className="text-xs font-medium text-emerald-600">{t('Today', 'Uyu munsi')}</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800">{t('Recent Transactions', 'Ibyo wakoze vuba')}</h3>
          <button onClick={() => onNavigate && onNavigate('insights')} className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
            {t('View All', 'Reba byose')}
          </button>
        </div>
        {history.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {history.slice(-4).reverse().map((item, idx) => (
              <div key={item.id} onClick={() => onNavigate && onNavigate('insights')} className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${idx === 0 ? 'bg-emerald-100 text-emerald-600' :
                    idx === 1 ? 'bg-blue-100 text-blue-600' :
                      idx === 2 ? 'bg-orange-100 text-orange-600' : 'bg-rose-100 text-rose-600'
                    }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{item.type}</p>
                    <p className="text-xs text-slate-500">{item.date}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">{item.units} units</span>
                  <span className="font-bold text-emerald-600">{item.amount.toLocaleString()} RWF</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-500">{t('No transactions logged yet', 'Nta bikorwa byanditswe')}</p>
            <button onClick={handleGoToAIAgent} className="text-emerald-600 text-sm mt-2 font-medium hover:text-emerald-700">
              {t('Log your first transaction with AI Agent', 'Andika igikorwa cyawe cya mbere')}
            </button>
          </div>
        )}
      </div>

      {/* Health & Metrics Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            {t('Health & Wellbeing', 'Ubuzima n\'Imibereho')}
          </h2>
        </div>
        <HealthModule
          data={healthData}
          profile={profile}
          setProfile={(p) => onNavigate && onNavigate('settings')}
          language={language}
        />
      </div>

      {/* Athletics Section */}
      <div className="pt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            {t('Athletics & Performance', 'Imikino n\'Umusaruro')}
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActivityFeed activities={athleticActivities} language={language} />
          <PerformanceMetric stats={performanceStats} language={language} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
