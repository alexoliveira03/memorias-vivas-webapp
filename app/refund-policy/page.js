"use client";
import { useLanguage, LanguageProvider } from '../../context/LanguageContext';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

function RefundPolicyPage() {
    const { lang } = useLanguage();

    const content = {
        'pt-BR': {
            title: 'Política de Reembolso e Devolução',
            sections: [
                {
                    title: '1. Prazo para Solicitação',
                    text: 'O cliente pode solicitar reembolso em até 7 (sete) dias corridos após a compra, conforme o Código de Defesa do Consumidor brasileiro.'
                },
                {
                    title: '2. Condições para Reembolso',
                    text: 'O reembolso será concedido nas seguintes situações:\n• Falha técnica que impeça a geração do vídeo\n• Vídeo gerado com qualidade significativamente inferior ao prometido\n• Cobrança duplicada ou indevida'
                },
                {
                    title: '3. Processo de Reembolso',
                    text: 'Para solicitar reembolso, envie um e-mail para contato@amk3technologies.com com:\n• Número do pedido\n• Motivo da solicitação\n• Comprovante de pagamento\n\nO reembolso será processado em até 10 (dez) dias úteis.'
                },
                {
                    title: '4. Forma de Reembolso',
                    text: 'O valor será estornado na mesma forma de pagamento utilizada na compra original.'
                },
                {
                    title: '5. Exceções',
                    text: 'Não serão aceitos pedidos de reembolso após a entrega bem-sucedida do vídeo gerado, exceto nos casos de defeito comprovado no produto.'
                }
            ]
        },
        'en-US': {
            title: 'Refund and Return Policy',
            sections: [
                {
                    title: '1. Request Period',
                    text: 'Customers may request a refund within 7 (seven) calendar days after purchase, in accordance with Brazilian Consumer Protection Code.'
                },
                {
                    title: '2. Refund Conditions',
                    text: 'Refunds will be granted in the following situations:\n• Technical failure preventing video generation\n• Generated video with quality significantly lower than promised\n• Duplicate or unauthorized charges'
                },
                {
                    title: '3. Refund Process',
                    text: 'To request a refund, send an email to contato@amk3technologies.com with:\n• Order number\n• Reason for request\n• Payment proof\n\nRefunds will be processed within 10 (ten) business days.'
                },
                {
                    title: '4. Refund Method',
                    text: 'The amount will be refunded using the same payment method used in the original purchase.'
                },
                {
                    title: '5. Exceptions',
                    text: 'Refund requests will not be accepted after successful delivery of the generated video, except in cases of proven product defect.'
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
                        {lang === 'pt-BR' ? 'Para dúvidas sobre reembolsos, entre em contato:' : 'For refund inquiries, contact us:'}
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
            <RefundPolicyPage />
        </LanguageProvider>
    );
}
