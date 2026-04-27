'use client';
import AppLayout from '@/components/AppLayout';
import { BedDouble, Plus, UserCheck, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useStore, Admission } from '@/lib/store';
import { useToast } from '@/lib/toast';
import Modal from '@/components/Modal';

const wards = [
  { name: 'General Ward A', type: 'General', total: 30, color: 'var(--primary)' },
  { name: 'General Ward B', type: 'General', total: 30, color: 'var(--primary)' },
  { name: 'Intensive Care Unit', type: 'ICU', total: 10, color: 'var(--danger)' },
  { name: 'Maternity Ward', type: 'Maternity', total: 20, color: 'var(--pink)' },
  { name: 'Paediatric Ward', type: 'Paediatrics', total: 15, color: 'var(--info)' },
  { name: 'Surgical Ward', type: 'Surgery', total: 20, color: 'var(--warning)' },
  { name: 'Private Suite A', type: 'Private', total: 10, color: 'var(--purple)' },
  { name: 'Private Suite B', type: 'Private', total: 10, color: 'var(--purple)' },
];

export default function WardsPage() {
  const { patients, admissions, addAdmission, dischargePatient } = useStore();
  const { toast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '', ward: 'General Ward A', bed: '', doctor: 'Dr. Amaka Obi', diagnosis: ''
  });

  const handleSave = () => {
    if (!formData.patientId || !formData.bed || !formData.diagnosis) {
      toast('error', 'Please fill all required fields');
      return;
    }
    const patient = patients.find(p => p.id === formData.patientId);
    if (!patient) return;

    addAdmission({
      ...formData,
      patientName: `${patient.firstName} ${patient.lastName}`,
    });
    toast('success', 'Patient admitted successfully');
    setIsModalOpen(false);
  };

  const handleDischarge = (id: string, name: string) => {
    if (confirm(`Are you sure you want to discharge ${name}?`)) {
      dischargePatient(id);
      toast('success', `${name} has been discharged`);
    }
  };

  const getWardStats = (wardName: string) => {
    const occupied = admissions.filter(a => a.ward === wardName).length;
    return occupied;
  };

  const totalBeds = wards.reduce((s, w) => s + w.total, 0);
  const occupiedBeds = admissions.length;
  const availableBeds = totalBeds - occupiedBeds;

  return (
    <AppLayout title="Wards & Bed Management" subtitle="Monitor ward capacity and patient admissions">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div className="page-title">Wards & Bed Management</div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}><Plus size={14} /> New Admission</button>
      </div>

      <div className="stats-grid" style={{ marginBottom: 20 }}>
        {[
          { icon: BedDouble, label: 'Total Beds', value: totalBeds, color: 'var(--primary)', bg: 'var(--primary-muted)' },
          { icon: UserCheck, label: 'Beds Occupied', value: occupiedBeds, color: 'var(--info)', bg: 'rgba(59,130,246,0.12)' },
          { icon: BedDouble, label: 'Beds Available', value: availableBeds, color: 'var(--success)', bg: 'rgba(16,185,129,0.12)' },
          { icon: AlertCircle, label: 'Current Admissions', value: admissions.length, color: 'var(--warning)', bg: 'rgba(245,158,11,0.12)' },
        ].map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-icon" style={{ background: s.bg }}><s.icon size={20} color={s.color} /></div>
            <div><div className="stat-label">{s.label}</div><div className="stat-value">{s.value}</div></div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {wards.map(w => {
          const occupied = getWardStats(w.name);
          // Just using a dummy base occupied for visuals since actual admissions start low
          const visualOccupied = occupied + Math.floor(w.total * 0.4); 
          const pct = Math.round((visualOccupied / w.total) * 100);
          
          return (
            <div className="card" key={w.name} style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{w.name}</div>
                  <span className="badge badge-muted" style={{ fontSize: 10 }}>{w.type}</span>
                </div>
                <BedDouble size={16} color={w.color} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Occupied</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: pct >= 90 ? 'var(--danger)' : pct >= 70 ? 'var(--warning)' : 'var(--success)' }}>{visualOccupied}/{w.total}</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{
                  width: `${Math.min(pct, 100)}%`,
                  background: pct >= 90 ? 'var(--danger)' : pct >= 70 ? 'var(--warning)' : w.color,
                }} />
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>{w.total - visualOccupied} beds available</div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Current Admissions</div>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Admission ID</th><th>Patient</th><th>Ward</th><th>Bed</th><th>Doctor</th><th>Admitted</th><th>Diagnosis</th><th>Days</th><th>Action</th></tr></thead>
            <tbody>
              {admissions.map(a => (
                <tr key={a.id}>
                  <td style={{ color: 'var(--primary-light)', fontWeight: 600 }}>{a.id}</td>
                  <td>
                    <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{a.patientName}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{a.patientId}</div>
                  </td>
                  <td><span className="badge badge-primary">{a.ward}</span></td>
                  <td style={{ fontWeight: 600, fontSize: 12 }}>{a.bed}</td>
                  <td style={{ fontSize: 12 }}>{a.doctor}</td>
                  <td style={{ fontSize: 12 }}>{a.admitted}</td>
                  <td style={{ fontSize: 12 }}>{a.diagnosis}</td>
                  <td><span className="badge badge-info">{a.days}d</span></td>
                  <td>
                    <button className="btn btn-sm btn-outline" style={{ fontSize: 11 }} onClick={() => handleDischarge(a.id, a.patientName)}>Discharge</button>
                  </td>
                </tr>
              ))}
              {admissions.length === 0 && (
                <tr><td colSpan={9} style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)' }}>No patients currently admitted</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Admit Patient"
        footer={<><button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button><button className="btn btn-primary" onClick={handleSave}>Admit Patient</button></>}
      >
        <div className="form-group">
          <label className="form-label">Select Patient *</label>
          <select className="form-input" value={formData.patientId} onChange={e => setFormData({...formData, patientId: e.target.value})}>
            <option value="">-- Choose Patient --</option>
            {patients.filter(p => p.status !== 'Admitted' && p.status !== 'Discharged').map(p => (
              <option key={p.id} value={p.id}>{p.firstName} {p.lastName} ({p.id})</option>
            ))}
          </select>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Select Ward *</label>
            <select className="form-input" value={formData.ward} onChange={e => setFormData({...formData, ward: e.target.value})}>
              {wards.map(w => <option key={w.name} value={w.name}>{w.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Bed Number *</label>
            <input className="form-input" value={formData.bed} onChange={e => setFormData({...formData, bed: e.target.value})} placeholder="e.g. GWA-12" />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Admitting Diagnosis *</label>
          <input className="form-input" value={formData.diagnosis} onChange={e => setFormData({...formData, diagnosis: e.target.value})} />
        </div>
        <div className="form-group">
          <label className="form-label">Attending Doctor</label>
          <input className="form-input" value={formData.doctor} onChange={e => setFormData({...formData, doctor: e.target.value})} />
        </div>
      </Modal>
    </AppLayout>
  );
}
