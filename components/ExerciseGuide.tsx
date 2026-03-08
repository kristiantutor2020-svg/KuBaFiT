import React, { useState } from 'react';
import { Language } from '../types';

interface ExerciseGuideProps {
    language: Language;
    onClose: () => void;
    exerciseName?: string;
}

interface ExerciseInfo {
    name: string;
    nameRw: string;
    image: string;
    description: string;
    descriptionRw: string;
    steps: string[];
    stepsRw: string[];
    muscles: string[];
    duration: string;
    calories: string;
}

const exerciseDatabase: Record<string, ExerciseInfo> = {
    'push ups': {
        name: 'Push Ups',
        nameRw: 'Kwisunira',
        image: '/exercises/push_ups.png',
        description: 'A classic upper body exercise that targets chest, shoulders, and triceps.',
        descriptionRw: 'Imyitozo y\'igitero ishingiye ku gituza, amabega, n\'amaboko.',
        steps: [
            'Start in a plank position with hands shoulder-width apart',
            'Keep your body in a straight line from head to heels',
            'Lower your body until chest nearly touches the floor',
            'Push back up to starting position',
            'Keep core tight throughout the movement'
        ],
        stepsRw: [
            'Tangira uri mu mwanya w\'ubugari, ibiganza byangana n\'amabega',
            'Komeza umubiri wawe uri umurongo utunganye',
            'Manura umubiri kugeza igituza kigeze hasi',
            'Subira hejuru mu mwanya w\'itangiriro',
            'Komeza inda yawe ikomeye'
        ],
        muscles: ['Chest', 'Shoulders', 'Triceps', 'Core'],
        duration: '30-60 seconds',
        calories: '7 per minute'
    },
    'squats': {
        name: 'Squats',
        nameRw: 'Kwikubita',
        image: '/exercises/squats.png',
        description: 'A fundamental lower body exercise that builds leg strength and improves mobility.',
        descriptionRw: 'Imyitozo y\'amaguru ishingiye ku kubaka imbaraga z\'amaguru.',
        steps: [
            'Stand with feet shoulder-width apart',
            'Keep your chest up and back straight',
            'Lower your hips back and down as if sitting in a chair',
            'Go down until thighs are parallel to the floor',
            'Push through heels to return to standing'
        ],
        stepsRw: [
            'Hagarara ibirenge byangana n\'amabega',
            'Komeza igituza hejuru n\'umugongo utunganye',
            'Manura inkokora inyuma nk\'ukwicara ku ntebe',
            'Manuka kugeza amatako angana n\'ubutaka',
            'Sunika ukoresheje uturenge usubire hejuru'
        ],
        muscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Core'],
        duration: '45-60 seconds',
        calories: '8 per minute'
    },
    'burpees': {
        name: 'Burpees',
        nameRw: 'Burpees',
        image: '/exercises/burpees.png',
        description: 'A full-body exercise that combines a squat, push-up, and jump for maximum calorie burn.',
        descriptionRw: 'Imyitozo y\'umubiri wose ihuza squat, push-up, n\'umusimbuko.',
        steps: [
            'Start standing with feet hip-width apart',
            'Drop into a squat and place hands on the floor',
            'Jump feet back into a plank position',
            'Perform a push-up (optional)',
            'Jump feet forward to hands and explosively jump up'
        ],
        stepsRw: [
            'Tangira uhagazeho ibirenge byangana n\'inkokora',
            'Manuka mu squat ushyire ibiganza hasi',
            'Simbuka ibirenge inyuma mu mwanya w\'ubugari',
            'Kora push-up (niba ubishaka)',
            'Simbuka ibirenge imbere maze usimbuke hejuru'
        ],
        muscles: ['Full Body', 'Cardio', 'Core', 'Legs'],
        duration: '20-30 seconds',
        calories: '10 per minute'
    },
    'lunges': {
        name: 'Lunges',
        nameRw: 'Intambwe ndende',
        image: '/exercises/lunges.png',
        description: 'A unilateral lower body exercise that improves balance and leg strength.',
        descriptionRw: 'Imyitozo y\'amaguru iteza imbere ubushobozi bwo guhagarara.',
        steps: [
            'Stand tall with feet hip-width apart',
            'Take a big step forward with one leg',
            'Lower your hips until both knees are bent at 90 degrees',
            'Keep front knee over ankle, not past toes',
            'Push back to starting position and alternate legs'
        ],
        stepsRw: [
            'Hagarara neza ibirenge byangana n\'inkokora',
            'Tera intambwe nini imbere n\'ukuguru kumwe',
            'Manura inkokora kugeza amavi yombi apfunyika',
            'Komeza ivi ry\'imbere hejuru y\'agaturi',
            'Subira mu mwanya w\'itangiriro uhindure amaguru'
        ],
        muscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Calves'],
        duration: '30-45 seconds per leg',
        calories: '6 per minute'
    },
    'plank': {
        name: 'Plank',
        nameRw: 'Ubugari',
        image: '/exercises/plank.png', // Dedicated plank image
        description: 'An isometric core exercise that builds stability and endurance.',
        descriptionRw: 'Imyitozo y\'inda iteza imbere gukomera n\'ubushobozi.',
        steps: [
            'Start in a forearm plank position',
            'Keep elbows directly under shoulders',
            'Engage your core and keep body in a straight line',
            'Do not let hips sag or pike up',
            'Hold the position and breathe steadily'
        ],
        stepsRw: [
            'Tangira uri mu mwanya w\'ubugari',
            'Shyira inkokora munsi y\'amabega',
            'Komeza inda yawe n\'umubiri mu murongo',
            'Ntukunde inkokora guhinduka',
            'Komeza umwanya uhumeka neza'
        ],
        muscles: ['Core', 'Shoulders', 'Back', 'Glutes'],
        duration: '30-60 seconds',
        calories: '4 per minute'
    },
    'hiit circuit': {
        name: 'HIIT Circuit',
        nameRw: 'HIIT Circuit',
        image: '/exercises/burpees.png',
        description: 'High-Intensity Interval Training combining multiple exercises for maximum burn.',
        descriptionRw: 'Imyitozo y\'imbaraga nyinshi ihuza imyitozo myinshi.',
        steps: [
            'Perform each exercise for 45 seconds with 15 seconds rest',
            'Complete 4-6 exercises per round',
            'Rest 1-2 minutes between rounds',
            'Maintain high intensity during work periods',
            'Complete 3-4 rounds total'
        ],
        stepsRw: [
            'Kora buri myitozo amasegonda 45 n\'ikiruhuko cy\'amasegonda 15',
            'Rangiza imyitozo 4-6 buri musimbuko',
            'Ruhuka iminota 1-2 hagati y\'imisimbuko',
            'Komeza imbaraga nyinshi mu gihe ukora',
            'Rangiza imisimbuko 3-4 yose'
        ],
        muscles: ['Full Body', 'Cardio', 'Endurance'],
        duration: '20-30 minutes',
        calories: '12-15 per minute'
    },
    'jump squats': {
        name: 'Jump Squats',
        nameRw: 'Gusimbuka ukikubita',
        image: '/exercises/squats.png',
        description: 'An explosive plyometric exercise that builds power and burns calories.',
        descriptionRw: 'Imyitozo y\'imbaraga iteza imbere ubushobozi bwo gusimbuka.',
        steps: [
            'Start in a squat position',
            'Lower down into a deep squat',
            'Explosively jump up as high as possible',
            'Land softly back into squat position',
            'Immediately repeat the movement'
        ],
        stepsRw: [
            'Tangira mu mwanya wa squat',
            'Manuka mu squat y\'imbere',
            'Simbuka hejuru n\'imbaraga',
            'Guma hasi buhoro usubire mu squat',
            'Subira ukore vuba'
        ],
        muscles: ['Quadriceps', 'Glutes', 'Calves', 'Core'],
        duration: '20-30 seconds',
        calories: '10 per minute'
    },
    'sprint intervals': {
        name: 'Sprint Intervals',
        nameRw: 'Kwiruka byihuse',
        image: '/exercises/burpees.png',
        description: 'High-intensity running intervals for maximum cardiovascular benefit.',
        descriptionRw: 'Kwiruka byihuse kugira ngo uteze imbere umutima.',
        steps: [
            'Warm up with light jogging for 5 minutes',
            'Sprint at maximum effort for 20-30 seconds',
            'Walk or light jog for 60-90 seconds recovery',
            'Repeat sprint/recovery cycle 8-10 times',
            'Cool down with 5 minutes easy walking'
        ],
        stepsRw: [
            'Tangira gushyusha umubiri iminota 5',
            'Iruka byihuse amasegonda 20-30',
            'Genda buhoro iminota 1-2 uruhuka',
            'Subira umusimbuko wo kwiruka inshuro 8-10',
            'Rangiza ugenda buhoro iminota 5'
        ],
        muscles: ['Legs', 'Core', 'Cardio', 'Endurance'],
        duration: '15-20 minutes',
        calories: '15 per minute'
    }
};

const ExerciseGuide: React.FC<ExerciseGuideProps> = ({ language, onClose, exerciseName }) => {
    const t = (en: string, rw: string) => language === Language.EN ? en : rw;

    // Find matching exercise
    const findExercise = (name?: string): ExerciseInfo | null => {
        if (!name) return null;
        const searchName = name.toLowerCase();
        for (const [key, exercise] of Object.entries(exerciseDatabase)) {
            if (searchName.includes(key) || key.includes(searchName)) {
                return exercise;
            }
        }
        // Default to push-ups if not found
        return exerciseDatabase['push ups'];
    };

    const [selectedExercise, setSelectedExercise] = useState<ExerciseInfo | null>(
        findExercise(exerciseName)
    );
    const [showAllExercises, setShowAllExercises] = useState(!exerciseName);

    const exerciseList = Object.values(exerciseDatabase);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div
                className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-slate-100 p-4 flex items-center justify-between rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        {selectedExercise && !showAllExercises && (
                            <button
                                onClick={() => { setSelectedExercise(null); setShowAllExercises(true); }}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                        )}
                        <h2 className="text-xl font-bold text-slate-800">
                            {showAllExercises
                                ? t('Exercise Guide', 'Ubuyobozi bw\'Imyitozo')
                                : (language === Language.EN ? selectedExercise?.name : selectedExercise?.nameRw)}
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {showAllExercises ? (
                    /* Exercise List */
                    <div className="p-4">
                        <p className="text-slate-500 text-sm mb-4">
                            {t('Select an exercise to see detailed instructions', 'Hitamo imyitozo urebe amabwiriza')}
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            {exerciseList.map((exercise, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => { setSelectedExercise(exercise); setShowAllExercises(false); }}
                                    className="p-4 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-transparent hover:border-emerald-200 transition-all cursor-pointer group"
                                >
                                    <div className="aspect-video rounded-lg overflow-hidden mb-3 bg-slate-100">
                                        <img
                                            src={exercise.image}
                                            alt={exercise.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                        />
                                    </div>
                                    <h3 className="font-semibold text-slate-800 group-hover:text-emerald-700">
                                        {language === Language.EN ? exercise.name : exercise.nameRw}
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-1">{exercise.muscles.slice(0, 2).join(', ')}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : selectedExercise && (
                    /* Exercise Detail */
                    <div className="p-6">
                        {/* Image */}
                        <div className="aspect-video rounded-xl overflow-hidden bg-slate-100 mb-6">
                            <img
                                src={selectedExercise.image}
                                alt={selectedExercise.name}
                                className="w-full h-full object-contain"
                            />
                        </div>

                        {/* Description */}
                        <p className="text-slate-600 mb-6">
                            {language === Language.EN ? selectedExercise.description : selectedExercise.descriptionRw}
                        </p>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-3 mb-6">
                            <div className="p-3 bg-emerald-50 rounded-xl text-center">
                                <p className="text-xs text-emerald-600 font-medium">{t('Duration', 'Igihe')}</p>
                                <p className="text-sm font-bold text-emerald-700">{selectedExercise.duration}</p>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-xl text-center">
                                <p className="text-xs text-blue-600 font-medium">{t('Calories', 'Ingufu')}</p>
                                <p className="text-sm font-bold text-blue-700">{selectedExercise.calories}</p>
                            </div>
                            <div className="p-3 bg-orange-50 rounded-xl text-center">
                                <p className="text-xs text-orange-600 font-medium">{t('Muscles', 'Imitsi')}</p>
                                <p className="text-sm font-bold text-orange-700">{selectedExercise.muscles.length}</p>
                            </div>
                        </div>

                        {/* Muscles */}
                        <div className="mb-6">
                            <h4 className="font-semibold text-slate-800 mb-2">{t('Muscles Worked', 'Imitsi ikoreshwa')}</h4>
                            <div className="flex flex-wrap gap-2">
                                {selectedExercise.muscles.map((muscle, idx) => (
                                    <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm">
                                        {muscle}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Steps */}
                        <div>
                            <h4 className="font-semibold text-slate-800 mb-3">{t('How to Do It', 'Uko bikozwe')}</h4>
                            <div className="space-y-3">
                                {(language === Language.EN ? selectedExercise.steps : selectedExercise.stepsRw).map((step, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        <span className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                                            {idx + 1}
                                        </span>
                                        <p className="text-slate-600 pt-1">{step}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={onClose}
                            className="w-full mt-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-teal-700 transition-all"
                        >
                            {t('Got It!', 'Narabyumvise!')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExerciseGuide;
