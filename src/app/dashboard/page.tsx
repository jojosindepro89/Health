'use client';
import AppLayout from '@/components/AppLayout';
import {
  Users, Activity, BedDouble, CreditCard,
  TrendingUp, Clock, CheckCircle2,
  AlertCircle, Stethoscope, FlaskConical, Pill
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { useStore } from '@/lib/store';
import { useAuth } from '@/lib/auth';

const areaData = [
  { day: 'Mon', outpatient: 42, inpatient: 18 },
  { day: 'Tue', outpatient: 55, inpatient: 22 },
  { day: 'Wed', outpatient: 48, inpatient: 20 },
  { day: 'Thu', outpatient: 63, inpatient: 28 },
  { day: 'Fri', outpatient: 70, inpatient: 31 },
  { day: 'Sat', outpatient: 38, inpatient: 14 },
  { day: 'Sun', outpatient: 29, inpatient: 10 },
];
const revenueData = [
  { month: 'Jan', revenue: 182000, target: 200000 },
  { month: 'Feb', revenue: 215000, target: 200000 },
  { month: 'Mar', revenue: 194000, target: 210000 },
  { month: 'Apr', revenue: 237000, target: 220000 },
  { month: 'May', revenue: 258000, target: 230000 },
  { month: 'Jun', revenue: 241000, target: 240000 },
];
const deptPie = [
  { name: 'General OPD', value: 34 },
  { name: 'Emergency', value: 18 },
  { name: 'Surgery', value: 15 },
  { name: 'Paediatrics', value: 12 },
  { name: 'Maternity', value: 21 },
];
const PIE_COLORS = ['#0d9488', '#06b6d4', '#8b5cf6', '#f59e0b', '#10b981'];

const recentPatients = [
  { id: 'P-00421', name: 'Adaeze Okafor', dept: 'General OPD', status: 'Waiting', time: '09:12 AM' },
  { id: 'P-00420', name: 'Emeka Nwachukwu', dept: 'Emergency', status: 'In Consultation', time: '09:05 AM' },
  { id: 'P-00419', name: 'Fatima Bello', dept: 'Antenatal', status: 'Completed', time: '08:48 AM' },
  { id: 'P-00418', name: 'Chidi Eze', dept: 'Surgery', status: 'Admitted', time: '08:30 AM' },
  { id: 'P-00417', name: 'Ngozi Umeh', dept: 'Paediatrics', status: 'Completed', time: '08:15 AM' },
];
const alerts = [
  { icon: AlertCircle, color: 'var(--danger)', text: '3 beds in ICU at critical capacity', time: '5m ago' },
  { icon: Clock, color: 'var(--warning)', text: 'Lab results pending for 12 patients', time: '14m ago' },
  { icon: CheckCircle2, color: 'var(--success)', text: 'Monthly pharmacy stock reconciled', time: '1h ago' },
  { icon: AlertCircle, color: 'var(--warning)', text: 'HMO pre-auth needed for 2 admissions', time: '2h ago' },
];
const statusMap: Record<string, string> = {
  'Waiting': 'badge-warning', 'In Consultation': 'badge-info', 'Completed': 'badge-success', 'Admitted': 'badge-primary',
};

export default function Dashboard() {
  const { currentUser } = useStore();
  const { user } = useAuth();

  return (
    <AppLayout title="Admin Dashboard" subtitle="Grabbo Fertility Clinic · Overview">
      {/* Welcome message */}
      {user && (
        <div style={{ marginBottom: 20, padding: '16px 20px', background: 'var(--primary-muted)', border: '1px solid rgba(13,148,136,0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Good morning, {user.name.split(' ')[0]}! 👋</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>Here&apos;s your {user.hospital} overview for today.</div>
          </div>
          <div style={{ fontSize: 12, color: 'var(--primary-light)', background: 'var(--primary-muted)', border: '1px solid rgba(13,148,136,0.3)', borderRadius: 6, padding: '4px 10px', fontWeight: 600 }}>
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="stats-grid">
        {[
          { icon: Users, label: 'Total Patients Today', value: '247', change: '+18 from yesterday', up: true, bg: 'rgba(13,148,136,0.12)', color: 'var(--primary)' },
          { icon: BedDouble, label: 'Beds Occupied', value: '138/180', change: '76.6% occupancy', up: false, bg: 'rgba(139,92,246,0.12)', color: 'var(--purple)' },
          ...(currentUser.role === 'super_admin' ? [{ icon: CreditCard, label: "Today's Revenue", value: '₦842K', change: '+12.4% vs last week', up: true, bg: 'rgba(16,185,129,0.12)', color: 'var(--success)' }] : []),
          { icon: Activity, label: 'Active Consultations', value: '34', change: '8 doctors on duty', up: true, bg: 'rgba(6,182,212,0.12)', color: 'var(--accent)' },
        ].map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-icon" style={{ background: s.bg }}><s.icon size={20} color={s.color} /></div>
            <div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.value}</div>
              <div className={`stat-change ${s.up ? 'up' : ''}`}>{s.up ? <TrendingUp size={11} /> : null}{s.change}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid-3-1" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-header">
            <div><div className="card-title">Patient Visits — This Week</div><div className="card-subtitle">Outpatient vs Inpatient</div></div>
            <span className="badge badge-primary">Live</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={areaData}>
              <defs>
                <linearGradient id="gOP" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0d9488" stopOpacity={0.3} /><stop offset="95%" stopColor="#0d9488" stopOpacity={0} /></linearGradient>
                <linearGradient id="gIP" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} /><stop offset="95%" stopColor="#06b6d4" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="outpatient" stroke="#0d9488" fill="url(#gOP)" strokeWidth={2} name="Outpatient" />
              <Area type="monotone" dataKey="inpatient" stroke="#06b6d4" fill="url(#gIP)" strokeWidth={2} name="Inpatient" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">Dept. Distribution</div></div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={deptPie} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {deptPie.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-header"><div className="card-title">Recent Patient Registrations</div><button className="btn btn-sm btn-secondary">View All</button></div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Patient ID</th><th>Name</th><th>Department</th><th>Status</th><th>Time</th></tr></thead>
              <tbody>
                {recentPatients.map((p) => (
                  <tr key={p.id}>
                    <td style={{ color: 'var(--primary-light)', fontWeight: 600 }}>{p.id}</td>
                    <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{p.name}</td>
                    <td>{p.dept}</td>
                    <td><span className={`badge ${statusMap[p.status]}`}>{p.status}</span></td>
                    <td>{p.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card" style={{ flex: 1 }}>
            <div className="card-header"><div className="card-title">System Alerts</div><span className="badge badge-danger">4 Active</span></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {alerts.map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <a.icon size={15} color={a.color} style={{ flexShrink: 0, marginTop: 2 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{a.text}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-title" style={{ marginBottom: 12 }}>Quick Actions</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { icon: Users, label: 'Register Patient', color: 'var(--primary)', href: '/patients' },
                { icon: Stethoscope, label: 'New Consultation', color: 'var(--accent)', href: '/clinics' },
                { icon: FlaskConical, label: 'Lab Request', color: 'var(--purple)', href: '/laboratory' },
                { icon: Pill, label: 'Prescribe Drugs', color: 'var(--success)', href: '/pharmacy' },
              ].map((q) => (
                <a key={q.label} href={q.href} className="btn btn-secondary" style={{ justifyContent: 'flex-start', gap: 8, padding: '10px 12px', textDecoration: 'none' }}>
                  <q.icon size={14} color={q.color} /><span style={{ fontSize: 12 }}>{q.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      {currentUser.role === 'super_admin' && (
        <div className="card">
          <div className="card-header">
            <div><div className="card-title">Monthly Revenue vs Target</div><div className="card-subtitle">Jan – Jun 2025 · All departments</div></div>
            <div style={{ display: 'flex', gap: 8 }}><button className="btn btn-sm btn-secondary">Export</button><button className="btn btn-sm btn-primary">Full Report</button></div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v: unknown) => `₦${(Number(v) / 1000).toFixed(0)}K`} />
              <Tooltip contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} formatter={(v: unknown) => [`₦${Number(v).toLocaleString()}`, '']} />
              <Bar dataKey="revenue" fill="#0d9488" radius={[4, 4, 0, 0]} name="Revenue" />
              <Bar dataKey="target" fill="rgba(6,182,212,0.25)" radius={[4, 4, 0, 0]} name="Target" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </AppLayout>
  );
}
