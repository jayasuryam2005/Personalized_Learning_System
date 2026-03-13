import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';

// ─── localStorage helpers ─────────────────────────────────────────────────────
const LS_KEY = (uid) => `skillpath_coding_${uid}`;
const saveProfiles = (uid, data) => localStorage.setItem(LS_KEY(uid), JSON.stringify(data));
const loadProfiles = (uid) => {
  try {
    const raw = localStorage.getItem(LS_KEY(uid));
    return raw ? JSON.parse(raw) : { leetcodeUsername: '', skillrackUrl: '' };
  } catch { return { leetcodeUsername: '', skillrackUrl: '' }; }
};

// ─── Tiny SVG icon ────────────────────────────────────────────────────────────
const Ico = ({ d, size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {(Array.isArray(d) ? d : d.split('|')).map((p, i) => <path key={i} d={p} />)}
  </svg>
);

const D = {
  edit:    ["M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7", "M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"],
  save:    ["M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z", "M17 21v-8H7v8", "M7 3v5h8"],
  refresh: ["M23 4v6h-6", "M1 20v-6h6", "M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"],
  link:    ["M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71", "M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"],
  check:   ["M20 6L9 17l-5-5"],
  alert:   ["M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z", "M12 9v4", "M12 17h.01"],
  trophy:  ["M6 9H4.5a2.5 2.5 0 010-5H6", "M18 9h1.5a2.5 2.5 0 000-5H18", "M4 22h16", "M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22", "M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22", "M18 2H6v7a6 6 0 0012 0V2z"],
  code:    ["M16 18l6-6-6-6", "M8 6l-6 6 6 6"],
  flame:   ["M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"],
  x:       ["M18 6L6 18", "M6 6l12 12"],
  star:    ["M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"],
  eye:     ["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z", "M12 9a3 3 0 100 6 3 3 0 000-6z"],
  user:    ["M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2", "M12 3a4 4 0 100 8 4 4 0 000-8z"],
  settings:["M12 15a3 3 0 100-6 3 3 0 000 6z", "M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"],
};

// ─── Spinner ──────────────────────────────────────────────────────────────────
const Spinner = ({ color = '#6366f1', size = 20 }) => (
  <div style={{
    width: size, height: size, border: `2.5px solid ${color}33`,
    borderTopColor: color, borderRadius: '50%',
    animation: 'cp-spin .7s linear infinite', flexShrink: 0,
  }} />
);

// ─── Circular Ring ────────────────────────────────────────────────────────────
const Ring = ({ pct = 0, color = '#6366f1', size = 90, stroke = 8 }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(pct, 100) / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1e293b" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1.1s ease' }} />
    </svg>
  );
};

// ─── Stat Pill ────────────────────────────────────────────────────────────────
const Pill = ({ label, value, color }) => (
  <div style={{ flex: 1, minWidth: 72, background: `${color}15`, border: `1px solid ${color}30`, borderRadius: 12, padding: '10px 12px', textAlign: 'center' }}>
    <div style={{ fontSize: 19, fontWeight: 800, color, letterSpacing: '-0.5px' }}>{value ?? '—'}</div>
    <div style={{ fontSize: 10, color: '#64748b', marginTop: 3, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
  </div>
);

// ─── LeetCode Card ────────────────────────────────────────────────────────────
function LeetCodeCard({ username, onEdit }) {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [lastFetch, setLastFetch] = useState('');

  const fetchStats = useCallback(async () => {
    if (!username) return;
    setLoading(true); setError(''); setStats(null);
    try {
      const res = await fetch(`https://leetcode-stats-api.herokuapp.com/${username.trim()}`);
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      if (data.status === 'error') throw new Error('Username not found on LeetCode.');
      setStats(data);
      setLastFetch(new Date().toLocaleTimeString());
    } catch (e) {
      // Fallback API
      try {
        const r2 = await fetch(`https://alfa-leetcode-api.onrender.com/userProfile/${username.trim()}`);
        if (!r2.ok) throw new Error('Fallback failed');
        const d2 = await r2.json();
        if (!d2.totalSolved && !d2.username) throw new Error('No data');
        setStats({
          totalSolved:  d2.totalSolved || 0,
          easySolved:   d2.easySolved  || 0,
          mediumSolved: d2.mediumSolved|| 0,
          hardSolved:   d2.hardSolved  || 0,
          ranking:      d2.ranking     || null,
          contributionPoints: d2.contributionPoint || null,
          acceptanceRate: null,
        });
        setLastFetch(new Date().toLocaleTimeString());
      } catch {
        setError(`Could not fetch stats for "${username}". Make sure your username is correct and public.`);
      }
    }
    setLoading(false);
  }, [username]);

  useEffect(() => { if (username) fetchStats(); }, [fetchStats]);

  const totalProblems = 3368;
  const solvedPct = stats ? Math.min(Math.round((stats.totalSolved / totalProblems) * 100), 100) : 0;

  return (
    <div style={{ background: 'linear-gradient(150deg,#0f172a 0%,#12181f 100%)', border: '1px solid #f59e0b33', borderRadius: 24, padding: 28, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle,#f59e0b14 0%,transparent 70%)', pointerEvents: 'none' }} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 46, height: 46, borderRadius: 14, background: '#f59e0b18', border: '1px solid #f59e0b33', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Ico d={D.code} size={22} color="#f59e0b" />
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: '#f1f5f9', fontFamily: 'Syne, sans-serif' }}>LeetCode</div>
            <div style={{ fontSize: 13, marginTop: 2, fontWeight: 600, color: username ? '#f59e0b' : '#475569' }}>
              {username ? `@${username}` : 'Not connected'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {username && (
            <button onClick={fetchStats} disabled={loading} title="Refresh stats"
              style={{ width: 36, height: 36, borderRadius: 10, background: '#f59e0b18', border: '1px solid #f59e0b33', color: '#f59e0b', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s', opacity: loading ? 0.6 : 1 }}>
              {loading ? <Spinner color="#f59e0b" size={15} /> : <Ico d={D.refresh} size={16} color="#f59e0b" />}
            </button>
          )}
          <button onClick={onEdit} title="Edit username"
            style={{ width: 36, height: 36, borderRadius: 10, background: '#1e293b', border: '1px solid #334155', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#f59e0b'; e.currentTarget.style.borderColor = '#f59e0b55'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = '#334155'; }}>
            <Ico d={D.edit} size={16} />
          </button>
        </div>
      </div>

      {/* Empty state */}
      {!username && (
        <div style={{ textAlign: 'center', padding: '32px 0' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🏆</div>
          <div style={{ color: '#64748b', fontSize: 14, marginBottom: 16 }}>Connect your LeetCode account to see live stats</div>
          <button onClick={onEdit} style={{ padding: '10px 22px', background: 'linear-gradient(135deg,#f59e0b,#d97706)', border: 'none', borderRadius: 11, color: '#000', fontWeight: 800, fontSize: 13, cursor: 'pointer' }}>
            + Add Username
          </button>
        </div>
      )}

      {/* Loading */}
      {username && loading && !stats && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '32px 0' }}>
          <Spinner color="#f59e0b" size={24} />
          <span style={{ color: '#64748b', fontSize: 14 }}>Fetching your LeetCode stats…</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: '#ef444415', border: '1px solid #ef444433', borderRadius: 12, padding: '13px 16px', marginTop: 4 }}>
          <Ico d={D.alert} size={17} color="#f87171" />
          <div>
            <div style={{ fontSize: 13, color: '#f87171', fontWeight: 700, marginBottom: 3 }}>Failed to load stats</div>
            <div style={{ fontSize: 12, color: '#f87171aa' }}>{error}</div>
          </div>
        </div>
      )}

      {/* Stats */}
      {stats && !loading && (
        <div style={{ animation: 'cp-fadeUp .4s ease' }}>
          {/* Ring + headline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <Ring pct={solvedPct} color="#f59e0b" size={92} stroke={8} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: 21, fontWeight: 900, color: '#f1f5f9', lineHeight: 1 }}>{stats.totalSolved}</div>
                <div style={{ fontSize: 9, color: '#64748b', fontWeight: 700, letterSpacing: '0.5px' }}>SOLVED</div>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 10 }}>of ~{totalProblems.toLocaleString()} total problems</div>
              {stats.ranking && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
                  <Ico d={D.trophy} size={14} color="#f59e0b" />
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>Global Rank</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#f1f5f9' }}>#{Number(stats.ranking).toLocaleString()}</span>
                </div>
              )}
              {stats.contributionPoints != null && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <Ico d={D.star} size={14} color="#f59e0b" />
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>Contribution</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#f1f5f9' }}>{stats.contributionPoints}</span>
                </div>
              )}
              {lastFetch && <div style={{ fontSize: 11, color: '#334155', marginTop: 8 }}>Updated {lastFetch}</div>}
            </div>
          </div>

          {/* Difficulty pills */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <Pill label="Easy"   value={stats.easySolved}   color="#10b981" />
            <Pill label="Medium" value={stats.mediumSolved} color="#f59e0b" />
            <Pill label="Hard"   value={stats.hardSolved}   color="#ef4444" />
          </div>

          {/* Acceptance */}
          {stats.acceptanceRate != null && (
            <div style={{ background: '#1e293b', borderRadius: 10, padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <span style={{ fontSize: 13, color: '#64748b' }}>Acceptance Rate</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#10b981' }}>{Number(stats.acceptanceRate).toFixed(1)}%</span>
            </div>
          )}

          {/* Profile link */}
          <a href={`https://leetcode.com/u/${username}`} target="_blank" rel="noreferrer"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '11px', background: '#f59e0b18', border: '1px solid #f59e0b33', borderRadius: 12, color: '#f59e0b', fontWeight: 700, fontSize: 13, textDecoration: 'none', transition: 'all .15s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#f59e0b28'}
            onMouseLeave={e => e.currentTarget.style.background = '#f59e0b18'}>
            <Ico d={D.eye} size={15} color="#f59e0b" /> View LeetCode Profile
          </a>
        </div>
      )}
    </div>
  );
}

// ─── SkillRack Card ───────────────────────────────────────────────────────────
function SkillRackCard({ url, onEdit }) {
  const extractId = (u) => { try { return u.match(/id=(\d+)/)?.[1] || null; } catch { return null; } };
  const profileId  = url ? extractId(url) : null;
  const isValid    = url && url.includes('skillrack.com');

  return (
    <div style={{ background: 'linear-gradient(150deg,#0f172a 0%,#0d1f18 100%)', border: '1px solid #10b98133', borderRadius: 24, padding: 28, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle,#10b98114 0%,transparent 70%)', pointerEvents: 'none' }} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 46, height: 46, borderRadius: 14, background: '#10b98118', border: '1px solid #10b98133', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Ico d={D.trophy} size={22} color="#10b981" />
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: '#f1f5f9', fontFamily: 'Syne, sans-serif' }}>SkillRack</div>
            <div style={{ fontSize: 13, marginTop: 2, fontWeight: 600, color: url ? '#10b981' : '#475569' }}>
              {profileId ? `Profile ID: ${profileId}` : url ? 'Custom URL' : 'Not connected'}
            </div>
          </div>
        </div>
        <button onClick={onEdit} title="Edit profile URL"
          style={{ width: 36, height: 36, borderRadius: 10, background: '#1e293b', border: '1px solid #334155', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#10b981'; e.currentTarget.style.borderColor = '#10b98155'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = '#334155'; }}>
          <Ico d={D.edit} size={16} />
        </button>
      </div>

      {!url ? (
        <div style={{ textAlign: 'center', padding: '32px 0' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🎯</div>
          <div style={{ color: '#64748b', fontSize: 14, marginBottom: 16 }}>Link your SkillRack profile to track your progress</div>
          <button onClick={onEdit} style={{ padding: '10px 22px', background: 'linear-gradient(135deg,#10b981,#059669)', border: 'none', borderRadius: 11, color: '#fff', fontWeight: 800, fontSize: 13, cursor: 'pointer' }}>
            + Add Profile URL
          </button>
        </div>
      ) : (
        <div style={{ animation: 'cp-fadeUp .4s ease' }}>
          {/* API notice */}
          <div style={{ background: '#1e293b', borderRadius: 12, padding: '12px 16px', marginBottom: 18, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>ℹ️</span>
            <span style={{ fontSize: 12, color: '#64748b', lineHeight: 1.7 }}>SkillRack doesn't provide a public API. Your profile link is saved — click "View Profile" to see your stats directly on SkillRack.</span>
          </div>

          {/* URL box */}
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: '11px 16px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Ico d={D.link} size={14} color="#10b981" />
            <span style={{ fontSize: 12, color: '#475569', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{url}</span>
          </div>

          {/* Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: isValid ? '#10b98115' : '#ef444415', border: `1px solid ${isValid ? '#10b98130' : '#ef444430'}`, borderRadius: 11, padding: '10px 14px', marginBottom: 16 }}>
            {isValid
              ? <><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} /><span style={{ fontSize: 13, color: '#10b981', fontWeight: 600 }}>Profile linked successfully</span></>
              : <><Ico d={D.alert} size={15} color="#f87171" /><span style={{ fontSize: 13, color: '#f87171' }}>URL may not be a valid SkillRack link</span></>
            }
          </div>

          {/* Info grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
            {[
              { k: 'Platform', v: 'SkillRack' },
              { k: 'Profile ID', v: profileId || '—' },
            ].map(s => (
              <div key={s.k} style={{ background: '#0f172a', borderRadius: 10, padding: '11px 14px' }}>
                <div style={{ fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 5 }}>{s.k}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#f1f5f9' }}>{s.v}</div>
              </div>
            ))}
          </div>

          {/* View button */}
          <a href={url} target="_blank" rel="noreferrer"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '11px', background: '#10b98118', border: '1px solid #10b98133', borderRadius: 12, color: '#10b981', fontWeight: 700, fontSize: 13, textDecoration: 'none', transition: 'all .15s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#10b98128'}
            onMouseLeave={e => e.currentTarget.style.background = '#10b98118'}>
            <Ico d={D.eye} size={15} color="#10b981" /> View SkillRack Profile
          </a>
        </div>
      )}
    </div>
  );
}

// ─── Edit / Settings Modal ────────────────────────────────────────────────────
function SettingsModal({ profiles, onSave, onClose }) {
  const [lc, setLc]   = useState(profiles.leetcodeUsername || '');
  const [sr, setSr]   = useState(profiles.skillrackUrl || '');
  const [errs, setErrs] = useState({});

  const validate = () => {
    const e = {};
    if (lc.includes(' '))            e.lc = 'Username cannot contain spaces.';
    if (sr && !sr.startsWith('http')) e.sr = 'Please enter a full URL starting with https://';
    setErrs(e);
    return !Object.keys(e).length;
  };

  const iStyle = {
    width: '100%', background: '#020817', border: '1px solid #1e293b',
    borderRadius: 11, padding: '12px 16px', color: '#f1f5f9', fontSize: 14,
    outline: 'none', transition: 'border-color .2s', boxSizing: 'border-box',
  };

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position: 'fixed', inset: 0, background: '#000000cc', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: 'linear-gradient(145deg,#0f172a,#111827)', border: '1px solid #1e293b', borderRadius: 26, padding: 36, width: '100%', maxWidth: 500, boxShadow: '0 40px 80px #00000099', animation: 'cp-fadeUp .3s ease' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Ico d={D.settings} size={20} color="#6366f1" />
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9', fontFamily: 'Syne, sans-serif', margin: 0 }}>Profile Settings</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', padding: 4 }}>
            <Ico d={D.x} size={20} />
          </button>
        </div>

        {/* LeetCode field */}
        <div style={{ marginBottom: 22 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 700, color: '#f59e0b', marginBottom: 9 }}>
            <Ico d={D.code} size={14} color="#f59e0b" /> LeetCode Username
          </label>
          <input value={lc} onChange={e => setLc(e.target.value)} placeholder="e.g. vicky_07_"
            style={iStyle}
            onFocus={e => e.target.style.borderColor = '#f59e0b'}
            onBlur={e => e.target.style.borderColor = '#1e293b'} />
          {errs.lc && <div style={{ color: '#f87171', fontSize: 12, marginTop: 5 }}>{errs.lc}</div>}
          <div style={{ fontSize: 12, color: '#334155', marginTop: 6 }}>
            From: <span style={{ color: '#64748b' }}>leetcode.com/u/</span><span style={{ color: '#f59e0b', fontWeight: 700 }}>your-username</span>
          </div>
        </div>

        {/* SkillRack field */}
        <div style={{ marginBottom: 30 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 700, color: '#10b981', marginBottom: 9 }}>
            <Ico d={D.trophy} size={14} color="#10b981" /> SkillRack Profile URL
          </label>
          <input value={sr} onChange={e => setSr(e.target.value)}
            placeholder="https://www.skillrack.com/faces/resume.xhtml?id=..."
            style={iStyle}
            onFocus={e => e.target.style.borderColor = '#10b981'}
            onBlur={e => e.target.style.borderColor = '#1e293b'} />
          {errs.sr && <div style={{ color: '#f87171', fontSize: 12, marginTop: 5 }}>{errs.sr}</div>}
          <div style={{ fontSize: 12, color: '#334155', marginTop: 6 }}>Paste the full URL from your SkillRack resume page</div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => { if (validate()) onSave({ leetcodeUsername: lc.trim(), skillrackUrl: sr.trim() }); }}
            style={{ flex: 1, padding: '13px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: 13, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 14px #6366f133' }}>
            <Ico d={D.save} size={16} color="#fff" /> Save Changes
          </button>
          <button onClick={onClose}
            style={{ padding: '13px 20px', background: 'transparent', border: '1px solid #1e293b', borderRadius: 13, color: '#64748b', fontSize: 14, cursor: 'pointer', fontWeight: 600 }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function CodingProfiles() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState(() => loadProfiles(user.id));
  const [showModal, setShowModal] = useState(false);
  const [saved, setSaved]         = useState(false);

  const handleSave = (data) => {
    setProfiles(data);
    saveProfiles(user.id, data);
    setShowModal(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  };

  const connected = [
    !!profiles.leetcodeUsername,
    !!profiles.skillrackUrl,
  ].filter(Boolean).length;

  return (
    <>
      <style>{`
        @keyframes cp-spin    { to { transform: rotate(360deg); } }
        @keyframes cp-fadeUp  { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes cp-pop     { 0%{transform:scale(.92);opacity:0} 100%{transform:scale(1);opacity:1} }
      `}</style>

      <div className="page" style={{ padding: 32 }}>

        {/* Page header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', fontFamily: 'Syne, sans-serif', letterSpacing: '-0.5px', margin: 0 }}>
              Coding Profiles
            </h1>
            <p style={{ color: '#64748b', fontSize: 14, marginTop: 6 }}>
              Connect your accounts — stats refresh automatically
            </p>
          </div>
          <button onClick={() => setShowModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '11px 22px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: 13, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 14px #6366f133' }}>
            <Ico d={D.settings} size={16} color="#fff" /> Profile Settings
          </button>
        </div>

        {/* Success toast */}
        {saved && (
          <div style={{ background: '#10b98120', border: '1px solid #10b98133', borderRadius: 13, padding: '12px 18px', marginBottom: 22, display: 'flex', alignItems: 'center', gap: 10, animation: 'cp-pop .3s ease' }}>
            <Ico d={D.check} size={17} color="#10b981" />
            <span style={{ fontSize: 14, color: '#10b981', fontWeight: 700 }}>Profile settings saved to localStorage!</span>
          </div>
        )}

        {/* Connection status bar */}
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 16, padding: '16px 22px', marginBottom: 26, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
          <div style={{ display: 'flex', align: 'center', gap: 20, flexWrap: 'wrap' }}>
            {[
              { label: 'LeetCode', active: !!profiles.leetcodeUsername, val: profiles.leetcodeUsername ? `@${profiles.leetcodeUsername}` : 'Not set', color: '#f59e0b' },
              { label: 'SkillRack', active: !!profiles.skillrackUrl, val: profiles.skillrackUrl ? 'Linked ✓' : 'Not set', color: '#10b981' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <div style={{ width: 9, height: 9, borderRadius: '50%', background: s.active ? s.color : '#334155', boxShadow: s.active ? `0 0 8px ${s.color}88` : 'none' }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: s.active ? s.color : '#475569' }}>{s.label}:</span>
                <span style={{ fontSize: 13, color: s.active ? '#94a3b8' : '#334155' }}>{s.val}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 13, color: '#334155', fontWeight: 600 }}>
            {connected}/2 platforms connected
          </div>
        </div>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 24, marginBottom: 28 }}>
          <LeetCodeCard username={profiles.leetcodeUsername} onEdit={() => setShowModal(true)} />
          <SkillRackCard url={profiles.skillrackUrl} onEdit={() => setShowModal(true)} />
        </div>

        {/* Help section */}
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 18, padding: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#94a3b8', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>💡</span> How to find your profile info
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 14 }}>
            <div style={{ background: '#020817', borderRadius: 13, padding: 18, borderLeft: '3px solid #f59e0b' }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#f59e0b', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 7 }}>
                <Ico d={D.code} size={14} color="#f59e0b" /> LeetCode Username
              </div>
              <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.8 }}>
                1. Go to <span style={{ color: '#f59e0b' }}>leetcode.com</span><br />
                2. Click your profile photo → Profile<br />
                3. Copy username from URL:<br />
                <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#94a3b8' }}>leetcode.com/u/<strong style={{ color: '#f59e0b' }}>username</strong></span>
              </div>
            </div>
            <div style={{ background: '#020817', borderRadius: 13, padding: 18, borderLeft: '3px solid #10b981' }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#10b981', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 7 }}>
                <Ico d={D.trophy} size={14} color="#10b981" /> SkillRack Profile URL
              </div>
              <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.8 }}>
                1. Go to <span style={{ color: '#10b981' }}>skillrack.com</span><br />
                2. Login → Dashboard → Resume<br />
                3. Copy full URL from browser bar<br />
                <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#94a3b8' }}>skillrack.com/faces/resume.xhtml?id=...</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <SettingsModal profiles={profiles} onSave={handleSave} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
