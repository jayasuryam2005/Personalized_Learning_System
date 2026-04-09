import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { StatCard, Card, ProgressBar, Badge, PageHeader, Icon } from '../../components/UI';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { db, getPathProgress, getTotalTime } = useApp();

  const myPath   = db.paths.find(p => p.teacherId === user.teacherId);
  const progress = db.progress.filter(p => p.studentId === user.id);
  const platform = db.platforms.find(p => p.studentId === user.id);
  const teacher  = db.users.find(u => u.id === user.teacherId);
  const overall  = myPath ? getPathProgress(user.id, myPath.id) : 0;
  const totalTime = getTotalTime(user.id);
  const announcements = db.announcements.filter(a => {
    const t = db.users.find(u => u.id === a.from);
    return t?.id === user.teacherId;
  });

  return (
    <div className="page" style={{ padding: 32 }}>

      {/* Welcome banner */}
      <div style={{
        background: 'linear-gradient(135deg,#6366f118,#8b5cf618)',
        border: '1px solid #6366f130', borderRadius: 20, padding: '28px 32px',
        marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16,
      }}>
        <div>
          <div style={{ fontSize: 12, color: '#6366f1', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: 6 }}>Welcome back 👋</div>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: 'var(--t1)', fontFamily: 'Syne, sans-serif', letterSpacing: '-0.4px' }}>{user.name}</h2>
          <p style={{ color: 'var(--t3)', marginTop: 6, fontSize: 14 }}>
            You're <strong style={{ color: '#6366f1' }}>{overall}%</strong> through your learning path. Keep going!
          </p>
          {teacher && <p style={{ color: 'var(--t3)', fontSize: 13, marginTop: 4 }}>Instructor: <span style={{ color: 'var(--t2)' }}>{teacher.name}</span> — {teacher.subject}</p>}
        </div>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          {[
            { label: 'Day Streak 🔥', value: platform?.leetcode.streak || 0, color: '#ef4444' },
            { label: 'LeetCode Solved', value: platform?.leetcode.solved || 0, color: '#f59e0b' },
            { label: 'SkillRack Score', value: platform?.skillrack.score || 0, color: '#10b981' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'var(--card)', borderRadius: 14, padding: '14px 20px', border: '1px solid var(--border)', textAlign: 'center', minWidth: 90 }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stat row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard label="Hours Studied"    value={`${totalTime}h`}          icon="chart"  color="#6366f1" sub="Cumulative" />
        <StatCard label="Overall Progress" value={`${overall}%`}            icon="star"   color="#10b981" sub={myPath?.title || '—'} />
        <StatCard label="SkillRack Badge"  value={platform?.skillrack.badge || '—'} icon="trophy" color="#f59e0b" sub={`${platform?.skillrack.problems || 0} problems`} />
        <StatCard label="CodeChef Rating"  value={platform?.codechef.rating || 0} icon="code"   color="#8b5cf6" sub={`${'★'.repeat(platform?.codechef.stars || 0)}`} />
      </div>

      {/* Learning path */}
      {myPath ? (
        <Card accent={myPath.color} style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ fontSize: 36 }}>{myPath.emoji}</div>
              <div>
                <h3 style={{ fontSize: 19, fontWeight: 800, color: 'var(--t1)', fontFamily: 'Syne, sans-serif' }}>{myPath.title}</h3>
                <p style={{ color: 'var(--t3)', fontSize: 13, marginTop: 3 }}>{myPath.description}</p>
              </div>
            </div>
            <Badge text={`${myPath.totalHours}h total`} color={myPath.color} />
          </div>
          <ProgressBar value={overall} color={myPath.color} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
            {myPath.modules.map((mod, i) => {
              const rec = progress.find(p => p.moduleId === mod.id);
              const pct = rec?.pct || 0;
              return (
                <div key={mod.id} style={{
                  background: 'var(--bg)', borderRadius: 12, padding: '14px 18px',
                  border: `1px solid ${pct === 100 ? '#10b98133' : 'var(--border)'}`,
                  display: 'flex', alignItems: 'center', gap: 14,
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: pct === 100 ? '#10b98122' : pct > 0 ? `${myPath.color}22` : 'var(--hover)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: pct === 100 ? '#10b981' : pct > 0 ? myPath.color : 'var(--t3)',
                    fontWeight: 800, fontSize: 14,
                  }}>
                    {pct === 100 ? <Icon name="check" size={16} /> : i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>{mod.title}</span>
                      <span style={{ fontSize: 12, color: 'var(--t3)' }}>{mod.hours}h</span>
                    </div>
                    <ProgressBar value={pct} color={pct === 100 ? '#10b981' : myPath.color} label={false} height={6} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: pct === 100 ? '#10b981' : myPath.color, minWidth: 34, textAlign: 'right' }}>{pct}%</span>
                </div>
              );
            })}
          </div>
        </Card>
      ) : (
        <Card style={{ marginBottom: 24, textAlign: 'center', padding: '40px 24px' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📚</div>
          <div style={{ color: 'var(--t2)', fontWeight: 700 }}>No learning path assigned yet.</div>
          <div style={{ color: 'var(--t3)', fontSize: 13, marginTop: 6 }}>Your instructor will assign one soon.</div>
        </Card>
      )}

      {/* Announcements */}
      <Card>
        <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--t1)', fontFamily: 'Syne, sans-serif', marginBottom: 18 }}>📢 Announcements</h3>
        {announcements.length === 0 && <p style={{ color: 'var(--t3)', fontSize: 14 }}>No announcements yet.</p>}
        {announcements.map(a => {
          const pColor = a.priority === 'high' ? '#ef4444' : a.priority === 'medium' ? '#f59e0b' : '#6366f1';
          return (
            <div key={a.id} style={{ background: 'var(--bg)', borderRadius: 12, padding: 16, marginBottom: 10, border: `1px solid ${a.priority === 'high' ? '#ef444433' : 'var(--border)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>{a.title}</span>
                    <Badge text={a.priority} color={pColor} />
                  </div>
                  <p style={{ margin: 0, color: 'var(--t2)', fontSize: 13, lineHeight: 1.6 }}>{a.body}</p>
                </div>
                <span style={{ fontSize: 11, color: 'var(--t3)', whiteSpace: 'nowrap' }}>{a.date}</span>
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}
