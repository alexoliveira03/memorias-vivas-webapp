"use client";
import { useState, useEffect } from 'react';
import { useLanguage, LanguageProvider } from '../../context/LanguageContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Download, Share2, Home, CheckCircle } from 'lucide-react';

function DownloadPage() {
    const { t, lang } = useLanguage();
    const router = useRouter();
    const [videoData, setVideoData] = useState(null);

    useEffect(() => {
        const data = localStorage.getItem('finalVideo');
        if (!data) {
            router.push('/');
            return;
        }
        setVideoData(JSON.parse(data));
    }, [router]);

    if (!videoData) return null;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0a0a0f]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-5xl w-full"
            >
                {/* Success Banner */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <CheckCircle className="text-green-400" size={32} />
                    <h1 className="text-3xl font-bold text-white">
                        {lang === 'pt-BR' ? 'Sua Memória Viva Está Pronta!' : 'Your Living Memory is Ready!'}
                    </h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Video Player */}
                    <div className="w-full lg:w-2/3">
                        <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                            <video
                                src={videoData.videoUrl}
                                controls
                                className="w-full h-full object-contain"
                                autoPlay
                                loop
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="w-full lg:w-1/3 space-y-6">
                        <div className="glass p-6 rounded-2xl border border-white/10">
                            <h2 className="text-xl font-bold mb-4 text-white">
                                {lang === 'pt-BR' ? 'Seu vídeo foi gerado!' : 'Your video is ready!'}
                            </h2>
                            <p className="text-gray-400 mb-6 text-sm">
                                {lang === 'pt-BR'
                                    ? 'Baixe agora e reviva suas memórias!'
                                    : 'Download now and relive your memories!'}
                            </p>

                            <div className="space-y-3">
                                <a
                                    href={videoData.videoUrl}
                                    download="MinhaMemoria.mp4"
                                    className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base"
                                >
                                    <Download size={20} />
                                    {lang === 'pt-BR' ? 'Baixar Vídeo' : 'Download Video'}
                                </a>

                                <button
                                    onClick={() => {
                                        if (navigator.share) {
                                            navigator.share({
                                                title: 'Minha Memória Viva',
                                                text: 'Veja meu vídeo!',
                                                url: videoData.videoUrl
                                            });
                                        } else {
                                            alert(lang === 'pt-BR' ? 'Compartilhamento não suportado' : 'Sharing not supported');
                                        }
                                    }}
                                    className="w-full py-3 rounded-lg border border-white/20 hover:bg-white/5 flex items-center justify-center gap-2 transition-colors text-white"
                                >
                                    <Share2 size={20} />
                                    {lang === 'pt-BR' ? 'Compartilhar' : 'Share'}
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                localStorage.removeItem('pendingOrder');
                                localStorage.removeItem('videoSession');
                                localStorage.removeItem('finalVideo');
                                router.push('/');
                            }}
                            className="text-sm text-gray-400 hover:text-white flex items-center justify-center gap-2 w-full py-3 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
                        >
                            <Home size={16} />
                            {lang === 'pt-BR' ? 'Criar Nova Memória' : 'Create New Memory'}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default function Page() {
    return (
        <LanguageProvider>
            <DownloadPage />
        </LanguageProvider>
    );
}
