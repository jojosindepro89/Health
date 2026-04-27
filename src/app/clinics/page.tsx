'use client';
import AppLayout from '@/components/AppLayout';
import { Stethoscope, Clock, CheckCircle2, AlertCircle, Plus, Check } from 'lucide-react';
import { useState } from 'react';
import { useStore, Consultation } from '@/lib/store';
import { useToast } from '@/lib/toast';
import Modal from '@/components/Modal';

const doctors = [
  { name: 'Dr. Amaka Obi', dept: 'General/Cardiology', patients: 8, status: 'Busy' },
  { name: 'Dr. Taiwo Adebayo', dept: 'Obstetrics', patients: 5, status: 'Busy' },
  { name: 'Dr. Emeka Cole', dept: 'General OPD', patients: 6, status: 'Available' },
  { name: 'Dr. A. Peters', dept: 'Emergency', patients: 3, status: 'Busy' },
  { name: 'Dr. Sola Adesanya', dept: 'Paediatrics', patients: 0, status: 'Off Duty' },
];

const priorityMap: Record<string, string> = { Urgent: 'badge-danger', Normal: 'badge-muted' };
const consultStatus: Record<string, string> = { Waiting: 'badge-warning', 'In Progress': 'badge-info', Completed: 'badge-success' };
const doctorStatus: Record<string, string> = { Busy: 'badge-warning', Available: 'badge-success', 'Off Duty': 'badge-muted' };

export default function ClinicsPage() {
  const { patients, consultations, addConsultation, updateConsultation } = useStore();
  const { toast } = useToast();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [selectedConsult, setSelectedConsult] = useState<Consultation | null>(null);
  
  const [formData, setFormData] = useState({
    patientId: '', doctorName: 'Dr. Emeka Cole', dept: 'General OPD',
    complaint: '', priority: 'Normal' as 'Normal' | 'Urgent'
  });

  const [completeData, setCompleteData] = useState({
    diagnosis: '', notes: ''
  });

  const queue = consultations.filter(c => c.status === 'Waiting');
  const active = consultations.filter(c => c.status === 'In Progress');
  const completed = consultations.filter(c => c.status === 'Completed');

  const handleSave = () => {
    if (!formData.patientId || !formData.complaint) {
      toast('error', 'Please select a patient and enter complaint');
      return;
    }
    const patient = patients.find(p => p.id === formData.patientId);
    if (!patient) return;

    addConsultation({
      ...formData,
      diagnosis: '', notes: '',
      status: 'Waiting',
    });
    toast('success', 'Patient added to queue');
    setIsModalOpen(false);
  };

  const handleStartConsultation = (c: Consultation) => {
    updateConsultation(c.id, { status: 'In Progress' });
    toast('info', `Consultation started for ${c.patient ? `${c.patient.firstName} ${c.patient.lastName}` : c.patientId}`);
  };

  const handleOpenComplete = (c: Consultation) => {
    setSelectedConsult(c);
    setCompleteData({ diagnosis: c.diagnosis || '', notes: c.notes || '' });
    setIsCompleteModalOpen(true);
  };

  const handleComplete = () => {
    if (!selectedConsult) return;
    if (!completeData.diagnosis) {
      toast('error', 'Please enter a diagnosis');
      return;
    }
    updateConsultation(selectedConsult.id, {
      ...completeData,
      status: 'Completed'
    });
    toast('success', 'Consultation completed');
    setIsCompleteModalOpen(false);
  };

  return (
    <AppLayout title="Clinics & Consultation" subtitle="Manage consultations, queues, and clinicians">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div className="page-title">Outpatient Clinic</div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}><Plus size={14} /> New Consultation</button>
      </div>

      <div className="stats-grid" style={{ marginBottom: 20 }}>
        {[
          { icon: Clock, label: 'In Queue', value: queue.length, color: 'var(--warning)', bg: 'rgba(245,158,11,0.12)' },
          { icon: Stethoscope, label: 'Active Consults', value: active.length, color: 'var(--info)', bg: 'rgba(59,130,246,0.12)' },
          { icon: CheckCircle2, label: 'Completed Today', value: completed.length, color: 'var(--success)', bg: 'rgba(16,185,129,0.12)' },
          { icon: AlertCircle, label: 'Total Visits', value: consultations.length, color: 'var(--primary)', bg: 'var(--primary-muted)' },
        ].map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-icon" style={{ background: s.bg }}><s.icon size={20} color={s.color} /></div>
            <div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        {/* Queue */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Waiting Queue</div>
            <span className="badge badge-warning">{queue.length} waiting</span>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Time</th><th>Patient</th><th>Complaint</th><th>Doctor</th><th>Priority</th><th>Action</th></tr></thead>
              <tbody>
                {queue.map(q => (
                  <tr key={q.id}>
                    <td style={{ fontWeight: 600, color: 'var(--warning)', fontSize: 12 }}>{new Date(q.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td>
                      <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{q.patient ? `${q.patient.firstName} ${q.patient.lastName}` : q.patientId}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{q.patient?.patientCode ?? q.patientId}</div>
                    </td>
                    <td style={{ fontSize: 12 }}>{q.complaint}</td>
                    <td style={{ fontSize: 12 }}>{q.doctorName}</td>
                    <td><span className={`badge ${priorityMap[q.priority]}`}>{q.priority}</span></td>
                    <td><button className="btn btn-sm btn-outline" onClick={() => handleStartConsultation(q)}>Start</button></td>
                  </tr>
                ))}
                {queue.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)' }}>Queue is empty</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Doctors on Duty */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Doctors On Duty</div>
            <span className="badge badge-success">3 Active</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {doctors.map(d => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div className="avatar" style={{ flexShrink: 0 }}>{d.name.split(' ')[1][0]}{d.name.split(' ')[2]?.[0] || ''}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{d.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{d.dept}</div>
                </div>
                <span className={`badge ${doctorStatus[d.status]}`}>{d.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active & Completed Consultations */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Consultation Log — Today</div>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Consult ID</th><th>Patient</th><th>Doctor</th><th>Department</th><th>Diagnosis</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {[...active, ...completed].map(c => (
                <tr key={c.id}>
                  <td style={{ color: 'var(--primary-light)', fontWeight: 600 }}>{c.consultCode}</td>
                  <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{c.patient ? `${c.patient.firstName} ${c.patient.lastName}` : c.patientId}</td>
                  <td style={{ fontSize: 12 }}>{c.doctorName}</td>
                  <td><span className="badge badge-muted">{c.dept}</span></td>
                  <td style={{ fontSize: 12 }}>{c.diagnosis || '-'}</td>
                  <td><span className={`badge ${consultStatus[c.status]}`}>{c.status}</span></td>
                  <td>
                    {c.status === 'In Progress' && (
                      <button className="btn btn-sm btn-primary" onClick={() => handleOpenComplete(c)}><Check size={12} /> Complete</button>
                    )}
                  </td>
                </tr>
              ))}
              {active.length === 0 && completed.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)' }}>No consultations yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Consultation Modal */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Queue New Consultation"
        footer={<><button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button><button className="btn btn-primary" onClick={handleSave}>Add to Queue</button></>}
      >
        <div className="form-group">
          <label className="form-label">Select Patient *</label>
          <select className="form-input" value={formData.patientId} onChange={e => setFormData({...formData, patientId: e.target.value})}>
            <option value="">-- Choose Patient --</option>
            {patients.filter(p => p.status === 'Active').map(p => (
              <option key={p.id} value={p.id}>{p.firstName} {p.lastName} ({p.id})</option>
            ))}
          </select>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Assign Doctor</label>
            <select className="form-input" value={formData.doctorName} onChange={e => setFormData({...formData, doctorName: e.target.value})}>
              {doctors.filter(d => d.status !== 'Off Duty').map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Department</label>
            <select className="form-input" value={formData.dept} onChange={e => setFormData({...formData, dept: e.target.value})}>
              <option>General OPD</option><option>Emergency</option><option>Paediatrics</option><option>Cardiology</option><option>Antenatal</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Priority</label>
          <select className="form-input" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value as 'Normal' | 'Urgent'})}>
            <option value="Normal">Normal</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Presenting Complaint *</label>
          <textarea className="form-input" rows={3} value={formData.complaint} onChange={e => setFormData({...formData, complaint: e.target.value})} placeholder="Brief description of symptoms..." style={{ resize: 'vertical' }} />
        </div>
      </Modal>

      {/* Complete Consultation Modal */}
      <Modal open={isCompleteModalOpen} onClose={() => setIsCompleteModalOpen(false)} title="Complete Consultation"
        footer={<><button className="btn btn-secondary" onClick={() => setIsCompleteModalOpen(false)}>Cancel</button><button className="btn btn-success" style={{ background: 'var(--success)', color: 'white', border: 'none' }} onClick={handleComplete}>Save & Complete</button></>}
      >
        <div className="form-group">
          <label className="form-label">Diagnosis *</label>
          <input className="form-input" value={completeData.diagnosis} onChange={e => setCompleteData({...completeData, diagnosis: e.target.value})} placeholder="Primary diagnosis" />
        </div>
        <div className="form-group">
          <label className="form-label">Clinical Notes</label>
          <textarea className="form-input" rows={5} value={completeData.notes} onChange={e => setCompleteData({...completeData, notes: e.target.value})} placeholder="Examination findings, plan..." style={{ resize: 'vertical' }} />
        </div>
      </Modal>

    </AppLayout>
  );
}
