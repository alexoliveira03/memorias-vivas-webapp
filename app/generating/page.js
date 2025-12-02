"use client";
import { useState, useEffect } from 'react';
import { useLanguage, LanguageProvider } from '../../context/LanguageContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, CheckCircle } from 'lucide-react';

function GeneratingPage() {
    const { t, lang } = useLanguage();
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session');

    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('processing');
    const [message, setMessage] = useState(lang === 'pt-BR' ? 'Iniciando geração...' : 'Starting generation...');

    useEffect(() => {
        if (!sessionId) {
            router.push('/');
            return;
        }

        let pollCount = 0;
        const maxPolls = 120; // 10 minutes max (120 * 5s)

        const pollStatus = async () => {
            try {
                const res = await fetch(`/api/video-status?sessionId=${sessionId}`);
                const data = await res.json();

                pollCount++;

                if (data.status === 'ready' && data.videoUrl) {
                    // Video is ready!
                    setProgress(100);
                    setStatus('ready');
                    setMessage(lang === 'pt-BR' ? 'Vídeo pronto!' : 'Video ready!');

                    localStorage.setItem('finalVideo', JSON.stringify(data));

                    setTimeout(() => {
                        router.push('/download');
                    }, 1000);

                } else if (data.status === 'error') {
                    setStatus('error');
                    setMessage(lang === 'pt-BR' ? 'Erro ao processar vídeo' : 'Error processing video');

                } else {
                    // Still processing - update UI
                    const estimatedProgress = Math.min((pollCount / maxPolls) * 90, 90);
                    setProgress(estimatedProgress);

                    // Update message based on progress
                    if (estimatedProgress < 30) {
                        setMessage(lang === 'pt-BR' ? 'Analisando fotos...' : 'Analyzing photos...');
                    } else if (estimatedProgress < 60) {
                        setMessage(lang === 'pt-BR' ? 'Gerando animações com IA...' : 'Generating AI animations...');
                    } else {
                        setMessage(lang === 'pt-BR' ? 'Finalizando vídeo...' : 'Finalizing video...');
                    }
                }

                // Timeout after max polls
                if (pollCount >= maxPolls) {
                    setStatus('error');
                    setMessage(lang === 'pt-BR' ? 'Tempo esgotado. Entre em contato.' : 'Timeout. Please contact support.');
                }

            } catch (err) {
                console.error('Polling error:', err);
            }
        };

        // Poll every 5 seconds
        const interval = setInterval(pollStatus, 5000);
        pollStatus(); // Initial call

        return () => clearInterval(interval);
    }, [sessionId, router, lang]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#0a0a0f]">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-md w-full"
            >
                <div className="mb-8 relative">
                    <div className="absolute inset-0 bg-violet-500/20 blur-3xl rounded-full" />
                    {status === 'ready' ? (
                        <CheckCircle size={64} className="text-green-400 mx-auto relative z-10" />
                    ) : status === 'error' ? (
                        <div className="text-red-400 mx-auto relative z-10 text-5xl">⚠️</div>
                    ) : (
                        <Sparkles size={64} className="text-violet-400 mx-auto relative z-10 animate-pulse" />
                    )}
                </div>

                <h2 className="text-3xl font-bold mb-4 text-white">
                    {status === 'ready' ? (lang === 'pt-BR' ? 'Pronto!' : 'Ready!') : (lang === 'pt-BR' ? 'Processando...' : 'Processing...')}
                </h2>
                <p className="text-gray-400 mb-12">{message}</p>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mb-4">
                    <motion.div
                        className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                        style={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                    <span>{Math.round(progress)}%</span>
                    {status === 'processing' && <Loader2 size={14} className="animate-spin" />}
                </div>

                {status === 'error' && (
                    <button
                        onClick={() => router.push('/')}
                        className="mt-8 btn-primary px-6 py-3"
                    >
                        {lang === 'pt-BR' ? 'Tentar Novamente' : 'Try Again'}
                    </button>
                )}
            </motion.div>
        </div>
    );
}

export default function Page() {
    return (
        <LanguageProvider>
            <GeneratingPage />
        </LanguageProvider>
    );
}
