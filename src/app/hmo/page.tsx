'use client';
import AppLayout from '@/components/AppLayout';
import { Shield, CheckCircle2, Clock, XCircle, Plus, FileText } from 'lucide-react';

const hmoProviders = [
  { name: 'NHIS', enrolled: 1240, active: 1180, claims: 88, settlement: '₦1.2M', status: 'Active' },
  { name: 'AXA Mansard', enrolled: 340, active: 320, claims: 24, settlement: '₦680K', status: 'Active' },
  { name: 'Hygeia HMO', enrolled: 280, active: 265, claims: 18, settlement: '₦420K', status: 'Active' },
  { name: 'Leadway Health', enrolled: 190, active: 175, claims: 12, settlement: '₦310K', status: 'Active' },
  { name: 'Liberty HMO', enrolled: 120, active: 110, claims: 8, settlement: '₦180K', status: 'Review' },
];

const preAuths = [
  { id: 'PA-0441', patient: 'Emeka Nwachukwu', hmo: 'AXA Mansard', procedure: 'Emergency Admission', est: '₦95,000', date: '27 Apr', status: 'Approved' },
  { id: 'PA-0440', patient: 'Chidi Eze', hmo: 'Self Pay', procedure: 'Surgery (Appendectomy)', est: '₦185,000', date: '26 Apr', status: 'Pending' },
  { id: 'PA-0439', patient: 'Fatima Bello', hmo: 'NHIS', procedure: 'Caesarean Section', est: '₦120,000', date: '25 Apr', status: 'Approved' },
  { id: 'PA-0438', patient: 'Babatunde Adeyemi', hmo: 'Leadway', procedure: 'Cardiac Catheterization', est: '₦450,000', date: '24 Apr', status: 'Declined' },
];

const authStatus: Record<string, string> = { Approved: 'badge-success', Pending: 'badge-warning', Declined: 'badge-danger' };
const providerStatus: Record<string, string> = { Active: 'badge-success', Review: 'badge-warning' };

export default function HMOPage() {
  return (
    <AppLayout title="HMO Management" subtitle="Health Maintenance Organization enrollment and claims">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div className="page-title">HMO Management</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary"><FileText size={14} /> Claims Report</button>
          <button className="btn btn-primary"><Plus size={14} /> Pre-Authorization</button>
        </div>
      </div>

      <div className="stats-grid" style={{ marginBottom: 20 }}>
        {[
          { icon: Shield, label: 'HMO Providers', value: '5', color: 'var(--primary)', bg: 'var(--primary-muted)' },
          { icon: CheckCircle2, label: 'Enrolled Patients', value: '2,170', color: 'var(--success)', bg: 'rgba(16,185,129,0.12)' },
          { icon: Clock, label: 'Pending Pre-Auth', value: '7', color: 'var(--warning)', bg: 'rgba(245,158,11,0.12)' },
          { icon: XCircle, label: 'Claims Declined', value: '3', color: 'var(--danger)', bg: 'rgba(239,68,68,0.12)' },
        ].map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-icon" style={{ background: s.bg }}><s.icon size={20} color={s.color} /></div>
            <div><div className="stat-label">{s.label}</div><div className="stat-value">{s.value}</div></div>
          </div>
        ))}
      </div>

      {/* HMO Providers */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <div className="card-title">HMO Providers</div>
          <button className="btn btn-sm btn-outline"><Plus size={13} /> Add Provider</button>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Provider</th><th>Enrolled</th><th>Active</th><th>Claims (Month)</th><th>Settlement</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {hmoProviders.map(p => (
                <tr key={p.name}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--primary-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--primary-light)' }}>
                        {p.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</span>
                    </div>
                  </td>
                  <td>{p.enrolled.toLocaleString()}</td>
                  <td style={{ color: 'var(--success)', fontWeight: 600 }}>{p.active.toLocaleString()}</td>
                  <td>{p.claims}</td>
                  <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{p.settlement}</td>
                  <td><span className={`badge ${providerStatus[p.status]}`}>{p.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-sm btn-secondary">View Claims</button>
                      <button className="btn btn-sm btn-outline">Enroll Patient</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pre-Authorization */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Pre-Authorization Requests</div>
          <span className="badge badge-warning">1 Pending</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Auth ID</th><th>Patient</th><th>HMO</th><th>Procedure</th><th>Est. Cost</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              {preAuths.map(a => (
                <tr key={a.id}>
                  <td style={{ color: 'var(--primary-light)', fontWeight: 600 }}>{a.id}</td>
                  <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{a.patient}</td>
                  <td><span className="badge badge-muted">{a.hmo}</span></td>
                  <td style={{ fontSize: 12 }}>{a.procedure}</td>
                  <td style={{ fontWeight: 600 }}>{a.est}</td>
                  <td style={{ fontSize: 12 }}>{a.date}</td>
                  <td><span className={`badge ${authStatus[a.status]}`}>{a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
