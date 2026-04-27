'use client';
/**
 * StoreProvider — now backed by real API calls.
 * All data is persisted in SQLite via the server-side Prisma APIs.
 * The store fetches from /api/* on mount and re-fetches after mutations.
 */
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  PatientsApi, ConsultationsApi, LabApi,
  PrescriptionsApi, InvoicesApi, AdmissionsApi, PrintLogsApi,
} from '@/lib/api';
import { useToast } from '@/lib/toast';

// ─── Types (mirrors the Prisma schema) ────────────────────────────────────────
export interface Patient {
  id: string; patientCode: string;
  firstName: string; lastName: string; age: number; gender: string;
  phone: string; email: string; hmo: string; dept: string;
  address: string; bloodGroup: string; status: string;
  createdAt: string; updatedAt: string;
}
export interface Consultation {
  id: string; consultCode: string; patientId: string;
  doctorName: string; dept: string; complaint: string;
  diagnosis: string; notes: string; priority: string; status: string;
  createdAt: string; updatedAt: string;
  patient?: { firstName: string; lastName: string; patientCode: string };
}
export interface LabRequest {
  id: string; labCode: string; patientId: string;
  requestedByName: string; test: string; dept: string;
  priority: string; status: string; result?: string;
  createdAt: string; updatedAt: string;
  patient?: { firstName: string; lastName: string; patientCode: string };
}
export interface Prescription {
  id: string; rxCode: string; patientId: string;
  doctorName: string; drugs: string; notes: string; status: string;
  createdAt: string; updatedAt: string;
  patient?: { firstName: string; lastName: string; patientCode: string };
}
export interface Invoice {
  id: string; invCode: string; patientId: string;
  services: string; amount: number; hmo: string; status: string; paid: number;
  createdAt: string; updatedAt: string;
  patient?: { firstName: string; lastName: string; patientCode: string };
  printLogs?: PrintLog[];
}
export interface Admission {
  id: string; admCode: string; patientId: string;
  ward: string; bed: string; doctorName: string; diagnosis: string;
  admittedAt: string; dischargedAt?: string; updatedAt: string;
  patient?: { firstName: string; lastName: string; patientCode: string };
}
export interface PrintLog {
  id: string; logCode: string; invoiceId: string;
  printedById: string; createdAt: string;
}

// RBAC-lite: keep the legacy currentUser shape for sidebar compatibility
export interface CurrentUser {
  name: string; role: 'super_admin' | 'front_desk'; initials: string;
}

// ─── Store shape ──────────────────────────────────────────────────────────────
interface StoreState {
  // data
  patients: Patient[];
  consultations: Consultation[];
  labRequests: LabRequest[];
  prescriptions: Prescription[];
  invoices: Invoice[];
  admissions: Admission[];
  printLogs: PrintLog[];
  // CRUD — Patients
  addPatient: (p: Omit<Patient, 'id' | 'patientCode' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updatePatient: (id: string, p: Partial<Patient>) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
  // CRUD — Consultations
  addConsultation: (c: Omit<Consultation, 'id' | 'consultCode' | 'createdAt' | 'updatedAt' | 'patient'>) => Promise<void>;
  updateConsultation: (id: string, c: Partial<Consultation>) => Promise<void>;
  deleteConsultation: (id: string) => Promise<void>;
  // CRUD — Lab
  addLabRequest: (l: Omit<LabRequest, 'id' | 'labCode' | 'createdAt' | 'updatedAt' | 'patient'>) => Promise<void>;
  updateLabRequest: (id: string, l: Partial<LabRequest>) => Promise<void>;
  // CRUD — Prescriptions
  addPrescription: (p: Omit<Prescription, 'id' | 'rxCode' | 'createdAt' | 'updatedAt' | 'patient'>) => Promise<void>;
  updatePrescription: (id: string, p: Partial<Prescription>) => Promise<void>;
  // CRUD — Invoices
  addInvoice: (i: Omit<Invoice, 'id' | 'invCode' | 'createdAt' | 'updatedAt' | 'patient' | 'printLogs'>) => Promise<void>;
  updateInvoice: (id: string, i: Partial<Invoice>) => Promise<void>;
  printInvoice: (invoiceId: string) => Promise<void>;
  // CRUD — Admissions
  admitPatient: (a: Omit<Admission, 'id' | 'admCode' | 'admittedAt' | 'dischargedAt' | 'updatedAt' | 'patient'>) => Promise<void>;
  dischargePatient: (id: string) => Promise<void>;
  // refresh
  refresh: () => Promise<void>;
  // legacy RBAC — reads from real auth
  currentUser: CurrentUser;
}

const StoreCtx = createContext<StoreState>({} as StoreState);

export function StoreProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [labRequests, setLabRequests] = useState<LabRequest[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [printLogs, setPrintLogs] = useState<PrintLog[]>([]);

  // Legacy RBAC shim — reads from auth session stored in localStorage
  const currentUser: CurrentUser = (() => {
    if (typeof window === 'undefined') return { name: 'Admin', role: 'super_admin', initials: 'AD' };
    try {
      const s = localStorage.getItem('dhs_session');
      const u = s ? JSON.parse(s) : null;
      return { name: u?.name || 'Admin', role: u?.role || 'super_admin', initials: u?.initials || 'AD' };
    } catch { return { name: 'Admin', role: 'super_admin', initials: 'AD' }; }
  })();

  const refresh = useCallback(async () => {
    const [p, c, l, rx, inv, adm] = await Promise.all([
      PatientsApi.list(),
      ConsultationsApi.list(),
      LabApi.list(),
      PrescriptionsApi.list(),
      InvoicesApi.list(),
      AdmissionsApi.list(),
    ]);
    if (p.data) setPatients(p.data.patients);
    if (c.data) setConsultations(c.data.consultations);
    if (l.data) setLabRequests(l.data.labRequests);
    if (rx.data) setPrescriptions(rx.data.prescriptions);
    if (inv.data) setInvoices(inv.data.invoices);
    if (adm.data) setAdmissions(adm.data.admissions);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  // ── Patients ──
  const addPatient = useCallback(async (data: any) => {
    const { data: res, error } = await PatientsApi.create(data);
    if (error) { toast('error', error); return; }
    setPatients(prev => [res!.patient, ...prev]);
    toast('success', `Patient ${res!.patient.firstName} registered`);
  }, [toast]);

  const updatePatient = useCallback(async (id: string, data: any) => {
    const { data: res, error } = await PatientsApi.update(id, data);
    if (error) { toast('error', error); return; }
    setPatients(prev => prev.map(p => p.id === id ? res!.patient : p));
    toast('success', 'Patient updated');
  }, [toast]);

  const deletePatient = useCallback(async (id: string) => {
    const { error } = await PatientsApi.delete(id);
    if (error) { toast('error', error); return; }
    setPatients(prev => prev.filter(p => p.id !== id));
    toast('success', 'Patient deleted');
  }, [toast]);

  // ── Consultations ──
  const addConsultation = useCallback(async (data: any) => {
    const { data: res, error } = await ConsultationsApi.create(data);
    if (error) { toast('error', error); return; }
    setConsultations(prev => [res!.consultation, ...prev]);
    toast('success', `Consultation ${res!.consultation.consultCode} created`);
  }, [toast]);

  const updateConsultation = useCallback(async (id: string, data: any) => {
    const { data: res, error } = await ConsultationsApi.update(id, data);
    if (error) { toast('error', error); return; }
    setConsultations(prev => prev.map(c => c.id === id ? { ...c, ...res!.consultation } : c));
    toast('success', 'Consultation updated');
  }, [toast]);

  const deleteConsultation = useCallback(async (id: string) => {
    const { error } = await ConsultationsApi.delete(id);
    if (error) { toast('error', error); return; }
    setConsultations(prev => prev.filter(c => c.id !== id));
    toast('success', 'Consultation removed');
  }, [toast]);

  // ── Lab ──
  const addLabRequest = useCallback(async (data: any) => {
    const { data: res, error } = await LabApi.create(data);
    if (error) { toast('error', error); return; }
    setLabRequests(prev => [res!.labRequest, ...prev]);
    toast('success', `Lab request ${res!.labRequest.labCode} created`);
  }, [toast]);

  const updateLabRequest = useCallback(async (id: string, data: any) => {
    const { data: res, error } = await LabApi.update(id, data);
    if (error) { toast('error', error); return; }
    setLabRequests(prev => prev.map(l => l.id === id ? { ...l, ...res!.labRequest } : l));
    toast('success', 'Lab request updated');
  }, [toast]);

  // ── Prescriptions ──
  const addPrescription = useCallback(async (data: any) => {
    const { data: res, error } = await PrescriptionsApi.create(data);
    if (error) { toast('error', error); return; }
    setPrescriptions(prev => [res!.prescription, ...prev]);
    toast('success', `Prescription ${res!.prescription.rxCode} created`);
  }, [toast]);

  const updatePrescription = useCallback(async (id: string, data: any) => {
    const { data: res, error } = await PrescriptionsApi.update(id, data);
    if (error) { toast('error', error); return; }
    setPrescriptions(prev => prev.map(p => p.id === id ? { ...p, ...res!.prescription } : p));
    toast('success', 'Prescription updated');
  }, [toast]);

  // ── Invoices ──
  const addInvoice = useCallback(async (data: any) => {
    const { data: res, error } = await InvoicesApi.create(data);
    if (error) { toast('error', error); return; }
    setInvoices(prev => [res!.invoice, ...prev]);
    toast('success', `Invoice ${res!.invoice.invCode} created`);
  }, [toast]);

  const updateInvoice = useCallback(async (id: string, data: any) => {
    const { data: res, error } = await InvoicesApi.update(id, data);
    if (error) { toast('error', error); return; }
    setInvoices(prev => prev.map(i => i.id === id ? { ...i, ...res!.invoice } : i));
    toast('success', 'Invoice updated');
  }, [toast]);

  const printInvoice = useCallback(async (invoiceId: string) => {
    const { error } = await PrintLogsApi.create(invoiceId);
    if (error) { toast('error', error); return; }
    toast('success', 'Invoice print logged');
  }, [toast]);

  // ── Admissions ──
  const admitPatient = useCallback(async (data: any) => {
    const { data: res, error } = await AdmissionsApi.create(data);
    if (error) { toast('error', error); return; }
    setAdmissions(prev => [res!.admission, ...prev]);
    setPatients(prev => prev.map(p => p.id === data.patientId ? { ...p, status: 'Admitted' } : p));
    toast('success', `Patient admitted to ${res!.admission.ward}`);
  }, [toast]);

  const dischargePatient = useCallback(async (id: string) => {
    const admission = admissions.find(a => a.id === id);
    const { error } = await AdmissionsApi.discharge(id);
    if (error) { toast('error', error); return; }
    setAdmissions(prev => prev.filter(a => a.id !== id));
    if (admission) {
      setPatients(prev => prev.map(p => p.id === admission.patientId ? { ...p, status: 'Discharged' } : p));
    }
    toast('success', 'Patient discharged');
  }, [admissions, toast]);

  return (
    <StoreCtx.Provider value={{
      patients, consultations, labRequests, prescriptions, invoices, admissions, printLogs,
      addPatient, updatePatient, deletePatient,
      addConsultation, updateConsultation, deleteConsultation,
      addLabRequest, updateLabRequest,
      addPrescription, updatePrescription,
      addInvoice, updateInvoice, printInvoice,
      admitPatient, dischargePatient,
      refresh, currentUser,
    }}>
      {children}
    </StoreCtx.Provider>
  );
}

export function useStore() { return useContext(StoreCtx); }
