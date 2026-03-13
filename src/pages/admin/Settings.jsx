import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PageHeader, Card, Btn, Toast } from '../../components/UI';
import { resetDb } from '../../utils/storage';

export default function AdminSettings() {
  const { update } = useApp();
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const handleReset = () => {
    if (!window.confirm('Reset ALL data to defaults? This cannot be undone.')) return;
    const fresh = resetDb();
    update(() => fresh);
    showToast('Data reset to defaults.', 'info');
  };

  return (
    <div className="page" style={{ padding: 32 }}>
      <PageHeader title="Settings" subtitle="Platform configuration and data management" />

      <Card style={{ maxWidth: 540 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--t1)', fontFamily: 'Syne, sans-serif', marginBottom: 8 }}>Data Management</h3>
        <p style={{ color: 'var(--t3)', fontSize: 14, marginBottom: 20 }}>
          All data is stored in your browser's localStorage. You can clear all student and teacher data at any time.
        </p>
        <Btn onClick={handleReset} variant="danger" icon="refresh">Reset to Default Data</Btn>
      </Card>

      <Card style={{ maxWidth: 540, marginTop: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--t1)', fontFamily: 'Syne, sans-serif', marginBottom: 8 }}>About</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            ['Project', 'SkillPath – SIH Problem Statement 1615'],
            ['Version', '1.0.0'],
            ['Storage', 'Browser localStorage (no backend)'],
            ['Framework', 'React 18 + React Router v6'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', gap: 12 }}>
              <span style={{ fontSize: 13, color: 'var(--t3)', minWidth: 90 }}>{k}</span>
              <span style={{ fontSize: 13, color: 'var(--t1)', fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </div>
      </Card>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
