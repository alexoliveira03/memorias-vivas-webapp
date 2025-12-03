"use client";
import { useState, useEffect, Suspense } from 'react';
import { useLanguage, LanguageProvider } from '../../context/LanguageContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, CheckCircle } from 'lucide-react';

function GeneratingPageContent() {
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

                if (data.status === 'completed') {
                    setProgress(100);
                    setStatus('completed');
                    setMessage(lang === 'pt-BR' ? 'Vídeo gerado com sucesso!' : 'Video generated successfully!');
                    setTimeout(() => {
                        router.push(`/download?session=${sessionId}`);
                    }, 2000);
                } else if (data.status === 'failed') {
                    setStatus('failed');
                    setMessage(lang === 'pt-BR' ? 'Erro ao gerar o vídeo.' : 'Error generating video.');
                } else {
                    // Still processing
                    setProgress(Math.min((pollCount / maxPolls) * 90, 90));
                    pollCount++;

                    if (pollCount < maxPolls) {
                        setTimeout(pollStatus, 5000); // Poll every 5 seconds
                    } else {
                        setStatus('timeout');
                        setMessage(lang === 'pt-BR' ? 'Tempo esgotado. Verifique seu e-mail.' : 'Timeout. Check your email.');
                    }
                }
            } catch (error) {
                console.error('Error polling status:', error);
                pollCount++;
                if (pollCount < maxPolls) {
                    setTimeout(pollStatus, 5000);
                }
            }
        };

        pollStatus();
    }, [sessionId, router, lang]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] text-white p-6">
            <div className="max-w-md w-full text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    {status === 'processing' && (
                        <>
                            <div className="flex justify-center">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                >
                                    <Loader2 size={64} className="text-violet-500" />
                                </motion.div>
                            </div>
                            <h1 className="text-3xl font-bold">
                                {lang === 'pt-BR' ? 'Criando Sua Memória...' : 'Creating Your Memory...'}
                            </h1>
                            <p className="text-gray-400">{message}</p>
                            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.5 }}
                                    className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                                />
                            </div>
                            <p className="text-sm text-gray-500">
                                {lang === 'pt-BR'
                                    ? 'Isso pode levar alguns minutos...'
                                    : 'This may take a few minutes...'}
                            </p>
                        </>
                    )}

                    {status === 'completed' && (
                        <>
                            <div className="flex justify-center">
                                <CheckCircle size={64} className="text-green-500" />
                            </div>
                            <h1 className="text-3xl font-bold text-green-500">
                                {lang === 'pt-BR' ? 'Pronto!' : 'Complete!'}
                            </h1>
                            <p className="text-gray-400">{message}</p>
                        </>
                    )}

                    {(status === 'failed' || status === 'timeout') && (
                        <>
                            <div className="text-red-500 text-6xl">⚠️</div>
                            <h1 className="text-3xl font-bold text-red-500">
                                {lang === 'pt-BR' ? 'Erro' : 'Error'}
                            </h1>
                            <p className="text-gray-400">{message}</p>
                        </>
                    )}
                </motion.div>
            </div>
        </div>
    );
}

function GeneratingPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] text-white">
                <Loader2 size={64} className="text-violet-500 animate-spin" />
            </div>
        }>
            <GeneratingPageContent />
        </Suspense>
    );
}

export default function Page() {
    return (
        <LanguageProvider>
            <GeneratingPage />
        </LanguageProvider>
    );
}
