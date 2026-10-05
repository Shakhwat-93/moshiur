# Herbheez BD — Zero Allergy Landing & Dynamic E-Commerce CMS

A modern, high-converting, fully dynamic e-commerce landing page and Shopify-style Admin Panel built with React 18, Vite, and Supabase.

## 🚀 Key Highlights

- **100% Dynamic Content:** No hardcoded copy, prices, packages, or images. Everything is managed from the Admin Panel.
- **Shopify-Style Admin Panel:** Minimal, fast, and accessible at `/#admin`.
- **Live Cash-on-Delivery Checkout:** Real-time quantity, discount, subtotal, and total calculation with Bangladeshi phone validation.
- **Mobile-First Experience:** App-like feel with bottom navigation, responsive drawer, and card-based table layouts.
- **Supabase Backend:** Real-time cloud sync for products, orders, testimonials, FAQs, and site theme settings.
- **Vercel Deploy Ready:** Includes SPA rewrites (`vercel.json`), asset caching, and environment variable fallbacks.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, Lucide Icons, Canvas Confetti
- **Styling:** Custom CSS with 8px Design System and CSS variables (`Noto Serif Bengali` + `Anek Bangla`)
- **Backend & Database:** Supabase (PostgreSQL with RLS policies)
- **Deployment:** Vercel

---

## 💻 Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Shakhwat-93/moshiur.git
   cd moshiur
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   - Storefront: `http://localhost:5500/`
   - Admin Panel: `http://localhost:5500/#admin`

---

## ☁️ Vercel Deployment

1. Import the repository in [Vercel](https://vercel.com).
2. Framework Preset: **Vite**
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. (Optional) Set Environment Variables:
   - `VITE_SUPABASE_URL`: `https://ovpsfqsvwmtzxglxrceg.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92cHNmcXN2d210enhnbHhyY2VnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExNTk3NTIsImV4cCI6MjEwNjczNTc1Mn0.gKj4Ng7QkH2pTfw7MHxiseBSKKZEyT5j_6O4ATfeTlw`
6. Click **Deploy**!

---

## 📄 License
MIT License. Copyright © 2026 Herbheez BD.
