"use client";
import { useState, useEffect } from 'react';
import { useLanguage, LanguageProvider } from '../context/LanguageContext';
import { auth, storage, googleProvider } from '../lib/firebase';
import { signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Upload, Music, Sparkles, Globe2, Zap, ArrowRight, Loader2, ChevronLeft, ChevronRight, Image as ImageIcon, LogOut } from 'lucide-react';
import PhotoUpload from '../components/PhotoUpload';
import MusicSelector, { MUSIC_OPTIONS } from '../components/MusicSelector';
import Footer from '../components/Footer';

function LandingPage() {
    const { t, setLang, lang } = useLanguage();
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    // Dashboard State
    const [images, setImages] = useState([]);
    const [selectedMusic, setSelectedMusic] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [previewIndex, setPreviewIndex] = useState(0);

    const [duration, setDuration] = useState(5);

    // Auth - only track authenticated state, no auto-login
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleLogin = async () => {
        setLoading(true);
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            // Silently handle popup close (user cancelled login)
            if (error.code === 'auth/popup-closed-by-user') {
                console.log('Login cancelled by user');
            } else {
                console.error("Login failed", error);
            }
        } finally {
            setLoading(false);
        }
    };

    const toggleLang = () => {
        setLang(lang === 'pt-BR' ? 'en-US' : 'pt-BR');
    };

    // Session ID for anonymous users
    const getOrCreateSessionId = () => {
        let sessionId = localStorage.getItem('sessionId');
        if (!sessionId) {
            sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem('sessionId', sessionId);
        }
        return sessionId;
    };

    // Price Calculation
    const getPricePerImage = () => {
        if (lang === 'pt-BR') {
            return duration === 5 ? 2.90 : 5.90;
        } else {
            return duration === 5 ? 0.90 : 1.80;
        }
    };

    const getTotalPrice = () => {
        return (images.length * getPricePerImage()).toFixed(2);
    };

    const getCurrencySymbol = () => lang === 'pt-BR' ? 'R$' : '$';

    const handleGenerate = async () => {
        if (images.length === 0 || !selectedMusic) return;

        setUploading(true);
        try {
            // Use userId if logged in, otherwise use sessionId
            const uploaderId = user?.uid || getOrCreateSessionId();
            const imageUrls = [];

            for (let i = 0; i < images.length; i++) {
                const file = images[i].file;
                const storageRef = ref(storage, `uploads/${uploaderId}/${Date.now()}_${i}_${file.name}`);
                const snapshot = await uploadBytes(storageRef, file);
                const url = await getDownloadURL(snapshot.ref);
                imageUrls.push(url);
            }

            // Find the full music object or URL based on the selected ID
            const selectedMusicOption = MUSIC_OPTIONS.find(m => m.id === selectedMusic);
            const musicUrl = selectedMusicOption ? selectedMusicOption.url : selectedMusic;

            localStorage.setItem('pendingOrder', JSON.stringify({
                images: imageUrls,
                music: musicUrl,
                duration: duration,
                totalPrice: getTotalPrice(),
                currency: lang === 'pt-BR' ? 'BRL' : 'USD',
                userId: user?.uid || '', // Empty if not logged in
                sessionId: getOrCreateSessionId(), // Always present
                userEmail: user?.email || '' // Empty if not logged in
            }));

            router.push('/payment');
        } catch (error) {
            console.error("Error uploading images:", error);
            alert(lang === 'pt-BR'
                ? "Erro ao fazer upload das imagens. Tente novamente."
                : "Error uploading images. Please try again."
            );
        } finally {
            setUploading(false);
        }
    };

    const scrollToCreate = () => {
        document.getElementById('create-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#0a0a0f] text-white">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
                            <Sparkles size={20} className="text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">Memorias Vivas</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleLang}
                            className="flex items-center gap-2 px-4 py-2 rounded-full glass hover:bg-white/10 transition-all"
                        >
                            <img
                                src={lang === 'pt-BR'
                                    ? "https://flagcdn.com/w40/us.png"
                                    : "https://flagcdn.com/w40/br.png"
                                }
                                alt={lang === 'pt-BR' ? "US Flag" : "Brazil Flag"}
                                className="w-5 h-3.5 rounded-sm object-cover"
                            />
                            <span className="text-sm font-medium">{lang === 'pt-BR' ? 'EN' : 'PT'}</span>
                        </button>
                        {user ? (
                            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                                <img src={user.photoURL} alt="User" className="w-8 h-8 rounded-full border border-white/20" />
                                <button
                                    onClick={async () => {
                                        await auth.signOut();
                                        window.location.reload();
                                    }}
                                    className="text-gray-400 hover:text-white"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleLogin}
                                disabled={loading}
                                className="text-sm font-medium px-4 py-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 transition-colors disabled:opacity-50"
                            >
                                {loading ? t('processing') : t('login')}
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex-1 flex flex-col">
                <section className="min-h-screen flex items-center justify-center px-6 pt-24 pb-16 relative overflow-hidden">
                    {/* Background Decoration */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px]" />
                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[120px]" />
                    </div>

                    <div className="container mx-auto max-w-6xl relative z-10">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            {/* Left Column - Content */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 mb-6">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                                    </span>
                                    <span className="text-sm font-medium text-violet-300">{t('aiPowered')}</span>
                                </div>

                                <h1 className="text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                                    {t('heroTitle').split(' ')[0]}<br />
                                    <span className="text-gradient">{t('heroTitle').split(' ').slice(1).join(' ')}</span>
                                </h1>

                                <p className="text-xl text-gray-400 mb-10 leading-relaxed max-w-lg">
                                    {t('heroSubtitle')}
                                </p>

                                <button
                                    onClick={scrollToCreate}
                                    className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4 shadow-xl shadow-violet-500/20 hover:shadow-violet-500/40 transition-all"
                                >
                                    {t('startCreating')}
                                    <ArrowRight size={20} />
                                </button>
                            </motion.div>

                            {/* Right Column - Feature Cards */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="grid gap-6"
                            >
                                {[
                                    {
                                        icon: Upload,
                                        title: t('uploadTitle'),
                                        desc: t('uploadDesc'),
                                        color: 'from-violet-500 to-indigo-500',
                                        iconColor: 'text-violet-400'
                                    },
                                    {
                                        icon: Music,
                                        title: t('musicTitle'),
                                        desc: t('musicDesc'),
                                        color: 'from-fuchsia-500 to-pink-500',
                                        iconColor: 'text-fuchsia-400'
                                    },
                                    {
                                        icon: Sparkles,
                                        title: t('generateBtn'),
                                        desc: t('generateDesc'),
                                        color: 'from-amber-500 to-orange-500',
                                        iconColor: 'text-amber-400'
                                    }
                                ].map((feature, i) => (
                                    <div key={i} className="glass p-6 rounded-2xl group hover:bg-white/5 transition-colors border border-white/5">
                                        <div className="flex items-start gap-5">
                                            <div className={`p-4 rounded-2xl bg-gradient-to-br ${feature.color} bg-opacity-10 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                                <feature.icon size={24} className="text-white" />
                                            </div>
                                            <div className="flex-1 pt-1">
                                                <h3 className="text-lg font-bold mb-1">{feature.title}</h3>
                                                <p className="text-sm text-gray-400">{feature.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Dashboard / Create Section */}
                <section id="create-section" className="min-h-screen bg-[#050508] border-t border-white/5 relative">
                    <div className="container mx-auto px-6 py-20">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold mb-4">
                                {t('createMasterpiece')}
                            </h2>
                            <p className="text-gray-400 max-w-2xl mx-auto">{t('createDesc')}</p>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-8 h-[800px] glass rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                            {/* Left Sidebar - Controls */}
                            <aside className="w-full lg:w-[450px] bg-[#0a0a0f]/50 border-r border-white/5 overflow-y-auto p-8 flex flex-col gap-8">

                                {/* Banner */}
                                <div className="w-full py-3 px-4 rounded-xl glass bg-white/5 border border-white/10 text-center">
                                    <span className="text-sm font-medium text-gray-300">
                                        {lang === 'pt-BR' ? 'Clique abaixo para escolher suas fotos' : 'Click below to choose your photos'}
                                    </span>
                                </div>

                                {/* Upload */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-bold text-gray-200">{t('photos')}</label>
                                        <span className="text-xs font-medium text-gray-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">{images.length}/10</span>
                                    </div>
                                    <PhotoUpload images={images} setImages={setImages} />
                                </div>

                                {/* Duration Selector */}
                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-gray-200 block">{t('durationTitle')}</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[5, 10].map((d) => (
                                            <button
                                                key={d}
                                                onClick={() => setDuration(d)}
                                                className={`p-4 rounded-xl border transition-all text-left relative overflow-hidden group ${duration === d
                                                    ? 'border-violet-500 bg-violet-500/20'
                                                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                                                    }`}
                                            >
                                                <div className="font-bold text-lg mb-1">{d}s</div>
                                                <div className="text-xs text-gray-400">
                                                    {getCurrencySymbol()} {lang === 'pt-BR' ? (d === 5 ? '2,90' : '5,90') : (d === 5 ? '0.90' : '1.80')} /{t('perImage')}
                                                </div>
                                                {duration === d && (
                                                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Music */}
                                {images.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="space-y-4"
                                    >
                                        <label className="text-sm font-bold text-gray-200 block">{t('soundtrack')}</label>
                                        <MusicSelector selectedMusic={selectedMusic} setSelectedMusic={setSelectedMusic} />
                                    </motion.div>
                                )}

                                {/* Generate Button */}
                                <div className="mt-auto pt-6">
                                    <button
                                        onClick={handleGenerate}
                                        disabled={images.length === 0 || !selectedMusic || uploading}
                                        className="w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold rounded-xl shadow-xl shadow-violet-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-lg group relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                        {uploading ? (
                                            <>
                                                <Loader2 size={20} className="animate-spin" />
                                                {t('processing')}
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                                                {t('generateBtn')}
                                            </>
                                        )}
                                    </button>
                                    {images.length > 0 && selectedMusic && (
                                        <div className="flex items-center justify-center gap-2 mt-3 text-sm text-gray-400">
                                            <span>{t('total')}:</span>
                                            <span className="text-lg font-bold text-white">
                                                {getCurrencySymbol()} {getTotalPrice()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </aside>

                            {/* Right Preview Area */}
                            <main className="flex-1 bg-black/40 flex items-center justify-center p-8 relative">
                                {images.length > 0 ? (
                                    <div className="w-full max-w-3xl flex flex-col gap-6">
                                        {/* Main Preview */}
                                        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[#050508] group">
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
                                                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full glass hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
                                                    >
                                                        <ChevronLeft size={24} />
                                                    </button>
                                                    <button
                                                        onClick={() => setPreviewIndex((prev) => (prev + 1) % images.length)}
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full glass hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
                                                    >
                                                        <ChevronRight size={24} />
                                                    </button>
                                                </>
                                            )}

                                            {/* Counter */}
                                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full glass text-xs font-bold tracking-wider">
                                                {previewIndex + 1} / {images.length}
                                            </div>
                                        </div>

                                        {/* Thumbnails */}
                                        <div className="flex gap-3 overflow-x-auto pb-4 px-1 scrollbar-hide justify-center">
                                            {images.map((img, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setPreviewIndex(idx)}
                                                    className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${idx === previewIndex
                                                        ? 'border-violet-500 scale-110 shadow-lg shadow-violet-500/30 z-10'
                                                        : 'border-white/10 hover:border-white/30 opacity-60 hover:opacity-100'
                                                        }`}
                                                >
                                                    <img src={img.preview} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center max-w-md">
                                        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 flex items-center justify-center mx-auto mb-8 shadow-2xl rotate-3">
                                            <ImageIcon size={40} className="text-gray-500" />
                                        </div>
                                        <h3 className="text-3xl font-bold mb-4">{t('readyToCreate')}</h3>
                                        <p className="text-gray-400 text-lg leading-relaxed">
                                            {t('readyDesc')}
                                        </p>
                                    </div>
                                )}
                            </main>
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section className="py-24 bg-[#0a0a0f] border-t border-white/5">
                    <div className="container mx-auto px-6 max-w-5xl">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('pricingTitle')}</h2>
                            <p className="text-gray-400">{t('pricingSubtitle')}</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Plan 1: 5s */}
                            <div className="glass p-8 rounded-3xl border border-white/10 hover:border-violet-500/30 transition-all group relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Zap size={100} />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">{t('shortDuration')}</h3>
                                <p className="text-gray-400 mb-6">5 {t('seconds')} / {t('perImage')}</p>
                                <div className="text-4xl font-bold mb-8 text-violet-400">
                                    {getCurrencySymbol()} {lang === 'pt-BR' ? '2,90' : '0.90'}
                                    <span className="text-sm text-gray-500 font-normal ml-2">/ {t('perImage')}</span>
                                </div>
                                <ul className="space-y-3 text-gray-300 mb-8">
                                    <li className="flex items-center gap-2"><Sparkles size={16} className="text-violet-500" /> HD Quality (720p)</li>
                                    <li className="flex items-center gap-2"><Sparkles size={16} className="text-violet-500" /> AI Transitions</li>
                                    <li className="flex items-center gap-2"><Sparkles size={16} className="text-violet-500" /> Music Sync</li>
                                </ul>
                                <button onClick={scrollToCreate} className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all font-medium">
                                    {t('startCreating')}
                                </button>
                            </div>

                            {/* Plan 2: 10s */}
                            <div className="glass p-8 rounded-3xl border border-violet-500/30 bg-violet-500/5 hover:bg-violet-500/10 transition-all group relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Play size={100} />
                                </div>
                                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-violet-500 text-xs font-bold">POPULAR</div>
                                <h3 className="text-2xl font-bold mb-2">{t('longDuration')}</h3>
                                <p className="text-gray-400 mb-6">10 {t('seconds')} / {t('perImage')}</p>
                                <div className="text-4xl font-bold mb-8 text-fuchsia-400">
                                    {getCurrencySymbol()} {lang === 'pt-BR' ? '5,90' : '1.80'}
                                    <span className="text-sm text-gray-500 font-normal ml-2">/ {t('perImage')}</span>
                                </div>
                                <ul className="space-y-3 text-gray-300 mb-8">
                                    <li className="flex items-center gap-2"><Sparkles size={16} className="text-fuchsia-500" /> Full HD Quality (1080p)</li>
                                    <li className="flex items-center gap-2"><Sparkles size={16} className="text-fuchsia-500" /> Extended Motion</li>
                                    <li className="flex items-center gap-2"><Sparkles size={16} className="text-fuchsia-500" /> Premium Transitions</li>
                                </ul>
                                <button onClick={scrollToCreate} className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 transition-all font-bold shadow-lg shadow-violet-500/20">
                                    {t('startCreating')}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-24 bg-[#020205] border-t border-white/5">
                    <div className="container mx-auto px-6 max-w-4xl">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('faqTitle')}</h2>
                            <div className="w-20 h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 mx-auto rounded-full" />
                        </div>

                        <div className="grid gap-6">
                            {t('faq').map((item, index) => (
                                <div key={index} className="glass p-8 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                                    <h3 className="text-xl font-bold mb-3 text-violet-200">{item.q}</h3>
                                    <p className="text-gray-400 leading-relaxed">{item.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main >

            <Footer />
        </div >
    );
}

export default function Page() {
    return (
        <LanguageProvider>
            <LandingPage />
        </LanguageProvider>
    );
}
