export default function Logo({ size = 36 }) {
  return (
    <div className="flex items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="30" fill="#F5B301" stroke="#0B1B3B" strokeWidth="3" />
        <circle cx="32" cy="32" r="24" fill="#0B1B3B" />
        <polygon points="27,22 27,42 45,32" fill="#F5B301" />
      </svg>
      <span className="font-bold text-xl tracking-tight">
        <span className="text-white">AdCash</span> <span className="text-gold">LK</span>
      </span>
    </div>
  );
}