'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, MessageCircle, Receipt, ArrowRight, UserCheck } from 'lucide-react';
import { calculateSettlements, Settlement } from '@/lib/calculations';

interface Member { id: string; name: string; whatsapp: string }
interface Trip { _id: string; name: string; description: string; members: Member[] }
interface SplittedExp { memberId: string; amount: number }
interface Expense { _id: string; title: string; amount: number; category: string; paidBy: string; splits: SplittedExp[] }

export default function SettlePage() {
  const { status } = useSession();
  const router = useRouter();
  const params = useParams();
  const tripId = params.id as string;

  const [trip, setTrip] = useState<Trip | null>(null);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [balances, setBalances] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (status === 'unauthenticated') router.push('/login'); }, [status, router]);

  useEffect(() => {
    if (tripId) {
      fetch(`/api/trips/${tripId}`)
        .then(r => r.json())
        .then(data => {
          setTrip(data.trip);
          if (data.trip && data.expenses) {
            // Using the actual calculate function
            const result = calculateSettlements(data.trip.members, data.expenses);
            setSettlements(result);

            // Using the get balances from local helper or inline
            const bals: Record<string, number> = {};
            data.trip.members.forEach((m: Member) => (bals[m.id] = 0));
            data.expenses.forEach((e: Expense) => {
              if (bals[e.paidBy] !== undefined) bals[e.paidBy] += e.amount;
              e.splits.forEach(s => { if (bals[s.memberId] !== undefined) bals[s.memberId] -= s.amount; });
            });
            setBalances(bals);
          }
          setLoading(false);
        }).catch(() => setLoading(false));
    }
  }, [tripId]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark)' }}>
      <div style={{ width: 40, height: 40, border: '3px solid rgba(108,99,255,0.3)', borderTop: '3px solid #6C63FF', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!trip) return <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF6584' }}>Trip not found.</div>;

  const handleWhatsApp = (s: Settlement) => {
    const text = encodeURIComponent(
      `Hi ${s.from.name}! 👋\n\n🧳 For our trip *"${trip.name}"*, you owe *₹${s.amount.toFixed(0)}* to *${s.to.name}*.\n\nPlease settle up! 😊\n\n💰 Powered by *BillBuddies*`
    );
    // WhatsApp defaults to country code +91 (India) if the number is exactly 10 digits
    const num = s.from.whatsapp.length === 10 ? `91${s.from.whatsapp}` : s.from.whatsapp;
    window.open(`https://wa.me/${num}?text=${text}`, '_blank');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)' }}>
      <nav className="navbar" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <Link href={`/trips/${tripId}`} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'var(--text-secondary)' }}>
          <ArrowLeft size={20} /> Back to Trip
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#6C63FF,#FF6584)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Receipt size={16} color="white" /></div>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 18, color: 'white' }}>BillBuddies</span>
        </div>
      </nav>

      <main style={{ maxWidth: 740, margin: '0 auto', padding: '40px 24px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: 20, background: 'rgba(67,233,123,0.15)', color: '#43E97B', marginBottom: 16 }}>
            <CheckCircle2 size={32} />
          </div>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 32, fontWeight: 800, color: 'white', marginBottom: 8 }}>Settle Up</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15, maxWidth: 400, margin: '0 auto' }}>
            We've simplified the debts to minimize the number of transactions needed to settle {trip.name}.
          </p>
        </motion.div>

        {settlements.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card" style={{ padding: 48, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 22, fontWeight: 700, color: 'white', marginBottom: 8 }}>All Settled Up!</h2>
            <p style={{ color: 'var(--text-secondary)' }}>There are no outstanding debts in this group.</p>
          </motion.div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 20, fontWeight: 700, color: 'white' }}>Who Pays Whom</h2>
            {settlements.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1, minWidth: 280 }}>
                  {/* From */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,100,100,0.15)', border: '2px solid #FF6584', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF6584', fontWeight: 700, fontSize: 16 }}>
                      {s.from.name[0]}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>{s.from.name}</span>
                  </div>

                  {/* Amount / Arrow */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: 18, fontWeight: 800, color: '#43E97B' }}>₹{s.amount.toFixed(0)}</span>
                    <div style={{ height: 2, background: 'linear-gradient(90deg, #FF6584 0%, #43E97B 100%)', width: '100%', position: 'relative' }}>
                      <ArrowRight size={14} color="#43E97B" style={{ position: 'absolute', right: -6, top: -6 }} />
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>pays</span>
                  </div>

                  {/* To */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(67,233,123,0.15)', border: '2px solid #43E97B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#43E97B', fontWeight: 700, fontSize: 16 }}>
                      {s.to.name[0]}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>{s.to.name}</span>
                  </div>
                </div>

                {/* Action */}
                <button
                  onClick={() => handleWhatsApp(s)}
                  style={{ background: '#25D366', color: 'white', border: 'none', borderRadius: 12, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 14, cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s', boxShadow: '0 4px 14px rgba(37, 211, 102, 0.3)' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                >
                  <MessageCircle size={18} /> Send Reminder
                </button>
              </motion.div>
            ))}

            {/* Balances summary */}
            <div className="glass-card" style={{ padding: 24, marginTop: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'white', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <UserCheck size={16} color="#6C63FF" /> Individual Net Balances
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
                {trip.members.map(m => {
                  const bal = balances[m.id] || 0;
                  const color = Math.abs(bal) < 0.5 ? 'var(--text-secondary)' : bal > 0 ? '#43E97B' : '#FF6584';
                  return (
                    <div key={m.id} style={{ background: 'rgba(255,255,255,0.03)', padding: 12, borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span style={{ fontSize: 13, color: 'white', fontWeight: 600 }}>{m.name}</span>
                      <span style={{ fontSize: 15, fontWeight: 700, color }}>
                        {Math.abs(bal) < 0.5 ? 'Settled' : `${bal > 0 ? '+' : '-'}₹${Math.abs(bal).toFixed(0)}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
