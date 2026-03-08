
import React, { useState, useEffect } from 'react';
import { UserProfile, BusinessTransaction, BusinessInsight, Language } from '../types';
import { analyzeBusinessData } from '../services/gemini';

interface HealthInsightsProps {
  profile: UserProfile;
  history: BusinessTransaction[];
  language: Language;
  isSubscribed: boolean;
}

const HealthInsights: React.FC<HealthInsightsProps> = ({ profile, history, language, isSubscribed }) => {
  const [insights, setInsights] = useState<BusinessInsight[]>([]);
  const [loading, setLoading] = useState(false);
  const t = (en: string, rw: string) => language === Language.EN ? en : rw;

  useEffect(() => {
    if (isSubscribed) {
      const fetchInsights = async () => {
        setLoading(true);
        try {
          const data = await analyzeBusinessData(profile, history);
          setInsights(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchInsights();
    }
  }, [isSubscribed, profile, history]);

  if (!isSubscribed) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-slate-100 shadow-sm text-center">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 21.48V22" /></svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">{t('AI Business Analysis', 'Isuzumwa rya AI ry\'ubucuruzi')}</h2>
        <p className="text-slate-500 mb-8 max-w-md mx-auto">
          {t('Get deep insights into your business metrics and operational trends using our advanced AI analyzer.', 'Bona isuzuma ryimbitse ry\'ubucuruzi bwawe ukoresheje AI yacu yateye imbere.')}
        </p>
        <button className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
          {t('Upgrade to Unlock', 'Gura ubu kugira ngo ufungure')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{t('AI Business Consultant', 'Umujyanama mu Bucuruzi bwa AI')}</h2>
          <button
            onClick={async () => {
              setLoading(true);
              const data = await analyzeBusinessData(profile, history);
              setInsights(data);
              setLoading(false);
            }}
            disabled={loading}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
          >
            {loading ? t('Refreshing...', 'Irimo kuvugururwa...') : t('Refresh Analysis', 'Vugurura isuzuma')}
          </button>
        </div>

        {loading && insights.length === 0 ? (
          <div className="animate-pulse space-y-4">
            <div className="h-24 bg-slate-50 rounded-xl"></div>
            <div className="h-24 bg-slate-50 rounded-xl"></div>
            <div className="h-24 bg-slate-50 rounded-xl"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insights.map((insight, idx) => (
              <div key={idx} className={`p-5 rounded-2xl border ${insight.status === 'positive' ? 'bg-emerald-50 border-emerald-100' :
                insight.status === 'warning' ? 'bg-amber-50 border-amber-100' : 'bg-slate-50 border-slate-100'
                }`}>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{insight.metric}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${insight.status === 'positive' ? 'bg-emerald-200 text-emerald-800' :
                    insight.status === 'warning' ? 'bg-amber-200 text-amber-800' : 'bg-slate-200 text-slate-800'
                    }`}>{insight.status}</span>
                </div>
                <p className="text-xl font-bold text-slate-900 mb-2">{insight.value}</p>
                <p className="text-sm text-slate-600 leading-relaxed">{insight.advice}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold mb-4">{t('Long-term Business Progress', 'Iterambere ry\'ubucuruzi ry\'igihe kirekire')}</h3>
        <p className="text-slate-500 italic">
          {t('Historical data tracking and market trend visualization coming soon.', 'Gukurikirana amakuru y\'amateka bije vuba.')}
        </p>
      </div>
    </div>
  );
};

export default HealthInsights;
