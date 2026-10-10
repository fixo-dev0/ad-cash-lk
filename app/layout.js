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
        {/* 1. Monetag Verification Meta Tag */}
        <meta name="monetag" content="ac29917a1139a2227cf018f661b72e3a" />

        {/* 2. Monetag Ad Zone Code (Multitag) */}
        <Script
          id="monetag-multitag"
          src="https://quge5.com/88/tag.min.js"
          data-zone="293630"
          strategy="afterInteractive"
          data-cfasync="false"
        />
      </head>
      <body>{children}</body>
    </html>
  );
    }
