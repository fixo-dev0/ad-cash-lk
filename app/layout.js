import Script from "next/script";
import "./globals.css";

export const metadata = {
  title: "AdCash LK - Earn Money Watching Ads",
  description: "Earn real money by watching short ads. Withdraw via PayPal or USDT.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Monetag Verification Meta Tag */}
        <meta name="monetag" content="ac29917a1139a2227cf018f661b72e3a" />
        <meta name="theme-color" content="#060f24" />
      </head>
      <body>
        {children}

        {/* Monetag Vignette Banner (auto + manual trigger attempt) */}
        <Script
          id="monetag-vignette"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(s){s.dataset.zone='12010366',s.src='https://n6wxm.com/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`,
          }}
        />
      </body>
    </html>
  );
}
