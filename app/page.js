import Link from "next/link";
import Logo from "@/components/Logo";

const features = [
  { icon: "💰", title: "Earn $0.30 per ad", desc: "Watch up to 15 ads daily and earn instantly credited rewards.", color: "from-green-400/20 to-emerald-500/5" },
  { icon: "⚡", title: "Instant Payouts", desc: "Withdraw via PayPal or USDT (TRC20) with 24-hour processing.", color: "from-yellow-400/20 to-amber-500/5" },
  { icon: "👥", title: "Referral Bonuses", desc: "Earn 10% lifetime commission from every friend you refer.", color: "from-blue-400/20 to-indigo-500/5" },
  { icon: "🔒", title: "Secure & Trusted", desc: "Bank-grade encryption, verified payouts, real users.", color: "from-purple-400/20 to-pink-500/5" },
];

const testimonials = [
  { name: "Kasun Perera", city: "Colombo", text: "Got my payment within 24 hours, legit site!", avatar: "KP" },
  { name: "Nimal Silva", city: "Kandy", text: "Simple and easy. I earn $4.50 daily on my break.", avatar: "NS" },
  { name: "John Smith", city: "UK", text: "Best GPT site I've used. USDT payout was fast.", avatar: "JS" },
];

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-40 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex justify-between items-center px-6 py-5 max-w-6xl mx-auto animate-fade-in">
        <Logo />
        <div className="flex gap-3">
          <Link href="/login" className="btn-outline text-sm py-2 px-5">Login</Link>
          <Link href="/register" className="btn-gold text-sm py-2 px-5">Sign Up</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative text-center px-6 pt-16 pb-24 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full glass border border-gold-500/30 animate-fade-up">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs text-white/80 font-medium">Trusted by 12,000+ users worldwide</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 animate-fade-up leading-tight" style={{ animationDelay: "0.1s" }}>
          <span className="text-gradient-white">Get Paid to</span>
          <br />
          <span className="text-gradient-gold">Watch Ads</span>
        </h1>

        <p className="text-white/60 text-lg mb-10 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "0.2s" }}>
          Join thousands of users earning real money daily. Watch short ads, refer friends,
          withdraw via PayPal or USDT — all from your phone.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <Link href="/register" className="btn-gold text-base py-4 px-8">Start Earning Now →</Link>
          <Link href="/login" className="btn-outline text-base py-4 px-8">I have an account</Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-20 animate-fade-up" style={{ animationDelay: "0.4s" }}>
          {[
            { value: "12,450+", label: "Active Users" },
            { value: "$48,200+", label: "Paid Out" },
            { value: "1.2M+", label: "Ads Watched" },
          ].map((s, i) => (
            <div key={i} className="card text-center py-6 group hover:scale-105">
              <div className="text-2xl md:text-3xl font-extrabold text-gradient-gold mb-1">{s.value}</div>
              <div className="text-white/50 text-xs md:text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gradient-white">Why Choose AdCash LK?</h2>
          <p className="text-white/50 max-w-xl mx-auto">A modern platform built for real earnings and real payouts.</p>
          <div className="divider w-32 mx-auto mt-6" />
        </div>

        <div className="grid md:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <div key={i} className="card group hover:-translate-y-2 animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} border border-white/10 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                {f.icon}
              </div>
              <h3 className="font-bold mb-2 text-white">{f.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gradient-white">What Users Say</h2>
          <div className="divider w-32 mx-auto mt-6" />
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div key={i} className="card hover:-translate-y-2 animate-fade-up" style={{ animationDelay: `${i * 0.15}s` }}>
              <div className="text-gold-500 mb-3 text-lg">★★★★★</div>
              <p className="text-white/80 mb-5 leading-relaxed">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center font-bold text-navy-900 text-sm">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-sm text-white">{t.name}</div>
                  <div className="text-white/40 text-xs">{t.city}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 max-w-4xl mx-auto">
        <div className="relative card overflow-hidden text-center py-14 animate-fade-up">
          <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 via-transparent to-blue-500/10 pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient-white">Ready to Start Earning?</h2>
            <p className="text-white/60 mb-8 max-w-lg mx-auto">Sign up free in 30 seconds. No credit card. No hidden fees.</p>
            <Link href="/register" className="btn-gold text-base py-4 px-8 inline-block">Create Free Account →</Link>
          </div>
        </div>
      </section>

      <footer className="text-center py-8 text-white/30 text-sm border-t border-white/5">
        <div className="mb-3 flex justify-center"><Logo size={28} /></div>
        © 2025 AdCash LK. All rights reserved.
      </footer>
    </main>
  );
    }
