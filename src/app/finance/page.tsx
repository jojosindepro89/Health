'use client';
import AppLayout from '@/components/AppLayout';
import { CreditCard, TrendingUp, Download, Plus, CheckCircle2, Clock, AlertCircle, Printer } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from 'react';
import { useStore, Invoice } from '@/lib/store';
import { useToast } from '@/lib/toast';
import Modal from '@/components/Modal';

const revenueByDept = [
  { dept: 'General OPD', revenue: 124000 },
  { dept: 'Emergency', revenue: 98000 },
  { dept: 'Surgery', revenue: 285000 },
  { dept: 'Pharmacy', revenue: 76000 },
  { dept: 'Laboratory', revenue: 54000 },
  { dept: 'Radiology', revenue: 43000 },
];

const invoiceStatus: Record<string, string> = { Paid: 'badge-success', Pending: 'badge-warning', 'Part-Paid': 'badge-info' };

export default function FinancePage() {
  const { patients, invoices, addInvoice, updateInvoice, currentUser, addPrintLog, printLogs } = useStore();
  const { toast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedInv, setSelectedInv] = useState<Invoice | null>(null);

  const [formData, setFormData] = useState({
    patientId: '', services: '', amount: '', hmo: 'Self Pay'
  });
  
  const [paymentAmount, setPaymentAmount] = useState('');

  const totalRevenue = invoices.reduce((s, i) => s + i.paid, 0);
  const pendingCount = invoices.filter(i => i.status !== 'Paid').length;
  const debt = invoices.reduce((s, i) => s + (i.amount - i.paid), 0);

  const handleSave = () => {
    if (!formData.patientId || !formData.services || !formData.amount) {
      toast('error', 'Please fill all required fields');
      return;
    }
    const patient = patients.find(p => p.id === formData.patientId);
    if (!patient) return;

    addInvoice({
      ...formData,
      amount: parseInt(formData.amount),
      patientName: `${patient.firstName} ${patient.lastName}`,
      status: 'Pending',
      paid: 0
    });
    toast('success', 'Invoice generated successfully');
    setIsModalOpen(false);
  };

  const handleOpenPayment = (inv: Invoice) => {
    setSelectedInv(inv);
    setPaymentAmount(String(inv.amount - inv.paid));
    setIsPaymentModalOpen(true);
  };

  const handleProcessPayment = () => {
    if (!selectedInv) return;
    const amount = parseInt(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      toast('error', 'Enter a valid amount');
      return;
    }
    
    const newPaid = selectedInv.paid + amount;
    const newStatus = newPaid >= selectedInv.amount ? 'Paid' : 'Part-Paid';
    
    updateInvoice(selectedInv.id, {
      paid: newPaid,
      status: newStatus
    });
    
    toast('success', `Payment of ₦${amount.toLocaleString()} recorded`);
    setIsPaymentModalOpen(false);
  };

  const handlePrint = (inv: Invoice) => {
    addPrintLog(inv.id);
    toast('success', `Invoice ${inv.id} sent to printer`);
  };

  return (
    <AppLayout title="Finance & Payments" subtitle="Billing, invoices, and payment processing">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div className="page-title">Finance & Payments</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {currentUser.role === 'super_admin' && (
            <button className="btn btn-secondary" onClick={() => toast('info', 'Report downloading...')}><Download size={14} /> Export</button>
          )}
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}><Plus size={14} /> New Invoice</button>
        </div>
      </div>

      {currentUser.role === 'super_admin' && (
        <>
          <div className="stats-grid" style={{ marginBottom: 20 }}>
            {[
              { icon: CreditCard, label: "Total Revenue Collected", value: `₦${(totalRevenue/1000).toFixed(0)}K`, color: 'var(--primary)', bg: 'var(--primary-muted)' },
              { icon: CheckCircle2, label: 'Invoices Issued', value: invoices.length, color: 'var(--success)', bg: 'rgba(16,185,129,0.12)' },
              { icon: Clock, label: 'Pending Invoices', value: pendingCount, color: 'var(--warning)', bg: 'rgba(245,158,11,0.12)' },
              { icon: AlertCircle, label: 'Outstanding Debt', value: `₦${(debt/1000).toFixed(0)}K`, color: 'var(--danger)', bg: 'rgba(239,68,68,0.12)' },
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
                <div className="card-title">Revenue by Department — Today</div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={revenueByDept} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}K`} />
                  <YAxis type="category" dataKey="dept" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
                  <Tooltip contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} formatter={(v: number) => [`₦${v.toLocaleString()}`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="#0d9488" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <div className="card-title" style={{ marginBottom: 16 }}>Payment Breakdown</div>
              {[
                { method: 'HMO / Insurance', amount: '₦312,000', pct: 37, color: 'var(--primary)' },
                { method: 'NHIS', amount: '₦196,000', pct: 23, color: 'var(--accent)' },
                { method: 'Self Pay (Cash)', amount: '₦218,000', pct: 26, color: 'var(--success)' },
                { method: 'POS / Transfer', amount: '₦116,000', pct: 14, color: 'var(--purple)' },
              ].map(p => (
                <div key={p.method} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{p.method}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{p.amount} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({p.pct}%)</span></span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${p.pct}%`, background: p.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <div className="card-title">Recent Invoices</div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Invoice ID</th><th>Patient</th><th>Services</th><th>Total Amount</th><th>Paid</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id}>
                  <td style={{ color: 'var(--primary-light)', fontWeight: 600 }}>{inv.id}</td>
                  <td>
                    <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{inv.patientName}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{inv.patientId}</div>
                  </td>
                  <td style={{ fontSize: 12 }}>{inv.services}</td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>₦{inv.amount.toLocaleString()}</td>
                  <td style={{ fontWeight: 600, color: 'var(--success)' }}>₦{inv.paid.toLocaleString()}</td>
                  <td><span className={`badge ${invoiceStatus[inv.status]}`}>{inv.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {inv.status !== 'Paid' && (
                        <button className="btn btn-sm btn-outline" style={{ fontSize: 11 }} onClick={() => handleOpenPayment(inv)}>Pay</button>
                      )}
                      <button className="btn btn-sm btn-secondary" style={{ fontSize: 11 }} onClick={() => handlePrint(inv)}><Printer size={12} /> Print</button>
                    </div>
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)' }}>No invoices</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {currentUser.role === 'super_admin' && printLogs.length > 0 && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">Invoice Print Audit Log</div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Log ID</th><th>Invoice ID</th><th>Date Printed</th><th>Printed By</th></tr>
              </thead>
              <tbody>
                {printLogs.map(log => (
                  <tr key={log.id}>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{log.id}</td>
                    <td style={{ fontWeight: 500, color: 'var(--primary-light)' }}>{log.invoiceId}</td>
                    <td style={{ fontSize: 12 }}>{log.date}</td>
                    <td style={{ fontSize: 12 }}>{log.printedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Generate New Invoice"
        footer={<><button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button><button className="btn btn-primary" onClick={handleSave}>Create Invoice</button></>}
      >
        <div className="form-group">
          <label className="form-label">Select Patient *</label>
          <select className="form-input" value={formData.patientId} onChange={e => {
            setFormData({...formData, patientId: e.target.value, hmo: patients.find(p=>p.id===e.target.value)?.hmo || 'Self Pay'})
          }}>
            <option value="">-- Choose Patient --</option>
            {patients.map(p => (
              <option key={p.id} value={p.id}>{p.firstName} {p.lastName} ({p.id})</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Services Provided *</label>
          <input className="form-input" value={formData.services} onChange={e => setFormData({...formData, services: e.target.value})} placeholder="e.g. Consultation + Lab + Drugs" />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Total Amount (₦) *</label>
            <input className="form-input" type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Payer / HMO</label>
            <input className="form-input" value={formData.hmo} onChange={e => setFormData({...formData, hmo: e.target.value})} />
          </div>
        </div>
      </Modal>

      <Modal open={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} title="Record Payment"
        footer={<><button className="btn btn-secondary" onClick={() => setIsPaymentModalOpen(false)}>Cancel</button><button className="btn btn-success" style={{ background: 'var(--success)', color: 'white', border: 'none' }} onClick={handleProcessPayment}>Process Payment</button></>}
      >
        {selectedInv && (
          <div style={{ marginBottom: 16, padding: 12, background: 'var(--bg-card-2)', borderRadius: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Invoice Total:</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>₦{selectedInv.amount.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Amount Paid:</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--success)' }}>₦{selectedInv.paid.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--danger)' }}>Balance Due:</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--danger)' }}>₦{(selectedInv.amount - selectedInv.paid).toLocaleString()}</span>
            </div>
          </div>
        )}
        <div className="form-group">
          <label className="form-label">Payment Amount (₦) *</label>
          <input className="form-input" type="number" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Payment Method</label>
          <select className="form-input">
            <option>Cash</option><option>POS</option><option>Bank Transfer</option><option>HMO Settlement</option>
          </select>
        </div>
      </Modal>
    </AppLayout>
  );
}
