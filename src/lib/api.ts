// src/lib/api.ts
// Frontend API client — all backend calls go through this module

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('dhs_token');
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<{ data: T | null; error: string | null }> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> || {}),
  };

  try {
    const res = await fetch(`/api${path}`, { ...options, headers });
    const json = await res.json();
    if (!res.ok) return { data: null, error: json.error || 'Request failed' };
    return { data: json as T, error: null };
  } catch (e) {
    return { data: null, error: 'Network error' };
  }
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const AuthApi = {
  login: (email: string, password: string) =>
    request<{ user: any; token: string }>('/auth/login', {
      method: 'POST', body: JSON.stringify({ email, password }),
    }),
  signup: (data: { name: string; email: string; password: string; hospital: string; role: string }) =>
    request<{ user: any; token: string }>('/auth/signup', {
      method: 'POST', body: JSON.stringify(data),
    }),
  me: () => request<{ user: any }>('/auth/me'),
};

// ─── Patients ─────────────────────────────────────────────────────────────────
export const PatientsApi = {
  list: () => request<{ patients: any[] }>('/patients'),
  get: (id: string) => request<{ patient: any }>(`/patients/${id}`),
  create: (data: any) => request<{ patient: any }>('/patients', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => request<{ patient: any }>(`/patients/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => request<{ success: boolean }>(`/patients/${id}`, { method: 'DELETE' }),
};

// ─── Consultations ────────────────────────────────────────────────────────────
export const ConsultationsApi = {
  list: () => request<{ consultations: any[] }>('/consultations'),
  create: (data: any) => request<{ consultation: any }>('/consultations', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => request<{ consultation: any }>(`/consultations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => request<{ success: boolean }>(`/consultations/${id}`, { method: 'DELETE' }),
};

// ─── Lab Requests ─────────────────────────────────────────────────────────────
export const LabApi = {
  list: () => request<{ labRequests: any[] }>('/lab-requests'),
  create: (data: any) => request<{ labRequest: any }>('/lab-requests', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => request<{ labRequest: any }>(`/lab-requests/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

// ─── Prescriptions ────────────────────────────────────────────────────────────
export const PrescriptionsApi = {
  list: () => request<{ prescriptions: any[] }>('/prescriptions'),
  create: (data: any) => request<{ prescription: any }>('/prescriptions', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => request<{ prescription: any }>(`/prescriptions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

// ─── Invoices ─────────────────────────────────────────────────────────────────
export const InvoicesApi = {
  list: () => request<{ invoices: any[] }>('/invoices'),
  create: (data: any) => request<{ invoice: any }>('/invoices', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => request<{ invoice: any }>(`/invoices/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

// ─── Admissions ───────────────────────────────────────────────────────────────
export const AdmissionsApi = {
  list: () => request<{ admissions: any[] }>('/admissions'),
  create: (data: any) => request<{ admission: any }>('/admissions', { method: 'POST', body: JSON.stringify(data) }),
  discharge: (id: string) => request<{ success: boolean }>(`/admissions/${id}/discharge`, { method: 'POST' }),
};

// ─── Print Logs ───────────────────────────────────────────────────────────────
export const PrintLogsApi = {
  list: () => request<{ logs: any[] }>('/print-logs'),
  create: (invoiceId: string) => request<{ log: any }>('/print-logs', { method: 'POST', body: JSON.stringify({ invoiceId }) }),
};

// ─── Seed ─────────────────────────────────────────────────────────────────────
export const SeedApi = {
  seed: () => request<{ success: boolean; seeded: any }>('/seed', { method: 'POST' }),
};
