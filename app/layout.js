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

        {/* Paste Monetag ad zone code here */}
      </head>
      <body>{children}</body>
    </html>
  );
}
