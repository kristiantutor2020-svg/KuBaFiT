import React, { useState } from 'react';
import { Currency, Language, PaymentMethod } from '../types';
import PaymentDialog from './PaymentDialog';
import { processPowerPayPayment } from '../services/gemini';

interface BillingProps {
  currency: Currency;
  isSubscribed: boolean;
  setIsSubscribed: (val: boolean) => void;
  language: Language;
}

const Billing: React.FC<BillingProps> = ({ currency, isSubscribed, setIsSubscribed, language }) => {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ name: string, price: string } | null>(null);
  const t = (en: string, rw: string) => language === Language.EN ? en : rw;

  const prices = {
    [Currency.RWF]: { business: '40,600', enterprise: '208,600', power: '308,000' },
    [Currency.USD]: { business: '29', enterprise: '149', power: '220' },
    [Currency.GBP]: { business: '23', enterprise: '119', power: '176' },
  };

  const currentPrice = prices[currency] || prices[Currency.USD];

  const plans = [
    {
      name: t('Business Monthly', 'Ubucuruzi ku kwezi'),
      price: currentPrice.business,
      interval: t('month', 'ukwezi'),
      features: [
        t('Full AI Inventory Access', 'Kugerera kuri AI yose y\'ibikoresho'),
        t('Real-time Billing Support', 'Gufasha mu kwishyuza ako kanya'),
        t('Financial Analytics', 'Isesengura ry\'imari'),
      ],
      current: false,
      cta: t('Get Started', 'Tangira ubu')
    },
    {
      name: t('Enterprise Yearly', 'Ikigo ku mwaka'),
      price: currentPrice.enterprise,
      interval: t('year', 'umwaka'),
      popular: true,
      features: [
        t('All Business Features', 'Ibiranga ubucuruzi byose'),
        t('Multi-user Support', 'Gufasha abakoresha benshi'),
        t('Custom API Integration', 'Guhuza na API yawe'),
        t('Priority Support', 'Gufashwa vuba'),
      ],
      current: isSubscribed,
      cta: isSubscribed ? t('Manage Plan', 'Genzura ifatabuguzi') : t('Select Enterprise', 'Hitamo Enterprise')
    },
    {
      name: t('Power User Yearly', 'Power User ku mwaka'),
      price: currentPrice.power,
      interval: t('year', 'umwaka'),
      features: [
        t('Advanced Automation', 'Gukora bidasaba umuntu byisumbuye'),
        t('Unlimited Reports', 'Raporo zitagira umupaka'),
        t('Dedicated Agent Persona', 'Persona y\'umukozi wihariye'),
        t('Early Access Features', 'Kugerera ku bishya mbere'),
      ],
      current: false,
      cta: t('Choose Power User', 'Hitamo Power User')
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">{t('Elevate Your Operations', 'Zamura imikorere yawe')}</h2>
        <p className="text-slate-500">
          {t('KuBaFit provides world-class AI sport performance and tracking solutions localized for Rwanda and global markets.', 'KuBaFit itanga ibisubizo by\'ikoranabuhanga mu gucunga imikino n\'imyitozo byagenewe u Rwanda n\'amahanga.')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {plans.map((plan, idx) => (
          <div key={idx} className={`relative p-8 rounded-3xl border ${plan.popular ? 'bg-white border-indigo-200 shadow-xl shadow-indigo-50' : 'bg-slate-50 border-slate-200'
            }`}>
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-full">
                {t('Most Popular', 'Ikunzwe cyane')}
              </span>
            )}
            <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
            <div className="flex items-baseline space-x-1 mb-8">
              <span className="text-4xl font-extrabold text-slate-900">{currency === Currency.USD ? '$' : currency === Currency.GBP ? '£' : currency + ' '}{plan.price}</span>
              <span className="text-slate-500 text-sm">/{plan.interval}</span>
            </div>

            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, fIdx) => (
                <li key={fIdx} className="flex items-center text-sm text-slate-600">
                  <svg className="w-5 h-5 text-emerald-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => {
                if (!plan.current) {
                  setSelectedPlan({ name: plan.name, price: plan.price });
                  setIsPaymentOpen(true);
                }
              }}
              className={`w-full py-3 rounded-xl font-bold transition-all ${plan.current
                ? 'bg-slate-100 text-slate-400 cursor-default'
                : plan.popular
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100'
                  : 'bg-white text-indigo-600 border border-indigo-100 hover:bg-indigo-50'
                }`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm max-w-4xl mx-auto">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-slate-50 rounded-lg">
            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <h4 className="font-bold text-slate-800">{t('Payment Methods', 'Uburyo bwo kwishyura')}</h4>
            <p className="text-sm text-slate-500">{t('We support M-Pesa, MTN Mobile Money, and major credit cards.', 'Twemera M-Pesa, MTN Mobile Money, n\'ikarita za banki.')}</p>
          </div>
        </div>
      </div>

      {selectedPlan && (
        <PaymentDialog
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          onSuccess={async (method) => {
            // Initiate mock payment processing
            await processPowerPayPayment({
              method,
              amount: Number(selectedPlan.price.replace(/,/g, '')),
              currency,
              planName: selectedPlan.name
            });
            setIsSubscribed(true);
          }}
          planName={selectedPlan.name}
          price={selectedPlan.price}
          currency={currency}
          language={language}
        />
      )}
    </div>
  );
};

export default Billing;
