
import React, { useState } from 'react';
import { UserProfile, AIInventoryPlan, Language } from '../types';
import { generateInventoryPlan } from '../services/gemini';

interface PerformancePlannerProps {
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
  currentPlan: AIInventoryPlan | null;
  setCurrentPlan: (plan: AIInventoryPlan) => void;
  language: Language;
  isSubscribed: boolean;
  onNavigate?: (tab: string) => void;
}

const PerformancePlanner: React.FC<PerformancePlannerProps> = ({ profile, setProfile, currentPlan, setCurrentPlan, language, isSubscribed, onNavigate }) => {
  const [loading, setLoading] = useState(false);
  const t = (en: string, rw: string) => language === Language.EN ? en : rw;

  const handleGenerate = async () => {
    if (!isSubscribed) return;
    setLoading(true);
    try {
      const plan = await generateInventoryPlan(profile);
      setCurrentPlan(plan);
    } catch (error) {
      console.error(error);
      alert(t('Failed to generate plan. Please try again.', 'Igenamigambi ryanze. Ongera ugerageze.'));
    } finally {
      setLoading(false);
    }
  };

  if (!isSubscribed) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-slate-100 shadow-sm text-center">
        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">{t('AI Performance Planner is Premium', 'Igenamigambi rya siporo rya AI rirasabirwa')}</h2>
        <p className="text-slate-500 mb-8 max-w-md mx-auto">
          {t('Upgrade to KuBaFit Enterprise to generate optimized training and recovery cycles using Gemini AI tailored for your fitness goals.', 'Gura KuBaFit Enterprise kugirango ubone igenamigambi rya siporo rikorerwa na AI yitwa Gemini.')}
        </p>
        <button
          onClick={() => onNavigate?.('billing')}
          className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
        >
          {t('Upgrade Now', 'Gura ubu')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h2 className="text-xl font-bold mb-4">{t('Personalize Your Plan', 'Hita igenamigambi ryawe')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">{t('Inventory Volume', 'Ingano y\'ibikoresho')}</label>
            <input
              type="number"
              value={profile.inventoryVolume}
              onChange={(e) => setProfile({ ...profile, inventoryVolume: Number(e.target.value) })}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">{t('Business Strategy', 'Icyerekezo cy\'ubucuruzi')}</label>
            <select
              value={profile.businessGoal}
              onChange={(e) => setProfile({ ...profile, businessGoal: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
            >
              <option value="Efficiency">Efficiency</option>
              <option value="Growth">Growth</option>
              <option value="Cost Reduction">Cost Reduction</option>
              <option value="Market Expansion">Market Expansion</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">{t('Transaction Frequency', 'Inshuro zo gucuruza')}</label>
            <select
              value={profile.marketFrequency}
              onChange={(e) => setProfile({ ...profile, marketFrequency: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
            >
              <option value="Low">Low</option>
              <option value="Moderate">Moderate</option>
              <option value="High">High</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {loading ? t('Generating...', 'Irimo gukorwa...') : t('Generate AI Plan', 'Kora igenamigambi rya AI')}
            </button>
          </div>
        </div>
      </div>

      {currentPlan && (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">{currentPlan.title}</h3>
              <p className="text-slate-500">{currentPlan.description}</p>
            </div>
            <button className="flex items-center text-indigo-600 text-sm font-semibold border border-indigo-100 px-4 py-2 rounded-lg hover:bg-indigo-50">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
              {t('Export to ERP', 'Bika muri ERP')}
            </button>
          </div>

          <div className="space-y-4">
            {currentPlan.phases.map((phase, idx) => (
              <details key={idx} className="group border border-slate-100 rounded-xl overflow-hidden" open={idx === 0}>
                <summary className="flex items-center justify-between p-4 bg-slate-50 cursor-pointer list-none">
                  <span className="font-bold text-slate-800">{phase.phase}</span>
                  <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </summary>
                <div className="p-4 bg-white grid grid-cols-1 md:grid-cols-2 gap-4">
                  {phase.actions.map((action, actionIdx) => (
                    <div key={actionIdx} className="p-3 border border-slate-50 rounded-lg bg-slate-50/50">
                      <p className="font-semibold text-slate-900">{action.name}</p>
                      <div className="flex space-x-4 text-xs text-slate-500 mt-1 uppercase tracking-wider">
                        <span>{action.batches} {t('Batches', 'Inshuro')}</span>
                        <span>{action.target}</span>
                        <span>{t('Freq', 'Freq')}: {action.frequency}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformancePlanner;
