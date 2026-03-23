'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, Receipt, User, Phone, Calendar, FileText } from 'lucide-react';

interface Member { name: string; whatsapp: string }

export default function NewTripPage() {
  const { status } = useSession();
  const router = useRouter();
  const [tripName, setTripName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [members, setMembers] = useState<Member[]>([{ name: '', whatsapp: '' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (status === 'unauthenticated') { router.push('/login'); return null; }

  const addMember = () => setMembers([...members, { name: '', whatsapp: '' }]);
  const removeMember = (i: number) => setMembers(members.filter((_, idx) => idx !== i));
  const updateMember = (i: number, field: keyof Member, val: string) => {
    const updated = [...members];
    updated[i][field] = val;
    setMembers(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const validMembers = members.filter(m => m.name.trim() && m.whatsapp.trim());
    if (!tripName.trim()) { setError('Trip name is required'); return; }
    if (validMembers.length < 1) { setError('Add at least one member with name and WhatsApp'); return; }

    const membersWithIds = validMembers.map(m => ({ ...m, id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}` }));

    setLoading(true);
    try {
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: tripName, description, date, members: membersWithIds }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to create trip'); setLoading(false); return; }
      router.push(`/trips/${data._id}`);
    } catch { setError('Something went wrong.'); setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)' }}>
      {/* Navbar */}
      <nav className="navbar" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'var(--text-secondary)' }}>
          <ArrowLeft size={20} />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src="/logo.png" alt="BillBuddies Logo" style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'cover', boxShadow: '0 2px 8px rgba(108,99,255,0.3)' }} />
          <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 18, color: 'white' }}>BillBuddies</span>
        </div>
      </nav>

      <main style={{ maxWidth: 680, margin: '0 auto', padding: '40px 24px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 32, fontWeight: 800, color: 'white', marginBottom: 6 }}>Create New Trip</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 36, fontSize: 15 }}>Set up a group, add friends, and start splitting expenses.</p>

          {error && (
            <div style={{ padding: '12px 16px', background: 'rgba(255,100,100,0.1)', border: '1px solid rgba(255,100,100,0.3)', borderRadius: 12, marginBottom: 24, color: '#FF6B6B', fontSize: 14 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {/* Trip details */}
            <div className="glass-card" style={{ padding: 28 }}>
              <h2 style={{ fontWeight: 700, fontSize: 17, color: 'white', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Calendar size={18} color="#6C63FF" /> Trip Details
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 8 }}>Trip Name *</label>
                  <div style={{ position: 'relative' }}>
                    <FileText size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input id="trip-name" type="text" value={tripName} onChange={e => setTripName(e.target.value)} className="input-field" style={{ paddingLeft: 42 }} placeholder="Goa Trip 2025" required />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 8 }}>Description</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} className="input-field" style={{ resize: 'vertical', minHeight: 80 }} placeholder="Optional description..." />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 8 }}>Date</label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} className="input-field" style={{ colorScheme: 'dark' }} />
                </div>
              </div>
            </div>

            {/* Members */}
            <div className="glass-card" style={{ padding: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h2 style={{ fontWeight: 700, fontSize: 17, color: 'white', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <User size={18} color="#FF6584" /> Members ({members.length})
                </h2>
                <button type="button" onClick={addMember} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.3)', color: 'var(--primary)', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                  <Plus size={14} /> Add Member
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <AnimatePresence>
                  {members.map((m, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                      style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 12, alignItems: 'center' }}>
                      <div style={{ position: 'relative' }}>
                        <User size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        <input type="text" value={m.name} onChange={e => updateMember(i, 'name', e.target.value)} className="input-field" style={{ paddingLeft: 36, fontSize: 14 }} placeholder={`Member ${i + 1} name`} />
                      </div>
                      <div style={{ position: 'relative' }}>
                        <Phone size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        <input type="tel" value={m.whatsapp} onChange={e => updateMember(i, 'whatsapp', e.target.value.replace(/\D/g, '').slice(0, 10))} className="input-field" style={{ paddingLeft: 36, fontSize: 14 }} placeholder="10-digit number" maxLength={10} />
                      </div>
                      <button type="button" onClick={() => removeMember(i)} disabled={members.length === 1}
                        style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,100,100,0.1)', border: '1px solid rgba(255,100,100,0.2)', color: '#FF6584', cursor: members.length === 1 ? 'not-allowed' : 'pointer', opacity: members.length === 1 ? 0.4 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Trash2 size={14} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <p style={{ marginTop: 14, fontSize: 12, color: 'var(--text-secondary)' }}>
                💡 WhatsApp number is used to send payment reminders later
              </p>
            </div>

            <div style={{ display: 'flex', gap: 14 }}>
              <Link href="/dashboard" className="btn-secondary" style={{ flex: 1, textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Cancel
              </Link>
              <button id="create-trip-submit" type="submit" disabled={loading} className="btn-primary" style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: loading ? 0.7 : 1 }}>
                {loading ? <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> : <><Plus size={18} /> Create Trip</>}
              </button>
            </div>
          </form>
        </motion.div>
      </main>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
