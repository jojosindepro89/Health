'use client';
import AppLayout from '@/components/AppLayout';
import { FlaskConical, Clock, CheckCircle2, AlertCircle, Plus, Download, Edit } from 'lucide-react';
import { useState } from 'react';
import { useStore, LabRequest } from '@/lib/store';
import { useToast } from '@/lib/toast';
import Modal from '@/components/Modal';

const statusMap: Record<string, string> = { 'In Progress': 'badge-info', Pending: 'badge-warning', Completed: 'badge-success' };
const priorityMap: Record<string, string> = { Urgent: 'badge-danger', Routine: 'badge-muted' };

const labDepts = [
  { name: 'Haematology', pending: 4, completed: 18, total: 22 },
  { name: 'Biochemistry', pending: 6, completed: 24, total: 30 },
  { name: 'Microbiology', pending: 3, completed: 11, total: 14 },
  { name: 'Parasitology', pending: 1, completed: 9, total: 10 },
  { name: 'Histopathology', pending: 0, completed: 5, total: 5 },
];

export default function LaboratoryPage() {
  const { patients, labRequests, addLabRequest, updateLabRequest } = useStore();
  const { toast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [selectedReq, setSelectedReq] = useState<LabRequest | null>(null);

  const [formData, setFormData] = useState({
    patientId: '', test: 'Full Blood Count', dept: 'Haematology', priority: 'Routine' as 'Routine' | 'Urgent', requestedByName: 'Dr. Amaka Obi'
  });
  
  const [resultData, setResultData] = useState({ result: '' });

  const pending = labRequests.filter(r => r.status === 'Pending' || r.status === 'In Progress').length;
  const completed = labRequests.filter(r => r.status === 'Completed').length;

  const handleSave = () => {
    if (!formData.patientId || !formData.test) {
      toast('error', 'Please select a patient and enter a test');
      return;
    }
    const patient = patients.find(p => p.id === formData.patientId);
    if (!patient) return;

    addLabRequest({
      ...formData,
      status: 'Pending'
    });
    toast('success', 'Lab request created successfully');
    setIsModalOpen(false);
  };

  const handleStart = (r: LabRequest) => {
    updateLabRequest(r.id, { status: 'In Progress' });
    toast('info', `Started processing test for ${r.patient ? `${r.patient.firstName} ${r.patient.lastName}` : r.patientId}`);
  };

  const handleOpenResult = (r: LabRequest) => {
    setSelectedReq(r);
    setResultData({ result: r.result || '' });
    setIsResultModalOpen(true);
  };

  const handleSaveResult = () => {
    if (!selectedReq) return;
    if (!resultData.result) {
      toast('error', 'Result cannot be empty');
      return;
    }
    updateLabRequest(selectedReq.id, {
      result: resultData.result,
      status: 'Completed'
    });
    toast('success', 'Lab result saved');
    setIsResultModalOpen(false);
  };

  return (
    <AppLayout title="Laboratory" subtitle="Manage lab requests, results, and department workload">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div className="page-title">Laboratory Management</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary" onClick={() => toast('info', 'Exporting results...')}><Download size={14} /> Export Results</button>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}><Plus size={14} /> New Lab Request</button>
        </div>
      </div>

      <div className="stats-grid" style={{ marginBottom: 20 }}>
        {[
          { icon: FlaskConical, label: 'Total Requests Today', value: labRequests.length, color: 'var(--primary)', bg: 'var(--primary-muted)' },
          { icon: Clock, label: 'Pending Results', value: pending, color: 'var(--warning)', bg: 'rgba(245,158,11,0.12)' },
          { icon: CheckCircle2, label: 'Results Ready', value: completed, color: 'var(--success)', bg: 'rgba(16,185,129,0.12)' },
          { icon: AlertCircle, label: 'Critical Values', value: '3', color: 'var(--danger)', bg: 'rgba(239,68,68,0.12)' },
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

      <div className="grid-3-1" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Lab Requests</div>
            <span className="badge badge-primary">Today</span>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Req. ID</th><th>Patient</th><th>Test</th><th>Department</th>
                  <th>Requested By</th><th>Time</th><th>Priority</th><th>Status</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {labRequests.map(r => (
                  <tr key={r.id}>
                    <td style={{ color: 'var(--primary-light)', fontWeight: 600 }}>{r.labCode}</td>
                    <td>
                      <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{r.patient ? `${r.patient.firstName} ${r.patient.lastName}` : r.patientId}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.patient?.patientCode ?? r.patientId}</div>
                    </td>
                    <td style={{ fontSize: 12 }}>{r.test}</td>
                    <td><span className="badge badge-muted">{r.dept}</span></td>
                    <td style={{ fontSize: 12 }}>{r.requestedByName}</td>
                    <td style={{ fontSize: 12 }}>{new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td><span className={`badge ${priorityMap[r.priority]}`}>{r.priority}</span></td>
                    <td><span className={`badge ${statusMap[r.status]}`}>{r.status}</span></td>
                    <td>
                      {r.status === 'Pending' && <button className="btn btn-sm btn-outline" onClick={() => handleStart(r)}>Process</button>}
                      {r.status === 'In Progress' && <button className="btn btn-sm btn-primary" onClick={() => handleOpenResult(r)}><Edit size={12} /> Enter Result</button>}
                      {r.status === 'Completed' && <button className="btn btn-sm btn-secondary" onClick={() => handleOpenResult(r)}>View</button>}
                    </td>
                  </tr>
                ))}
                {labRequests.length === 0 && (
                  <tr><td colSpan={9} style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)' }}>No lab requests</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Dept. Workload</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {labDepts.map(d => (
              <div key={d.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>{d.name}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{d.completed}/{d.total}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{
                    width: `${(d.completed / d.total) * 100}%`,
                    background: 'var(--primary)',
                  }} />
                </div>
                {d.pending > 0 && (
                  <div style={{ fontSize: 11, color: 'var(--warning)', marginTop: 3 }}>{d.pending} pending</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Lab Request"
        footer={<><button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button><button className="btn btn-primary" onClick={handleSave}>Create Request</button></>}
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
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Test Requested *</label>
            <input className="form-input" value={formData.test} onChange={e => setFormData({...formData, test: e.target.value})} placeholder="e.g. Full Blood Count" />
          </div>
          <div className="form-group">
            <label className="form-label">Department</label>
            <select className="form-input" value={formData.dept} onChange={e => setFormData({...formData, dept: e.target.value})}>
              {labDepts.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Priority</label>
            <select className="form-input" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value as 'Routine' | 'Urgent'})}>
              <option value="Routine">Routine</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Requested By</label>
            <input className="form-input" value={formData.requestedByName} onChange={e => setFormData({...formData, requestedByName: e.target.value})} />
          </div>
        </div>
      </Modal>

      <Modal open={isResultModalOpen} onClose={() => setIsResultModalOpen(false)} title={selectedReq?.status === 'Completed' ? "View Lab Result" : "Enter Lab Result"}
        footer={
          selectedReq?.status !== 'Completed' ? 
            <><button className="btn btn-secondary" onClick={() => setIsResultModalOpen(false)}>Cancel</button><button className="btn btn-success" style={{ background: 'var(--success)', color: 'white', border: 'none' }} onClick={handleSaveResult}>Save Result</button></> 
            : <button className="btn btn-primary" onClick={() => setIsResultModalOpen(false)}>Close</button>
        }
      >
        {selectedReq && (
          <div style={{ marginBottom: 16, padding: 12, background: 'var(--bg-card-2)', borderRadius: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{selectedReq.test}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{selectedReq.patient ? `${selectedReq.patient.firstName} ${selectedReq.patient.lastName}` : selectedReq.patientId} ({selectedReq.patientId})</div>
          </div>
        )}
        <div className="form-group">
          <label className="form-label">Result / Report *</label>
          <textarea className="form-input" rows={6} value={resultData.result} readOnly={selectedReq?.status === 'Completed'} onChange={e => setResultData({result: e.target.value})} placeholder="Enter test findings and parameters..." style={{ resize: 'vertical' }} />
        </div>
      </Modal>
    </AppLayout>
  );
}
