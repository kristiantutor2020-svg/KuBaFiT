import React, { useState } from 'react';
import { Language, UserProfile, ExerciseVideo } from '../types';

interface WorkoutLibraryProps {
    language: Language;
    profile: UserProfile;
}

const WorkoutLibrary: React.FC<WorkoutLibraryProps> = ({ language }) => {
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [activeVideo, setActiveVideo] = useState<ExerciseVideo | null>(null);

    const t = (en: string, rw: string) => language === Language.EN ? en : rw;

    const categories = ['All', 'HIIT', 'Strength', 'Flexibility', 'Cardio', 'Recovery'];

    const exercises: ExerciseVideo[] = [
        {
            id: 'hiit-1',
            name: t('Kigali HIIT Flow', 'HIIT y\'i Kigali'),
            category: 'HIIT',
            duration: '15 min',
            description: 'High-intensity interval training session designed for Kigali urban athletes.',
            thumbnailUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=400',
            videoUrl: '#'
        },
        {
            id: 'strength-1',
            name: t('Power Building', 'Kungura Imbaraga'),
            category: 'Strength',
            duration: '45 min',
            description: 'Complete full-body strength building routine focusing on fundamental lifts.',
            thumbnailUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400',
            videoUrl: '#'
        },
        {
            id: 'yoga-1',
            name: t('Sunset Mobility', 'Yoga ya Nimunsi'),
            category: 'Flexibility',
            duration: '20 min',
            description: 'Relaxing sunset yoga session to improve flexibility and mindfulness.',
            thumbnailUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400',
            videoUrl: '#'
        },
        {
            id: 'cardio-1',
            name: t('Lake Kivu Cardio', 'Cardio y\' i Nyanza'),
            category: 'Cardio',
            duration: '30 min',
            description: 'Endurance focused cardio session inspired by the shores of Lake Kivu.',
            thumbnailUrl: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&q=80&w=400',
            videoUrl: '#'
        },
        {
            id: 'strength-2',
            name: t('Core Foundation', 'Ikarishe Kunda'),
            category: 'Strength',
            duration: '10 min',
            description: 'Quick but intensive core activation and stability workout.',
            thumbnailUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=400',
            videoUrl: '#'
        },
        {
            id: 'mobility-1',
            name: t('Morning Activation', 'Gukangura Umubiri'),
            category: 'Recovery',
            duration: '12 min',
            description: 'Gentle recovery and mobility movements to start your day right.',
            thumbnailUrl: 'https://images.unsplash.com/photo-1518622358385-8ea7d0794bf6?auto=format&fit=crop&q=80&w=400',
            videoUrl: '#'
        }
    ];

    const filteredExercises = selectedCategory === 'All'
        ? exercises
        : exercises.filter(ex => ex.category === selectedCategory);

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
            {/* Header and Filter */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                        {t('Workout Library', 'Ububiko bwa Siporo')}
                    </h2>
                    <p className="text-slate-500 font-medium">
                        {t('Access high-quality training sessions anywhere.', 'Bona amahugurwa akomeye aho waba uri hose.')}
                    </p>
                </div>

                <div className="flex bg-slate-100 p-1 rounded-2xl overflow-x-auto no-scrollbar">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${selectedCategory === cat ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Exercises Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredExercises.map((ex) => (
                    <div
                        key={ex.id}
                        className="group bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500 flex flex-col"
                    >
                        <div className="relative aspect-video overflow-hidden">
                            <img src={ex.thumbnailUrl} alt={ex.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-colors"></div>
                            <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur px-2 py-1 rounded-lg text-white text-[10px] font-bold">
                                {ex.duration}
                            </div>
                            <button
                                onClick={() => setActiveVideo(ex)}
                                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-600/20"
                            >
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-500">
                                    <svg className="w-6 h-6 text-indigo-600 ml-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                                </div>
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{ex.category}</span>
                                <div className="flex space-x-1">
                                    <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                                    <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                                    <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                                </div>
                            </div>
                            <h4 className="font-black text-slate-800 text-lg uppercase tracking-tight leading-tight">{ex.name}</h4>
                        </div>
                    </div>
                ))}
            </div>

            {/* Video Player Modal (Mock) */}
            {activeVideo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="relative w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500">
                        <button
                            onClick={() => setActiveVideo(null)}
                            className="absolute top-6 right-6 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-2xl text-white transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        <div className="w-full h-full flex flex-col items-center justify-center text-white space-y-4">
                            <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center animate-pulse">
                                <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                            </div>
                            <h2 className="text-3xl font-black uppercase tracking-tighter">{activeVideo.name}</h2>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs tracking-widest">{activeVideo.duration} • {activeVideo.category}</p>
                            <div className="pt-8 text-xs text-slate-500 font-bold uppercase tracking-widest animate-pulse">
                                Connecting to Stream Server...
                            </div>
                        </div>

                        <div className="absolute bottom-0 inset-x-0 p-8 h-32 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-between">
                            <div className="flex h-1.5 bg-white/20 rounded-full flex-grow mx-4 overflow-hidden relative">
                                <div className="absolute inset-y-0 left-0 bg-indigo-500 w-1/3"></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkoutLibrary;
