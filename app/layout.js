import "./globals.css";
import Script from "next/script";

export const metadata = {
  title: "AdCash LK - Earn Money Watching Ads",
  description: "Earn real money by watching short ads. Withdraw via PayPal or USDT.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Monetag verification meta tag goes here */}
        <meta name="monetag" content="YOUR_MONETAG_VERIFICATION_CODE" />
        {/* Paste Monetag ad zone code here */}
      </head>
      <body>
        {children}
        {/* Paste Monetag ad zone code here (popunder script) */}
      </body>
    </html>
  );
}