import Link from "next/link";
import Logo from "@/components/Logo";

const features = [
  { icon: "💰", title: "Earn $0.30 per ad", desc: "Watch up to 15 ads daily and earn instantly credited rewards." },
  { icon: "⚡", title: "Instant Payouts", desc: "Withdraw via PayPal or USDT (TRC20) with 24-hour processing." },
  { icon: "👥", title: "Referral Bonuses", desc: "Earn 10% lifetime commission from every friend you refer." },
  { icon: "🔒", title: "Secure & Trusted", desc: "Bank-grade encryption, verified payouts, real users." },
];

const testimonials = [
  { name: "Kasun Perera", city: "Colombo", text: "Got my payment within 24 hours, legit site!" },
  { name: "Nimal Silva", city: "Kandy", text: "Simple and easy. I earn $4.50 daily on my break." },
  { name: "John Smith", city: "UK", text: "Best GPT site I've used. USDT payout was fast." },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <nav className="flex justify-between items-center px-6 py-4 max-w-6xl mx-auto">
        <Logo />
        <div className="flex gap-3">
          <Link href="/login" className="btn-outline text-sm py-2">Login</Link>
          <Link href="/register" className="btn-gold text-sm py-2">Sign Up</Link>
        </div>
      </nav>

      <section className="text-center px-6 py-20 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Get Paid to <span className="text-gold">Watch Ads</span>
        </h1>
        <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
          Join thousands of users earning real money daily. Watch short ads, refer friends, withdraw via PayPal or USDT.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/register" className="btn-gold">Start Earning Now</Link>
          <Link href="/login" className="btn-outline">I have an account</Link>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-16">
          <div>
            <div className="text-3xl font-bold text-gold">12,450+</div>
            <div className="text-white/60 text-sm">Active Users</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gold">$48,200+</div>
            <div className="text-white/60 text-sm">Paid Out</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gold">1.2M+</div>
            <div className="text-white/60 text-sm">Ads Watched</div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose AdCash LK?</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="card">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-white/60 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="card">
              <div className="text-gold mb-2">★★★★★</div>
              <p className="mb-4">"{t.text}"</p>
              <div className="text-white/60 text-sm">— {t.name}, {t.city}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="text-center py-8 text-white/50 text-sm border-t border-white/10">
        © 2026 AdCash LK. All rights reserved.
      </footer>
    </main>
  );
}