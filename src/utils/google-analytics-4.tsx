import Script from 'next/script'

async function GoogleAnalytics({ GA_TRACKING_ID }: { GA_TRACKING_ID: string }) {
    return (
        <>
            <Script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
                strategy="afterInteractive"
            />
            <Script async id="google-analytics" strategy="afterInteractive">
                {`
        window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${GA_TRACKING_ID}');

        `}
            </Script>
        </>
    )
}

export default GoogleAnalytics
