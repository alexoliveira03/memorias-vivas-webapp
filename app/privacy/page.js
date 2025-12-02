"use client";
import { useLanguage, LanguageProvider } from '../../context/LanguageContext';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

function PrivacyPage() {
    const { lang } = useLanguage();

    const content = {
        'pt-BR': {
            title: 'Política de Privacidade',
            sections: [
                {
                    title: '1. Informações Coletadas',
                    text: 'Coletamos:\n• E-mail de login (via Google Authentication)\n• Imagens enviadas para geração de vídeo\n• Informações de pagamento (processadas pela Stripe)\n• Dados de uso do serviço'
                },
                {
                    title: '2. Uso das Informações',
                    text: 'Utilizamos seus dados para:\n• Processar pagamentos e gerar vídeos\n• Enviar o vídeo gerado por e-mail\n• Melhorar nossos serviços\n• Cumprir obrigações legais'
                },
                {
                    title: '3. Armazenamento de Dados',
                    text: 'Suas imagens e vídeos são armazenados em servidores seguros do Firebase. Mantemos seus dados pelo tempo necessário para prestação do serviço.'
                },
                {
                    title: '4. Compartilhamento de Dados',
                    text: 'Não compartilhamos seus dados pessoais com terceiros, exceto:\n• Stripe (processamento de pagamentos)\n• Firebase/Google (armazenamento e autenticação)\n• Quando exigido por lei'
                },
                {
                    title: '5. Segurança',
                    text: 'Implementamos medidas de segurança para proteger seus dados, incluindo criptografia SSL e controles de acesso.'
                },
                {
                    title: '6. Seus Direitos (LGPD)',
                    text: 'Você tem direito a:\n• Acessar seus dados pessoais\n• Corrigir dados incorretos\n• Solicitar exclusão de dados\n• Revogar consentimento\n\nPara exercer seus direitos, contate: contato@amk3technologies.com'
                },
                {
                    title: '7. Cookies',
                    text: 'Utilizamos cookies essenciais para funcionamento do site e autenticação. Não utilizamos cookies de rastreamento.'
                },
                {
                    title: '8. Alterações na Política',
                    text: 'Esta política pode ser atualizada periodicamente. Mudanças significativas serão comunicadas por e-mail.'
                }
            ]
        },
        'en-US': {
            title: 'Privacy Policy',
            sections: [
                {
                    title: '1. Information Collected',
                    text: 'We collect:\n• Login email (via Google Authentication)\n• Images uploaded for video generation\n• Payment information (processed by Stripe)\n• Service usage data'
                },
                {
                    title: '2. Use of Information',
                    text: 'We use your data to:\n• Process payments and generate videos\n• Send generated video via email\n• Improve our services\n• Comply with legal obligations'
                },
                {
                    title: '3. Data Storage',
                    text: 'Your images and videos are stored on secure Firebase servers. We retain your data for as long as necessary to provide the service.'
                },
                {
                    title: '4. Data Sharing',
                    text: 'We do not share your personal data with third parties, except:\n• Stripe (payment processing)\n• Firebase/Google (storage and authentication)\n• When required by law'
                },
                {
                    title: '5. Security',
                    text: 'We implement security measures to protect your data, including SSL encryption and access controls.'
                },
                {
                    title: '6. Your Rights (LGPD)',
                    text: 'You have the right to:\n• Access your personal data\n• Correct incorrect data\n• Request data deletion\n• Revoke consent\n\nTo exercise your rights, contact: contato@amk3technologies.com'
                },
                {
                    title: '7. Cookies',
                    text: 'We use essential cookies for website functionality and authentication. We do not use tracking cookies.'
                },
                {
                    title: '8. Policy Changes',
                    text: 'This policy may be updated periodically. Significant changes will be communicated via email.'
                }
            ]
        }
    };

    const pageContent = content[lang];

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white">
            <div className="container mx-auto px-6 py-12 max-w-4xl">
                <Link href="/" className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 mb-8 transition-colors">
                    <ArrowLeft size={20} />
                    {lang === 'pt-BR' ? 'Voltar' : 'Back'}
                </Link>

                <h1 className="text-4xl font-bold mb-8">{pageContent.title}</h1>

                <div className="space-y-8">
                    {pageContent.sections.map((section, index) => (
                        <div key={index} className="glass p-6 rounded-2xl border border-white/10">
                            <h2 className="text-2xl font-semibold mb-4 text-violet-400">{section.title}</h2>
                            <p className="text-gray-300 whitespace-pre-line leading-relaxed">{section.text}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-12 p-6 glass rounded-2xl border border-white/10">
                    <h3 className="text-xl font-semibold mb-3 text-violet-400">
                        {lang === 'pt-BR' ? 'Contato' : 'Contact'}
                    </h3>
                    <p className="text-gray-300">
                        {lang === 'pt-BR' ? 'Para questões sobre privacidade, entre em contato:' : 'For privacy inquiries, contact us:'}
                    </p>
                    <p className="text-white font-medium mt-2">contato@amk3technologies.com</p>
                </div>
            </div>
        </div>
    );
}

export default function Page() {
    return (
        <LanguageProvider>
            <PrivacyPage />
        </LanguageProvider>
    );
}
