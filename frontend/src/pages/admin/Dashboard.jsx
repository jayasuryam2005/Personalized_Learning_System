import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard, Card, ProgressBar, Badge, Avatar, PageHeader, Icon } from '../../components/UI';

export default function AdminDashboard() {
  const { db, getPathProgress } = useApp();

  const students = db.users.filter(u => u.role === 'student');
  const teachers = db.users.filter(u => u.role === 'teacher');

  const totalLC = db.platforms.reduce((a, p) => a + p.leetcode.solved, 0);
  const totalSR = db.platforms.reduce((a, p) => a + p.skillrack.score, 0);
  const totalRes = db.resources.length;

  return (
    <div className="page" style={{ padding: 32 }}>
      <PageHeader title="Admin Overview" subtitle="Platform-wide analytics and performance" />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(185px,1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard label="Students"       value={students.length} icon="users"  color="#6366f1" />
        <StatCard label="Teachers"       value={teachers.length} icon="star"   color="#f59e0b" />
        <StatCard label="Learning Paths" value={db.paths.length} icon="book"   color="#10b981" />
        <StatCard label="Resources"      value={totalRes}        icon="upload" color="#8b5cf6" />
        <StatCard label="LeetCode Solved" value={totalLC}        icon="code"   color="#f59e0b" sub="All students" />
        <StatCard label="SkillRack Points" value={totalSR}       icon="trophy" color="#ef4444" sub="Combined" />
      </div>

      {/* All students table */}
      <Card style={{ marginBottom: 24, overflowX: 'auto' }}>
        <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--t1)', fontFamily: 'Syne, sans-serif', marginBottom: 20 }}>All Students — Performance Overview</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Student', 'Teacher', 'LeetCode', 'SkillRack', 'CodeChef', 'Streak', 'Path Progress'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontSize: 11, color: 'var(--t3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map(s => {
              const plt  = db.platforms.find(p => p.studentId === s.id);
              const tch  = db.users.find(u => u.id === s.teacherId);
              const path = db.paths.find(p => p.teacherId === s.teacherId);
              const prog = path ? getPathProgress(s.id, path.id) : 0;
              return (
                <tr key={s.id}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  style={{ borderBottom: '1px solid #0f172a', transition: 'background .12s' }}>
                  <td style={{ padding: '14px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar user={s} size={32} />
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>{s.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--t3)' }}>{s.batch}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 14px', fontSize: 13, color: 'var(--t2)' }}>{tch?.name}</td>
                  <td style={{ padding: '14px 14px' }}>
                    <div style={{ fontSize: 17, fontWeight: 800, color: '#f59e0b' }}>{plt?.leetcode.solved || 0}</div>
                    <div style={{ fontSize: 11, color: 'var(--t3)' }}>E:{plt?.leetcode.easy} M:{plt?.leetcode.medium} H:{plt?.leetcode.hard}</div>
                  </td>
                  <td style={{ padding: '14px 14px' }}>
                    <div style={{ fontSize: 17, fontWeight: 800, color: '#10b981' }}>{plt?.skillrack.score || 0}</div>
                    <Badge text={plt?.skillrack.badge || '—'} color={plt?.skillrack.badge === 'Gold' ? '#f59e0b' : plt?.skillrack.badge === 'Silver' ? '#94a3b8' : '#cd7f32'} />
                  </td>
                  <td style={{ padding: '14px 14px' }}>
                    <div style={{ fontSize: 17, fontWeight: 800, color: '#8b5cf6' }}>{plt?.codechef.rating || 0}</div>
                    <div style={{ color: '#f59e0b', fontSize: 13 }}>{'★'.repeat(plt?.codechef.stars || 0)}</div>
                  </td>
                  <td style={{ padding: '14px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#ef4444', fontWeight: 700 }}>
                      <Icon name="flame" size={14} />{plt?.leetcode.streak || 0}
                    </div>
                  </td>
                  <td style={{ padding: '14px 14px', minWidth: 150 }}>
                    <ProgressBar value={prog} color="#6366f1" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      {/* Teachers */}
      <Card>
        <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--t1)', fontFamily: 'Syne, sans-serif', marginBottom: 18 }}>Instructors</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
          {teachers.map(t => {
            const tStudents = students.filter(s => s.teacherId === t.id);
            const tPaths    = db.paths.filter(p => p.teacherId === t.id);
            const tRes      = db.resources.filter(r => r.uploadedBy === t.id);
            return (
              <div key={t.id} style={{ background: 'var(--bg)', borderRadius: 14, padding: 20, border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <Avatar user={t} size={44} />
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--t1)' }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: '#6366f1', marginTop: 2 }}>{t.subject}</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                  {[
                    { label: 'Students', value: tStudents.length, color: '#6366f1' },
                    { label: 'Paths',    value: tPaths.length,    color: '#10b981' },
                    { label: 'Resources', value: tRes.length,     color: '#f59e0b' },
                  ].map(s => (
                    <div key={s.label} style={{ textAlign: 'center', background: 'var(--card)', borderRadius: 10, padding: '10px 6px' }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
                      <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 2 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
