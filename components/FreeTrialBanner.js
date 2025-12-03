"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function FreeTrialBanner({ onLogin, user }) {
    const { t } = useLanguage();
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        // Check if banner was previously dismissed
        const isDismissed = localStorage.getItem('freeTrialBannerDismissed');
        if (isDismissed === 'true') {
            setDismissed(true);
        }
    }, []);

    const handleDismiss = () => {
        setDismissed(true);
        localStorage.setItem('freeTrialBannerDismissed', 'true');
    };

    // Don't show if user is already logged in or banner is dismissed
    if (user || dismissed) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="fixed top-16 md:top-20 left-0 right-0 z-40 px-4 py-3"
            >
                <div className="container mx-auto">
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600/20 via-fuchsia-600/20 to-violet-600/20 backdrop-blur-xl border border-violet-500/30 shadow-2xl shadow-violet-500/20">
                        {/* Animated background gradient */}
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-fuchsia-600/10 to-violet-600/10 animate-pulse" />

                        <div className="relative flex items-center justify-between gap-4 px-4 md:px-6 py-3 md:py-4">
                            <div className="flex items-center gap-3 md:gap-4 flex-1">
                                <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                                    <Gift className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                </div>
                                <p className="text-sm md:text-base font-medium text-white flex-1">
                                    {t('freeTrialBanner')}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                                <button
                                    onClick={onLogin}
                                    className="px-4 md:px-6 py-2 md:py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-bold text-sm md:text-base transition-all shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105"
                                >
                                    {t('freeTrialLogin')}
                                </button>
                                <button
                                    onClick={handleDismiss}
                                    className="p-2 rounded-full hover:bg-white/10 transition-all"
                                    aria-label={t('dismissBanner')}
                                >
                                    <X className="w-5 h-5 text-white/70 hover:text-white" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
