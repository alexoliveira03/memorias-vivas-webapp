"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, MessageCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useState } from 'react';

export default function DeliveryChoiceModal({ isOpen, onSubmit, orderData }) {
    const { t, lang } = useLanguage();
    const [deliveryMethod, setDeliveryMethod] = useState('email');
    const [contact, setContact] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validatePhone = (phone) => {
        // Basic validation: must have at least 10 digits
        const cleaned = phone.replace(/\D/g, '');
        return cleaned.length >= 10 && cleaned.length <= 15;
    };

    const handleSubmit = async () => {
        setError('');

        if (!contact.trim()) {
            setError(deliveryMethod === 'email' ? t('deliveryValidationEmail') : t('deliveryValidationPhone'));
            return;
        }

        if (deliveryMethod === 'email' && !validateEmail(contact)) {
            setError(t('deliveryValidationEmail'));
            return;
        }

        if (deliveryMethod === 'whatsapp' && !validatePhone(contact)) {
            setError(t('deliveryValidationPhone'));
            return;
        }

        setLoading(true);
        await onSubmit(deliveryMethod, contact);
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-md bg-[#0a0a0f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white/5">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                                <CheckCircle size={24} className="text-green-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">
                                    {lang === 'pt-BR' ? 'Pagamento Confirmado!' : 'Payment Confirmed!'}
                                </h3>
                                <p className="text-sm text-gray-400">
                                    {t('deliveryChoiceTitle')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                        {/* Radio Buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={() => {
                                    setDeliveryMethod('email');
                                    setContact('');
                                    setError('');
                                }}
                                className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${deliveryMethod === 'email'
                                        ? 'border-violet-500 bg-violet-500/10'
                                        : 'border-white/10 hover:border-white/20'
                                    }`}
                            >
                                <Mail size={20} className={deliveryMethod === 'email' ? 'text-violet-500' : 'text-gray-400'} />
                                <span className="font-medium text-white">{t('deliveryChoiceEmail')}</span>
                            </button>

                            <button
                                onClick={() => {
                                    setDeliveryMethod('whatsapp');
                                    setContact('');
                                    setError('');
                                }}
                                className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${deliveryMethod === 'whatsapp'
                                        ? 'border-violet-500 bg-violet-500/10'
                                        : 'border-white/10 hover:border-white/20'
                                    }`}
                            >
                                <MessageCircle size={20} className={deliveryMethod === 'whatsapp' ? 'text-violet-500' : 'text-gray-400'} />
                                <span className="font-medium text-white">{t('deliveryChoiceWhatsApp')}</span>
                            </button>
                        </div>

                        {/* Input Field */}
                        <div>
                            <input
                                type={deliveryMethod === 'email' ? 'email' : 'tel'}
                                value={contact}
                                onChange={(e) => {
                                    setContact(e.target.value);
                                    setError('');
                                }}
                                placeholder={deliveryMethod === 'email' ? t('deliveryEmailPlaceholder') : t('deliveryPhonePlaceholder')}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
                            />
                            {error && (
                                <p className="mt-2 text-sm text-red-500">{error}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-violet-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    <span>{t('processing')}</span>
                                </>
                            ) : (
                                <span>{t('deliverySubmit')}</span>
                            )}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
