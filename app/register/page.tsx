'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, Receipt, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Registration failed');
        setLoading(false);
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push('/login'), 1500);
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthColors = ['', '#FF6584', '#FFBB38', '#43E97B'];
  const strengthLabels = ['', 'Weak', 'Good', 'Strong'];

  return (
    <div className="animated-bg min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="orb" style={{ width: 400, height: 400, background: '#FF6584', top: -100, right: -100 }} />
      <div className="orb" style={{ width: 350, height: 350, background: '#6C63FF', bottom: -80, left: -80, animationDelay: '4s' }} />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: '100%', maxWidth: 460, position: 'relative', zIndex: 10 }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg,#6C63FF,#FF6584)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Receipt size={22} color="white" />
            </div>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 24, color: 'white' }}>BillBuddies</span>
          </Link>
          <p style={{ color: 'var(--text-secondary)', marginTop: 8, fontSize: 15 }}>Create your free account in seconds.</p>
        </div>

        <div className="glass-card" style={{ padding: '36px 32px' }}>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 26, fontWeight: 800, marginBottom: 28, color: 'white' }}>Create Account</h1>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'rgba(255,100,100,0.1)', border: '1px solid rgba(255,100,100,0.3)', borderRadius: 12, marginBottom: 20, color: '#FF6B6B', fontSize: 14 }}>
              <AlertCircle size={16} />{error}
            </motion.div>
          )}

          {success && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'rgba(67,233,123,0.1)', border: '1px solid rgba(67,233,123,0.3)', borderRadius: 12, marginBottom: 20, color: '#43E97B', fontSize: 14 }}>
              <CheckCircle size={16} /> Account created! Redirecting to login...
            </motion.div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Name */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, display: 'block', textTransform: 'uppercase', letterSpacing: 0.5 }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input id="name" type="text" value={name} onChange={e => setName(e.target.value)}
                  className="input-field" style={{ paddingLeft: 44 }} placeholder="Rahul Sharma" required />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, display: 'block', textTransform: 'uppercase', letterSpacing: 0.5 }}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input id="reg-email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="input-field" style={{ paddingLeft: 44 }} placeholder="you@example.com" required />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, display: 'block', textTransform: 'uppercase', letterSpacing: 0.5 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input id="reg-password" type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  className="input-field" style={{ paddingLeft: 44, paddingRight: 44 }} placeholder="Min. 6 characters" required />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* Strength bar */}
              {password.length > 0 && (
                <div style={{ marginTop: 10 }}>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                    {[1, 2, 3].map(i => (
                      <div key={i} style={{ flex: 1, height: 4, borderRadius: 4, background: i <= strength ? strengthColors[strength] : 'rgba(255,255,255,0.1)', transition: 'background 0.3s' }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 12, color: strengthColors[strength] }}>{strengthLabels[strength]}</span>
                </div>
              )}
            </div>

            <button id="register-submit" type="submit" disabled={loading || success} className="btn-primary"
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 16, padding: '14px', marginTop: 4, opacity: (loading || success) ? 0.7 : 1 }}>
              {loading ? (
                <div style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              ) : (
                <>Create Account <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--text-secondary)', fontSize: 14 }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Sign in →</Link>
          </p>
        </div>
      </motion.div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
