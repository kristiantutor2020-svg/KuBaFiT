import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../types';
import { useAuth } from './AuthContext';
import { sendChatMessage, getChatHistory, saveChatHistory, clearChatHistory, ChatMessage } from '../services/gemini';

interface AIChatProps {
    language: Language;
}

const AIChat: React.FC<AIChatProps> = ({ language }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const t = (en: string, rw: string) => language === Language.EN ? en : rw;

    // Load chat history on mount
    useEffect(() => {
        if (user) {
            const history = getChatHistory(user.uid);
            setMessages(history);
        }
    }, [user]);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Save messages when they change
    useEffect(() => {
        if (user && messages.length > 0) {
            saveChatHistory(user.uid, messages);
        }
    }, [messages, user]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = {
            role: 'user',
            content: input.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setError(null);
        setIsLoading(true);

        try {
            const response = await sendChatMessage(userMessage.content, messages);
            setMessages(prev => [...prev, response]);
        } catch (err: any) {
            setError(err.message || 'Failed to send message');
        } finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleClearChat = () => {
        if (user) {
            clearChatHistory(user.uid);
            setMessages([]);
        }
    };

    const quickActions = [
        { label: t('Check Inventory Status', 'Reba ibikoresho bihari'), prompt: t('Show me my current inventory status', 'Nyereka uko ibikoresho bihagaze ubu') },
        { label: t('Create New Invoice', 'Kora fagitire nshya'), prompt: t('I want to create a new invoice', 'Ndashaka gukora fagitire nshya') },
        { label: t('Market Efficiency Tips', 'Inama ku isoko'), prompt: t('Give me some efficiency tips for the Rwandan market', 'Mpe inama ku isoko ry\'u Rwanda') },
        { label: t('View Billing Stats', 'Reba imibare yo kwishyuza'), prompt: t('Show me my billing statistics', 'Nyereka imibare yo kwishyuza') },
    ];

    // Parse markdown-like formatting in AI responses
    const renderFormattedMessage = (content: string, isUser: boolean) => {
        if (isUser) {
            return <p className="whitespace-pre-wrap">{content}</p>;
        }

        // Split content into lines and process
        const lines = content.split('\n');
        const elements: React.ReactNode[] = [];
        let listItems: string[] = [];
        let listKey = 0;

        const flushList = () => {
            if (listItems.length > 0) {
                elements.push(
                    <ul key={`list-${listKey++}`} className="space-y-2 my-3">
                        {listItems.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                                <span className="flex-1">{renderInlineFormatting(item)}</span>
                            </li>
                        ))}
                    </ul>
                );
                listItems = [];
            }
        };

        // Render inline formatting (bold, italic)
        const renderInlineFormatting = (text: string) => {
            // Handle **bold** and *italic*
            const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
            return parts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={i} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
                }
                if (part.startsWith('*') && part.endsWith('*')) {
                    return <em key={i} className="italic">{part.slice(1, -1)}</em>;
                }
                return part;
            });
        };

        lines.forEach((line, idx) => {
            const trimmedLine = line.trim();

            // Bullet point (*, -, •)
            if (/^[*\-•]\s+/.test(trimmedLine)) {
                listItems.push(trimmedLine.replace(/^[*\-•]\s+/, ''));
            }
            // Numbered list
            else if (/^\d+\.\s+/.test(trimmedLine)) {
                flushList();
                elements.push(
                    <div key={`num-${idx}`} className="flex items-start gap-2 my-1">
                        <span className="font-semibold text-emerald-600 min-w-[1.5rem]">{trimmedLine.match(/^\d+/)?.[0]}.</span>
                        <span className="flex-1">{renderInlineFormatting(trimmedLine.replace(/^\d+\.\s+/, ''))}</span>
                    </div>
                );
            }
            // Empty line
            else if (trimmedLine === '') {
                flushList();
                elements.push(<div key={`br-${idx}`} className="h-2" />);
            }
            // Regular paragraph
            else {
                flushList();
                elements.push(
                    <p key={`p-${idx}`} className="my-1">
                        {renderInlineFormatting(trimmedLine)}
                    </p>
                );
            }
        });

        flushList();

        return <div className="space-y-1">{elements}</div>;
    };


    return (
        <div className="flex flex-col h-[calc(100vh-12rem)] bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-emerald-500 to-teal-600">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="font-bold text-white">{t('KuBaFit AI Agent', ' KuBaFit AI Agent')}</h2>
                        <p className="text-xs text-white/70">{t('Powered by Gemini 2.0 Flash', 'Ikoreshwa na Gemini 2.0 Flash')}</p>
                    </div>
                </div>
                <button
                    onClick={handleClearChat}
                    className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    title={t('Clear chat', 'Siba ikiganiro')}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center px-4">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-4">
                            <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">
                            {t("Hello! I'm KuBaFit, your AI Agent", "Muraho! Ndi KuBaFit, umukozi wawe wa AI")}
                        </h3>
                        <p className="text-slate-500 mb-6 max-w-md">
                            {t(
                                'I can help you manage inventory, track billing, and provide localized business insights for Rwanda and global markets.',
                                'Ndashobora kuguha inama mu gucunga ibikoresho, kwishyuza, no kuguha amakuru y\'ubucuruzi mu Rwanda no mu mahanga.'
                            )}
                        </p>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-2 gap-2 w-full max-w-md">
                            {quickActions.map((action, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setInput(action.prompt)}
                                    className="p-3 text-left text-sm bg-slate-50 hover:bg-emerald-50 rounded-xl border border-slate-100 hover:border-emerald-200 transition-all group"
                                >
                                    <span className="text-slate-700 group-hover:text-emerald-700">{action.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === 'user'
                                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
                                        : 'bg-slate-100 text-slate-800'
                                        }`}
                                >
                                    {/* Tool calls indicator */}
                                    {msg.toolCalls && msg.toolCalls.length > 0 && (
                                        <div className="mb-2 pb-2 border-b border-slate-200/50">
                                            <div className="flex items-center gap-1 text-xs opacity-70">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {msg.toolCalls.map(tc => tc.name.replace(/_/g, ' ')).join(', ')}
                                            </div>
                                        </div>
                                    )}
                                    {renderFormattedMessage(msg.content, msg.role === 'user')}
                                    <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-white/60' : 'text-slate-400'}`}>
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {/* Loading indicator */}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-slate-100 rounded-2xl px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-1">
                                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                        <span className="text-sm text-slate-500">{t('Thinking...', 'Ndatekereza...')}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="mx-4 mb-2 p-3 bg-red-50 text-red-600 rounded-xl text-sm flex items-center gap-2">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t border-slate-100 bg-slate-50">
                <div className="flex items-end gap-2">
                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={t('Type your message...', 'Andika ubutumwa bwawe...')}
                        rows={1}
                        className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none bg-white transition-all"
                        style={{ minHeight: '48px', maxHeight: '120px' }}
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </div>
                <p className="text-xs text-slate-400 mt-2 text-center">
                    {t('KuBaFit AI can make mistakes. Verify important information.', 'KuBaFit AI irashobora gukora amakosa. Suzuma amakuru y\'ingenzi.')}
                </p>
            </div>
        </div>
    );
};

export default AIChat;
