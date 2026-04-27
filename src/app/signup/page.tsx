'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Activity, Eye, EyeOff, Mail, Lock, User, Building2, ArrowRight, AlertCircle, Check } from 'lucide-react';

const roles = [
  { value: 'super_admin', label: 'Hospital Administrator', desc: 'Full access to all modules & analytics' },
  { value: 'doctor', label: 'Doctor / Clinician', desc: 'Clinical workflow & patient management' },
  { value: 'front_desk', label: 'Front Desk / Reception', desc: 'Patient registration & appointments' },
  { value: 'nurse', label: 'Nurse / Ward Staff', desc: 'Ward management & patient care' },
  { value: 'pharmacist', label: 'Pharmacist', desc: 'Pharmacy & prescription management' },
];

export default function SignupPage() {
  const { signup, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading && isAuthenticated) router.replace('/dashboard');
  }, [isAuthenticated, isLoading, router]);

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirm: '',
    hospital: '', role: 'super_admin' as const,
  });

  if (isLoading) return null;
  if (isAuthenticated) return null;

  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    if (!form.name || !form.email || !form.password || !form.confirm) { setError('All fields are required'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    if (!form.hospital) { setError('Hospital name is required'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const result = await signup({ name: form.name, email: form.email, password: form.password, hospital: form.hospital, role: form.role as any });
    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Signup failed');
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', fontFamily: 'Inter, sans-serif' }}>

      {/* Left panel */}
      <div style={{ flex: 1, background: 'linear-gradient(160deg, #0b1120 0%, #0f2027 60%, #0b1a1f 100%)', display: 'flex', flexDirection: 'column', padding: 48, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 320, height: 320, background: 'radial-gradient(circle, rgba(13,148,136,0.12) 0%, transparent 70%)', borderRadius: '50%' }} />

        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, var(--primary), var(--accent))', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Activity size={20} color="white" /></div>
          <span style={{ fontWeight: 800, fontSize: 18, color: 'var(--text-primary)' }}>DHS Workspace</span>
        </Link>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 420 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(13,148,136,0.1)', border: '1px solid rgba(13,148,136,0.3)', borderRadius: 20, padding: '6px 14px', marginBottom: 28 }}>
            <div style={{ width: 6, height: 6, background: 'var(--success)', borderRadius: '50%', boxShadow: '0 0 0 3px rgba(16,185,129,0.3)' }} />
            <span style={{ fontSize: 12, color: 'var(--primary-light)', fontWeight: 600 }}>Free 30-day trial</span>
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.15, marginBottom: 20, letterSpacing: -1 }}>
            Start your hospital's{' '}
            <span style={{ background: 'linear-gradient(90deg, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>digital journey.</span>
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 40 }}>
            Create your DHS Workspace account and connect your entire hospital team in minutes.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { title: 'No credit card required', desc: 'Full access for 30 days, cancel anytime' },
              { title: 'Setup in 15 minutes', desc: 'Guided onboarding for your entire team' },
              { title: 'HIPAA & NDPR compliant', desc: 'Enterprise-grade security from day one' },
              { title: 'Local Nigerian support', desc: '24/7 support team in your timezone' },
            ].map(item => (
              <div key={item.title} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ width: 22, height: 22, background: 'var(--primary-muted)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                  <Check size={12} color="var(--primary-light)" />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          Already have an account? <Link href="/login" style={{ color: 'var(--primary-light)', textDecoration: 'none', fontWeight: 600 }}>Sign in →</Link>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{ width: 520, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 44px', background: 'var(--bg-card)', borderLeft: '1px solid var(--border)', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          {/* Step indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 36 }}>
            {[1, 2].map(s => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: step >= s ? 'var(--primary)' : 'var(--bg)', border: `2px solid ${step >= s ? 'var(--primary)' : 'var(--border-2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: step >= s ? 'white' : 'var(--text-muted)', transition: 'all 0.3s' }}>
                  {step > s ? <Check size={13} /> : s}
                </div>
                <span style={{ fontSize: 12, fontWeight: 500, color: step >= s ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  {s === 1 ? 'Your Details' : 'Hospital & Role'}
                </span>
                {s < 2 && <div style={{ width: 40, height: 2, background: step > s ? 'var(--primary)' : 'var(--border)', borderRadius: 1, transition: 'background 0.3s' }} />}
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>
              {step === 1 ? 'Create your account' : 'Your hospital details'}
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
              {step === 1 ? 'Enter your personal details to get started' : 'Tell us about your hospital and your role'}
            </p>
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, marginBottom: 20 }}>
              <AlertCircle size={15} color="var(--danger)" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: 'var(--danger)' }}>{error}</span>
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleStep1} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 7 }}>Full Name *</label>
                <div style={{ position: 'relative' }}>
                  <User size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input type="text" value={form.name} onChange={e => update('name', e.target.value)} placeholder="Dr. Amaka Obi"
                    style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border-2)', borderRadius: 8, padding: '11px 12px 11px 38px', color: 'var(--text-primary)', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border-2)'}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 7 }}>Work Email *</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="you@hospital.ng"
                    style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border-2)', borderRadius: 8, padding: '11px 12px 11px 38px', color: 'var(--text-primary)', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border-2)'}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 7 }}>Password *</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => update('password', e.target.value)} placeholder="Min. 6 characters"
                    style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border-2)', borderRadius: 8, padding: '11px 40px 11px 38px', color: 'var(--text-primary)', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border-2)'}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}>
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 7 }}>Confirm Password *</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input type="password" value={form.confirm} onChange={e => update('confirm', e.target.value)} placeholder="Repeat password"
                    style={{ width: '100%', background: 'var(--bg)', border: `1px solid ${form.confirm && form.confirm !== form.password ? 'var(--danger)' : 'var(--border-2)'}`, borderRadius: 8, padding: '11px 12px 11px 38px', color: 'var(--text-primary)', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = form.confirm !== form.password ? 'var(--danger)' : 'var(--primary)'}
                    onBlur={e => e.target.style.borderColor = form.confirm && form.confirm !== form.password ? 'var(--danger)' : 'var(--border-2)'}
                  />
                </div>
                {form.confirm && form.confirm === form.password && <div style={{ fontSize: 11, color: 'var(--success)', marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}><Check size={11} /> Passwords match</div>}
              </div>

              <button type="submit" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 9, fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit', marginTop: 8, boxShadow: '0 0 24px rgba(13,148,136,0.3)' }}>
                Continue <ArrowRight size={16} />
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 7 }}>Hospital / Organisation Name *</label>
                <div style={{ position: 'relative' }}>
                  <Building2 size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input type="text" value={form.hospital} onChange={e => update('hospital', e.target.value)} placeholder="Lagos General Hospital"
                    style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border-2)', borderRadius: 8, padding: '11px 12px 11px 38px', color: 'var(--text-primary)', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border-2)'}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10 }}>Your Role *</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {roles.map(r => (
                    <button key={r.value} type="button" onClick={() => update('role', r.value)}
                      style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 14px', background: form.role === r.value ? 'var(--primary-muted)' : 'var(--bg)', border: `2px solid ${form.role === r.value ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 10, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
                    >
                      <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${form.role === r.value ? 'var(--primary)' : 'var(--border-2)'}`, background: form.role === r.value ? 'var(--primary)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                        {form.role === r.value && <div style={{ width: 6, height: 6, background: 'white', borderRadius: '50%' }} />}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{r.label}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{r.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button type="button" onClick={() => { setStep(1); setError(''); }} style={{ flex: 1, padding: '12px', background: 'var(--bg)', color: 'var(--text-secondary)', border: '1px solid var(--border-2)', borderRadius: 9, fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Back
                </button>
                <button type="submit" disabled={loading} style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px', background: loading ? 'var(--primary-dark)' : 'var(--primary)', color: 'white', border: 'none', borderRadius: 9, fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', boxShadow: '0 0 24px rgba(13,148,136,0.3)' }}>
                  {loading ? (
                    <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />Creating account...</>
                  ) : (
                    <>Create Account <ArrowRight size={16} /></>
                  )}
                </button>
              </div>

              <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.5 }}>
                By creating an account, you agree to our{' '}
                <a href="#" style={{ color: 'var(--primary-light)', textDecoration: 'none' }}>Terms of Service</a>{' and '}
                <a href="#" style={{ color: 'var(--primary-light)', textDecoration: 'none' }}>Privacy Policy</a>.
              </p>
            </form>
          )}

          <div style={{ textAlign: 'center', marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
            <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>Already have an account? </span>
            <Link href="/login" style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary-light)', textDecoration: 'none' }}>Sign in →</Link>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
