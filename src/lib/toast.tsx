'use client';
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';
interface Toast { id: number; type: ToastType; message: string; }
interface ToastCtx { toast: (type: ToastType, message: string) => void; }

const Ctx = createContext<ToastCtx>({ toast: () => {} });

const icons = { success: CheckCircle2, error: XCircle, warning: AlertCircle, info: Info };
const colors = { success: 'var(--success)', error: 'var(--danger)', warning: 'var(--warning)', info: 'var(--info)' };

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toast = useCallback((type: ToastType, message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);
  const remove = (id: number) => setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {toasts.map(t => {
          const Icon = icons[t.type];
          return (
            <div key={t.id} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
              background: 'var(--bg-card)', border: `1px solid ${colors[t.type]}40`,
              borderLeft: `3px solid ${colors[t.type]}`, borderRadius: 10,
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)', minWidth: 280, maxWidth: 380,
              animation: 'slideIn 0.25s ease',
            }}>
              <Icon size={16} color={colors[t.type]} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: 'var(--text-primary)', flex: 1 }}>{t.message}</span>
              <button onClick={() => remove(t.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}>
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
      <style>{`@keyframes slideIn{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:none}}`}</style>
    </Ctx.Provider>
  );
}

export function useToast() { return useContext(Ctx); }
