import React from 'react';

/* ─── Icon ─────────────────────────────────────────────────────────────────── */
const PATHS = {
  home:    "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z|M9 22V12h6v10",
  book:    "M4 19.5A2.5 2.5 0 016.5 17H20|M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z",
  users:   "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2|M23 21v-2a4 4 0 00-3-3.87|M16 3.13a4 4 0 010 7.75|M9 7a4 4 0 100 8 4 4 0 000-8z",
  chat:    "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",
  upload:  "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4|M17 8l-5-5-5 5|M12 3v12",
  chart:   "M18 20V10|M12 20V4|M6 20v-6",
  star:    "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  link:    "M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71|M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71",
  video:   "M23 7l-7 5 7 5V7z|M1 5h15a2 2 0 012 2v10a2 2 0 01-2 2H1V5z",
  pdf:     "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z|M14 2v6h6|M16 13H8|M16 17H8|M10 9H8",
  doc:     "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z|M14 2v6h6|M12 18v-6|M9 15l3 3 3-3",
  logout:  "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4|M16 17l5-5-5-5|M21 12H9",
  send:    "M22 2L11 13|M22 2l-7 20-4-9-9-4 20-7z",
  bell:    "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9|M13.73 21a2 2 0 01-3.46 0",
  check:   "M20 6L9 17l-5-5",
  plus:    "M12 5v14|M5 12h14",
  search:  "M21 21l-4.35-4.35|M17 11A6 6 0 115 11a6 6 0 0112 0z",
  trophy:  "M6 9H4.5a2.5 2.5 0 010-5H6|M18 9h1.5a2.5 2.5 0 000-5H18|M4 22h16|M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22|M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22|M18 2H6v7a6 6 0 0012 0V2z",
  code:    "M16 18l6-6-6-6|M8 6l-6 6 6 6",
  flame:   "M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z",
  menu:    "M3 12h18|M3 6h18|M3 18h18",
  x:       "M18 6L6 18|M6 6l12 12",
  eye:     "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z|M12 9a3 3 0 100 6 3 3 0 000-6z",
  edit:    "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7|M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  trash:   "M3 6h18|M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6|M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2",
  settings:"M12 15a3 3 0 100-6 3 3 0 000 6z|M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
  alert:   "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z|M12 9v4|M12 17h.01",
  download:"M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4|M7 10l5 5 5-5|M12 15V3",
  folder:  "M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z",
  refresh: "M23 4v6h-6|M1 20v-6h6|M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15",
};

export function Icon({ name, size = 18, color = 'currentColor', strokeWidth = 2 }) {
  const d = PATHS[name] || PATHS.alert;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0 }}>
      {d.split('|').map((p, i) => <path key={i} d={p} />)}
    </svg>
  );
}

/* ─── Avatar ───────────────────────────────────────────────────────────────── */
const ROLE_COLOR = { admin: '#f59e0b', teacher: '#6366f1', student: '#10b981' };
export function Avatar({ user, size = 36 }) {
  const c = ROLE_COLOR[user?.role] || '#6366f1';
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `linear-gradient(135deg,${c},${c}88)`,
      border: `2px solid ${c}44`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 800, fontSize: size * 0.38, flexShrink: 0,
    }}>
      {user?.avatar || '?'}
    </div>
  );
}

/* ─── Badge ────────────────────────────────────────────────────────────────── */
export function Badge({ text, color = '#6366f1' }) {
  return (
    <span style={{
      background: `${color}22`, color, border: `1px solid ${color}44`,
      borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700,
      letterSpacing: '0.5px', textTransform: 'uppercase', whiteSpace: 'nowrap',
    }}>{text}</span>
  );
}

/* ─── ProgressBar ──────────────────────────────────────────────────────────── */
export function ProgressBar({ value, color = '#6366f1', height = 8, label = true }) {
  return (
    <div style={{ width: '100%' }}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 12, color: 'var(--t3)' }}>Progress</span>
          <span style={{ fontSize: 12, fontWeight: 700, color }}>{value}%</span>
        </div>
      )}
      <div style={{ background: '#1e293b', borderRadius: 999, height, overflow: 'hidden' }}>
        <div style={{
          width: `${Math.min(value, 100)}%`,
          background: `linear-gradient(90deg,${color},${color}bb)`,
          height: '100%', borderRadius: 999,
          transition: 'width .6s ease',
          boxShadow: `0 0 8px ${color}55`,
        }} />
      </div>
    </div>
  );
}

/* ─── StatCard ─────────────────────────────────────────────────────────────── */
export function StatCard({ label, value, icon, color = '#6366f1', sub }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg,#0f172a,#1e293b)',
      border: `1px solid ${color}33`, borderRadius: 16, padding: '20px 22px',
      display: 'flex', gap: 16, alignItems: 'center',
      transition: 'transform .2s, box-shadow .2s', cursor: 'default',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${color}22`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', color,
      }}>
        <Icon name={icon} size={22} />
      </div>
      <div>
        <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--t1)', letterSpacing: '-0.5px' }}>{value}</div>
        <div style={{ fontSize: 13, color: 'var(--t3)', marginTop: 2 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color, marginTop: 3 }}>{sub}</div>}
      </div>
    </div>
  );
}

/* ─── Card ─────────────────────────────────────────────────────────────────── */
export function Card({ children, style = {}, accent }) {
  return (
    <div style={{
      background: 'var(--card)', borderRadius: 20, padding: 28,
      border: `1px solid ${accent ? `${accent}33` : 'var(--border)'}`,
      ...style,
    }}>
      {children}
    </div>
  );
}

/* ─── PageHeader ───────────────────────────────────────────────────────────── */
export function PageHeader({ title, subtitle, actions }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--t1)', letterSpacing: '-0.5px', fontFamily: 'Syne, sans-serif' }}>{title}</h1>
        {subtitle && <p style={{ color: 'var(--t3)', fontSize: 14, marginTop: 6 }}>{subtitle}</p>}
      </div>
      {actions && <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>{actions}</div>}
    </div>
  );
}

/* ─── Btn ──────────────────────────────────────────────────────────────────── */
export function Btn({ children, onClick, variant = 'primary', size = 'md', disabled, style = {}, icon }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    border: 'none', borderRadius: 12, cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: 700, transition: 'all .2s', opacity: disabled ? 0.55 : 1,
    fontFamily: 'DM Sans, sans-serif',
  };
  const sizes = { sm: { padding: '7px 14px', fontSize: 13 }, md: { padding: '11px 20px', fontSize: 14 }, lg: { padding: '14px 28px', fontSize: 15 } };
  const variants = {
    primary:  { background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', boxShadow: '0 4px 14px #6366f133' },
    success:  { background: 'linear-gradient(135deg,#10b981,#059669)', color: '#fff', boxShadow: '0 4px 14px #10b98133' },
    danger:   { background: 'linear-gradient(135deg,#ef4444,#dc2626)', color: '#fff', boxShadow: '0 4px 14px #ef444433' },
    ghost:    { background: 'transparent', color: 'var(--t2)', border: '1px solid var(--border)' },
    outline:  { background: 'transparent', color: '#6366f1', border: '1px solid #6366f155' },
  };
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.filter = 'brightness(1.1)'; }}
      onMouseLeave={e => { e.currentTarget.style.filter = ''; }}>
      {icon && <Icon name={icon} size={16} />}
      {children}
    </button>
  );
}

/* ─── Input ────────────────────────────────────────────────────────────────── */
export function Input({ label, value, onChange, placeholder, type = 'text', required }) {
  return (
    <div>
      {label && <label style={{ display: 'block', color: 'var(--t2)', fontSize: 13, fontWeight: 600, marginBottom: 7 }}>{label}{required && <span style={{ color: '#ef4444' }}> *</span>}</label>}
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder}
        style={{
          width: '100%', background: 'var(--bg)', border: '1px solid var(--border)',
          borderRadius: 10, padding: '11px 15px', color: 'var(--t1)', fontSize: 14,
          outline: 'none', transition: 'border-color .2s',
        }}
        onFocus={e => e.target.style.borderColor = '#6366f1'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
      />
    </div>
  );
}

/* ─── Select ───────────────────────────────────────────────────────────────── */
export function Select({ label, value, onChange, options, required }) {
  return (
    <div>
      {label && <label style={{ display: 'block', color: 'var(--t2)', fontSize: 13, fontWeight: 600, marginBottom: 7 }}>{label}{required && <span style={{ color: '#ef4444' }}> *</span>}</label>}
      <select value={value} onChange={onChange}
        style={{
          width: '100%', background: 'var(--bg)', border: '1px solid var(--border)',
          borderRadius: 10, padding: '11px 15px', color: value ? 'var(--t1)' : 'var(--t3)',
          fontSize: 14, outline: 'none', transition: 'border-color .2s', cursor: 'pointer',
        }}
        onFocus={e => e.target.style.borderColor = '#6366f1'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

/* ─── Empty State ──────────────────────────────────────────────────────────── */
export function Empty({ emoji = '📭', title, sub }) {
  return (
    <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--t3)' }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>{emoji}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--t2)', marginBottom: 6 }}>{title}</div>
      {sub && <div style={{ fontSize: 13 }}>{sub}</div>}
    </div>
  );
}

/* ─── Toast ────────────────────────────────────────────────────────────────── */
export function Toast({ message, type = 'success', onClose }) {
  const colors = { success: '#10b981', error: '#ef4444', info: '#6366f1' };
  const c = colors[type];
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      background: 'var(--card)', border: `1px solid ${c}55`,
      borderRadius: 14, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12,
      boxShadow: `0 8px 32px #00000066, 0 0 0 1px ${c}22`,
      animation: 'fadeUp .3s ease',
      maxWidth: 340,
    }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: c, flexShrink: 0 }} />
      <span style={{ fontSize: 14, color: 'var(--t1)', flex: 1 }}>{message}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--t3)', cursor: 'pointer', padding: 0 }}>
        <Icon name="x" size={16} />
      </button>
    </div>
  );
}
