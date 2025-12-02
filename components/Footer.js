"use client";
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { Mail } from 'lucide-react';

export default function Footer() {
    const { lang } = useLanguage();

    return (
        <footer className="bg-black/50 border-t border-white/10 py-8 mt-auto">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Company Info */}
                    <div>
                        <h3 className="text-white font-semibold mb-3">
                            {lang === 'pt-BR' ? 'Memórias Vivas' : 'Living Memories'}
                        </h3>
                        <p className="text-gray-400 text-sm mb-3">
                            {lang === 'pt-BR'
                                ? 'Transforme suas fotos em vídeos emocionantes com IA.'
                                : 'Transform your photos into emotional videos with AI.'}
                        </p>
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <Mail size={16} />
                            <a href="mailto:contato@amk3technologies.com" className="hover:text-violet-400 transition-colors">
                                contato@amk3technologies.com
                            </a>
                        </div>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-3">
                            {lang === 'pt-BR' ? 'Legal' : 'Legal'}
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/terms" className="text-gray-400 hover:text-violet-400 transition-colors">
                                    {lang === 'pt-BR' ? 'Termos de Serviço' : 'Terms of Service'}
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-gray-400 hover:text-violet-400 transition-colors">
                                    {lang === 'pt-BR' ? 'Política de Privacidade' : 'Privacy Policy'}
                                </Link>
                            </li>
                            <li>
                                <Link href="/refund-policy" className="text-gray-400 hover:text-violet-400 transition-colors">
                                    {lang === 'pt-BR' ? 'Política de Reembolso' : 'Refund Policy'}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-white font-semibold mb-3">
                            {lang === 'pt-BR' ? 'Suporte' : 'Support'}
                        </h3>
                        <p className="text-gray-400 text-sm mb-2">
                            {lang === 'pt-BR'
                                ? 'Dúvidas? Entre em contato conosco:'
                                : 'Questions? Contact us:'}
                        </p>
                        <p className="text-gray-400 text-sm">
                            contato@amk3technologies.com
                        </p>
                    </div>
                </div>

                <div className="border-t border-white/10 mt-8 pt-6 text-center">
                    <p className="text-gray-500 text-sm">
                        © 2025 AMK3 Technologies. {lang === 'pt-BR' ? 'Todos os direitos reservados.' : 'All rights reserved.'}
                    </p>
                </div>
            </div>
        </footer>
    );
}
