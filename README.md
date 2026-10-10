# AdCash LK

Get-paid-to-watch-ads platform built with Next.js 14, MongoDB, Tailwind CSS.

## Features
- JWT auth with httpOnly cookies + bcrypt
- 15 daily ad slots ($0.30 each)
- Referral system with 10% lifetime commission
- Withdraw via PayPal / USDT (TRC20)
- Admin panel at `/admin-panel-x9k2`
- Public + private comments
- Monetag ad zone placeholder

## Setup

1. **Clone & Install**
```bash
git clone <your-repo-url>
cd adcash-lk
npm install
```

2. **Environment** — create `.env.local`:
```env
MONGODB_URI=mongodb://localhost:27017/adcash_lk
JWT_SECRET=<long-random-string>
ADMIN_PASSWORD_HASH=<bcrypt-hash-of-admin-password>
```

Generate admin hash:
```bash
node -e "console.log(require('bcryptjs').hashSync('dark1234#@$',10))"
```

3. **Seed fake comments**
Start dev server, then visit:
```
http://localhost:3000/api/seed
```

4. **Run**
```bash
npm run dev
```

5. **Access**
- Home: http://localhost:3000
- Dashboard: /dashboard
- Withdraw: /withdraw
- Admin: /admin-panel-x9k2 (password: `dark1234#@$`)

## Monetag Integration
Open `app/layout.js` and replace:
- `YOUR_MONETAG_VERIFICATION_CODE` with your code
- Add ad zone script where marked `Paste Monetag ad zone code here`

## Deploy to Vercel
1. Push to GitHub
2. Import in Vercel
3. Add env vars in Vercel dashboard
4. Deploy

## Tech
Next.js 14 · React 18 · MongoDB/Mongoose · Tailwind · bcryptjs · jsonwebtoken · zod