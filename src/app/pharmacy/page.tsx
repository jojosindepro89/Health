'use client';
import AppLayout from '@/components/AppLayout';
import { Pill, AlertCircle, TrendingDown, ShoppingCart, Plus, Package, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useStore, Prescription } from '@/lib/store';
import { useToast } from '@/lib/toast';
import Modal from '@/components/Modal';

const inventory = [
  { drug: 'Paracetamol 500mg', category: 'Analgesic', stock: 2400, unit: 'Tabs', reorder: 500, status: 'Adequate' },
  { drug: 'Amlodipine 5mg', category: 'Antihypertensive', stock: 320, unit: 'Tabs', reorder: 200, status: 'Adequate' },
  { drug: 'Artemether/Lumefantrine', category: 'Antimalarial', stock: 80, unit: 'Tabs', reorder: 150, status: 'Low Stock' },
  { drug: 'Lisinopril 10mg', category: 'Antihypertensive', stock: 160, unit: 'Tabs', reorder: 200, status: 'Low Stock' },
  { drug: 'Ceftriaxone 1g', category: 'Antibiotic', stock: 12, unit: 'Vials', reorder: 20, status: 'Critical' },
  { drug: 'Metformin 500mg', category: 'Antidiabetic', stock: 900, unit: 'Tabs', reorder: 300, status: 'Adequate' },
];

const rxStatus: Record<string, string> = { Dispensed: 'badge-success', Pending: 'badge-warning' };
const stockStatus: Record<string, string> = { Adequate: 'badge-success', 'Low Stock': 'badge-warning', Critical: 'badge-danger' };

export default function PharmacyPage() {
  const { patients, prescriptions, addPrescription, updatePrescription } = useStore();
  const { toast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '', drugs: '', doctorName: 'Dr. Amaka Obi', notes: ''
  });

  const dispensed = prescriptions.filter(p => p.status === 'Dispensed').length;

  const handleSave = () => {
    if (!formData.patientId || !formData.drugs) {
      toast('error', 'Please select a patient and enter drugs');
      return;
    }
    const patient = patients.find(p => p.id === formData.patientId);
    if (!patient) return;

    addPrescription({
      ...formData,
      status: 'Pending'
    });
    toast('success', 'Prescription created successfully');
    setIsModalOpen(false);
  };

  const handleDispense = (id: string) => {
    updatePrescription(id, { status: 'Dispensed' });
    toast('success', 'Drugs dispensed successfully');
  };

  return (
    <AppLayout title="Pharmacy Management" subtitle="Prescriptions, dispensing, and inventory control">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div className="page-title">Pharmacy</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary" onClick={() => toast('info', 'Requisition flow coming soon')}><ShoppingCart size={14} /> Requisition</button>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}><Plus size={14} /> New Prescription</button>
        </div>
      </div>

      <div className="stats-grid" style={{ marginBottom: 20 }}>
        {[
          { icon: Pill, label: 'Total Prescriptions', value: prescriptions.length, color: 'var(--primary)', bg: 'var(--primary-muted)' },
          { icon: Package, label: 'Rx Dispensed', value: dispensed, color: 'var(--success)', bg: 'rgba(16,185,129,0.12)' },
          { icon: AlertCircle, label: 'Low Stock Items', value: '2', color: 'var(--warning)', bg: 'rgba(245,158,11,0.12)' },
          { icon: TrendingDown, label: 'Critical Stock', value: '1', color: 'var(--danger)', bg: 'rgba(239,68,68,0.12)' },
        ].map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-icon" style={{ background: s.bg }}><s.icon size={20} color={s.color} /></div>
            <div><div className="stat-label">{s.label}</div><div className="stat-value">{s.value}</div></div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Recent Prescriptions</div>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Rx ID</th><th>Patient</th><th>Drugs</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {prescriptions.map(p => (
                  <tr key={p.id}>
                    <td style={{ color: 'var(--primary-light)', fontWeight: 600 }}>{p.rxCode}</td>
                    <td>
                      <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{p.patient ? `${p.patient.firstName} ${p.patient.lastName}` : p.patientId}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.doctorName}</div>
                    </td>
                    <td style={{ fontSize: 12, maxWidth: 180 }}>{p.drugs}</td>
                    <td><span className={`badge ${rxStatus[p.status]}`}>{p.status}</span></td>
                    <td>
                      {p.status === 'Pending' ? (
                        <button className="btn btn-sm btn-primary" onClick={() => handleDispense(p.id)}><CheckCircle2 size={12} /> Dispense</button>
                      ) : (
                        <span style={{ fontSize: 12, color: 'var(--success)' }}>Done</span>
                      )}
                    </td>
                  </tr>
                ))}
                {prescriptions.length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)' }}>No prescriptions</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title">Stock Alerts</div></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {inventory.filter(i => i.status !== 'Adequate').map(item => (
              <div key={item.drug} style={{ background: 'var(--bg-card-2)', borderRadius: 8, padding: '12px 14px', border: `1px solid ${item.status === 'Critical' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>{item.drug}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.category} · {item.stock} {item.unit} remaining</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                    <span className={`badge ${stockStatus[item.status]}`}>{item.status}</span>
                    <button className="btn btn-sm btn-outline" style={{ fontSize: 11, padding: '3px 8px' }} onClick={() => toast('info', `Reorder triggered for ${item.drug}`)}>Reorder</button>
                  </div>
                </div>
                <div className="progress-bar" style={{ marginTop: 8 }}>
                  <div className="progress-fill" style={{
                    width: `${Math.min((item.stock / item.reorder) * 100, 100)}%`,
                    background: item.status === 'Critical' ? 'var(--danger)' : 'var(--warning)',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Drug Inventory</div>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Drug Name</th><th>Category</th><th>Stock</th><th>Unit</th><th>Reorder Level</th><th>Status</th></tr></thead>
            <tbody>
              {inventory.map(item => (
                <tr key={item.drug}>
                  <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{item.drug}</td>
                  <td><span className="badge badge-muted">{item.category}</span></td>
                  <td style={{ fontWeight: 600, color: item.status === 'Critical' ? 'var(--danger)' : item.status === 'Low Stock' ? 'var(--warning)' : 'var(--text-primary)' }}>{item.stock}</td>
                  <td>{item.unit}</td>
                  <td>{item.reorder}</td>
                  <td><span className={`badge ${stockStatus[item.status]}`}>{item.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Prescription"
        footer={<><button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button><button className="btn btn-primary" onClick={handleSave}>Create Prescription</button></>}
      >
        <div className="form-group">
          <label className="form-label">Select Patient *</label>
          <select className="form-input" value={formData.patientId} onChange={e => setFormData({...formData, patientId: e.target.value})}>
            <option value="">-- Choose Patient --</option>
            {patients.filter(p => p.status !== 'Discharged').map(p => (
              <option key={p.id} value={p.id}>{p.firstName} {p.lastName} ({p.id})</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Prescribed Drugs *</label>
          <textarea className="form-input" rows={3} value={formData.drugs} onChange={e => setFormData({...formData, drugs: e.target.value})} placeholder="e.g. Paracetamol 500mg x 20, Amoxicillin 500mg x 15" style={{ resize: 'vertical' }} />
        </div>
        <div className="form-group">
          <label className="form-label">Dosage Instructions</label>
          <textarea className="form-input" rows={2} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="e.g. Take 1 tablet twice daily after meals" style={{ resize: 'vertical' }} />
        </div>
        <div className="form-group">
          <label className="form-label">Prescribing Doctor</label>
          <input className="form-input" value={formData.doctorName} onChange={e => setFormData({...formData, doctorName: e.target.value})} />
        </div>
      </Modal>

    </AppLayout>
  );
}
