'use client';
import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Receipt, Users, TrendingUp, LogOut, Trash2, Calendar, ChevronRight } from 'lucide-react';

interface Member { id: string; name: string; whatsapp: string }
interface Trip { _id: string; name: string; description: string; date: string; members: Member[] }

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/trips')
        .then(r => r.json())
        .then(data => { setTrips(Array.isArray(data) ? data : []); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [status]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this trip and all its expenses?')) return;
    await fetch(`/api/trips/${id}`, { method: 'DELETE' });
    setTrips(trips.filter(t => t._id !== id));
  };

  if (status === 'loading' || loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: '3px solid rgba(108,99,255,0.3)', borderTop: '3px solid #6C63FF', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Loading your trips...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (status === 'unauthenticated') return null;

  const totalMembers = trips.reduce((acc, t) => acc + t.members.length, 0);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)' }}>
      {/* Navbar */}
      <nav className="navbar" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#6C63FF,#FF6584)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Receipt size={18} color="white" />
          </div>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 18, color: 'white' }}>BillBuddies</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#6C63FF,#FF6584)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>
              {session?.user?.name?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: 'white' }}>{session?.user?.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{session?.user?.email}</div>
            </div>
          </div>
          <button onClick={() => signOut({ callbackUrl: '/login' })} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '8px 12px', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </nav>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 32, fontWeight: 800, color: 'white', marginBottom: 4 }}>
              Hey, {session?.user?.name?.split(' ')[0]}! 👋
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>Here are all your trips and group expenses.</p>
          </div>
          <Link href="/trips/new" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <Plus size={18} /> New Trip
          </Link>
        </motion.div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 40 }}>
          {[
            { icon: <Receipt size={22} />, label: 'Total Trips', value: trips.length, color: '#6C63FF' },
            { icon: <Users size={22} />, label: 'Total Friends', value: totalMembers, color: '#FF6584' },
            { icon: <TrendingUp size={22} />, label: 'Active Groups', value: trips.length, color: '#43E97B' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="glass-card"
              style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: 18 }}
            >
              <div style={{ width: 52, height: 52, borderRadius: 14, background: `${stat.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color, flexShrink: 0 }}>
                {stat.icon}
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'white', fontFamily: 'Outfit, sans-serif' }}>{stat.value}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trips */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 22, fontWeight: 700, color: 'white', marginBottom: 20 }}>Your Trips</h2>

          {trips.length === 0 ? (
            <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🧳</div>
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 22, fontWeight: 700, color: 'white', marginBottom: 8 }}>No trips yet</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 28 }}>Create your first trip and start splitting expenses with friends!</p>
              <Link href="/trips/new" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                <Plus size={18} /> Create First Trip
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
              {trips.map((trip, i) => (
                <motion.div
                  key={trip._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="glass-card card-hover"
                  style={{ padding: 24 }}
                >
                  {/* Trip card header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 12, background: `hsl(${(i * 60) % 360},70%,50%)20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                          🧳
                        </div>
                        <h3 style={{ fontWeight: 700, fontSize: 17, color: 'white' }}>{trip.name}</h3>
                      </div>
                      {trip.description && (
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>{trip.description}</p>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 12 }}>
                        <Calendar size={12} />
                        {new Date(trip.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(trip._id)}
                      style={{ background: 'rgba(255,100,100,0.1)', border: '1px solid rgba(255,100,100,0.2)', borderRadius: 8, padding: '6px', color: '#FF6584', cursor: 'pointer', marginLeft: 8 }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Members */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <div style={{ display: 'flex' }}>
                      {trip.members.slice(0, 4).map((m, mi) => (
                        <div key={mi} style={{ width: 28, height: 28, borderRadius: '50%', background: `hsl(${mi * 80},70%,55%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, marginLeft: mi > 0 ? -8 : 0, border: '2px solid var(--bg-card)', color: 'white' }}>
                          {m.name[0]}
                        </div>
                      ))}
                      {trip.members.length > 4 && (
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, marginLeft: -8, border: '2px solid var(--bg-card)', color: 'var(--text-secondary)' }}>
                          +{trip.members.length - 4}
                        </div>
                      )}
                    </div>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{trip.members.length} member{trip.members.length !== 1 ? 's' : ''}</span>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 10 }}>
                    <Link href={`/trips/${trip._id}`} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, textDecoration: 'none', padding: '10px', borderRadius: 10, background: 'linear-gradient(135deg,#6C63FF,#5A52D5)', color: 'white', fontWeight: 600, fontSize: 13 }}>
                      View Expenses <ChevronRight size={14} />
                    </Link>
                    <Link href={`/trips/${trip._id}/settle`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(108,99,255,0.3)', color: 'var(--primary)', fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>
                      Settle
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
