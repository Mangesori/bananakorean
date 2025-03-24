import { Hind, Inter } from 'next/font/google';
import '@/assets/css/icofont.min.css';
import '@/assets/css/popup.css';
import '@/assets/css/video-modal.css';
import 'aos/dist/aos.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-cards';
import './globals.css';
import FixedShadow from '@/components/shared/others/FixedShadow';
import PreloaderPrimary from '@/components/shared/others/PreloaderPrimary';
import { imageConfigDefault } from 'next/dist/shared/lib/image-config';
import { AuthProvider } from '@/hooks/useAuth';

export const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-inter',
});

export const hind = Hind({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-hind',
  display: 'swap',
});

export const metadata = {
  title: 'Banana Korean',
  description: 'Learn Korean with Banana Korean',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${hind.variable}`}>
      <body
        className={`relative leading-[1.8] bg-bodyBg dark:bg-bodyBg-dark z-0  ${inter.className}`}
      >
        <AuthProvider>
          {children}
          <div></div>
        </AuthProvider>
      </body>
    </html>
  );
}
