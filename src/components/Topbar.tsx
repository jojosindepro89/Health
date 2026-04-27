'use client';
import { Bell, Search, Settings } from 'lucide-react';
import { useToast } from '@/lib/toast';

interface TopbarProps {
  title: string;
  subtitle?: string;
}

export default function Topbar({ title, subtitle }: TopbarProps) {
  const { toast } = useToast();

  return (
    <header className="topbar">
      <div>
        <div className="topbar-title">{title}</div>
        {subtitle && <div className="topbar-breadcrumb">{subtitle}</div>}
      </div>

      <div className="topbar-search">
        <Search size={14} color="var(--text-muted)" />
        <input placeholder="Search patients, records, staff..." />
      </div>

      <div className="topbar-actions">
        <div className="icon-btn" onClick={() => toast('info', 'Opening Settings...')}>
          <Settings size={15} />
        </div>
        <div className="icon-btn" onClick={() => toast('info', 'You have 4 new alerts')}>
          <Bell size={15} />
          <span className="notif-dot" />
        </div>
        <div className="avatar" onClick={() => toast('success', 'Profile loaded')}>AD</div>
      </div>
    </header>
  );
}
