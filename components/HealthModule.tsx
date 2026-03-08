import React, { useState } from 'react';
import { HealthData, UserProfile, Language } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface HealthModuleProps {
    data: HealthData;
    profile: UserProfile;
    setProfile: (p: UserProfile) => void;
    language: Language;
}

const HealthModule: React.FC<HealthModuleProps> = ({ data, profile, setProfile, language }) => {
    const t = (en: string, rw: string) => language === Language.EN ? en : rw;

    const [weight, setWeight] = useState(profile.weight || 0);
    const [height, setHeight] = useState(profile.height || 0);

    const calculateBMI = () => {
        if (weight > 0 && height > 0) {
            const heightInMeters = height / 100;
            return (weight / (heightInMeters * heightInMeters)).toFixed(1);
        }
        return '--';
    };

    const bmiValue = calculateBMI();
    const bmiStatus = Number(bmiValue) < 18.5 ? 'Underweight' : Number(bmiValue) < 25 ? 'Normal' : 'Overweight';

    const handleSaveMetrics = () => {
        setProfile({ ...profile, weight, height });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Heart Rate Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center text-rose-600">
                            <svg className="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                        </div>
                        <h3 className="font-bold text-slate-800">{t('Heart Rate', 'Umutera-mutima')}</h3>
                    </div>
                    <span className="text-2xl font-black text-rose-600">{data.heartRate.current} <span className="text-xs font-normal text-slate-400">BPM</span></span>
                </div>
                <div className="h-32 w-full mt-auto">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data.heartRate.history}>
                            <XAxis dataKey="time" hide />
                            <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '10px' }}
                                labelStyle={{ display: 'none' }}
                            />
                            <Line type="monotone" dataKey="value" stroke="#e11d48" strokeWidth={3} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex justify-between mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <span>Min: {data.heartRate.min}</span>
                    <span>Max: {data.heartRate.max}</span>
                </div>
            </div>

            {/* Sleep Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                        </div>
                        <h3 className="font-bold text-slate-800">{t('Sleep', 'Ibitotsi')}</h3>
                    </div>
                    <span className="text-lg font-bold text-indigo-600">{Math.floor(data.sleep.totalDuration / 60)}h {data.sleep.totalDuration % 60}m</span>
                </div>
                <div className="flex gap-1 h-12 items-end mb-4">
                    {data.sleep.stages.map((stage, idx) => (
                        <div
                            key={idx}
                            className={`rounded-full flex-1 transition-all hover:opacity-80`}
                            style={{
                                height: stage.stage === 'Deep' ? '100%' : stage.stage === 'Core' ? '70%' : stage.stage === 'REM' ? '40%' : '15%',
                                backgroundColor: stage.stage === 'Deep' ? '#4338ca' : stage.stage === 'Core' ? '#6366f1' : stage.stage === 'REM' ? '#818cf8' : '#e2e8f0'
                            }}
                            title={`${stage.stage}: ${stage.duration}m`}
                        />
                    ))}
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-medium text-slate-500">
                    <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-indigo-800" /> Deep: {data.sleep.stages.find(s => s.stage === 'Deep')?.duration || 0}m</div>
                    <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Core: {data.sleep.stages.find(s => s.stage === 'Core')?.duration || 0}m</div>
                </div>
            </div>

            {/* Metrics Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-800">{t('Body Metrics', 'Ibigize umubiri')}</h3>
                    <button onClick={handleSaveMetrics} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2 py-1 rounded-lg transition-colors">
                        {t('Save', 'Bika')}
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">{t('Weight', 'Ibiro')}</label>
                        <div className="flex items-center gap-1 border-b border-slate-100 pb-1">
                            <input
                                type="number"
                                value={weight}
                                onChange={(e) => setWeight(Number(e.target.value))}
                                className="w-full bg-transparent font-bold text-slate-800 outline-none"
                            />
                            <span className="text-xs text-slate-400">kg</span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">{t('Height', 'Uburebure')}</label>
                        <div className="flex items-center gap-1 border-b border-slate-100 pb-1">
                            <input
                                type="number"
                                value={height}
                                onChange={(e) => setHeight(Number(e.target.value))}
                                className="w-full bg-transparent font-bold text-slate-800 outline-none"
                            />
                            <span className="text-xs text-slate-400">cm</span>
                        </div>
                    </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">BMI</p>
                        <p className="text-xl font-black text-slate-800">{bmiValue}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">{t('Category', 'Icyiciro')}</p>
                        <p className={`text-xs font-bold ${bmiStatus === 'Normal' ? 'text-emerald-600' : 'text-orange-600'}`}>{t(bmiStatus, bmiStatus)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HealthModule;
