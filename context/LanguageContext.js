"use client";
import { createContext, useContext, useState, useEffect } from 'react';

const translations = {
    'pt-BR': {
        heroTitle: 'Reviva suas Memórias',
        heroSubtitle: 'Transforme fotos antigas em vídeos emocionantes com inteligência artificial.',
        ctaStart: 'Começar Agora',
        uploadTitle: 'Desça mais um pouco e carregue suas fotos',
        uploadDesc: 'Envie até 10 fotos de uma vez',
        musicTitle: 'Escolha a duração do vídeo',
        musicDesc: 'Duração por cada imagem enviada',
        generateBtn: 'Gerar Vídeo',
        generateCardTitle: 'Clique em Gerar vídeo',
        generateDesc: 'E siga as instruções para receber seu vídeo',
        processing: 'Criando mágica...',
        download: 'Baixar Vídeo',
        login: 'Entrar com Google',
        paymentTitle: 'Só mais uma etapa',
        paymentDesc: '',
        aiPowered: 'Gerador de Vídeo com IA',
        startCreating: 'Começar a Criar',
        createMasterpiece: 'Pronto para dar vida às suas memórias?',
        createDesc: 'Carregue suas fotos e deixe nossa IA tecer uma bela história.',
        imageToVideo: 'Imagem para Vídeo',
        textToVideo: 'Texto para Vídeo',
        photos: 'Fotos',
        aspectRatio: 'Proporção',
        soundtrack: 'Trilha Sonora',
        animationStyle: 'Estilo da Animação',
        stylePlaceholder: 'Descreva o movimento e o estilo...',
        total: 'Total',
        readyToCreate: 'Pronto para Criar?',
        readyDesc: 'Carregue suas fotos na barra lateral para começar a transformar memórias em belos vídeos animados.',
        rightsReserved: 'Todos os direitos reservados.',
        faqTitle: 'Dúvidas Frequentes',
        pricingTitle: 'Preços',
        pricingSubtitle: 'Escolha o plano ideal para suas memórias',
        durationTitle: 'Duração por Imagem',
        shortDuration: 'Curta Duração',
        longDuration: 'Longa Duração',
        perImage: 'por imagem',
        seconds: 'segundos',
        processing: 'Processando...',
        gotIt: 'Entendi',
        deliveryChoiceTitle: 'Como você deseja receber seu vídeo?',
        deliveryChoiceEmail: 'Email',
        deliveryChoiceWhatsApp: 'WhatsApp',
        deliveryEmailPlaceholder: 'seuemail@exemplo.com',
        deliveryPhonePlaceholder: '(11) 98765-4321',
        deliverySubmit: 'Confirmar e Gerar Vídeo',
        deliverySuccess: 'Perfeito! Seu vídeo está sendo gerado e será enviado em breve.',
        deliveryValidationEmail: 'Por favor, insira um email válido',
        deliveryValidationPhone: 'Por favor, insira um número válido com DDD',
        faq: [
            {
                q: 'Por que eu preciso pagar?',
                a: 'Nosso objetivo é facilitar a animação de memórias com IA e permitir que qualquer um possa criar um vídeo legal simplesmente enviando suas fotos. No entanto, a tecnologia de IA de ponta que utilizamos tem custos elevados de processamento para cada geração.'
            },
            {
                q: 'Tem algum plano gratuito?',
                a: 'Infelizmente ainda não conseguimos absorver os custos de geração de vídeos com IA, por isso cada geração é paga. No entanto, garantimos a qualidade do resultado final baseada em nossos exemplos.'
            },
            {
                q: 'Quantos vídeos serão gerados?',
                a: 'Um único vídeo completo será gerado, contendo uma animação sequencial de cada uma das fotos que você enviou, unidas com transições suaves.'
            },
            {
                q: 'Posso gerar mais de um vídeo?',
                a: 'Cada pagamento representa a geração de 1 vídeo único. Caso queira criar um novo vídeo com outras fotos ou músicas, basta realizar novamente o procedimento.'
            },
            {
                q: 'Como funciona o pagamento?',
                a: 'O pagamento é processado de forma totalmente segura via Stripe, basta clicar no botão para realizar pagamento e seguir as instruções na tela. Assim que o pagamento for confirmado, nossa IA começa a trabalhar no seu vídeo imediatamente.'
            }
        ]
    },
    'en-US': {
        heroTitle: 'Revive Your Memories',
        heroSubtitle: 'Transform old photos into emotional videos with artificial intelligence.',
        ctaStart: 'Start Now',
        uploadTitle: 'Scroll down and upload your photos',
        uploadDesc: 'Upload up to 10 photos at once',
        musicTitle: 'Choose video duration',
        musicDesc: 'Duration per uploaded image',
        generateBtn: 'Generate Video',
        generateCardTitle: 'Click Generate Video',
        generateDesc: 'And follow instructions to receive your video',
        processing: 'Creating magic...',
        download: 'Download Video',
        login: 'Login with Google',
        paymentTitle: 'Just One More Step',
        paymentDesc: '',
        aiPowered: 'AI-Powered Video Generator',
        startCreating: 'Start Creating',
        createMasterpiece: 'Ready to bring your memories to life?',
        createDesc: 'Upload your photos and let our AI weave them into a beautiful story.',
        imageToVideo: 'Image to Video',
        textToVideo: 'Text to Video',
        photos: 'Photos',
        aspectRatio: 'Aspect Ratio',
        soundtrack: 'Soundtrack',
        animationStyle: 'Animation Style',
        stylePlaceholder: 'Describe the motion and style...',
        total: 'Total',
        readyToCreate: 'Ready to Create?',
        readyDesc: 'Upload your photos in the sidebar to start transforming memories into beautiful animated videos.',
        rightsReserved: 'All rights reserved.',
        faqTitle: 'FAQ',
        pricingTitle: 'Pricing',
        pricingSubtitle: 'Choose the ideal plan for your memories',
        durationTitle: 'Duration per Image',
        shortDuration: 'Short Duration',
        longDuration: 'Long Duration',
        perImage: 'per image',
        seconds: 'seconds',
        processing: 'Processing...',
        gotIt: 'Got it',
        deliveryChoiceTitle: 'How would you like to receive your video?',
        deliveryChoiceEmail: 'Email',
        deliveryChoiceWhatsApp: 'WhatsApp',
        deliveryEmailPlaceholder: 'youremail@example.com',
        deliveryPhonePlaceholder: '(11) 98765-4321',
        deliverySubmit: 'Confirm and Generate Video',
        deliverySuccess: 'Perfect! Your video is being generated and will be sent soon.',
        deliveryValidationEmail: 'Please enter a valid email',
        deliveryValidationPhone: 'Please enter a valid number with area code',
        faq: [
            {
                q: 'Why do I need to pay?',
                a: 'Our goal is to make AI memory animation accessible to everyone. However, the cutting-edge AI technology we use incurs high processing costs for each video generation.'
            },
            {
                q: 'Is there a free plan?',
                a: 'Unfortunately, we cannot yet absorb the costs of AI video generation, so each generation is paid. However, we guarantee the quality of the final result based on our examples.'
            },
            {
                q: 'How many videos will be generated?',
                a: 'A single complete video will be generated, containing a sequential animation of each of the photos you uploaded, joined with smooth transitions.'
            },
            {
                q: 'Can I generate more than one video?',
                a: 'Each payment covers the generation of 1 unique video. If you want to create a new video with other photos or music, simply repeat the process.'
            },
            {
                q: 'How does payment work?',
                a: 'Payment is securely processed via Stripe. Just click the button to pay and follow the on-screen instructions. Once payment is confirmed, our AI starts working on your video immediately.'
            }
        ]
    }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [lang, setLang] = useState(() => {
        // Initialize from localStorage if available
        if (typeof window !== 'undefined') {
            const savedLang = localStorage.getItem('preferredLanguage');
            return savedLang || 'pt-BR';
        }
        return 'pt-BR';
    });

    // Save to localStorage whenever language changes
    const updateLang = (newLang) => {
        setLang(newLang);
        if (typeof window !== 'undefined') {
            localStorage.setItem('preferredLanguage', newLang);
        }
    };

    const t = (key) => translations[lang][key] || key;

    return (
        <LanguageContext.Provider value={{ lang, setLang: updateLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => useContext(LanguageContext);
