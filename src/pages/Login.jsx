import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Icon } from '../components/UI';

export default function Login() {
  const { login } = useAuth();
  const [role, setRole]         = useState('student');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPw, setShowPw]     = useState(false);

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) { setError('Please enter your email and password.'); return; }
    setLoading(true); setError('');
    setTimeout(() => {
      const result = login(email.trim(), password, role);
      if (!result.ok) setError(result.error);
      setLoading(false);
    }, 500);
  };

  const ROLES = [
    { id: 'student', label: 'Student', hint: 'Use credentials created by your admin.' },
    { id: 'teacher', label: 'Teacher', hint: 'Use credentials created by your admin.' },
    { id: 'admin',   label: 'Admin',   hint: 'Email: admin@skillpath.com  ·  Password: admin@123' },
  ];

  const inp = (extra = {}) => ({
    width: '100%', boxSizing: 'border-box',
    background: '#020817', border: '1px solid #1e293b',
    borderRadius: 11, padding: '12px 16px', color: '#f1f5f9',
    fontSize: 14, outline: 'none', transition: 'border-color .2s', ...extra,
  });

  return (
    <div style={{ minHeight: '100vh', background: '#020817', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans, sans-serif', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle,#6366f118 0%,transparent 70%)', top: -300, left: -300, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,#10b98115 0%,transparent 70%)', bottom: -200, right: -200, pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 440, background: 'linear-gradient(145deg,#0f172a,#111827)', border: '1px solid #1e293b', borderRadius: 28, padding: '44px 40px', boxShadow: '0 40px 80px #00000077', position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ width: 68, height: 68, borderRadius: 20, margin: '0 auto 16px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 28px #6366f155' }}>
            <Icon name="book" size={32} color="#fff" />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#f1f5f9', fontFamily: 'Syne, sans-serif', letterSpacing: '-0.5px', margin: 0 }}>SkillPath</h1>
          <p style={{ color: '#64748b', fontSize: 13, marginTop: 6 }}>Learning Path Dashboard</p>
        </div>

        {/* Role tabs */}
        <div style={{ display: 'flex', background: '#020817', borderRadius: 12, padding: 4, marginBottom: 18, gap: 4 }}>
          {ROLES.map(r => (
            <button key={r.id} onClick={() => { setRole(r.id); setEmail(''); setPassword(''); setError(''); }}
              style={{ flex: 1, padding: '9px 0', borderRadius: 9, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, transition: 'all .2s', background: role === r.id ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'transparent', color: role === r.id ? '#fff' : '#64748b', boxShadow: role === r.id ? '0 2px 12px #6366f144' : 'none' }}>
              {r.label}
            </button>
          ))}
        </div>

        {/* Hint banner */}
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 10, padding: '10px 14px', marginBottom: 22, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <Icon name="alert" size={14} color="#6366f1" />
          <span style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>{ROLES.find(r => r.id === role)?.hint}</span>
        </div>

        {/* Inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 16 }}>
          <div>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: 13, fontWeight: 600, marginBottom: 7 }}>Email Address</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="your@email.com"
              style={inp()} onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = '#1e293b'}
              onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          </div>
          <div>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: 13, fontWeight: 600, marginBottom: 7 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input value={password} onChange={e => setPassword(e.target.value)} type={showPw ? 'text' : 'password'} placeholder="••••••••"
                style={inp({ paddingRight: 44 })} onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = '#1e293b'}
                onKeyDown={e => e.key === 'Enter' && handleLogin()} />
              <button onClick={() => setShowPw(s => !s)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}>
                <Icon name="eye" size={17} />
              </button>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: '#ef444418', border: '1px solid #ef444433', borderRadius: 10, padding: '10px 14px', marginBottom: 14, color: '#f87171', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="alert" size={14} color="#f87171" /> {error}
          </div>
        )}

        {/* Submit */}
        <button onClick={handleLogin} disabled={loading}
          style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: 13, color: '#fff', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.75 : 1, transition: 'all .2s', boxShadow: '0 4px 18px #6366f144', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          {loading && <span style={{ width: 16, height: 16, border: '2px solid #ffffff55', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />}
          {loading ? 'Signing in…' : 'Sign In →'}
        </button>

        {role !== 'admin' && (
          <p style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: '#475569' }}>
            No credentials? Contact your administrator to create your account.
          </p>
        )}
      </div>
    </div>
  );
}
