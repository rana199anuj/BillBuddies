'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, Receipt, ChevronDown, ChevronUp, TrendingUp } from 'lucide-react';

interface Member { id: string; name: string; whatsapp: string }
interface Split { memberId: string; amount: number }
interface Expense { _id: string; title: string; amount: number; category: string; paidBy: string; splits: Split[]; createdAt: string }
interface Trip { _id: string; name: string; description: string; date: string; members: Member[] }

const CATEGORIES = ['🍽️ Food', '🏨 Hotel', '🚗 Transport', '🎡 Activities', '🛍️ Shopping', '💊 Medical', '📱 Utilities', '🎲 Other'];
const CATEGORY_COLORS: Record<string, string> = { Food: '#FF6584', Hotel: '#6C63FF', Transport: '#43E97B', Activities: '#FFBB38', Shopping: '#FF6584', Medical: '#43E97B', Utilities: '#6C63FF', Other: '#A0A8C0' };

function getCatColor(cat: string) {
  const key = cat.replace(/^.*? /, '');
  return CATEGORY_COLORS[key] || '#A0A8C0';
}

export default function TripDetailPage() {
  const { status } = useSession();
  const router = useRouter();
  const params = useParams();
  const tripId = params.id as string;

  const [trip, setTrip] = useState<Trip | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('🎲 Other');
  const [paidBy, setPaidBy] = useState('');
  const [selectedSplitMembers, setSelectedSplitMembers] = useState<string[]>([]);
  const [splitType, setSplitType] = useState<'equal' | 'custom'>('equal');
  const [customSplits, setCustomSplits] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => { if (status === 'unauthenticated') router.push('/login'); }, [status, router]);

  useEffect(() => {
    if (tripId) {
      fetch(`/api/trips/${tripId}`)
        .then(r => r.json())
        .then(data => {
          setTrip(data.trip);
          setExpenses(data.expenses || []);
          if (data.trip?.members?.length > 0) {
            setPaidBy(data.trip.members[0].id);
            setSelectedSplitMembers(data.trip.members.map((m: Member) => m.id));
          }
          setLoading(false);
        }).catch(() => setLoading(false));
    }
  }, [tripId]);

  const toggleSplitMember = (id: string) => {
    setSelectedSplitMembers(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!title || !amount || !paidBy || selectedSplitMembers.length === 0) {
      setFormError('Fill all fields and select at least one member to split with.');
      return;
    }

    const totalAmount = parseFloat(amount);
    let splits: Split[] = [];

    if (splitType === 'equal') {
      const share = parseFloat((totalAmount / selectedSplitMembers.length).toFixed(2));
      splits = selectedSplitMembers.map(id => ({ memberId: id, amount: share }));
    } else {
      splits = selectedSplitMembers.map(id => ({ memberId: id, amount: parseFloat(customSplits[id] || '0') }));
      const splitTotal = splits.reduce((s, sp) => s + sp.amount, 0);
      if (Math.abs(splitTotal - totalAmount) > 0.5) {
        setFormError(`Custom splits total ₹${splitTotal.toFixed(2)} but expense is ₹${totalAmount.toFixed(2)}`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tripId, title, amount: totalAmount, category, paidBy, splits }),
      });
      const data = await res.json();
      if (!res.ok) { setFormError(data.error || 'Failed to add expense'); setSubmitting(false); return; }
      setExpenses(prev => [data, ...prev]);
      setTitle(''); setAmount(''); setCategory('🎲 Other'); setSplitType('equal'); setCustomSplits({});
      setShowForm(false);
    } catch { setFormError('Something went wrong.'); }
    setSubmitting(false);
  };

  const handleDeleteExpense = async (id: string) => {
    await fetch('/api/expenses', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ expenseId: id }) });
    setExpenses(prev => prev.filter(e => e._id !== id));
  };

  const getMemberName = (id: string) => trip?.members.find(m => m.id === id)?.name ?? id;

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark)' }}>
      <div style={{ width: 40, height: 40, border: '3px solid rgba(108,99,255,0.3)', borderTop: '3px solid #6C63FF', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!trip) return <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF6584', fontSize: 18 }}>Trip not found.</div>;

  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)' }}>
      <nav className="navbar" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/dashboard" style={{ color: 'var(--text-secondary)', display: 'flex' }}><ArrowLeft size={20} /></Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#6C63FF,#FF6584)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Receipt size={16} color="white" /></div>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 18, color: 'white' }}>BillBuddies</span>
          </div>
        </div>
        <Link href={`/trips/${tripId}/settle`} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', padding: '8px 18px', fontSize: 14 }}>
          <TrendingUp size={15} /> Settle Up
        </Link>
      </nav>

      <main style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
        {/* Trip header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 30, fontWeight: 800, color: 'white', marginBottom: 6 }}>🧳 {trip.name}</h1>
          {trip.description && <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginBottom: 8 }}>{trip.description}</p>}
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{new Date(trip.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Members', value: trip.members.length, color: '#6C63FF' },
            { label: 'Expenses', value: expenses.length, color: '#FF6584' },
            { label: 'Total Spent', value: `₹${totalSpent.toFixed(0)}`, color: '#43E97B' },
          ].map((s, i) => (
            <div key={i} className="glass-card" style={{ padding: '18px 20px' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color, fontFamily: 'Outfit, sans-serif' }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Members row */}
        <div className="glass-card" style={{ padding: '20px 24px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Members:</span>
          {trip.members.map((m, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 50, padding: '5px 14px' }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: `hsl(${i * 80},70%,55%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'white' }}>{m.name[0]}</div>
              <span style={{ fontSize: 13, color: 'white' }}>{m.name}</span>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{m.whatsapp}</span>
            </div>
          ))}
        </div>

        {/* Add expense toggle */}
        <div style={{ marginBottom: 24 }}>
          <button id="toggle-expense-form" onClick={() => setShowForm(!showForm)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {showForm ? <><ChevronUp size={18} /> Hide Form</> : <><Plus size={18} /> Add Expense</>}
          </button>
        </div>

        {/* Add expense form */}
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="glass-card" style={{ padding: 28, marginBottom: 28, overflow: 'hidden' }}>
              <h2 style={{ fontWeight: 700, fontSize: 17, color: 'white', marginBottom: 20 }}>Add Expense</h2>
              {formError && (
                <div style={{ padding: '10px 14px', background: 'rgba(255,100,100,0.1)', border: '1px solid rgba(255,100,100,0.3)', borderRadius: 10, marginBottom: 16, color: '#FF6B6B', fontSize: 13 }}>
                  {formError}
                </div>
              )}
              <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>Title</label>
                    <input id="expense-title" type="text" value={title} onChange={e => setTitle(e.target.value)} className="input-field" placeholder="Hotel dinner" required />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>Amount (₹)</label>
                    <input id="expense-amount" type="number" min="1" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} className="input-field" placeholder="1500" required />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>Category</label>
                    <select value={category} onChange={e => setCategory(e.target.value)} className="select-field">
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>Paid By</label>
                    <select id="paid-by-select" value={paidBy} onChange={e => setPaidBy(e.target.value)} className="select-field">
                      {trip.members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                  </div>
                </div>

                {/* Split members */}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 10 }}>Split Among</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                    {trip.members.map((m, i) => {
                      const selected = selectedSplitMembers.includes(m.id);
                      return (
                        <button key={i} type="button" onClick={() => toggleSplitMember(m.id)}
                          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 50, border: `1px solid ${selected ? '#6C63FF' : 'rgba(255,255,255,0.1)'}`, background: selected ? 'rgba(108,99,255,0.2)' : 'transparent', color: selected ? '#6C63FF' : 'var(--text-secondary)', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.2s' }}>
                          <div style={{ width: 18, height: 18, borderRadius: '50%', background: `hsl(${i * 80},70%,55%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: 'white' }}>{m.name[0]}</div>
                          {m.name}
                        </button>
                      );
                    })}
                  </div>

                  {/* Split type */}
                  <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                    {(['equal', 'custom'] as const).map(t => (
                      <button key={t} type="button" onClick={() => setSplitType(t)}
                        style={{ padding: '6px 16px', borderRadius: 8, border: `1px solid ${splitType === t ? '#6C63FF' : 'rgba(255,255,255,0.1)'}`, background: splitType === t ? 'rgba(108,99,255,0.2)' : 'transparent', color: splitType === t ? '#6C63FF' : 'var(--text-secondary)', cursor: 'pointer', fontSize: 13, fontWeight: 600, textTransform: 'capitalize' }}>
                        {t} Split
                      </button>
                    ))}
                  </div>

                  {splitType === 'custom' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      {selectedSplitMembers.map(id => (
                        <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 13, color: 'var(--text-secondary)', minWidth: 60 }}>{getMemberName(id)}</span>
                          <input type="number" min="0" step="0.01" value={customSplits[id] ?? ''} onChange={e => setCustomSplits(prev => ({ ...prev, [id]: e.target.value }))} className="input-field" style={{ padding: '8px 12px', fontSize: 13 }} placeholder="₹0" />
                        </div>
                      ))}
                    </div>
                  )}

                  {splitType === 'equal' && selectedSplitMembers.length > 0 && amount && (
                    <p style={{ fontSize: 12, color: '#43E97B', marginTop: 6 }}>
                      Each person pays ₹{(parseFloat(amount) / selectedSplitMembers.length).toFixed(2)}
                    </p>
                  )}
                </div>

                <button id="add-expense-submit" type="submit" disabled={submitting} className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: submitting ? 0.7 : 1 }}>
                  {submitting ? <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> : <><Plus size={16} /> Add Expense</>}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expense List */}
        <div>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 20, fontWeight: 700, color: 'white', marginBottom: 16 }}>
            Expenses {expenses.length > 0 && <span style={{ color: 'var(--text-secondary)', fontWeight: 400, fontSize: 14 }}>({expenses.length})</span>}
          </h2>

          {expenses.length === 0 ? (
            <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🧾</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>No expenses yet. Add the first one!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {expenses.map((exp, i) => {
                const color = getCatColor(exp.category);
                return (
                  <motion.div key={exp._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    className="glass-card" style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                      {exp.category.split(' ')[0]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, color: 'white', marginBottom: 3 }}>{exp.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                        Paid by <span style={{ color: '#6C63FF' }}>{getMemberName(exp.paidBy)}</span> · Split among {exp.splits.length} people
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontWeight: 800, fontSize: 18, color: color, fontFamily: 'Outfit, sans-serif' }}>₹{exp.amount.toFixed(0)}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 1 }}>{exp.category.replace(/^.*? /, '')}</div>
                    </div>
                    <button onClick={() => handleDeleteExpense(exp._id)} style={{ background: 'rgba(255,100,100,0.1)', border: '1px solid rgba(255,100,100,0.2)', borderRadius: 8, padding: '6px', color: '#FF6584', cursor: 'pointer', marginLeft: 4, display: 'flex' }}>
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
