import React, { useState } from 'react';
import { Language, UserProfile, HikingSpot } from '../types';
import { getHikingAdvice } from '../services/gemini';

interface HikingPlannerProps {
    language: Language;
    profile: UserProfile;
}

const HikingPlanner: React.FC<HikingPlannerProps> = ({ language, profile }) => {
    const [selectedSpot, setSelectedSpot] = useState<HikingSpot | null>(null);
    const [aiAdvice, setAiAdvice] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const t = (en: string, rw: string) => language === Language.EN ? en : rw;

    // East African / Rwandan Hiking Spots
    const hikingSpots: HikingSpot[] = [
        {
            id: 'bisoke',
            name: 'Mount Bisoke',
            location: 'Musanze, Rwanda',
            difficulty: 'Hard',
            distance: 8.5,
            elevationGain: 3711,
            description: 'Volcanic mountain with a beautiful crater lake at the summit.',
            imageUrl: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=400'
        },
        {
            id: 'kalisoke',
            name: 'Kalisoke Research Center',
            location: 'Kinigi, Rwanda',
            difficulty: 'Moderate',
            distance: 6.2,
            elevationGain: 3000,
            description: 'The historic site where Dian Fossey studied gorillas.',
            imageUrl: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=400'
        },
        {
            id: 'nyiragongo',
            name: 'Mount Nyiragongo',
            location: 'Goma, DRC Border',
            difficulty: 'Extreme',
            distance: 12.0,
            elevationGain: 3470,
            description: 'Active volcano with the world\'s largest lava lake.',
            imageUrl: 'https://images.unsplash.com/photo-1541088922240-f19985922383?auto=format&fit=crop&q=80&w=400'
        },
        {
            id: 'fazenda',
            name: 'Fazenda Sengha',
            location: 'Kigali, Rwanda',
            difficulty: 'Easy',
            distance: 4.5,
            elevationGain: 1600,
            description: 'Scenic trails and horse riding overlooking Kigali city.',
            imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400'
        }
    ];

    const getAdvice = async (spot: HikingSpot) => {
        setSelectedSpot(spot);
        setAiAdvice('');
        setIsLoading(true);
        try {
            const advice = await getHikingAdvice(spot.name, profile);
            setAiAdvice(advice);
        } catch (error) {
            setAiAdvice("Sorry, I couldn't get hiking advice right now.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                        {t('Hiking Planner', 'Guhangana n\'Imisozi')}
                    </h2>
                    <p className="text-slate-500 font-medium">
                        {t('Plan your next East African adventure with AI tips.', 'Twibaze kuri AI uburyo wategura urugendo rwawe rukurikiyeho.')}
                    </p>
                </div>
                <div className="flex items-center space-x-2 bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-100">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">AI Powered Agent</span>
                </div>
            </div>

            {/* Spots Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {hikingSpots.map((spot) => (
                    <div
                        key={spot.id}
                        className={`group relative overflow-hidden bg-white rounded-3xl border-2 transition-all cursor-pointer ${selectedSpot?.id === spot.id ? 'border-indigo-500 ring-4 ring-indigo-50 shadow-xl' : 'border-slate-100 hover:border-indigo-200 hover:shadow-lg'}`}
                        onClick={() => getAdvice(spot)}
                    >
                        <div className="aspect-[4/3] overflow-hidden">
                            <img src={spot.imageUrl} alt={spot.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-800 shadow-sm">
                                {spot.difficulty}
                            </div>
                        </div>
                        <div className="p-5">
                            <h4 className="font-black text-slate-800 text-lg group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{spot.name}</h4>
                            <div className="flex items-center text-slate-400 text-xs mt-1 font-bold">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                {spot.location}
                            </div>
                            <p className="text-slate-500 text-sm mt-3 line-clamp-2 leading-relaxed">
                                {spot.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* AI Advice Panel */}
            {selectedSpot && (
                <div className="bg-white rounded-[40px] shadow-2xl shadow-indigo-100/50 border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-500">
                    <div className="flex flex-col lg:flex-row">
                        {/* Spot Info Sidebar */}
                        <div className="lg:w-1/3 bg-slate-900 p-10 text-white relative">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" /></svg>
                            </div>

                            <h3 className="text-3xl font-black uppercase tracking-tighter mb-2">{selectedSpot.name}</h3>
                            <p className="text-indigo-400 font-bold mb-8">{selectedSpot.location}</p>

                            <div className="space-y-6">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-white/10 rounded-2xl"><svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg></div>
                                    <div>
                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">Elevation Gain</p>
                                        <p className="text-lg font-bold">{selectedSpot.elevationGain}m</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-white/10 rounded-2xl"><svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                                    <div>
                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">Avg Time</p>
                                        <p className="text-lg font-bold">4 - 6 Hours</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 p-6 bg-indigo-600 rounded-3xl">
                                <p className="text-xs font-bold text-indigo-200 uppercase mb-2">My Current Metric</p>
                                <div className="flex justify-between items-end">
                                    <p className="text-2xl font-black">{profile.weight || '--'} <span className="text-sm font-normal">kg</span></p>
                                    {profile.height && <p className="text-xs font-bold text-indigo-200">Height: {profile.height}cm</p>}
                                </div>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="lg:w-2/3 p-10 relative">
                            <div className="flex items-center justify-between mb-8">
                                <h4 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-indigo-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" /></svg>
                                    AI Trail Analytics
                                </h4>
                                {isLoading && <div className="flex space-x-1"><div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce"></div><div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div><div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div></div>}
                            </div>

                            <div className="prose prose-slate max-w-none prose-p:text-slate-600 prose-li:text-slate-600 prose-headings:text-slate-800">
                                {isLoading ? (
                                    <div className="space-y-4">
                                        <div className="h-4 bg-slate-100 rounded-full w-3/4 animate-pulse"></div>
                                        <div className="h-4 bg-slate-100 rounded-full w-full animate-pulse"></div>
                                        <div className="h-4 bg-slate-100 rounded-full w-5/6 animate-pulse"></div>
                                        <div className="h-4 bg-slate-100 rounded-full w-2/3 animate-pulse"></div>
                                    </div>
                                ) : (
                                    <div className="whitespace-pre-wrap font-medium leading-relaxed">
                                        {aiAdvice || t('Click a trail to get personalized AI preparation advice.', 'Kanda ku musozi kugira ngo ubone inama za AI zikubereye.')}
                                    </div>
                                )}
                            </div>

                            <button className="mt-10 w-full py-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:border-indigo-300 hover:text-indigo-600 transition-all flex items-center justify-center space-x-2 group">
                                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-7l-4-4m0 0l-4 4m4-4v12" /></svg>
                                <span>{t('Export Preparation Plan', 'Bika ubu buryo bwo kwitegura')}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HikingPlanner;
