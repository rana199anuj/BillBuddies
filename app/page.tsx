'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, Receipt, MessageCircle, ArrowRight, Zap, Shield } from 'lucide-react';
import { signIn } from 'next-auth/react';

const features = [
  {
    icon: <Users size={28} />,
    title: 'Group Trips',
    desc: 'Create trip groups, add friends with their WhatsApp numbers, and manage who is in.',
    color: '#6C63FF',
  },
  {
    icon: <Receipt size={28} />,
    title: 'Smart Splitting',
    desc: 'Add expenses, pick who paid, and split among any subset. Equal or custom splits.',
    color: '#FF6584',
  },
  {
    icon: <MessageCircle size={28} />,
    title: 'WhatsApp Reminders',
    desc: 'One tap sends a polite payment reminder directly on WhatsApp.',
    color: '#43E97B',
  },
  {
    icon: <Zap size={28} />,
    title: 'Instant Calculation',
    desc: 'Our debt-simplification engine minimizes the number of transactions to settle.',
    color: '#FFBB38',
  },
  {
    icon: <Shield size={28} />,
    title: 'Secure & Private',
    desc: 'Passwords are bcrypt-hashed. Your data lives on MongoDB Atlas with auth protection.',
    color: '#6C63FF',
  },
];

const floatingCards = [
  { label: 'Grocery Run', amount: '₹1,200', paidBy: 'Rahul', color: '#6C63FF' },
  { label: 'Hotel Room', amount: '₹8,500', paidBy: 'Priya', color: '#FF6584' },
  { label: 'Cab to Airport', amount: '₹650', paidBy: 'You', color: '#43E97B' },
];

export default function LandingPage() {
  return (
    <div className="animated-bg min-h-screen relative overflow-hidden">
      {/* Orbs */}
      <div className="orb" style={{ width: 500, height: 500, background: '#6C63FF', top: -100, left: -150, animationDelay: '0s' }} />
      <div className="orb" style={{ width: 400, height: 400, background: '#FF6584', bottom: -100, right: -100, animationDelay: '3s' }} />
      <div className="orb" style={{ width: 300, height: 300, background: '#43E97B', top: '40%', left: '50%', animationDelay: '6s' }} />

      {/* Navbar */}
      <nav className="navbar px-6 py-4 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#6C63FF,#FF6584)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Receipt size={20} color="white" />
          </div>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 20, color: 'white' }}>BillBuddies</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <button onClick={() => signIn('credentials', { isGuest: 'true', callbackUrl: '/dashboard' })} style={{
            padding: '10px 24px', 
            color: 'white', 
            fontWeight: 600, 
            fontSize: '15px', 
            borderRadius: '12px', 
            background: 'linear-gradient(135deg, #6C63FF 0%, #FF6584 100%)',
            boxShadow: '0 8px 20px -6px rgba(108, 99, 255, 0.5)',
            border: 'none',
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}>
            Start Now
          </button>
        </motion.div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-24 pb-40">

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(40px, 7vw, 80px)', fontWeight: 900, lineHeight: 1.1, marginBottom: 24, maxWidth: 800 }}
        >
          Split Bills, <span className="gradient-text">Not Friendships</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{ fontSize: 20, color: 'var(--text-secondary)', maxWidth: 560, lineHeight: 1.7, marginBottom: 40 }}
        >
          Track group expenses, calculate who owes what, and send WhatsApp payment reminders — all in one place.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex gap-4 flex-wrap justify-center"
        >
          <button onClick={() => signIn('credentials', { isGuest: 'true', callbackUrl: '/dashboard' })} className="btn-primary" style={{ fontSize: 17, padding: '14px 32px', display: 'flex', border: 'none', cursor: 'pointer', alignItems: 'center', gap: 8 }}>
            Get Started <ArrowRight size={18} />
          </button>
        </motion.div>

        {/* Floating expense cards */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="flex gap-4 flex-wrap justify-center mt-16"
        >
          {floatingCards.map((card, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
              className="glass-card"
              style={{ padding: '18px 24px', minWidth: 180, textAlign: 'left' }}
            >
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: card.color, marginBottom: 10 }} />
              <div style={{ fontWeight: 700, fontSize: 18, color: 'white', marginBottom: 4 }}>{card.amount}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>{card.label}</div>
              <div style={{ fontSize: 12, color: card.color }}>Paid by {card.paidBy}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 py-20 max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ fontFamily: 'Outfit, sans-serif', fontSize: 42, fontWeight: 800, textAlign: 'center', marginBottom: 16 }}
        >
          Everything you need
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: 60, fontSize: 17 }}
        >
          Powerful features, zero complexity.
        </motion.p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card card-hover"
              style={{ padding: 28 }}
            >
              <div style={{ width: 56, height: 56, borderRadius: 16, background: `${f.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: f.color, marginBottom: 18 }}>
                {f.icon}
              </div>
              <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 10, color: 'white' }}>{f.title}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: 14 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card"
          style={{ maxWidth: 700, margin: '0 auto', padding: '60px 40px' }}
        >
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 40, fontWeight: 800, marginBottom: 16 }}>
            Ready to settle up?
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 17 }}>
            Join BillBuddies for free. No credit card required.
          </p>
          <button onClick={() => signIn('credentials', { isGuest: 'true', callbackUrl: '/dashboard' })} className="btn-primary" style={{ fontSize: 17, border: 'none', cursor: 'pointer', padding: '14px 40px', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            Start Using BillBuddies <ArrowRight size={18} />
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(108,99,255,0.1)', padding: '24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: 14 }}>
        © {new Date().getFullYear()} BillBuddies — Split smarter, travel together.
      </footer>
    </div>
  );
}
