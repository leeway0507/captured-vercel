import './globals.css'
import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Sans_KR } from 'next/font/google'
import { ToastContainer, Slide } from 'react-toastify'
import Script from 'next/script'
import GoogleAnalytics from '@/utils/google-analytics-4'

export const viewport: Viewport = {
    maximumScale: 1,
    initialScale: 1,
    width: 'device-width',
}

const monda = IBM_Plex_Sans_KR({
    weight: ['100', '200', '300', '400', '500', '600', '700'],
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: '캡쳐드',
    description:
        '전세계 숨은 재고를 검거하는 캡쳐드! 내가 원하는 그 제품, 캡쳐드에서 먼저 찾아보세요.',
}

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '캡쳐드',
    alternateName: 'CAPTURED',
    url: 'https://we-captured.kr/',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="kr">
            <Script
                id="initID+JSON"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <body className={`${monda.className} relative text-sm 2xl:text-base text-black/90`}>
                {children}
                <ToastContainer
                    position="top-right"
                    autoClose={1000}
                    hideProgressBar
                    newestOnTop={false}
                    transition={Slide}
                    toastClassName="shadow-lg top-[60px] md:top-[100px]"
                />
            </body>
            <GoogleAnalytics GA_TRACKING_ID={process.env.GA_TRACKING_ID!} />
        </html>
    )
}
