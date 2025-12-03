"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, MessageCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useState, useEffect } from 'react';

// Comprehensive country codes list
const COUNTRIES = [
    { code: '+93', name: 'Afghanistan', flag: '🇦🇫' },
    { code: '+355', name: 'Albania', flag: '🇦🇱' },
    { code: '+213', name: 'Algeria', flag: '🇩🇿' },
    { code: '+376', name: 'Andorra', flag: '🇦🇩' },
    { code: '+244', name: 'Angola', flag: '🇦🇴' },
    { code: '+54', name: 'Argentina', flag: '🇦🇷' },
    { code: '+374', name: 'Armenia', flag: '🇦🇲' },
    { code: '+61', name: 'Australia', flag: '🇦🇺' },
    { code: '+43', name: 'Austria', flag: '🇦🇹' },
    { code: '+994', name: 'Azerbaijan', flag: '🇦🇿' },
    { code: '+973', name: 'Bahrain', flag: '🇧🇭' },
    { code: '+880', name: 'Bangladesh', flag: '🇧🇩' },
    { code: '+375', name: 'Belarus', flag: '🇧🇾' },
    { code: '+32', name: 'Belgium', flag: '🇧🇪' },
    { code: '+501', name: 'Belize', flag: '🇧🇿' },
    { code: '+229', name: 'Benin', flag: '🇧🇯' },
    { code: '+975', name: 'Bhutan', flag: '🇧🇹' },
    { code: '+591', name: 'Bolivia', flag: '🇧🇴' },
    { code: '+387', name: 'Bosnia', flag: '🇧🇦' },
    { code: '+267', name: 'Botswana', flag: '🇧🇼' },
    { code: '+55', name: 'Brasil', flag: '🇧🇷' },
    { code: '+673', name: 'Brunei', flag: '🇧🇳' },
    { code: '+359', name: 'Bulgaria', flag: '🇧🇬' },
    { code: '+226', name: 'Burkina Faso', flag: '🇧🇫' },
    { code: '+257', name: 'Burundi', flag: '🇧🇮' },
    { code: '+855', name: 'Cambodia', flag: '🇰🇭' },
    { code: '+237', name: 'Cameroon', flag: '🇨🇲' },
    { code: '+1', name: 'Canada/USA', flag: '🇨🇦' },
    { code: '+238', name: 'Cape Verde', flag: '🇨🇻' },
    { code: '+236', name: 'Central African Rep.', flag: '🇨🇫' },
    { code: '+235', name: 'Chad', flag: '🇹🇩' },
    { code: '+56', name: 'Chile', flag: '🇨🇱' },
    { code: '+86', name: 'China', flag: '🇨🇳' },
    { code: '+57', name: 'Colombia', flag: '🇨🇴' },
    { code: '+269', name: 'Comoros', flag: '🇰🇲' },
    { code: '+242', name: 'Congo', flag: '🇨🇬' },
    { code: '+506', name: 'Costa Rica', flag: '🇨🇷' },
    { code: '+385', name: 'Croatia', flag: '🇭🇷' },
    { code: '+53', name: 'Cuba', flag: '🇨🇺' },
    { code: '+357', name: 'Cyprus', flag: '🇨🇾' },
    { code: '+420', name: 'Czech Republic', flag: '🇨🇿' },
    { code: '+45', name: 'Denmark', flag: '🇩🇰' },
    { code: '+253', name: 'Djibouti', flag: '🇩🇯' },
    { code: '+593', name: 'Ecuador', flag: '🇪🇨' },
    { code: '+20', name: 'Egypt', flag: '🇪🇬' },
    { code: '+503', name: 'El Salvador', flag: '🇸🇻' },
    { code: '+372', name: 'Estonia', flag: '🇪🇪' },
    { code: '+251', name: 'Ethiopia', flag: '🇪🇹' },
    { code: '+358', name: 'Finland', flag: '🇫🇮' },
    { code: '+33', name: 'France', flag: '🇫🇷' },
    { code: '+241', name: 'Gabon', flag: '🇬🇦' },
    { code: '+220', name: 'Gambia', flag: '🇬🇲' },
    { code: '+995', name: 'Georgia', flag: '🇬🇪' },
    { code: '+49', name: 'Germany', flag: '🇩🇪' },
    { code: '+233', name: 'Ghana', flag: '🇬🇭' },
    { code: '+30', name: 'Greece', flag: '🇬🇷' },
    { code: '+502', name: 'Guatemala', flag: '🇬🇹' },
    { code: '+224', name: 'Guinea', flag: '🇬🇳' },
    { code: '+245', name: 'Guinea-Bissau', flag: '🇬🇼' },
    { code: '+509', name: 'Haiti', flag: '🇭🇹' },
    { code: '+504', name: 'Honduras', flag: '🇭🇳' },
    { code: '+852', name: 'Hong Kong', flag: '🇭🇰' },
    { code: '+36', name: 'Hungary', flag: '🇭🇺' },
    { code: '+354', name: 'Iceland', flag: '🇮🇸' },
    { code: '+91', name: 'India', flag: '🇮🇳' },
    { code: '+62', name: 'Indonesia', flag: '🇮🇩' },
    { code: '+98', name: 'Iran', flag: '🇮🇷' },
    { code: '+964', name: 'Iraq', flag: '🇮🇶' },
    { code: '+353', name: 'Ireland', flag: '🇮🇪' },
    { code: '+972', name: 'Israel', flag: '🇮🇱' },
    { code: '+39', name: 'Italy', flag: '🇮🇹' },
    { code: '+81', name: 'Japan', flag: '🇯🇵' },
    { code: '+962', name: 'Jordan', flag: '🇯🇴' },
    { code: '+7', name: 'Kazakhstan', flag: '🇰🇿' },
    { code: '+254', name: 'Kenya', flag: '🇰🇪' },
    { code: '+965', name: 'Kuwait', flag: '🇰🇼' },
    { code: '+996', name: 'Kyrgyzstan', flag: '🇰🇬' },
    { code: '+856', name: 'Laos', flag: '🇱🇦' },
    { code: '+371', name: 'Latvia', flag: '🇱🇻' },
    { code: '+961', name: 'Lebanon', flag: '🇱🇧' },
    { code: '+231', name: 'Liberia', flag: '🇱🇷' },
    { code: '+218', name: 'Libya', flag: '🇱🇾' },
    { code: '+370', name: 'Lithuania', flag: '🇱🇹' },
    { code: '+352', name: 'Luxembourg', flag: '🇱🇺' },
    { code: '+261', name: 'Madagascar', flag: '🇲🇬' },
    { code: '+265', name: 'Malawi', flag: '🇲🇼' },
    { code: '+60', name: 'Malaysia', flag: '🇲🇾' },
    { code: '+960', name: 'Maldives', flag: '🇲🇻' },
    { code: '+223', name: 'Mali', flag: '🇲🇱' },
    { code: '+356', name: 'Malta', flag: '🇲🇹' },
    { code: '+222', name: 'Mauritania', flag: '🇲🇷' },
    { code: '+230', name: 'Mauritius', flag: '🇲🇺' },
    { code: '+52', name: 'Mexico', flag: '🇲🇽' },
    { code: '+373', name: 'Moldova', flag: '🇲🇩' },
    { code: '+377', name: 'Monaco', flag: '🇲🇨' },
    { code: '+976', name: 'Mongolia', flag: '🇲🇳' },
    { code: '+382', name: 'Montenegro', flag: '🇲🇪' },
    { code: '+212', name: 'Morocco', flag: '🇲🇦' },
    { code: '+258', name: 'Mozambique', flag: '🇲🇿' },
    { code: '+95', name: 'Myanmar', flag: '🇲🇲' },
    { code: '+264', name: 'Namibia', flag: '🇳🇦' },
    { code: '+977', name: 'Nepal', flag: '🇳🇵' },
    { code: '+31', name: 'Netherlands', flag: '🇳🇱' },
    { code: '+64', name: 'New Zealand', flag: '🇳🇿' },
    { code: '+505', name: 'Nicaragua', flag: '🇳🇮' },
    { code: '+227', name: 'Niger', flag: '🇳🇪' },
    { code: '+234', name: 'Nigeria', flag: '🇳🇬' },
    { code: '+47', name: 'Norway', flag: '🇳🇴' },
    { code: '+968', name: 'Oman', flag: '🇴🇲' },
    { code: '+92', name: 'Pakistan', flag: '🇵🇰' },
    { code: '+970', name: 'Palestine', flag: '🇵🇸' },
    { code: '+507', name: 'Panama', flag: '🇵🇦' },
    { code: '+595', name: 'Paraguay', flag: '🇵🇾' },
    { code: '+51', name: 'Peru', flag: '🇵🇪' },
    { code: '+63', name: 'Philippines', flag: '🇵🇭' },
    { code: '+48', name: 'Poland', flag: '🇵🇱' },
    { code: '+351', name: 'Portugal', flag: '🇵🇹' },
    { code: '+974', name: 'Qatar', flag: '🇶🇦' },
    { code: '+40', name: 'Romania', flag: '🇷🇴' },
    { code: '+7', name: 'Russia', flag: '🇷🇺' },
    { code: '+250', name: 'Rwanda', flag: '🇷🇼' },
    { code: '+966', name: 'Saudi Arabia', flag: '🇸🇦' },
    { code: '+221', name: 'Senegal', flag: '🇸🇳' },
    { code: '+381', name: 'Serbia', flag: '🇷🇸' },
    { code: '+65', name: 'Singapore', flag: '🇸🇬' },
    { code: '+421', name: 'Slovakia', flag: '🇸🇰' },
    { code: '+386', name: 'Slovenia', flag: '🇸🇮' },
    { code: '+252', name: 'Somalia', flag: '🇸🇴' },
    { code: '+27', name: 'South Africa', flag: '🇿🇦' },
    { code: '+82', name: 'South Korea', flag: '🇰🇷' },
    { code: '+211', name: 'South Sudan', flag: '🇸🇸' },
    { code: '+34', name: 'Spain', flag: '🇪🇸' },
    { code: '+94', name: 'Sri Lanka', flag: '🇱🇰' },
    { code: '+249', name: 'Sudan', flag: '🇸🇩' },
    { code: '+46', name: 'Sweden', flag: '🇸🇪' },
    { code: '+41', name: 'Switzerland', flag: '🇨🇭' },
    { code: '+963', name: 'Syria', flag: '🇸🇾' },
    { code: '+886', name: 'Taiwan', flag: '🇹🇼' },
    { code: '+992', name: 'Tajikistan', flag: '🇹🇯' },
    { code: '+255', name: 'Tanzania', flag: '🇹🇿' },
    { code: '+66', name: 'Thailand', flag: '🇹🇭' },
    { code: '+228', name: 'Togo', flag: '🇹🇬' },
    { code: '+216', name: 'Tunisia', flag: '🇹🇳' },
    { code: '+90', name: 'Turkey', flag: '🇹🇷' },
    { code: '+993', name: 'Turkmenistan', flag: '🇹🇲' },
    { code: '+256', name: 'Uganda', flag: '🇺🇬' },
    { code: '+380', name: 'Ukraine', flag: '🇺🇦' },
    { code: '+971', name: 'UAE', flag: '🇦🇪' },
    { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
    { code: '+598', name: 'Uruguay', flag: '🇺🇾' },
    { code: '+998', name: 'Uzbekistan', flag: '🇺🇿' },
    { code: '+58', name: 'Venezuela', flag: '🇻🇪' },
    { code: '+84', name: 'Vietnam', flag: '🇻🇳' },
    { code: '+967', name: 'Yemen', flag: '🇾🇪' },
    { code: '+260', name: 'Zambia', flag: '🇿🇲' },
    { code: '+263', name: 'Zimbabwe', flag: '🇿🇼' },
];

export default function DeliveryChoiceModal({ isOpen, onSubmit, orderData }) {
    const { t, lang } = useLanguage();
    const [deliveryMethod, setDeliveryMethod] = useState('email');
    const [contact, setContact] = useState('');
    const [countryCode, setCountryCode] = useState('+55'); // Default Brasil
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validatePhone = (phone) => {
        // Basic validation: must have at least 8 digits (without country code)
        const cleaned = phone.replace(/\D/g, '');
        return cleaned.length >= 8 && cleaned.length <= 15;
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
        // For WhatsApp, combine country code + phone number and remove all non-numeric characters
        let finalContact = contact;
        if (deliveryMethod === 'whatsapp') {
            const fullNumber = `${countryCode}${contact}`;
            finalContact = fullNumber.replace(/\D/g, ''); // Remove all non-numeric characters
        }
        await onSubmit(deliveryMethod, finalContact);
        setLoading(false);
    };

    // Auto-detect country from user's IP when modal opens
    useEffect(() => {
        if (isOpen && deliveryMethod === 'whatsapp') {
            const detectCountry = async () => {
                try {
                    const response = await fetch('https://ipapi.co/json/');
                    const data = await response.json();

                    if (data.country_calling_code) {
                        // Find matching country in our list
                        const foundCountry = COUNTRIES.find(c => c.code === data.country_calling_code);
                        if (foundCountry) {
                            setCountryCode(foundCountry.code);
                        }
                    }
                } catch (error) {
                    console.log('Could not detect country, using default');
                    // Keep default country code (+55)
                }
            };
            detectCountry();
        }
    }, [isOpen, deliveryMethod]);

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
                            {deliveryMethod === 'whatsapp' ? (
                                <div className="flex gap-2">
                                    {/* Country Code Selector */}
                                    <select
                                        value={countryCode}
                                        onChange={(e) => setCountryCode(e.target.value)}
                                        className="w-32 px-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500 transition-colors appearance-none cursor-pointer text-sm"
                                        style={{
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23fff' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                                            backgroundRepeat: 'no-repeat',
                                            backgroundPosition: 'right 0.75rem center',
                                            backgroundSize: '12px'
                                        }}
                                    >
                                        {COUNTRIES.map((country) => (
                                            <option key={country.name} value={country.code} className="bg-[#0a0a0f] text-white">
                                                {country.flag} {country.code} {country.name}
                                            </option>
                                        ))}
                                    </select>

                                    {/* Phone Input */}
                                    <input
                                        type="tel"
                                        value={contact}
                                        onChange={(e) => {
                                            setContact(e.target.value);
                                            setError('');
                                        }}
                                        placeholder={lang === 'pt-BR' ? '(11) 98765-4321' : '123-456-7890'}
                                        className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
                                    />
                                </div>
                            ) : (
                                <input
                                    type="email"
                                    value={contact}
                                    onChange={(e) => {
                                        setContact(e.target.value);
                                        setError('');
                                    }}
                                    placeholder={t('deliveryEmailPlaceholder')}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
                                />
                            )}
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
