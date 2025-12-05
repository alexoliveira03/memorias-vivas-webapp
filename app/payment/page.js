"use client";
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check, Shield, Zap, Gift } from 'lucide-react';
import { useLanguage, LanguageProvider } from '../../context/LanguageContext';
import PaymentModal from '../../components/PaymentModal';
import { db } from '../../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import * as gtag from '../../lib/gtag';

function PaymentPageContent() {
    const { t, lang } = useLanguage();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [orderData, setOrderData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', message: '' });

    useEffect(() => {
        const pending = localStorage.getItem('pendingOrder');
        if (!pending) {
            router.push('/');
            return;
        }
        const parsedOrder = JSON.parse(pending);
        setOrderData(parsedOrder);

        // Check for success return from Stripe
        if (searchParams.get('success')) {
            handlePaymentSuccess(parsedOrder);
        }
    }, [searchParams]);

    // Auto-redirect after 10 seconds when success modal is shown
    useEffect(() => {
        if (showModal) {
            const timer = setTimeout(() => {
                router.push('/');
            }, 10000); // 10 seconds

            return () => clearTimeout(timer);
        }
    }, [showModal, router]);

    const handlePaymentSuccess = async (order) => {
        if (loading) return;
        setLoading(true);

        try {
            // Fetch coupon data from Stripe session if this was a paid order
            let couponUsed = false;
            let couponCode = '';

            if (!order.isFreeTrial && searchParams.get('session_id')) {
                try {
                    const stripeSessionId = searchParams.get('session_id');
                    console.log('[Payment Success] Fetching session details for coupon info:', stripeSessionId);

                    const sessionResponse = await fetch(`/api/stripe/session-details?session_id=${stripeSessionId}`);
                    if (sessionResponse.ok) {
                        const sessionData = await sessionResponse.json();
                        couponUsed = sessionData.couponUsed || false;
                        couponCode = sessionData.couponCode || '';
                        console.log('[Payment Success] Coupon data:', { couponUsed, couponCode });
                    }
                } catch (err) {
                    console.error('[Payment Success] Error fetching coupon data:', err);
                    // Continue without coupon data
                }
            }

            // Call n8n webhook with all order data + delivery info + coupon info
            console.log('[Payment Success] Triggering n8n workflow...');

            const n8nPayload = {
                userId: order.userId || '', // Empty if not logged in
                sessionId: order.sessionId, // Always present
                images: order.images,
                music: order.music,
                duration: order.duration, // Video duration (5 or 10 seconds)
                deliveryMethod: order.deliveryMethod, // 'email' or 'whatsapp'
                deliveryContact: order.deliveryContact, // email address or phone number
                isFreeTrial: order.isFreeTrial || false,
                couponUsed: couponUsed,
                couponCode: couponCode
            };

            console.log('[Payment Success] n8n payload:', n8nPayload);

            const n8nResponse = await fetch('https://n8n.alexoliveiraiaautomation.shop/webhook/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(n8nPayload),
            });

            if (n8nResponse.ok) {
                console.log('[Payment Success] n8n workflow triggered successfully');

                // If it was a free trial, increment the photos used counter
                if (order.isFreeTrial && order.userId) {
                    try {
                        const userDocRef = doc(db, 'users', order.userId);
                        const userDoc = await getDoc(userDocRef);
                        const currentCount = userDoc.exists() ? (userDoc.data().freeTrialPhotosUsed || 0) : 0;
                        const newCount = currentCount + order.images.length;

                        await setDoc(userDocRef, {
                            freeTrialPhotosUsed: newCount,
                            lastUpdated: new Date()
                        }, { merge: true });

                        console.log(`[Free Trial] Updated count: ${currentCount} → ${newCount} (added ${order.images.length} photos)`);

                        // Track free trial usage
                        gtag.trackFreeTrialUsed(order.images.length);
                    } catch (err) {
                        console.error('[Free Trial] Error updating photo count:', err);
                    }
                } else {
                    // Track paid purchase
                    const sessionId = searchParams.get('session_id') || 'free_trial';
                    gtag.trackPaymentCompleted(
                        order.totalPrice,
                        order.currency,
                        order.images.length,
                        sessionId
                    );
                }
            } else {
                console.error('[Payment Success] n8n workflow trigger failed:', await n8nResponse.text());
            }

            // Show success message
            setModalContent({
                title: lang === 'pt-BR' ? 'Tudo Pronto!' : 'All Set!',
                message: t('deliverySuccess'),
            });
            setShowModal(true);
            localStorage.removeItem('pendingOrder');
        } catch (error) {
            console.error('[Payment Success] Error:', error);
            alert(lang === 'pt-BR'
                ? 'Erro ao processar. Tente novamente.'
                : 'Error processing. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async () => {
        setLoading(true);

        // Check for free trial
        if (orderData.isFreeTrial) {
            console.log('[Payment] Processing free trial...');
            handlePaymentSuccess(orderData);
            return;
        }

        console.log('[Payment] Starting payment process...');

        try {
            console.log('[Payment] Calling Stripe Checkout API...');

            const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            console.log('[Payment] Stripe API response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('[Stripe API] API error:', errorText);
                throw new Error(`Stripe API error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            console.log('[Payment] Received response:', data);

            if (data.url) {
                console.log('[Payment] Redirecting to Stripe:', data.url);
                window.location.href = data.url;
            } else {
                throw new Error('No checkout URL received from Stripe');
            }
        } catch (error) {
            console.error('[Payment] Payment initiation failed:', error);
            alert(lang === 'pt-BR'
                ? 'Erro ao iniciar pagamento. Tente novamente.'
                : 'Error starting payment. Please try again.'
            );
            setLoading(false);
        }
    };

    if (!orderData) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    const { images = [], duration = 5, totalPrice = '0', currency = 'BRL' } = orderData;

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <h1 className="text-3xl font-bold mb-2 text-center">{t('paymentTitle')}</h1>
                    <p className="text-gray-400 text-center mb-8">{lang === 'pt-BR' ? 'Finalize seu pedido' : 'Complete your order'}</p>

                    <div className="space-y-6 mb-8">
                        <div className="flex items-center justify-between py-3 border-b border-white/10">
                            <span className="text-gray-300">{lang === 'pt-BR' ? 'Fotos' : 'Photos'}</span>
                            <span className="font-semibold">{images.length}</span>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-white/10">
                            <span className="text-gray-300">{lang === 'pt-BR' ? 'Duração por imagem' : 'Duration per image'}</span>
                            <span className="font-semibold">{duration}s</span>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-white/10">
                            <span className="text-gray-300">{lang === 'pt-BR' ? 'Preço unitário' : 'Unit price'}</span>
                            <span className="font-semibold">{currency === 'BRL' ? 'R$' : '$'} {(parseFloat(totalPrice) / images.length).toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between py-4 text-xl font-bold">
                            <span>Total</span>
                            <span className={orderData.isFreeTrial ? "text-emerald-400" : "text-violet-400"}>
                                {orderData.isFreeTrial ? (lang === 'pt-BR' ? 'GRÁTIS' : 'FREE') : `${currency === 'BRL' ? 'R$' : '$'} ${totalPrice}`}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-3 text-sm text-gray-300">
                            <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                                <Check size={14} />
                            </div>
                            {lang === 'pt-BR' ? `Vídeo em ${duration === 10 ? 'Full HD (1080p)' : 'HD (720p)'}` : `Video in ${duration === 10 ? 'Full HD (1080p)' : 'HD (720p)'}`}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-300">
                            <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                                <Check size={14} />
                            </div>
                            {lang === 'pt-BR' ? 'Animação fluida com IA' : 'Smooth AI animation'}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-300">
                            <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                                <Check size={14} />
                            </div>
                            {lang === 'pt-BR' ? 'Entrega via e-mail ou WhatsApp' : 'Delivery via email or WhatsApp'}
                        </div>
                    </div>

                    <button
                        onClick={handlePayment}
                        disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold rounded-xl shadow-xl shadow-violet-500/20 transition-all flex items-center justify-center gap-2 group mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>{t('processing')}</span>
                            </>
                        ) : orderData.isFreeTrial ? (
                            <>
                                <Gift size={20} className="group-hover:scale-110 transition-transform" />
                                <span>{t('freeTrialGenerate')}</span>
                            </>
                        ) : (
                            <>
                                <Zap size={20} className="group-hover:scale-110 transition-transform" />
                                <span>{lang === 'pt-BR' ? 'Pagar com Stripe' : 'Pay with Stripe'}</span>
                            </>
                        )}
                    </button>

                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                        <Shield size={12} />
                        <span>{lang === 'pt-BR' ? 'Pagamento 100% seguro via Stripe' : '100% secure payment via Stripe'}</span>
                    </div>
                </div>
            </div>

            <PaymentModal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    router.push('/');
                }}
                title={modalContent.title}
                message={modalContent.message}
            />
        </div>
    );
}

function PaymentPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
            </div>
        }>
            <PaymentPageContent />
        </Suspense>
    );
}

export default function Page() {
    return (
        <LanguageProvider>
            <PaymentPage />
        </LanguageProvider>
    );
}
