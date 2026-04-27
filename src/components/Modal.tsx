'use client';
import { useEffect, useRef, ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  width?: number;
  footer?: ReactNode;
}

export default function Modal({ open, onClose, title, children, width = 520, footer }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      style={{ position:'fixed',inset:0,zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:16 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div style={{ position:'absolute',inset:0,background:'rgba(0,0,0,0.65)',backdropFilter:'blur(4px)' }} />
      {/* Dialog */}
      <div ref={ref} style={{
        position:'relative',width:'100%',maxWidth:width,maxHeight:'90vh',
        background:'var(--bg-card)',border:'1px solid var(--border-2)',
        borderRadius:14,boxShadow:'0 24px 80px rgba(0,0,0,0.5)',
        display:'flex',flexDirection:'column',animation:'modalIn 0.2s ease',
      }}>
        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 20px',borderBottom:'1px solid var(--border)' }}>
          <h2 style={{ fontSize:15,fontWeight:700,color:'var(--text-primary)',margin:0 }}>{title}</h2>
          <button onClick={onClose} style={{ background:'none',border:'none',cursor:'pointer',color:'var(--text-muted)',display:'flex',padding:4,borderRadius:6 }}>
            <X size={18} />
          </button>
        </div>
        <div style={{ padding:20,overflowY:'auto',flex:1 }}>{children}</div>
        {footer && (
          <div style={{ padding:'14px 20px',borderTop:'1px solid var(--border)',display:'flex',justifyContent:'flex-end',gap:8 }}>
            {footer}
          </div>
        )}
      </div>
      <style>{`@keyframes modalIn{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}
