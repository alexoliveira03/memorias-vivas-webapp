"use client";
import { useLanguage, LanguageProvider } from '../../context/LanguageContext';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

function TermsPage() {
    const { lang } = useLanguage();

    const content = {
        'pt-BR': {
            title: 'Termos de Serviço',
            sections: [
                {
                    title: '1. Aceite dos Termos',
                    text: 'Ao utilizar nosso serviço de geração de vídeos com IA, você concorda com estes Termos de Serviço. Se não concordar, não utilize nosso serviço.'
                },
                {
                    title: '2. Descrição do Serviço',
                    text: 'Oferecemos um serviço automatizado de geração de vídeos a partir de imagens enviadas pelo usuário, utilizando tecnologia de inteligência artificial.'
                },
                {
                    title: '3. Responsabilidades do Usuário',
                    text: 'O usuário é responsável por:\n• Garantir que possui direitos sobre as imagens enviadas\n• Não enviar conteúdo ilegal, ofensivo ou que viole direitos de terceiros\n• Fornecer informações de pagamento válidas\n• Manter a confidencialidade de sua conta'
                },
                {
                    title: '4. Propriedade Intelectual',
                    text: 'O vídeo gerado é de propriedade do usuário que o solicitou. A AMK3 Technologies mantém direitos sobre a tecnologia e plataforma utilizadas.'
                },
                {
                    title: '5. Limitações de Responsabilidade',
                    text: 'Não nos responsabilizamos por:\n• Problemas técnicos fora de nosso controle\n• Uso indevido do conteúdo gerado pelo usuário\n• Perdas indiretas ou consequenciais'
                },
                {
                    title: '6. Pagamento e Preços',
                    text: 'Os preços são apresentados antes da compra e podem ser alterados sem aviso prévio. O pagamento é processado via Stripe de forma segura.'
                },
                {
                    title: '7. Modificações nos Termos',
                    text: 'Reservamos o direito de modificar estes termos a qualquer momento. Alterações entram em vigor imediatamente após publicação.'
                },
                {
                    title: '8. Lei Aplicável',
                    text: 'Estes termos são regidos pelas leis brasileiras, com foro na comarca do domicílio do consumidor.'
                }
            ]
        },
        'en-US': {
            title: 'Terms of Service',
            sections: [
                {
                    title: '1. Acceptance of Terms',
                    text: 'By using our AI video generation service, you agree to these Terms of Service. If you do not agree, do not use our service.'
                },
                {
                    title: '2. Service Description',
                    text: 'We offer an automated video generation service from user-uploaded images using artificial intelligence technology.'
                },
                {
                    title: '3. User Responsibilities',
                    text: 'Users are responsible for:\n• Ensuring they have rights to uploaded images\n• Not uploading illegal, offensive, or third-party rights-violating content\n• Providing valid payment information\n• Maintaining account confidentiality'
                },
                {
                    title: '4. Intellectual Property',
                    text: 'The generated video is owned by the user who requested it. AMK3 Technologies retains rights to the technology and platform used.'
                },
                {
                    title: '5. Liability Limitations',
                    text: 'We are not responsible for:\n• Technical issues beyond our control\n• Misuse of user-generated content\n• Indirect or consequential losses'
                },
                {
                    title: '6. Payment and Pricing',
                    text: 'Prices are displayed before purchase and may change without notice. Payment is securely processed via Stripe.'
                },
                {
                    title: '7. Terms Modifications',
                    text: 'We reserve the right to modify these terms at any time. Changes take effect immediately upon publication.'
                },
                {
                    title: '8. Governing Law',
                    text: 'These terms are governed by Brazilian law, with jurisdiction in the consumer\'s domicile.'
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
                        {lang === 'pt-BR' ? 'Para dúvidas sobre os termos, entre em contato:' : 'For questions about these terms, contact us:'}
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
            <TermsPage />
        </LanguageProvider>
    );
}
