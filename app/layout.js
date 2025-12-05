import './globals.css';
import { Inter } from 'next/font/google';
import GoogleAnalytics from '../components/GoogleAnalytics';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Memorias Vivas',
    description: 'Reviva suas memórias com animações mágicas.',
};

export default function RootLayout({ children }) {
    return (
        <html lang="pt-BR">
            <body className={inter.className}>
                <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_ID} />
                {children}
            </body>
        </html>
    );
}
