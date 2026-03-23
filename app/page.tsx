'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Users, Receipt, MessageCircle, ArrowRight, Zap, Shield } from 'lucide-react';

const features = [
  {
    icon: <Users size={26} />,
    title: 'Group Trips',
    desc: "Create trip groups, add friends, and manage who's in.",
    color: '#a78bfa',
  },
  {
    icon: <Receipt size={26} />,
    title: 'Smart Splitting',
    desc: 'Add expenses and split equally or with custom amounts.',
    color: '#f472b6',
  },
  {
    icon: <MessageCircle size={26} />,
    title: 'WhatsApp Reminders',
    desc: 'One tap sends a polite payment reminder on WhatsApp.',
    color: '#34d399',
  },
  {
    icon: <Zap size={26} />,
    title: 'Instant Calculation',
    desc: 'Debt-simplification engine minimizes total transactions.',
    color: '#fbbf24',
  },
  {
    icon: <Shield size={26} />,
    title: 'Secure & Private',
    desc: 'Passwords are bcrypt-hashed, data lives on MongoDB Atlas.',
    color: '#60a5fa',
  },
];

// Replaced SVG with image
export default function LandingPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e0a3c 0%, #2d1b69 30%, #4a2080 60%, #3b0764 100%)',
      fontFamily: "'Inter', sans-serif",
      color: 'white',
      overflowX: 'hidden',
      position: 'relative',
    }}>
      <style>{`
        .responsive-nav { padding: 20px 60px; }
        .nav-links-container { display: flex; }
        .hero-section { flex-direction: row; padding: 60px 60px 80px; }
        .hero-text-container { display: flex; flex-direction: column; align-items: flex-start; max-width: 520px; text-align: left; }
        .hero-buttons { justify-content: flex-start; }
        .hero-image-container { width: 45%; max-width: 520px; }
        .features-section { padding: 60px 60px 80px; }
        .cta-section { padding: 40px 60px 80px; }
        .footer-section { padding: 24px 60px; }

        @media (max-width: 768px) {
          .responsive-nav { padding: 15px 20px; }
          .nav-links-container { display: none !important; }
          .hero-section { flex-direction: column; padding: 30px 20px 60px; gap: 40px !important; }
          .hero-text-container { max-width: 100%; align-items: center; text-align: center; }
          .hero-buttons { justify-content: center; }
          .hero-image-container { width: 90%; max-width: 400px; margin: 0 auto; }
          .features-section { padding: 40px 20px; }
          .cta-section { padding: 40px 20px; }
          .footer-section { padding: 24px 20px; }
        }
        @media (max-width: 480px) {
          .hero-title { font-size: 42px !important; }
          .hero-buttons { flex-direction: column; width: 100%; gap: 12px !important; }
          .hero-buttons > * { width: 100%; justify-content: center; }
        }
      `}</style>
      
      {/* Subtle top-left orange accent (like reference) */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0,
        width: 180, height: 8,
        background: 'linear-gradient(90deg, #f97316, #fb923c)',
        borderRadius: '0 0 8px 0',
        zIndex: 10,
      }} />

      {/* Background decorative circles */}
      <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'rgba(109,40,217,0.12)', filter: 'blur(60px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(76,29,149,0.2)', filter: 'blur(80px)', pointerEvents: 'none' }} />

      {/* ── NAVBAR ── */}
      <nav className="responsive-nav" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 10,
      }}>
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ display: 'flex', alignItems: 'center', gap: 10 }}
        >
          <img src="/logo.png" alt="BillBuddies Logo" style={{ width: 38, height: 38, borderRadius: 10, objectFit: 'cover' }} />
          <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 20, color: 'white' }}>BillBuddies</span>
        </motion.div>

        {/* Nav Links */}
        <motion.div
          className="nav-links-container"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ alignItems: 'center', gap: 40 }}
        >
          <Link href="/" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontWeight: 500, fontSize: 15 }}>Home</Link>
          <Link href="#features" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none', fontWeight: 500, fontSize: 15 }}>Features</Link>
          <Link href="#about" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none', fontWeight: 500, fontSize: 15 }}>About</Link>
        </motion.div>

        {/* Auth buttons */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ display: 'flex', alignItems: 'center', gap: 12 }}
        >
          <Link href="/login" style={{
            color: 'rgba(255,255,255,0.8)',
            fontWeight: 600,
            fontSize: 15,
            textDecoration: 'none',
            padding: '9px 20px',
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.2)',
            transition: 'all 0.2s',
          }}>Login</Link>
          <Link href="/register" style={{
            color: '#1e0a3c',
            fontWeight: 700,
            fontSize: 15,
            textDecoration: 'none',
            padding: '9px 22px',
            borderRadius: 8,
            background: 'white',
            transition: 'all 0.2s',
          }}>Sign Up</Link>
        </motion.div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero-section" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: '80vh',
        position: 'relative',
        zIndex: 5,
        gap: 40,
      }}>
        {/* Left: Text */}
        <div className="hero-text-container" style={{ flex: '0 0 auto' }}>
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 'clamp(40px, 5vw, 68px)',
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: 20,
              color: 'white',
            }}
          >
            Split Bills,<br />
            <span style={{ color: '#c4b5fd' }}>Not Friendships</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            style={{
              fontSize: 17,
              color: 'rgba(255,255,255,0.65)',
              lineHeight: 1.75,
              marginBottom: 40,
              maxWidth: 440,
            }}
          >
            Track group expenses, calculate who owes what, and send WhatsApp payment reminders — all in one place.
          </motion.p>

          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28 }}
            style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}
          >
            <Link
              href="/register"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '14px 32px',
                background: 'white',
                color: '#4c1d95',
                fontWeight: 700,
                fontSize: 16,
                borderRadius: 10,
                textDecoration: 'none',
                transition: 'all 0.25s',
                boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
              }}
            >
              Try Now
            </Link>
            <Link
              href="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '14px 32px',
                background: 'transparent',
                color: 'white',
                fontWeight: 700,
                fontSize: 16,
                borderRadius: 10,
                textDecoration: 'none',
                border: '2px solid rgba(255,255,255,0.35)',
                transition: 'all 0.25s',
              }}
            >
              Get Now <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>

        {/* Right: Cartoon Image */}
        <motion.div
          className="hero-image-container"
          initial={{ opacity: 0, scale: 0.8, x: 30 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1.0, ease: 'easeOut' }}
          style={{ flex: '0 0 auto', display: 'flex', justifyContent: 'center' }}
        >
          <img 
            src="/cartoon-friends.png" 
            alt="Friends splitting travel bills" 
            style={{ 
              width: '100%', 
              height: 'auto', 
              filter: 'drop-shadow(0 25px 35px rgba(0,0,0,0.3))'
            }} 
          />
        </motion.div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="features-section" style={{ position: 'relative', zIndex: 5 }}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ fontFamily: 'Outfit, sans-serif', fontSize: 38, fontWeight: 800, textAlign: 'center', marginBottom: 12 }}
        >
          Everything you need
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ color: 'rgba(255,255,255,0.55)', textAlign: 'center', marginBottom: 52, fontSize: 16 }}
        >
          Powerful features, zero complexity.
        </motion.p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, maxWidth: 1100, margin: '0 auto' }}>
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              style={{
                padding: '28px 24px',
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 18,
                cursor: 'default',
              }}
            >
              <div style={{ width: 52, height: 52, borderRadius: 14, background: `${f.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: f.color, marginBottom: 18 }}>
                {f.icon}
              </div>
              <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 8, color: 'white' }}>{f.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, fontSize: 14 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section" style={{ textAlign: 'center', position: 'relative', zIndex: 5 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          style={{
            maxWidth: 660,
            margin: '0 auto',
            padding: '56px 40px',
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 24,
          }}
        >
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 38, fontWeight: 800, marginBottom: 14 }}>
            Ready to settle up?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 32, fontSize: 16 }}>
            Join BillBuddies for free. No credit card required.
          </p>
          <Link
            href="/register"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '14px 40px',
              background: 'white',
              color: '#4c1d95',
              fontWeight: 700,
              fontSize: 16,
              borderRadius: 10,
              textDecoration: 'none',
              boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
            }}
          >
            Start Using BillBuddies <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer-section" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
        © {new Date().getFullYear()} BillBuddies — Split smarter, travel together. | Made by <strong style={{ color: 'rgba(255,255,255,0.7)' }}>Anuj Rana</strong>
      </footer>
    </div>
  );
}
