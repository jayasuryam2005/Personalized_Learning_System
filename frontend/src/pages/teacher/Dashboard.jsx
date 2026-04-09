import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { StatCard, Card, ProgressBar, Badge, Avatar, PageHeader, Icon } from '../../components/UI';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const { db, getPathProgress } = useApp();

  const myStudents = db.users.filter(u => u.role === 'student' && u.teacherId === user.id);
  const myPaths    = db.paths.filter(p => p.teacherId === user.id);
  const myRes      = db.resources.filter(r => r.uploadedBy === user.id);
  const pendingMsgs = db.messages.filter(m => m.to === user.id && !m.read).length;

  const avgCompletion = myStudents.length && myPaths[0]
    ? Math.round(myStudents.reduce((a, s) => a + getPathProgress(s.id, myPaths[0].id), 0) / myStudents.length)
    : 0;

  return (
    <div className="page" style={{ padding: 32 }}>
      <PageHeader
        title={`Welcome, ${user.name.split(' ')[0]} 👋`}
        subtitle={`${user.subject} · ${myStudents.length} students enrolled`} />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard label="Students"       value={myStudents.length} icon="users"  color="#6366f1" />
        <StatCard label="Learning Paths" value={myPaths.length}    icon="book"   color="#10b981" />
        <StatCard label="Avg Completion" value={`${avgCompletion}%`} icon="chart" color="#f59e0b" />
        <StatCard label="Resources"      value={myRes.length}      icon="upload" color="#8b5cf6" />
        <StatCard label="Pending Messages" value={pendingMsgs}     icon="chat"   color="#ef4444" sub="Unread" />
      </div>

      {/* Student progress table */}
      <Card style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--t1)', fontFamily: 'Syne, sans-serif', marginBottom: 20 }}>Student Progress Overview</h3>
        {myStudents.length === 0 ? (
          <p style={{ color: 'var(--t3)' }}>No students assigned yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {myStudents.map(student => {
              const prog    = myPaths[0] ? getPathProgress(student.id, myPaths[0].id) : 0;
              const platform = db.platforms.find(p => p.studentId === student.id);
              const lastRec  = db.progress.filter(p => p.studentId === student.id).sort((a, b) => (b.lastActive || '').localeCompare(a.lastActive || ''))[0];
              const unread   = db.messages.filter(m => m.from === student.id && m.to === user.id && !m.read).length;
              return (
                <div key={student.id} style={{
                  background: 'var(--bg)', borderRadius: 14, padding: '16px 20px',
                  border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
                }}>
                  <Avatar user={student} size={44} />
                  <div style={{ flex: 1, minWidth: 150 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--t1)' }}>{student.name}</span>
                      {unread > 0 && <Badge text={`${unread} new msg`} color="#ef4444" />}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 3 }}>
                      {student.batch} · Last active: {lastRec?.lastActive || 'Never'}
                    </div>
                  </div>
                  <div style={{ flex: 2, minWidth: 180 }}>
                    <ProgressBar value={prog} color="#6366f1" />
                  </div>
                  <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: '#f59e0b' }}>{platform?.leetcode.solved || 0}</div>
                      <div style={{ fontSize: 10, color: 'var(--t3)' }}>LeetCode</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: '#10b981' }}>{platform?.skillrack.score || 0}</div>
                      <div style={{ fontSize: 10, color: 'var(--t3)' }}>SkillRack</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: '#ef4444' }}>{platform?.leetcode.streak || 0}🔥</div>
                      <div style={{ fontSize: 10, color: 'var(--t3)' }}>Streak</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Announcements sent */}
      <Card>
        <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--t1)', fontFamily: 'Syne, sans-serif', marginBottom: 16 }}>My Announcements</h3>
        {db.announcements.filter(a => a.from === user.id).length === 0
          ? <p style={{ color: 'var(--t3)', fontSize: 14 }}>No announcements yet. Post one from the Announcements page.</p>
          : db.announcements.filter(a => a.from === user.id).map(a => (
            <div key={a.id} style={{ background: 'var(--bg)', borderRadius: 12, padding: 14, marginBottom: 10, border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>{a.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--t2)', marginTop: 4 }}>{a.body}</div>
                </div>
                <span style={{ fontSize: 11, color: 'var(--t3)', whiteSpace: 'nowrap' }}>{a.date}</span>
              </div>
            </div>
          ))
        }
      </Card>
    </div>
  );
}
