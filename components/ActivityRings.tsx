import React from 'react';
import { ActivityData, Language } from '../types';

interface ActivityRingsProps {
    data: ActivityData;
    language: Language;
}

const ActivityRings: React.FC<ActivityRingsProps> = ({ data, language }) => {
    const t = (en: string, rw: string) => language === Language.EN ? en : rw;

    const rings = [
        {
            label: t('Move', 'Kugenda'),
            value: data.move,
            color: 'stroke-rose-500',
            bg: 'stroke-rose-500/20',
            radius: 40,
            unit: 'kcal',
            current: data.calories
        },
        {
            label: t('Exercise', 'Imyitozo'),
            value: data.exercise,
            color: 'stroke-emerald-500',
            bg: 'stroke-emerald-500/20',
            radius: 28,
            unit: 'min',
            current: data.exerciseMinutes
        },
        {
            label: t('Stand', 'Guhagarara'),
            value: data.stand,
            color: 'stroke-cyan-500',
            bg: 'stroke-cyan-500/20',
            radius: 16,
            unit: 'hr',
            current: data.standHours
        }
    ];

    const circumference = (radius: number) => 2 * Math.PI * radius;

    return (
        <div className="flex items-center gap-6 p-4 bg-black/95 rounded-3xl shadow-2xl border border-white/5">
            <div className="relative w-32 h-32">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                    {rings.map((ring, idx) => (
                        <React.Fragment key={idx}>
                            {/* Background Ring */}
                            <circle
                                cx="50"
                                cy="50"
                                r={ring.radius}
                                className={`${ring.bg} fill-none`}
                                strokeWidth="10"
                            />
                            {/* Progress Ring */}
                            <circle
                                cx="50"
                                cy="50"
                                r={ring.radius}
                                className={`${ring.color} fill-none transition-all duration-1000 ease-out`}
                                strokeWidth="10"
                                strokeDasharray={circumference(ring.radius)}
                                strokeDashoffset={circumference(ring.radius) * (1 - Math.min(ring.value, 100) / 100)}
                                strokeLinecap="round"
                            />
                        </React.Fragment>
                    ))}
                </svg>
            </div>

            <div className="flex flex-col gap-3">
                {rings.map((ring, idx) => (
                    <div key={idx} className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${ring.color.replace('stroke', 'bg')}`} />
                            <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">{ring.label}</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-sm font-bold text-white">{ring.current}</span>
                            <span className="text-[10px] text-white/40">{ring.unit}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActivityRings;
