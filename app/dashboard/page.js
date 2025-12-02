"use client";
import { useState, useEffect } from 'react';
import { useLanguage, LanguageProvider } from '../../context/LanguageContext';
import { auth, storage } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import PhotoUpload from '../../components/PhotoUpload';
import MusicSelector from '../../components/MusicSelector';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, LogOut, Loader2, Sparkles, ChevronLeft, ChevronRight, Zap, Image as ImageIcon } from 'lucide-react';

function Dashboard() {
    const { t } = useLanguage();
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [images, setImages] = useState([]);
    const [selectedMusic, setSelectedMusic] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [previewIndex, setPreviewIndex] = useState(0);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                router.push('/');
            }
        });
        return () => unsubscribe();
    }, [router]);

    const handleGenerate = async () => {
        if (images.length === 0 || !selectedMusic) return;

        setUploading(true);
        try {
            const imageUrls = [];

            for (let i = 0; i < images.length; i++) {
                const file = images[i].file;
                const storageRef = ref(storage, `uploads/${user.uid}/${Date.now()}_${i}_${file.name}`);
                const snapshot = await uploadBytes(storageRef, file);
                const url = await getDownloadURL(snapshot.ref);
                imageUrls.push(url);
            }

            localStorage.setItem('pendingOrder', JSON.stringify({
                images: imageUrls,
                music: selectedMusic,
                userId: user.uid
            }));

            router.push('/payment');
        } catch (error) {
            console.error("Error uploading images:", error);
            alert("Erro ao fazer upload das imagens. Tente novamente.");
        } finally {
            setUploading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Header */}
            <header className="sticky top-0 z-50 glass border-b border-white/10">
                <div className="px-8 py-4 flex items-center justify-between max-w-[2000px] mx-auto">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
                            <Sparkles size={20} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">Memorias Vivas</h1>
                            <p className="text-xs text-gray-400">AI Video Studio</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl glass">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-sm font-medium">Credits: <span className="text-gradient">44</span></span>
                        </div>
                        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                            <img src={user.photoURL} alt="User" className="w-9 h-9 rounded-xl border-2 border-white/20" />
                            <button
                                onClick={() => auth.signOut()}
                                className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar */}
                <aside className="w-full md:w-[420px] border-r border-white/10 overflow-y-auto">
                    <div className="p-6 space-y-6">
                        {/* Header */}
                        <div>
                            <h2 className="text-2xl font-bold mb-1 text-gradient">Create Magic</h2>
                            <p className="text-sm text-gray-400">Transform photos into animated videos</p>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-2 p-1.5 rounded-xl glass">
                            <button className="flex-1 py-2.5 px-4 text-sm font-semibold bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-lg shadow-lg shadow-violet-500/20 flex items-center justify-center gap-2 transition-all">
                                <Zap size={16} /> Image to Video
                            </button>
                            <button className="flex-1 py-2.5 px-4 text-sm font-medium text-gray-400 hover:text-white transition-colors rounded-lg flex items-center justify-center gap-2">
                                <Sparkles size={16} /> Text to Video
                            </button>
                        </div>

                        {/* Upload */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-semibold">Photos</label>
                                <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-full">{images.length}/10</span>
                            </div>
                            <PhotoUpload images={images} setImages={setImages} />
                        </div>

                        {/* Aspect Ratio */}
                        <div className="space-y-3">
                            <label className="text-sm font-semibold block">Aspect Ratio</label>
                            <div className="grid grid-cols-2 gap-2">
                                {['16:9', '9:16', '1:1', '4:3'].map((ratio, idx) => (
                                    <button
                                        key={ratio}
                                        className={`py-3 px-4 rounded-xl font-medium text-sm transition-all ${idx === 0
                                                ? 'bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 border-2 border-violet-500/50 text-white'
                                                : 'glass glass-hover text-gray-300'
                                            }`}
                                    >
                                        {ratio}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Music */}
                        {images.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="space-y-3"
                            >
                                <label className="text-sm font-semibold block">Soundtrack</label>
                                <MusicSelector selectedMusic={selectedMusic} setSelectedMusic={setSelectedMusic} />
                            </motion.div>
                        )}

                        {/* Prompt */}
                        <div className="space-y-3">
                            <label className="text-sm font-semibold block">Animation Style</label>
                            <textarea
                                className="w-full glass rounded-xl p-4 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 min-h-[100px] resize-none transition-all"
                                placeholder="Describe the motion and style..."
                                defaultValue="Natural movements, smiles, people looking at each other in a happy family moment."
                            />
                        </div>

                        {/* Generate Button */}
                        <button
                            onClick={handleGenerate}
                            disabled={images.length === 0 || !selectedMusic || uploading}
                            className="w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold rounded-xl shadow-2xl shadow-violet-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-lg group"
                        >
                            {uploading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                                    Generate Video
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>

                        {images.length > 0 && selectedMusic && (
                            <div className="flex items-center justify-between text-sm px-2">
                                <span className="text-gray-400">{images.length} photos • {selectedMusic}</span>
                                <span className="text-xl font-bold text-gradient">R$ 39,90</span>
                            </div>
                        )}
                    </div>
                </aside>

                {/* Right Preview Area */}
                <main className="flex-1 bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center p-8 overflow-hidden relative">
                    {/* Background Decoration */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-20 -right-20 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-20 -left-20 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl" />
                    </div>

                    {images.length > 0 ? (
                        <div className="relative z-10 w-full max-w-5xl">
                            {/* Main Preview */}
                            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black/50 backdrop-blur-sm group">
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={previewIndex}
                                        src={images[previewIndex].preview}
                                        alt="Preview"
                                        className="w-full h-full object-contain"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                    />
                                </AnimatePresence>

                                {/* Navigation */}
                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={() => setPreviewIndex((prev) => (prev - 1 + images.length) % images.length)}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full glass glass-hover opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <ChevronLeft size={24} />
                                        </button>
                                        <button
                                            onClick={() => setPreviewIndex((prev) => (prev + 1) % images.length)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full glass glass-hover opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <ChevronRight size={24} />
                                        </button>
                                    </>
                                )}

                                {/* Counter */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full glass text-sm font-medium">
                                    {previewIndex + 1} / {images.length}
                                </div>
                            </div>

                            {/* Thumbnails */}
                            <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setPreviewIndex(idx)}
                                        className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${idx === previewIndex
                                                ? 'border-violet-500 scale-105 shadow-lg shadow-violet-500/50'
                                                : 'border-white/10 hover:border-white/30'
                                            }`}
                                    >
                                        <img src={img.preview} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="relative z-10 text-center max-w-md">
                            <div className="w-24 h-24 rounded-2xl glass flex items-center justify-center mx-auto mb-6 shadow-2xl">
                                <ImageIcon size={40} className="text-gray-600" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-gradient">Ready to Create Magic?</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Upload your photos in the sidebar to start transforming memories into beautiful animated videos.
                            </p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default function Page() {
    return (
        <LanguageProvider>
            <Dashboard />
        </LanguageProvider>
    );
}
