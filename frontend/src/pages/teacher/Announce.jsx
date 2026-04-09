import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { PageHeader, Card, Badge, Btn, Input, Toast, Empty } from '../../components/UI';

export default function TeacherAnnounce() {
  const { user } = useAuth();
  const { db, addAnnouncement } = useApp();
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({ title: '', body: '', priority: 'medium' });

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const handlePost = () => {
    if (!form.title.trim() || !form.body.trim()) return showToast('Title and body required.', 'error');
    addAnnouncement({ ...form, from: user.id, date: new Date().toISOString().split('T')[0] });
    setForm({ title: '', body: '', priority: 'medium' });
    showToast('Announcement posted!');
  };

  const myAnn = db.announcements.filter(a => a.from === user.id);
  const pColor = { high: '#ef4444', medium: '#f59e0b', low: '#6366f1' };

  return (
    <div className="page" style={{ padding: 32 }}>
      <PageHeader title="Announcements" subtitle="Broadcast messages to all your students" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <Card>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--t1)', fontFamily: 'Syne, sans-serif', marginBottom: 20 }}>New Announcement</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input label="Title" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Announcement subject…" />
            <div>
              <label style={{ display: 'block', color: 'var(--t2)', fontSize: 13, fontWeight: 600, marginBottom: 7 }}>Message</label>
              <textarea value={form.body} onChange={e => setForm({ ...form, body: e.target.value })}
                rows={5} placeholder="Write your announcement here…"
                style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '11px 15px', color: 'var(--t1)', fontSize: 14, outline: 'none', resize: 'vertical', transition: 'border-color .2s' }}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--t2)', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Priority</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {['low', 'medium', 'high'].map(p => (
                  <button key={p} onClick={() => setForm({ ...form, priority: p })}
                    style={{ flex: 1, padding: '9px', borderRadius: 9, border: `1px solid ${form.priority === p ? pColor[p] : 'var(--border)'}`, background: form.priority === p ? `${pColor[p]}18` : 'transparent', color: form.priority === p ? pColor[p] : 'var(--t3)', cursor: 'pointer', fontSize: 13, fontWeight: 700, textTransform: 'capitalize', transition: 'all .15s' }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <Btn onClick={handlePost} icon="bell" size="lg">Post Announcement</Btn>
          </div>
        </Card>

        <Card>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--t1)', fontFamily: 'Syne, sans-serif', marginBottom: 18 }}>Posted Announcements</h3>
          {myAnn.length === 0 ? (
            <Empty emoji="📢" title="No announcements yet" sub="Post your first one on the left." />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 520, overflowY: 'auto' }}>
              {myAnn.map(a => (
                <div key={a.id} style={{ background: 'var(--bg)', borderRadius: 12, padding: 16, border: `1px solid ${a.priority === 'high' ? '#ef444433' : 'var(--border)'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>{a.title}</span>
                    <Badge text={a.priority} color={pColor[a.priority]} />
                  </div>
                  <p style={{ margin: 0, color: 'var(--t2)', fontSize: 13, lineHeight: 1.6 }}>{a.body}</p>
                  <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 8 }}>{a.date}</div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
