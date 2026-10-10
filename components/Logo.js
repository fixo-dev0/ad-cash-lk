export default function Logo({ size = 36 }) {
  return (
    <div className="flex items-center gap-2 group">
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        className="transition-transform duration-500 group-hover:rotate-12"
      >
        <circle cx="32" cy="32" r="30" fill="url(#logoGrad)" stroke="#0B1B3B" strokeWidth="3" />
        <circle cx="32" cy="32" r="24" fill="#0B1B3B" />
        <polygon points="27,22 27,42 45,32" fill="#F5B301" />
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="64" y2="64">
            <stop offset="0%" stopColor="#FFD966" />
            <stop offset="100%" stopColor="#F5B301" />
          </linearGradient>
        </defs>
      </svg>
      <span className="font-extrabold text-xl tracking-tight">
        <span className="text-white">AdCash</span> <span className="text-gradient-gold">LK</span>
      </span>
    </div>
  );
          }
