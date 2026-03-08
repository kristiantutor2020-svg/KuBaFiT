import React from 'react';
import { PerformanceStats, Language } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PerformanceMetricProps {
    stats: PerformanceStats;
    language: Language;
}

const PerformanceMetric: React.FC<PerformanceMetricProps> = ({ stats, language }) => {
    const t = (en: string, rw: string) => language === Language.EN ? en : rw;

    const getStatusColor = (form: number) => {
        if (form > 5) return 'text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30';
        if (form < -15) return 'text-rose-500 bg-rose-100 dark:bg-rose-900/30';
        return 'text-indigo-500 bg-indigo-100 dark:bg-indigo-900/30';
    };

    const getStatusLabel = (form: number) => {
        if (form > 5) return t('Fresh', 'Agarutse imbaraga');
        if (form < -15) return t('Overreaching', 'Ananiwe cyane');
        return t('Productive', 'Arimo gukora neza');
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">{t('Training Load', 'Umutwaro w\'imyitozo')}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t('Relative Effort Over Time', 'Urugero rw\'ingufu ukoresha')}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(stats.formLevel)}`}>
                    {getStatusLabel(stats.formLevel)}
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{t('Fitness', 'Ubuzima')}</p>
                    <p className="text-2xl font-black text-slate-800 dark:text-white">{stats.fitnessLevel}</p>
                </div>
                <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{t('Fatigue', 'Umunaniro')}</p>
                    <p className="text-2xl font-black text-rose-500">{stats.fatigueLevel}</p>
                </div>
                <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{t('Form', 'Uko uhagaze')}</p>
                    <p className={`text-2xl font-black ${stats.formLevel >= 0 ? 'text-emerald-500' : 'text-indigo-500'}`}>
                        {stats.formLevel > 0 ? `+${stats.formLevel}` : stats.formLevel}
                    </p>
                </div>
            </div>

            <div className="flex-1 min-h-[150px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.relativeEffortHistory}>
                        <defs>
                            <linearGradient id="colorEffort" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="date" hide />
                        <YAxis hide />
                        <Tooltip
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)' }}
                            labelClassName="font-bold text-slate-800"
                        />
                        <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorEffort)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
                    {t(
                        "Your training load is currently productive. You're building fitness without excessive fatigue.",
                        "Umutwaro w'imyitozo yawe urimo gukora neza. Uri kubaka amagara yawe utaniwe cyane."
                    )}
                </p>
            </div>
        </div>
    );
};

export default PerformanceMetric;
