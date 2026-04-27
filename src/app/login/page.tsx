'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Activity, Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading && isAuthenticated) router.replace('/dashboard');
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return null;
  if (isAuthenticated) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields'); return; }
    setLoading(true); setError('');
    await new Promise(r => setTimeout(r, 600));
    const result = login(email, password);
    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Login failed');
    }
    setLoading(false);
  };

  const fillDemo = (em: string, pw: string) => { setEmail(em); setPassword(pw); setError(''); };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', fontFamily: 'Inter, sans-serif' }}>

      {/* Left panel */}
      <div style={{ flex: 1, background: 'linear-gradient(160deg, #0b1120 0%, #0f2027 50%, #0b1a1f 100%)', display: 'flex', flexDirection: 'column', padding: 48, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, background: 'radial-gradient(circle, rgba(13,148,136,0.12) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -80, width: 300, height: 300, background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />

        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 'auto' }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, var(--primary), var(--accent))', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Activity size={20} color="white" /></div>
          <span style={{ fontWeight: 800, fontSize: 18, color: 'var(--text-primary)' }}>DHS Workspace</span>
        </Link>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 420 }}>
          <h1 style={{ fontSize: 42, fontWeight: 800, lineHeight: 1.15, marginBottom: 20, letterSpacing: -1 }}>
            Healthcare managed{' '}
            <span style={{ background: 'linear-gradient(90deg, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>smarter.</span>
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 40 }}>
            Log in to your DHS Workspace to manage patients, labs, pharmacy, finance, and more — all in one place.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { emoji: '🏥', text: 'Real-time patient queue management' },
              { emoji: '💊', text: 'Automated prescription & dispensing workflow' },
              { emoji: '📊', text: 'Live financial analytics & HMO claims' },
              { emoji: '🛏️', text: 'Ward & bed occupancy monitoring' },
            ].map(item => (
              <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, background: 'var(--primary-muted)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{item.emoji}</div>
                <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 40, padding: '20px', background: 'rgba(255,255,255,0.04)', borderRadius: 12, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10, fontWeight: 600 }}>DEMO ACCOUNTS — click to fill:</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button onClick={() => fillDemo('admin@dhs.ng', 'admin123')} style={{ background: 'var(--primary-muted)', border: '1px solid rgba(13,148,136,0.3)', borderRadius: 8, padding: '10px 14px', cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s' }}>
              <span style={{ fontSize: 12, color: 'var(--primary-light)', fontWeight: 700 }}>Super Admin</span><span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 8 }}>admin@dhs.ng / admin123</span>
            </button>
            <button onClick={() => fillDemo('desk@dhs.ng', 'desk123')} style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 8, padding: '10px 14px', cursor: 'pointer', textAlign: 'left' }}>
              <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 700 }}>Front Desk</span><span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 8 }}>desk@dhs.ng / desk123</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{ width: 480, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 40px', background: 'var(--bg-card)', borderLeft: '1px solid var(--border)' }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <div style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Welcome back</h2>
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Sign in to your account to continue</p>
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, marginBottom: 20 }}>
              <AlertCircle size={15} color="var(--danger)" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: 'var(--danger)' }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 7 }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="your@hospital.ng"
                  style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border-2)', borderRadius: 8, padding: '11px 12px 11px 38px', color: 'var(--text-primary)', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                  onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-2)'}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Password</label>
                <a href="#" style={{ fontSize: 12, color: 'var(--primary-light)', textDecoration: 'none' }}>Forgot password?</a>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border-2)', borderRadius: 8, padding: '11px 40px 11px 38px', color: 'var(--text-primary)', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                  onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-2)'}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px', background: loading ? 'var(--primary-dark)' : 'var(--primary)', color: 'white', border: 'none', borderRadius: 9, fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'background 0.2s', marginTop: 4, boxShadow: '0 0 24px rgba(13,148,136,0.3)' }}>
              {loading ? (
                <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />Signing in...</>
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 28, paddingTop: 28, borderTop: '1px solid var(--border)' }}>
            <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>Don't have an account? </span>
            <Link href="/signup" style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary-light)', textDecoration: 'none' }}>Create one →</Link>
          </div>

          <div style={{ marginTop: 32, padding: 14, background: 'var(--bg)', borderRadius: 10, border: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>🔒 HIPAA Compliant · SSL Encrypted · SOC 2 Type II</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Your data is safe and fully encrypted at rest and in transit.</div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
