
import React, { useState } from 'react';
import { Currency, Language, PaymentMethod } from '../types';

interface PaymentDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (method: PaymentMethod) => void;
    planName: string;
    price: string;
    currency: Currency;
    language: Language;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({
    isOpen,
    onClose,
    onSuccess,
    planName,
    price,
    currency,
    language
}) => {
    const [step, setStep] = useState<'select' | 'details' | 'processing'>('select');
    const [method, setMethod] = useState<PaymentMethod | null>(null);
    const [phone, setPhone] = useState('');
    const [cardNumber, setCardNumber] = useState('');

    const t = (en: string, rw: string) => language === Language.EN ? en : rw;

    if (!isOpen) return null;

    const handleProcess = () => {
        setStep('processing');
        // Simulate API call
        setTimeout(() => {
            onSuccess(method!);
            onClose();
            // Reset state for next time
            setStep('select');
            setMethod(null);
            setPhone('');
            setCardNumber('');
        }, 2500);
    };

    const renderSelect = () => (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">{t('Select Payment Method', 'Hitamo uburyo bwo kwishyura')}</h3>
            <div className="grid grid-cols-1 gap-3">
                <button
                    onClick={() => { setMethod(PaymentMethod.MTN_MO_MO); setStep('details'); }}
                    className="flex items-center p-4 border-2 border-slate-100 rounded-xl hover:border-yellow-400 hover:bg-yellow-50 transition-all text-left"
                >
                    <div className="w-10 h-10 bg-yellow-400 rounded-lg mr-4 flex items-center justify-center font-bold text-xs">MTN</div>
                    <div>
                        <div className="font-bold">MTN Mobile Money</div>
                        <div className="text-xs text-slate-500">{t('Instant in Rwanda', 'Ako kanya mu Rwanda')}</div>
                    </div>
                </button>
                <button
                    onClick={() => { setMethod(PaymentMethod.MPESA); setStep('details'); }}
                    className="flex items-center p-4 border-2 border-slate-100 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all text-left"
                >
                    <div className="w-10 h-10 bg-emerald-500 rounded-lg mr-4 flex items-center justify-center font-bold text-xs text-white">M-Pesa</div>
                    <div>
                        <div className="font-bold">M-Pesa</div>
                        <div className="text-xs text-slate-500">{t('East Africa Standard', 'Ibisanzwe muri Afurika y\'Iburasirazuba')}</div>
                    </div>
                </button>
                <button
                    onClick={() => { setMethod(PaymentMethod.CREDIT_CARD); setStep('details'); }}
                    className="flex items-center p-4 border-2 border-slate-100 rounded-xl hover:border-indigo-600 hover:bg-indigo-50 transition-all text-left"
                >
                    <div className="w-10 h-10 bg-indigo-600 rounded-lg mr-4 flex items-center justify-center text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                    </div>
                    <div>
                        <div className="font-bold">{t('Credit Card', 'Ikarita ya Banki')}</div>
                        <div className="text-xs text-slate-500">Visa, Mastercard, Amex</div>
                    </div>
                </button>
            </div>
        </div>
    );

    const renderDetails = () => (
        <div className="space-y-4">
            <button onClick={() => setStep('select')} className="text-indigo-600 text-sm font-bold flex items-center mb-2">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                {t('Back', 'Subira inyuma')}
            </button>
            <h3 className="text-lg font-bold text-slate-900">
                {method === PaymentMethod.CREDIT_CARD ? t('Enter Card Details', 'Andika amakuru y\'ikarita') : t('Enter Mobile Number', 'Andika nimero ya terefoni')}
            </h3>

            {method === PaymentMethod.CREDIT_CARD ? (
                <div className="space-y-3">
                    <input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-mono"
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <input type="text" placeholder="MM/YY" className="p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-mono" />
                        <input type="text" placeholder="CVV" className="p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-mono" />
                    </div>
                </div>
            ) : (
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">{t('Phone Number', 'Nimero ya Terefoni')}</label>
                    <input
                        type="tel"
                        placeholder="078XXXXXXX"
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-mono text-lg"
                    />
                </div>
            )}

            <div className="pt-4">
                <button
                    onClick={handleProcess}
                    disabled={method === PaymentMethod.CREDIT_CARD ? !cardNumber : phone.length !== 10}
                    className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50"
                >
                    {t('Pay Now', 'Yshura Ubu')}
                </button>
                <p className="text-[10px] text-center text-slate-400 mt-4 leading-relaxed">
                    {t('By proceeding, you authorize KuBaFit to process this transaction via the Power Pay secure gateway.', 'Ukanze hano, wemeye ko KuBaFit yishyura binyuze muri Power Pay gate.')}
                </p>
            </div>
        </div>
    );

    const renderProcessing = () => (
        <div className="py-12 text-center space-y-6">
            <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <div>
                <h3 className="text-xl font-bold text-slate-900">{t('Processing Payment', 'Irimo kwishyura')}</h3>
                <p className="text-sm text-slate-500 mt-2">{t('Please check your phone for the STK push notification.', 'Reba kuri terefoni yawe niba wahawe ubutumwa bwo kwemeza.')}</p>
            </div>
            <div className="pt-4 flex justify-center gap-2">
                <div className="w-2 h-2 bg-indigo-200 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce delay-200"></div>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <div className="p-8 border-b border-slate-50 bg-slate-50/50">
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-1">{t('Secure Checkout', 'Kwishyura neza')}</p>
                            <h2 className="text-2xl font-bold text-slate-900">{planName}</h2>
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-black text-slate-900">{currency === Currency.USD ? '$' : currency === Currency.GBP ? '£' : currency + ' '}{price}</span>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    {step === 'select' && renderSelect()}
                    {step === 'details' && renderDetails()}
                    {step === 'processing' && renderProcessing()}
                </div>
            </div>
        </div>
    );
};

export default PaymentDialog;
