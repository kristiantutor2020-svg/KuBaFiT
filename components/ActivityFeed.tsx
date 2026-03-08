import React from 'react';
import { AthleticActivity, Language } from '../types';

interface ActivityFeedProps {
    activities: AthleticActivity[];
    language: Language;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities, language }) => {
    const t = (en: string, rw: string) => language === Language.EN ? en : rw;

    const formatDistance = (meters: number) => {
        return (meters / 1000).toFixed(2) + ' km';
    };

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <span className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </span>
                    {t('Activity Feed', 'Amakuru y\'ibyo wakoze')}
                </h3>
            </div>

            {activities.map((activity) => (
                <div key={activity.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-4 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0 flex items-center justify-center overflow-hidden">
                            <img src={activity.photoUrl || `https://ui-avatars.com/api/?name=${activity.name}&background=random`} alt="user" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <h4 className="font-bold text-slate-900 dark:text-white truncate">{activity.name}</h4>
                                <span className="text-[10px] text-slate-400 font-medium">{activity.startDate}</span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{activity.type}</p>

                            <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-50 dark:border-slate-700 mb-3">
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase font-bold">{t('Distance', 'Intera')}</p>
                                    <p className="text-sm font-bold text-slate-800 dark:text-white">{formatDistance(activity.distance)}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase font-bold">{t('Pace', 'Umuvuduko')}</p>
                                    <p className="text-sm font-bold text-slate-800 dark:text-white">
                                        {(activity.movingTime / (activity.distance / 1000) / 60).toFixed(2)} /km
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase font-bold">{t('Time', 'Igihe')}</p>
                                    <p className="text-sm font-bold text-slate-800 dark:text-white">{formatTime(activity.movingTime)}</p>
                                </div>
                            </div>

                            {activity.mapPolyline && (
                                <div className="relative h-32 w-full bg-slate-50 dark:bg-slate-900 rounded-xl mb-3 overflow-hidden border border-slate-100 dark:border-slate-800">
                                    <div className="absolute inset-0 flex items-center justify-center opacity-40">
                                        <svg className="w-full h-full text-orange-500/20" viewBox="0 0 100 100" preserveAspectRatio="none">
                                            <polyline points="10,50 30,30 50,70 70,40 90,60" fill="none" stroke="currentColor" strokeWidth="2" />
                                        </svg>
                                    </div>
                                    <div className="absolute bottom-2 right-2 bg-white/90 dark:bg-slate-800/90 px-2 py-1 rounded text-[8px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">
                                        Map Preview
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-4">
                                <button className="flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-600 transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.704a1 1 0 01.94 1.335l-2.21 5.893A2 2 0 0115.548 18.5H10V7h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707z" /></svg>
                                    <span>{activity.kudosCount}</span>
                                </button>
                                <button className="flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-600 transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                    <span>{activity.commentCount}</span>
                                </button>
                                {activity.relativeEffort && (
                                    <div className="ml-auto flex items-center gap-1">
                                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Effort</span>
                                        <div className="w-16 h-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <div className="h-full bg-indigo-500" style={{ width: `${Math.min(activity.relativeEffort, 100)}%` }} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ActivityFeed;
