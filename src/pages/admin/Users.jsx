import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { PageHeader, Card, Badge, Avatar, Btn, Input, Select, Toast, Empty, Icon } from '../../components/UI';

const ROLE_COLOR = { teacher: '#6366f1', student: '#10b981' };

export default function AdminUsers() {
  const { db, addUser, deleteUser } = useApp();
  const { user: currentUser } = useAuth();
  const [filter, setFilter]       = useState('all');
  const [search, setSearch]       = useState('');
  const [showAdd, setShowAdd]     = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [toast, setToast]         = useState(null);
  const [form, setForm]           = useState({ name: '', email: '', password: '', role: 'student', subject: '', teacherId: '', batch: '' });

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };
  const teachers = db.users.filter(u => u.role === 'teacher');

  const filtered = db.users
    .filter(u => filter === 'all' || u.role === filter)
    .filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = () => {
    if (!form.name.trim() || !form.email.trim() || !form.password.trim())
      return showToast('Name, email and password are required.', 'error');
    if (db.users.find(u => u.email === form.email))
      return showToast('Email already exists.', 'error');
    addUser({ ...form, avatar: form.name.charAt(0).toUpperCase(), teacherId: form.role === 'student' ? Number(form.teacherId) : undefined });
    setForm({ name: '', email: '', password: '', role: 'student', subject: '', teacherId: '', batch: '' });
    setShowAdd(false);
    showToast(`${form.role === 'student' ? 'Student' : 'Teacher'} account created!`);
  };

  const handleDelete = (userId) => {
    deleteUser(userId);
    setConfirmId(null);
    showToast('User deleted.', 'info');
  };

  const confirmUser = db.users.find(u => u.id === confirmId);

  return (
    <div className="page" style={{ padding: 32 }}>

      {/* Delete modal */}
      {confirmId && confirmUser && (
        <div style={{ position: 'fixed', inset: 0, background: '#00000088', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: 'var(--card)', borderRadius: 20, padding: 32, maxWidth: 420, width: '100%', border: '1px solid #ef444433' }}>
            <div style={{ width: 50, height: 50, borderRadius: 14, background: '#ef444422', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <Icon name="trash" size={22} color="#ef4444" />
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--t1)', fontFamily: 'Syne, sans-serif', marginBottom: 8 }}>Delete Account?</h3>
            <p style={{ color: 'var(--t2)', fontSize: 14, lineHeight: 1.6, marginBottom: 6 }}>Permanently delete <strong style={{ color: 'var(--t1)' }}>{confirmUser.name}</strong>'s account.</p>
            <p style={{ color: '#ef4444', fontSize: 13, marginBottom: 24 }}>All associated messages, progress, and data will also be removed. This cannot be undone.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <Btn onClick={() => handleDelete(confirmId)} variant="danger" size="md" icon="trash" style={{ flex: 1 }}>Delete</Btn>
              <Btn onClick={() => setConfirmId(null)} variant="ghost" size="md" style={{ flex: 1 }}>Cancel</Btn>
            </div>
          </div>
        </div>
      )}

      <PageHeader title="User Management" subtitle="Create and manage student & teacher accounts"
        actions={
          <div style={{ display: 'flex', gap: 10 }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
              style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: '9px 14px', color: 'var(--t1)', fontSize: 13, outline: 'none', width: 200, transition: 'border-color .2s' }}
              onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            <Btn onClick={() => setShowAdd(s => !s)} icon={showAdd ? 'x' : 'plus'}>{showAdd ? 'Cancel' : 'Create Account'}</Btn>
          </div>
        } />

      {/* Create form */}
      {showAdd && (
        <Card style={{ marginBottom: 24, border: '1px solid #6366f133' }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--t1)', fontFamily: 'Syne, sans-serif', marginBottom: 6 }}>Create New Account</h3>
          <p style={{ fontSize: 13, color: 'var(--t3)', marginBottom: 20 }}>The user will use these credentials to log in.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(210px,1fr))', gap: 14, marginBottom: 16 }}>
            <Input label="Full Name" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Ravi Kumar" />
            <Input label="Email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="user@college.edu" />
            <Input label="Password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} type="password" placeholder="Set a password" />
            <Select label="Role" value={form.role} onChange={e => setForm({ ...form, role: e.target.value, teacherId: '', subject: '', batch: '' })}
              options={[{ value: 'student', label: 'Student' }, { value: 'teacher', label: 'Teacher' }]} />
            {form.role === 'teacher' && (
              <Input label="Subject" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="e.g. Web Development" />
            )}
            {form.role === 'student' && (
              <>
                <Select label="Assign Teacher" value={form.teacherId} onChange={e => setForm({ ...form, teacherId: e.target.value })}
                  options={[{ value: '', label: teachers.length ? 'Select teacher…' : 'No teachers yet' }, ...teachers.map(t => ({ value: String(t.id), label: t.name }))]} />
                <Input label="Batch / Class" value={form.batch} onChange={e => setForm({ ...form, batch: e.target.value })} placeholder="e.g. CS-2024" />
              </>
            )}
          </div>
          <Btn onClick={handleAdd} icon="check">Create Account</Btn>
        </Card>
      )}

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        {['all', 'student', 'teacher'].map(r => (
          <button key={r} onClick={() => setFilter(r)}
            style={{ padding: '8px 18px', borderRadius: 10, border: `1px solid ${filter === r ? '#6366f1' : 'var(--border)'}`, background: filter === r ? '#6366f122' : 'transparent', color: filter === r ? '#6366f1' : 'var(--t3)', cursor: 'pointer', fontSize: 13, fontWeight: 700, textTransform: 'capitalize', transition: 'all .15s' }}>
            {r} <span style={{ opacity: 0.6, fontSize: 11 }}>
              ({r === 'all' ? db.users.length : db.users.filter(u => u.role === r).length})
            </span>
          </button>
        ))}
        <span style={{ fontSize: 13, color: 'var(--t3)', marginLeft: 'auto' }}>{filtered.length} account{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Empty state */}
      {db.users.length === 0 && (
        <Card style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>👥</div>
          <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--t1)', fontFamily: 'Syne, sans-serif', marginBottom: 8 }}>No accounts yet</h3>
          <p style={{ color: 'var(--t3)', fontSize: 14, marginBottom: 20 }}>Create student and teacher accounts so they can log in.</p>
          <Btn onClick={() => setShowAdd(true)} icon="plus">Create First Account</Btn>
        </Card>
      )}

      {/* User cards */}
      {filtered.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 14 }}>
          {filtered.map(u => {
            const teacher = u.role === 'student' ? db.users.find(t => t.id === u.teacherId) : null;
            const color   = ROLE_COLOR[u.role] || '#64748b';
            return (
              <div key={u.id}
                style={{ background: 'var(--card)', border: `1px solid ${color}22`, borderRadius: 16, padding: 20, display: 'flex', alignItems: 'flex-start', gap: 14, transition: 'border-color .2s, transform .15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}55`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = `${color}22`; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <Avatar user={u} size={46} />
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--t1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.email}</div>
                    </div>
                    <button onClick={() => setConfirmId(u.id)} title="Delete account"
                      style={{ background: 'transparent', border: '1px solid #ef444433', borderRadius: 8, padding: '5px 7px', cursor: 'pointer', color: '#ef4444', transition: 'background .15s', flexShrink: 0 }}
                      onMouseEnter={e => e.currentTarget.style.background = '#ef444422'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <Icon name="trash" size={14} />
                    </button>
                  </div>
                  {u.subject && <div style={{ fontSize: 12, color: '#6366f1', marginTop: 5, fontWeight: 600 }}>{u.subject}</div>}
                  {teacher   && <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 3 }}>Teacher: {teacher.name}</div>}
                  {u.batch   && <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 3 }}>Batch: {u.batch}</div>}
                  <div style={{ marginTop: 10 }}><Badge text={u.role} color={color} /></div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filtered.length === 0 && db.users.length > 0 && (
        <Empty emoji="🔍" title="No matches" sub="Try a different search or filter." />
      )}

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
