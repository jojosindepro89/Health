'use client';
import AppLayout from '@/components/AppLayout';
import { BarChart3, Download, TrendingUp, Users, CreditCard, Activity } from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const monthlyData = [
  { month: 'Jan', patients: 1820, revenue: 182000, admissions: 124 },
  { month: 'Feb', patients: 2150, revenue: 215000, admissions: 138 },
  { month: 'Mar', patients: 1940, revenue: 194000, admissions: 110 },
  { month: 'Apr', patients: 2370, revenue: 237000, admissions: 152 },
  { month: 'May', patients: 2580, revenue: 258000, admissions: 168 },
  { month: 'Jun', patients: 2410, revenue: 241000, admissions: 145 },
];

const topDiagnoses = [
  { diagnosis: 'Malaria', count: 342 },
  { diagnosis: 'Hypertension', count: 289 },
  { diagnosis: 'Typhoid', count: 187 },
  { diagnosis: 'Diabetes', count: 164 },
  { diagnosis: 'Pneumonia', count: 128 },
  { diagnosis: 'UTI', count: 112 },
];

export default function ReportsPage() {
  return (
    <AppLayout title="Reports & Analytics" subtitle="Hospital performance metrics and statistical reports">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div className="page-title">Reports & Analytics</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div className="date-pill"><span>Jan 2025 – Jun 2025</span></div>
          <button className="btn btn-primary"><Download size={14} /> Export Report</button>
        </div>
      </div>

      <div className="stats-grid" style={{ marginBottom: 20 }}>
        {[
          { icon: Users, label: 'Total Patients (H1)', value: '13,270', change: '+14.2% vs H1 2024', color: 'var(--primary)', bg: 'var(--primary-muted)' },
          { icon: CreditCard, label: 'Total Revenue (H1)', value: '₦1.33M', change: '+18.6% vs H1 2024', color: 'var(--success)', bg: 'rgba(16,185,129,0.12)' },
          { icon: Activity, label: 'Total Admissions', value: '837', change: '+9.1% vs H1 2024', color: 'var(--info)', bg: 'rgba(59,130,246,0.12)' },
          { icon: TrendingUp, label: 'Avg. Occupancy Rate', value: '74.3%', change: '+3.2pts vs H1 2024', color: 'var(--warning)', bg: 'rgba(245,158,11,0.12)' },
        ].map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-icon" style={{ background: s.bg }}><s.icon size={20} color={s.color} /></div>
            <div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-change up"><TrendingUp size={11} />{s.change}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Monthly Patient Volume</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="gPat" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="patients" stroke="#0d9488" fill="url(#gPat)" strokeWidth={2} name="Patients" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Revenue vs Admissions</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}K`} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
              <Bar yAxisId="left" dataKey="revenue" fill="#0d9488" radius={[4, 4, 0, 0]} name="Revenue (₦)" />
              <Bar yAxisId="right" dataKey="admissions" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Admissions" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Diagnoses */}
      <div className="grid-3-1">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Top Diagnoses — H1 2025</div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={topDiagnoses} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="diagnosis" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
              <Tooltip contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} name="Cases" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-title" style={{ marginBottom: 16 }}>Key Indicators</div>
          {[
            { label: 'Patient Satisfaction', value: '87%', color: 'var(--success)' },
            { label: 'Average LOS (days)', value: '3.2', color: 'var(--info)' },
            { label: 'Readmission Rate', value: '4.8%', color: 'var(--warning)' },
            { label: 'Mortality Rate', value: '0.9%', color: 'var(--danger)' },
            { label: 'Bed Turnover Rate', value: '8.4x', color: 'var(--primary)' },
          ].map(k => (
            <div key={k.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{k.label}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: k.color }}>{k.value}</span>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
