'use client';
import AppLayout from '@/components/AppLayout';
import { Settings, User, Bell, Shield, Key, Camera } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { useToast } from '@/lib/toast';

const tabs = ['Profile', 'Security', 'Notifications', 'Preferences'];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('Profile');
  const { currentUser, setCurrentUser } = useStore();
  const { toast } = useToast();

  const handleRoleToggle = () => {
    const newRole = currentUser.role === 'super_admin' ? 'front_desk' : 'super_admin';
    setCurrentUser({
      name: newRole === 'super_admin' ? 'Admin DHS' : 'Front Desk User',
      role: newRole
    });
    toast('success', `Switched role to ${newRole === 'super_admin' ? 'Super Admin' : 'Front Desk'}`);
  };

  return (
    <AppLayout title="User Profile & Settings" subtitle="Manage your account details and preferences">
      <div className="page-title" style={{ marginBottom: 20 }}>Account Settings</div>
      
      <div className="card" style={{ marginBottom: 20, border: '1px solid var(--primary)', background: 'var(--primary-muted)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--primary-light)' }}>Development Role Testing</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              Currently logged in as: <strong style={{ color: 'var(--text-primary)' }}>{currentUser.role === 'super_admin' ? 'Super Admin' : 'Front Desk'}</strong>
            </div>
          </div>
          <button className="btn btn-primary" onClick={handleRoleToggle}>
            Switch to {currentUser.role === 'super_admin' ? 'Front Desk' : 'Super Admin'}
          </button>
        </div>
      </div>

      <div className="tabs">
        {tabs.map(t => (
          <div key={t} className={`tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
            {t}
          </div>
        ))}
      </div>

      {activeTab === 'Profile' && (
        <div className="grid-3-1">
          <div className="card">
            <div className="card-title" style={{ marginBottom: 20 }}>Personal Information</div>
            <div className="form-row" style={{ marginBottom: 16 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">First Name</label>
                <input className="form-input" defaultValue="Admin" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Last Name</label>
                <input className="form-input" defaultValue="DHS" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" defaultValue="admin@dhshospital.ng" type="email" />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input className="form-input" defaultValue="+234 801 234 5678" />
            </div>
            <div className="form-group">
              <label className="form-label">Department</label>
              <select className="form-input">
                <option>Administration</option>
                <option>Clinical</option>
                <option>Finance</option>
                <option>IT</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <input className="form-input" defaultValue="System Administrator" readOnly style={{ opacity: 0.7 }} />
            </div>
            <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea className="form-input" rows={3} defaultValue="Hospital system administrator managing DHS Workspace." style={{ resize: 'vertical' }} />
            </div>
            <button className="btn btn-primary">Save Changes</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, color: 'white', margin: '0 auto 12px' }}>AD</div>
              <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>Admin DHS</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>System Administrator</div>
              <button className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                <Camera size={13} /> Change Photo
              </button>
            </div>

            <div className="card">
              <div className="card-title" style={{ marginBottom: 14 }}>Account Summary</div>
              {[
                { label: 'Member Since', value: 'Jan 2023' },
                { label: 'Last Login', value: 'Today, 08:45 AM' },
                { label: 'Active Sessions', value: '1' },
                { label: 'Account Status', value: 'Active' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: item.value === 'Active' ? 'var(--success)' : 'var(--text-primary)' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Security' && (
        <div className="card" style={{ maxWidth: 540 }}>
          <div className="card-title" style={{ marginBottom: 20 }}>Change Password</div>
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <input className="form-input" type="password" placeholder="Enter current password" />
          </div>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input className="form-input" type="password" placeholder="Enter new password" />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <input className="form-input" type="password" placeholder="Confirm new password" />
          </div>
          <hr className="divider" />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Two-Factor Authentication</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Add an extra layer of security to your account</div>
            </div>
            <div style={{ width: 44, height: 24, background: 'var(--border)', borderRadius: 12, cursor: 'pointer', position: 'relative' }}>
              <div style={{ width: 18, height: 18, background: 'white', borderRadius: '50%', position: 'absolute', top: 3, left: 3 }} />
            </div>
          </div>
          <button className="btn btn-primary">Update Password</button>
        </div>
      )}

      {activeTab === 'Notifications' && (
        <div className="card" style={{ maxWidth: 540 }}>
          <div className="card-title" style={{ marginBottom: 20 }}>Notification Preferences</div>
          {[
            { label: 'New Patient Registration', desc: 'Get notified when a new patient is registered', on: true },
            { label: 'Lab Results Ready', desc: 'Alert when lab results are available', on: true },
            { label: 'Low Pharmacy Stock', desc: 'Alert when drug stock drops below reorder level', on: true },
            { label: 'HMO Pre-Auth Updates', desc: 'Approval / rejection notifications', on: false },
            { label: 'Daily Revenue Summary', desc: 'End-of-day financial summary email', on: true },
            { label: 'System Maintenance', desc: 'Scheduled downtime and updates', on: false },
          ].map(n => (
            <div key={n.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{n.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{n.desc}</div>
              </div>
              <div style={{ width: 44, height: 24, background: n.on ? 'var(--primary)' : 'var(--border)', borderRadius: 12, cursor: 'pointer', position: 'relative', flexShrink: 0 }}>
                <div style={{ width: 18, height: 18, background: 'white', borderRadius: '50%', position: 'absolute', top: 3, left: n.on ? 23 : 3, transition: 'left 0.2s' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Preferences' && (
        <div className="card" style={{ maxWidth: 540 }}>
          <div className="card-title" style={{ marginBottom: 20 }}>System Preferences</div>
          <div className="form-group">
            <label className="form-label">Language</label>
            <select className="form-input"><option>English</option><option>Yoruba</option><option>Hausa</option><option>Igbo</option></select>
          </div>
          <div className="form-group">
            <label className="form-label">Time Zone</label>
            <select className="form-input"><option>Africa/Lagos (GMT+1)</option><option>UTC</option></select>
          </div>
          <div className="form-group">
            <label className="form-label">Date Format</label>
            <select className="form-input"><option>DD/MM/YYYY</option><option>MM/DD/YYYY</option><option>YYYY-MM-DD</option></select>
          </div>
          <div className="form-group">
            <label className="form-label">Currency</label>
            <select className="form-input"><option>Nigerian Naira (₦)</option><option>USD ($)</option></select>
          </div>
          <button className="btn btn-primary">Save Preferences</button>
        </div>
      )}
    </AppLayout>
  );
}
