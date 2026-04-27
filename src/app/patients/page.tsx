'use client';
import AppLayout from '@/components/AppLayout';
import { UserPlus, Search, Filter, Download, Eye, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useStore, Patient } from '@/lib/store';
import { useToast } from '@/lib/toast';
import Modal from '@/components/Modal';

const statusMap: Record<string, string> = {
  Active: 'badge-success', Admitted: 'badge-info', Discharged: 'badge-muted',
};

export default function PatientsPage() {
  const { patients, addPatient, updatePatient, deletePatient } = useStore();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', age: '', gender: 'M' as 'M'|'F', phone: '',
    email: '', hmo: '', dept: 'General OPD', address: '', bloodGroup: 'O+'
  });

  const filtered = patients.filter(p =>
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase())
  );

  const activeToday = patients.filter(p => p.status === 'Active').length;
  const admitted = patients.filter(p => p.status === 'Admitted').length;
  const discharged = patients.filter(p => p.status === 'Discharged').length;

  const handleOpenModal = (p?: Patient) => {
    if (p) {
      setEditingPatient(p);
      setFormData({
        firstName: p.firstName, lastName: p.lastName, age: String(p.age),
        gender: p.gender as 'M' | 'F', phone: p.phone, email: p.email, hmo: p.hmo,
        dept: p.dept, address: p.address, bloodGroup: p.bloodGroup
      });
    } else {
      setEditingPatient(null);
      setFormData({
        firstName: '', lastName: '', age: '', gender: 'M', phone: '',
        email: '', hmo: '', dept: 'General OPD', address: '', bloodGroup: 'O+'
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.firstName || !formData.lastName || !formData.age) {
      toast('error', 'Please fill in all required fields');
      return;
    }

    if (editingPatient) {
      updatePatient(editingPatient.id, {
        ...formData,
        age: parseInt(formData.age),
      });
      toast('success', 'Patient updated successfully');
    } else {
      addPatient({
        ...formData,
        age: parseInt(formData.age),
        status: 'Active',
      });
      toast('success', 'Patient registered successfully');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this patient?')) {
      deletePatient(id);
      toast('info', 'Patient record deleted');
    }
  };

  return (
    <AppLayout title="Patient Registration" subtitle="Manage patient records and registrations">
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div className="page-title">Patient Records</div>
          <div className="page-subtitle">Total: {patients.length} patients registered</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary" onClick={() => toast('info', 'Export feature coming soon')}><Download size={14} /> Export</button>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}><UserPlus size={14} /> Register Patient</button>
        </div>
      </div>

      <div className="stats-grid" style={{ marginBottom: 20 }}>
        {[
          { label: 'Total Registered', value: patients.length, color: 'var(--primary)' },
          { label: 'Active Today', value: activeToday, color: 'var(--success)' },
          { label: 'Currently Admitted', value: admitted, color: 'var(--info)' },
          { label: 'Discharged Total', value: discharged, color: 'var(--text-muted)' },
        ].map(s => (
          <div className="card" key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flex: 1 }}>
            <div className="topbar-search" style={{ maxWidth: 300, margin: 0 }}>
              <Search size={14} color="var(--text-muted)" />
              <input
                placeholder="Search by name or ID..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Patient ID</th><th>Name</th><th>Age</th><th>Gender</th>
                <th>Phone</th><th>HMO</th><th>Department</th><th>Reg. Date</th>
                <th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td style={{ color: 'var(--primary-light)', fontWeight: 600 }}>{p.patientCode}</td>
                  <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{p.firstName} {p.lastName}</td>
                  <td>{p.age}</td>
                  <td>{p.gender}</td>
                  <td>{p.phone}</td>
                  <td><span className="badge badge-muted">{p.hmo || 'Self Pay'}</span></td>
                  <td>{p.dept}</td>
                  <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td><span className={`badge ${statusMap[p.status]}`}>{p.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="icon-btn" style={{ width: 28, height: 28 }} onClick={() => handleOpenModal(p)}><Edit size={12} /></button>
                      <button className="icon-btn" style={{ width: 28, height: 28, color: 'var(--danger)' }} onClick={() => handleDelete(p.id)}><Trash2 size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: '30px 0' }}>
                    <div className="empty-state">
                      <Search style={{ margin: '0 auto 10px', color: 'var(--text-muted)' }} size={32} />
                      <h3>No patients found</h3>
                      <p>Try adjusting your search criteria</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingPatient ? 'Edit Patient Record' : 'Register New Patient'}
        width={600}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>Save Record</button>
          </>
        }
      >
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">First Name *</label>
            <input className="form-input" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Last Name *</label>
            <input className="form-input" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
          </div>
        </div>
        <div className="form-row-3">
          <div className="form-group">
            <label className="form-label">Age *</label>
            <input className="form-input" type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Gender</label>
            <select className="form-input" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value as 'M'|'F'})}>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Blood Group</label>
            <select className="form-input" value={formData.bloodGroup} onChange={e => setFormData({...formData, bloodGroup: e.target.value})}>
              <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
              <option>AB+</option><option>AB-</option><option>O+</option><option>O-</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input className="form-input" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Home Address</label>
          <input className="form-input" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
        </div>
        <div className="divider" />
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">HMO / Provider</label>
            <select className="form-input" value={formData.hmo} onChange={e => setFormData({...formData, hmo: e.target.value})}>
              <option value="">Self Pay</option>
              <option value="NHIS">NHIS</option>
              <option value="AXA Mansard">AXA Mansard</option>
              <option value="Hygeia">Hygeia</option>
              <option value="Leadway">Leadway</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Department</label>
            <select className="form-input" value={formData.dept} onChange={e => setFormData({...formData, dept: e.target.value})}>
              <option>General OPD</option>
              <option>Emergency</option>
              <option>Paediatrics</option>
              <option>Surgery</option>
              <option>Antenatal</option>
              <option>Cardiology</option>
            </select>
          </div>
        </div>
      </Modal>
    </AppLayout>
  );
}
