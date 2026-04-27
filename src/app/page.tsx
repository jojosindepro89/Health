'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import {
  Activity, Shield, Users, Stethoscope, Smartphone,
  Check, Star, ArrowRight, BedDouble, CreditCard, Bell,
} from 'lucide-react';

const features = [
  { icon: Users, title: 'Unified Patient Records', desc: 'A single source of truth for patient history, lab results, and imaging with intelligent AI-powered indexing.', tags: ['Auto-HMO Integration', 'AI-powered Insights'], color: '#0d9488' },
  { icon: Stethoscope, title: 'Seamless TeleConsultation', desc: 'HIPAA-compliant video consultations with integrated patient file sharing for remote care.', tags: ['HD Video', 'File Sharing'], color: '#06b6d4' },
  { icon: CreditCard, title: 'Automated Billing', desc: 'Generate invoices automatically, process HMO claims, and reconcile payments with zero manual entry.', tags: ['HMO Claims', 'Auto-Reconcile'], color: '#8b5cf6' },
  { icon: BedDouble, title: 'Real-time Bed Management', desc: 'Optimise patient flow with live visualisation of ward capacity and emergency alerts.', tags: ['Live Dashboard', 'Emergency Alerts'], color: '#10b981', featured: true },
];
const stakeholders = [
  { role: 'For Doctors', icon: Stethoscope, color: '#0d9488', points: ['Smart prescription and EHR tools', 'Real-time lab result notifications', 'Decision Support System'] },
  { role: 'For Admins', icon: Shield, color: '#06b6d4', points: ['Complete staff scheduling tools', 'Real-time performance reporting', 'Quick Ready Reporting'] },
  { role: 'For Patients', icon: Smartphone, color: '#8b5cf6', points: ['Easy booking and appointments', 'Secure messaging with doctors', 'Health Data Portability'] },
];
const stats = [
  { value: '50+', label: 'Medical Centres' },
  { value: '99.9%', label: 'System Uptime' },
  { value: '2M+', label: 'Patients Served' },
  { value: '15min', label: 'Avg. Setup Time' },
];
const testimonials = [
  { name: 'Dr. Amaka Obi', role: 'CMO, Lagos State Hospital', quote: 'Grabbo Fertility Clinic transformed our workflow. Patient wait times dropped by 40% in the first month.', stars: 5 },
  { name: 'Chukwuemeka Eze', role: 'Admin, UCH Ibadan', quote: 'The billing module alone pays for itself. HMO claim rejections went from 18% to under 2%.', stars: 5 },
  { name: 'Nurse Fatima Bello', role: 'Ward Manager, ABUTH', quote: 'Finally a system that works the way nurses actually work — real-time and intuitive.', stars: 5 },
];

export default function LandingPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) router.replace('/dashboard');
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif' }}>

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, background: scrolled ? 'rgba(11,17,32,0.95)' : 'transparent', backdropFilter: scrolled ? 'blur(20px)' : 'none', borderBottom: scrolled ? '1px solid var(--border)' : 'none', transition: 'all 0.3s ease' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg, var(--primary), var(--accent))', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={18} color="white" />
            </div>
            <span style={{ fontWeight: 800, fontSize: 16 }}>Grabbo Fertility Clinic</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            {['Solutions', 'Features', 'Pricing', 'Contact'].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} style={{ fontSize: 14, color: 'var(--text-secondary)', textDecoration: 'none' }}>{l}</a>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/login" style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none', padding: '8px 16px' }}>Log In</Link>
            <Link href="/signup" style={{ fontSize: 14, fontWeight: 700, color: 'white', textDecoration: 'none', padding: '9px 20px', background: 'var(--primary)', borderRadius: 8 }}>Request Demo</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '100px 24px 60px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center', width: '100%' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(13,148,136,0.1)', border: '1px solid rgba(13,148,136,0.3)', borderRadius: 20, padding: '6px 14px', marginBottom: 28 }}>
              <div style={{ width: 6, height: 6, background: 'var(--success)', borderRadius: '50%', boxShadow: '0 0 0 3px rgba(16,185,129,0.3)' }} />
              <span style={{ fontSize: 12, color: 'var(--primary-light)', fontWeight: 600 }}>HIPAA Compliant Platform</span>
            </div>
            <h1 style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.1, marginBottom: 20, letterSpacing: -1 }}>
              Transforming Healthcare with{' '}
              <span style={{ background: 'linear-gradient(90deg, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Precision & Care</span>
            </h1>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 36, maxWidth: 460 }}>
              A unified workspace designed for the modern clinical ecosystem. Real-time data helping you deliver optimal patient outcomes with data-driven workflows.
            </p>
            <div style={{ display: 'flex', gap: 12, marginBottom: 48 }}>
              <Link href="/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px', background: 'var(--primary)', color: 'white', borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: 'none', boxShadow: '0 0 32px rgba(13,148,136,0.4)' }}>
                Request Demo <ArrowRight size={16} />
              </Link>
              <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px', background: 'var(--bg-card)', color: 'var(--text-primary)', borderRadius: 10, fontWeight: 600, fontSize: 15, textDecoration: 'none', border: '1px solid var(--border-2)' }}>
                Explore Platform
              </Link>
            </div>
            <div style={{ display: 'flex', gap: 36 }}>
              {stats.slice(0, 2).map(s => (
                <div key={s.label}><div style={{ fontSize: 28, fontWeight: 800, color: 'var(--primary-light)' }}>{s.value}</div><div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div></div>
              ))}
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', inset: -20, background: 'radial-gradient(circle at 50% 50%, rgba(13,148,136,0.12) 0%, transparent 70%)', borderRadius: '50%' }} />
            <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.5)', border: '1px solid var(--border-2)' }}>
              <Image src="/doctor-hero.png" alt="Grabbo Fertility Clinic Doctor" width={560} height={500} style={{ objectFit: 'cover', display: 'block', width: '100%', height: 'auto' }} priority />
              <div style={{ position: 'absolute', bottom: 20, right: 20, background: 'rgba(11,17,32,0.9)', backdropFilter: 'blur(12px)', border: '1px solid var(--border-2)', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, background: 'var(--primary-muted)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Bell size={16} color="var(--primary-light)" /></div>
                <div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>16 labs in 6 queues</div><div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>+8% ✓ All systems normal</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '32px 24px', background: 'var(--bg-card)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {stats.map(s => (<div key={s.label} style={{ textAlign: 'center' }}><div style={{ fontSize: 32, fontWeight: 800, color: 'var(--primary-light)' }}>{s.value}</div><div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div></div>))}
        </div>
      </div>

      {/* FEATURES */}
      <section id="features" style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 16, letterSpacing: -0.5 }}>Precision Features for Better Outcomes</h2>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto' }}>Designed to handle the complexity of modern healthcare without cognitive load.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {features.map(f => (
              <div key={f.title} style={{ background: f.featured ? `linear-gradient(135deg, ${f.color}15, ${f.color}28)` : 'var(--bg-card)', border: `1px solid ${f.featured ? f.color + '40' : 'var(--border)'}`, borderRadius: 16, padding: '28px 32px', cursor: 'default', transition: 'transform 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}
              >
                <div style={{ width: 44, height: 44, background: `${f.color}20`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}><f.icon size={20} color={f.color} /></div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>{f.desc}</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {f.tags.map(tag => (<span key={tag} style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 12, background: `${f.color}15`, color: f.color, border: `1px solid ${f.color}30` }}>{tag}</span>))}
                </div>
                {f.featured && (<Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 20, fontSize: 13, fontWeight: 700, color: f.color, textDecoration: 'none' }}>View Live Dashboard <ArrowRight size={14} /></Link>)}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STAKEHOLDERS */}
      <section id="solutions" style={{ background: 'var(--bg-card)', padding: '100px 24px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ marginBottom: 60 }}><h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 12, letterSpacing: -0.5 }}>Tailored for Every Stakeholder</h2><p style={{ fontSize: 16, color: 'var(--text-secondary)', maxWidth: 480 }}>The Grabbo Fertility Clinic system adapts to the specific needs of different roles within your hospital.</p></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {stakeholders.map(s => (
              <div key={s.role} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 16, padding: '32px 28px', transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = s.color + '60'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <div style={{ width: 52, height: 52, background: `${s.color}15`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}><s.icon size={24} color={s.color} /></div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>{s.role}</h3>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {s.points.map(pt => (<li key={pt} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: 'var(--text-secondary)' }}><Check size={14} color={s.color} style={{ flexShrink: 0, marginTop: 2 }} />{pt}</li>))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}><div style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary-light)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>TRUSTED BY INDUSTRY LEADERS</div><h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: -0.5 }}>What Healthcare Leaders Say</h2></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {testimonials.map(t => (
              <div key={t.name} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '28px 24px' }}>
                <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>{Array.from({ length: t.stars }).map((_, i) => <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />)}</div>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic' }}>&quot;{t.quote}&quot;</p>
                <div><div style={{ fontSize: 13, fontWeight: 700 }}>{t.name}</div><div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{t.role}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '60px 24px 100px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)', borderRadius: 24, padding: '60px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'relative' }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: 'white', marginBottom: 16 }}>Ready to Elevate Your Standard of Care?</h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', marginBottom: 36 }}>Join over 50 medical centres choosing Grabbo Fertility Clinic for their daily operations.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <Link href="/signup" style={{ padding: '13px 28px', background: 'white', color: 'var(--primary-dark)', borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>Request Demo Now</Link>
              <Link href="/login" style={{ padding: '13px 28px', background: 'rgba(255,255,255,0.15)', color: 'white', borderRadius: 10, fontWeight: 600, fontSize: 15, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.3)' }}>Talk to Sales</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '40px 24px', background: 'var(--bg-card)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg, var(--primary), var(--accent))', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Activity size={14} color="white" /></div>
            <div><div style={{ fontWeight: 700, fontSize: 13 }}>Grabbo Fertility Clinic</div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Fertility Clinic and Diagnostic Centre</div></div>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacy Policy', 'Terms of Service', 'HIPAA Compliance', 'Support'].map(l => (<a key={l} href="#" style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none' }}>{l}</a>))}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>© 2025 Grabbo Fertility Clinic and Diagnostic Centre. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
