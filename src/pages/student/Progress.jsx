import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { PageHeader, Card, ProgressBar, Badge, Btn, Toast } from '../../components/UI';

export default function StudentProgress() {
  const { user } = useAuth();
  const { db, updateProgress, getPathProgress } = useApp();
  const [toast, setToast] = useState(null);

  const myPath  = db.paths.find(p => p.teacherId === user.teacherId);
  const overall = myPath ? getPathProgress(user.id, myPath.id) : 0;

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const handleSlider = (moduleId, val) => {
    updateProgress(user.id, myPath.id, moduleId, Number(val));
    showToast('Progress updated!');
  };

  if (!myPath) return (
    <div className="page" style={{ padding: 32 }}>
      <PageHeader title="My Progress" subtitle="Track your learning journey" />
      <Card><p style={{ color: 'var(--t3)' }}>No learning path assigned yet.</p></Card>
    </div>
  );

  return (
    <div className="page" style={{ padding: 32 }}>
      <PageHeader title="My Progress" subtitle="Update and track your learning journey" />

      {/* Overall */}
      <Card accent={myPath.color} style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 36, marginBottom: 8 }}>{myPath.emoji}</div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--t1)', fontFamily: 'Syne, sans-serif' }}>{myPath.title}</h3>
            <p style={{ color: 'var(--t3)', fontSize: 13, marginTop: 4 }}>{myPath.description}</p>
          </div>
          <div style={{ textAlign: 'center', background: 'var(--bg)', borderRadius: 16, padding: '18px 28px', border: `1px solid ${myPath.color}33` }}>
            <div style={{ fontSize: 40, fontWeight: 800, color: myPath.color }}>{overall}%</div>
            <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 4 }}>Overall Complete</div>
          </div>
        </div>
        <ProgressBar value={overall} color={myPath.color} />
      </Card>

      {/* Per-module sliders */}
      <Card>
        <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--t1)', fontFamily: 'Syne, sans-serif', marginBottom: 20 }}>Module Progress</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          {myPath.modules.map((mod) => {
            const rec = db.progress.find(p => p.studentId === user.id && p.pathId === myPath.id && p.moduleId === mod.id);
            const pct = rec?.pct || 0;
            return (
              <div key={mod.id} style={{ background: 'var(--bg)', borderRadius: 14, padding: '18px 20px', border: `1px solid ${pct === 100 ? '#10b98133' : 'var(--border)'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--t1)' }}>{mod.title}</span>
                    <span style={{ fontSize: 12, color: 'var(--t3)', marginLeft: 10 }}>{mod.hours}h estimated</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {pct === 100 && <Badge text="Completed ✓" color="#10b981" />}
                    {pct > 0 && pct < 100 && <Badge text="In Progress" color="#f59e0b" />}
                    {pct === 0 && <Badge text="Not Started" color="#64748b" />}
                    <span style={{ fontSize: 18, fontWeight: 800, color: pct === 100 ? '#10b981' : myPath.color, minWidth: 42, textAlign: 'right' }}>{pct}%</span>
                  </div>
                </div>
                <ProgressBar value={pct} color={pct === 100 ? '#10b981' : myPath.color} label={false} />
                <div style={{ marginTop: 14 }}>
                  <input type="range" min="0" max="100" step="5" value={pct}
                    onChange={e => handleSlider(mod.id, e.target.value)}
                    style={{ width: '100%', accentColor: myPath.color, cursor: 'pointer', height: 4 }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--t3)', marginTop: 4 }}>
                    <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
                  </div>
                </div>
                {rec?.lastActive && (
                  <div style={{ marginTop: 10, fontSize: 12, color: 'var(--t3)' }}>Last updated: {rec.lastActive} · Time spent: {rec.timeSpent || 0}h</div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {toast && <Toast message={toast} type="success" onClose={() => setToast(null)} />}
    </div>
  );
}
