'use client';
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AuthApi, SeedApi } from '@/lib/api';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'front_desk' | 'doctor' | 'nurse' | 'pharmacist';
  hospital: string;
  initials: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: { name: string; email: string; password: string; hospital: string; role: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthCtx = createContext<AuthState>({
  user: null, isAuthenticated: false, isLoading: true,
  login: async () => ({ success: false }),
  signup: async () => ({ success: false }),
  logout: () => {},
});

function makeInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function saveToken(token: string) {
  localStorage.setItem('dhs_token', token);
}
function saveSession(user: any) {
  localStorage.setItem('dhs_session', JSON.stringify(user));
}
function clearToken() {
  localStorage.removeItem('dhs_token');
  localStorage.removeItem('dhs_session');
}

async function ensureSeeded() {
  // Auto-seed the DB with demo data on first run
  await SeedApi.seed();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      // First ensure DB is seeded
      await ensureSeeded();

      // Try to restore session from JWT
      const token = localStorage.getItem('dhs_token');
      if (token) {
        const { data, error } = await AuthApi.me();
        if (data?.user && !error) {
          setUser({ ...data.user, initials: makeInitials(data.user.name) });
        } else {
          clearToken();
        }
      }
      setIsLoading(false);
    };
    init();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await AuthApi.login(email, password);
    if (error || !data) return { success: false, error: error || 'Login failed' };

    saveToken(data.token);
    const u = { ...data.user, initials: makeInitials(data.user.name) };
    saveSession(u);
    setUser(u);
    return { success: true };
  }, []);

  const signup = useCallback(async (signupData: { name: string; email: string; password: string; hospital: string; role: string }) => {
    const { data, error } = await AuthApi.signup(signupData);
    if (error || !data) return { success: false, error: error || 'Signup failed' };

    saveToken(data.token);
    const u2 = { ...data.user, initials: makeInitials(data.user.name) };
    saveSession(u2);
    setUser(u2);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    clearToken();
  }, []);

  return (
    <AuthCtx.Provider value={{ user, isAuthenticated: !!user, isLoading, login, signup, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() { return useContext(AuthCtx); }
