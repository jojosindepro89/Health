'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Users, Stethoscope, FlaskConical,
  Pill, CreditCard, ShieldCheck, BedDouble, BarChart3,
  Settings, LogOut, Activity,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/lib/toast';

const routes = [
  { group: 'MAIN', items: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Patient Registration', icon: Users, path: '/patients' },
    { label: 'Clinics & Consultation', icon: Stethoscope, path: '/clinics' },
  ]},
  { group: 'SERVICES', items: [
    { label: 'Laboratory', icon: FlaskConical, path: '/laboratory' },
    { label: 'Pharmacy', icon: Pill, path: '/pharmacy' },
    { label: 'Finance & Payments', icon: CreditCard, path: '/finance' },
  ]},
  { group: 'MANAGEMENT', items: [
    { label: 'HMO Management', icon: ShieldCheck, path: '/hmo', adminOnly: true },
    { label: 'Wards & Bed Mgmt', icon: BedDouble, path: '/wards' },
    { label: 'Reports & Analytics', icon: BarChart3, path: '/reports', adminOnly: true },
  ]},
  { group: 'ACCOUNT', items: [
    { label: 'User Profile & Settings', icon: Settings, path: '/profile' },
  ]},
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser } = useStore();
  const { logout, user } = useAuth();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast('success', 'You have been logged out successfully');
    router.push('/login');
  };

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Activity size={18} color="white" />
        </div>
        <div>
          <div className="sidebar-logo-text">DHS Hospital</div>
          <div className="sidebar-logo-sub">Workspace UI</div>
        </div>
      </div>

      {/* User badge */}
      {user && (
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: 'var(--primary-muted)', borderRadius: 8, border: '1px solid rgba(13,148,136,0.2)' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'white', flexShrink: 0 }}>
              {user.initials}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
              <div style={{ fontSize: 10, color: 'var(--primary-light)', textTransform: 'capitalize' }}>{user.role.replace('_', ' ')}</div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
        {routes.map(group => {
          const visibleItems = group.items.filter(item =>
            !item.adminOnly || currentUser.role === 'super_admin'
          );
          if (visibleItems.length === 0) return null;

          return (
            <div key={group.group} className="sidebar-section">
              <div className="sidebar-section-label">{group.group}</div>
              {visibleItems.map(item => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`sidebar-item${isActive ? ' active' : ''}`}
                  >
                    <item.icon size={16} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <button
          className="sidebar-item"
          style={{ width: '100%', background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}
          onClick={handleLogout}
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
