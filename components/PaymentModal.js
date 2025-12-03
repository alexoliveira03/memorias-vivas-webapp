"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Loader2, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function PaymentModal({ isOpen, onClose, title, message, type = 'success', loading = false }) {
    const { t } = useLanguage();
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={loading ? undefined : onClose}
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
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white">{title}</h3>
                        {!loading && (
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col items-center text-center">
                        {loading ? (
                            <div className="w-16 h-16 mb-4 rounded-full bg-violet-500/10 flex items-center justify-center">
                                <Loader2 size={32} className="text-violet-500 animate-spin" />
                            </div>
                        ) : (
                            <div className="w-16 h-16 mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
                                <CheckCircle size={32} className="text-green-500" />
                            </div>
                        )}

                        <p className="text-gray-300 leading-relaxed mb-4">
                            {message}
                        </p>

                        {!loading && type === 'success' && (
                            <div className="w-full mb-6 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3">
                                <AlertTriangle size={20} className="text-amber-400 flex-shrink-0" />
                                <p className="text-sm text-amber-200 text-left">
                                    {t('deliveryTimeWarning')}
                                </p>
                            </div>
                        )}

                        {!loading && (
                            <button
                                onClick={onClose}
                                className="w-full py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-violet-500/20"
                            >
                                {t('gotIt')}
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
