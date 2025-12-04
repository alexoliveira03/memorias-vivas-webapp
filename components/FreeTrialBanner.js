"use client";
import { motion } from 'framer-motion';
import { Gift } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function FreeTrialBanner({ onLogin, user }) {
    const { t } = useLanguage();

    // Don't show if user is already logged in
    if (user) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
        >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600/20 via-fuchsia-600/20 to-violet-600/20 backdrop-blur-xl border border-violet-500/30 shadow-2xl shadow-violet-500/20">
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-fuchsia-600/10 to-violet-600/10 animate-pulse" />

                <div className="relative flex flex-col md:flex-row items-center justify-between gap-4 px-6 md:px-8 py-6 md:py-8">
                    <div className="flex items-center gap-4 md:gap-6 flex-1 text-center md:text-left">
                        <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/50">
                            <Gift className="w-8 h-8 md:w-10 md:h-10 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                                {t('freeTrialLogin')}!
                            </h3>
                            <p className="text-sm md:text-base font-medium text-white/90">
                                {t('freeTrialBanner')}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onLogin}
                        className="w-full md:w-auto px-8 py-3 md:py-4 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-bold text-base md:text-lg transition-all shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105"
                    >
                        {t('login')}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
