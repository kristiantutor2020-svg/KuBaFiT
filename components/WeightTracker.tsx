
import React, { useState } from 'react';
import { Language, UserProfile, WeightEntry } from '../types';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, AreaChart, Area
} from 'recharts';

interface WeightTrackerProps {
    language: Language;
    profile: UserProfile;
    entries: WeightEntry[];
    setEntries: (entries: WeightEntry[]) => void;
}

const WeightTracker: React.FC<WeightTrackerProps> = ({
    language,
    profile,
    entries,
    setEntries
}) => {
    const [newWeight, setNewWeight] = useState('');
    const [newNote, setNewNote] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const t = (en: string, rw: string) => language === Language.EN ? en : rw;

    const handleAddEntry = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newWeight) return;

        const entry: WeightEntry = {
            id: `weight_${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            weight: parseFloat(newWeight),
            notes: newNote
        };

        setEntries([...entries, entry].sort((a, b) => a.date.localeCompare(b.date)));
        setNewWeight('');
        setNewNote('');
        setIsAdding(false);
    };

    // Calculate BMI if height is available
    const calculateBMI = (weight: number) => {
        if (!profile.height) return null;
        const heightInMeters = profile.height / 100;
        return (weight / (heightInMeters * heightInMeters)).toFixed(1);
    };

    const currentWeight = entries.length > 0 ? entries[entries.length - 1].weight : profile.weight || 0;
    const bmi = calculateBMI(currentWeight);

    const getBMICategory = (bmiValue: number) => {
        if (bmiValue < 18.5) return { label: t('Underweight', 'Ibiro bike'), color: 'text-amber-500' };
        if (bmiValue < 25) return { label: t('Normal', 'Ibiro bikwiriye'), color: 'text-emerald-500' };
        if (bmiValue < 30) return { label: t('Overweight', 'Ibiro byinshi'), color: 'text-orange-500' };
        return { label: t('Obese', 'Ibiro bikabije'), color: 'text-red-500' };
    };

    const bmiInfo = bmi ? getBMICategory(parseFloat(bmi)) : null;

    // Prepare chart data
    const chartData = entries.map(e => ({
        date: new Date(e.date).toLocaleDateString(language === Language.EN ? 'en-US' : 'rw-RW', { month: 'short', day: 'numeric' }),
        weight: e.weight
    }));

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center space-x-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('Current Weight', 'Ibiro ubu')}</p>
                        <h3 className="text-2xl font-black text-slate-800">{currentWeight} <span className="text-sm font-normal text-slate-400">kg</span></h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center space-x-4">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">BMI</p>
                        <div className="flex items-baseline space-x-2">
                            <h3 className="text-2xl font-black text-slate-800">{bmi || '--'}</h3>
                            {bmiInfo && <span className={`text-xs font-bold ${bmiInfo.color}`}>{bmiInfo.label}</span>}
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => setIsAdding(true)}
                    className="bg-indigo-600 p-6 rounded-3xl shadow-lg shadow-indigo-100 flex items-center justify-center space-x-3 text-white hover:bg-indigo-700 transition-all group"
                >
                    <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    <span className="font-bold">{t('Add Entry', 'Andika ibiro ubu')}</span>
                </button>
            </div>

            {/* Main Chart Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-bold text-slate-800">{t('Weight Trend', 'Uko ibiro bihinduka')}</h3>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('Last 30 Days', 'Iminsi 30 ishize')}</span>
                    </div>

                    <div className="h-[300px] w-full">
                        {entries.length > 1 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                                        domain={['dataMin - 2', 'dataMax + 2']}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                        itemStyle={{ fontWeight: 'bold', color: '#4f46e5' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="weight"
                                        stroke="#4f46e5"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorWeight)"
                                        animationDuration={1500}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-3">
                                <svg className="w-12 h-12 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2" /></svg>
                                <p className="text-sm">{t('More data needed for chart', 'Ukeneye andi makuru kugira ngo ubone imbonerahamwe')}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                    <h3 className="text-xl font-bold text-slate-800 mb-6">{t('Recent Log', 'Ibyanditswe vuba')}</h3>
                    <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                        {entries.length > 0 ? (
                            entries.slice().reverse().map((entry) => (
                                <div key={entry.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-indigo-200 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-lg font-black text-slate-800">{entry.weight}<span className="text-xs font-normal text-slate-400 ml-1">kg</span></p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{entry.date}</p>
                                        </div>
                                        <button className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                    {entry.notes && (
                                        <p className="text-xs text-slate-500 mt-2 italic">"{entry.notes}"</p>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-slate-400 italic text-center py-10">{t('No entries yet', 'Nta biro byari byandikwa')}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Modal */}
            {isAdding && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-slate-50 bg-indigo-600 text-white">
                            <h2 className="text-2xl font-bold">{t('Log Weight', 'Andika ibiro hashya')}</h2>
                            <p className="text-indigo-100 text-sm mt-1">{t('Track your progress towards your goals.', 'Kurikira uko uhinduka kugira ngo ugere ku ntego zawe.')}</p>
                        </div>

                        <form onSubmit={handleAddEntry} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t('Current Weight (kg)', 'Ibiro uyu munsi (kg)')}</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="0.1"
                                        autoFocus
                                        required
                                        value={newWeight}
                                        onChange={(e) => setNewWeight(e.target.value)}
                                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 text-2xl font-black text-slate-800"
                                        placeholder="75.5"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">kg</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t('Notes (Optional)', 'Andika hano (Niba ubishaka)')}</label>
                                <textarea
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 min-h-[100px] text-slate-600"
                                    placeholder={t('feeling energetic!', 'ndimva mfite ingufu!')}
                                />
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsAdding(false)}
                                    className="flex-1 py-4 px-6 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-colors"
                                >
                                    {t('Cancel', 'Hagarika')}
                                </button>
                                <button
                                    type="submit"
                                    className="flex-2 py-4 px-10 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                                >
                                    {t('Save Entry', 'Bika')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WeightTracker;
