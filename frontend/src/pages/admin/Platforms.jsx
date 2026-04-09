import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PageHeader, Card, Badge, Avatar, Icon, Btn, Toast } from '../../components/UI';

export default function AdminPlatforms() {
  const { db, updatePlatform } = useApp();
  const [toast, setToast]   = useState(null);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({});

  const students = db.users.filter(u => u.role === 'student');
  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const startEdit = (studentId) => {
    const plt = db.platforms.find(p => p.studentId === studentId);
    if (plt) { setEditing(studentId); setEditForm(JSON.parse(JSON.stringify(plt))); }
  };

  const saveEdit = () => {
    updatePlatform(editing, editForm);
    setEditing(null);
    showToast('Platform stats updated!');
  };

  const numInput = (val, onChange) => (
    <input type="number" value={val} onChange={onChange}
      style={{ width: 70, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 10px', color: 'var(--t1)', fontSize: 13, outline: 'none', textAlign: 'center' }}
      onFocus={e => e.target.style.borderColor = '#6366f1'}
      onBlur={e => e.target.style.borderColor = 'var(--border)'} />
  );

  return (
    <div className="page" style={{ padding: 32 }}>
      <PageHeader title="Platform Analytics" subtitle="LeetCode · SkillRack · CodeChef performance across all students" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {students.map(student => {
          const plt = db.platforms.find(p => p.studentId === student.id);
          if (!plt) return null;
          const isEditing = editing === student.id;
          const data = isEditing ? editForm : plt;

          return (
            <Card key={student.id}>
              {/* Student header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <Avatar user={student} size={46} />
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--t1)', fontFamily: 'Syne, sans-serif' }}>{student.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--t3)', marginTop: 2 }}>{student.batch} · {student.email}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  {isEditing ? (
                    <>
                      <Btn onClick={saveEdit} variant="success" size="sm" icon="check">Save</Btn>
                      <Btn onClick={() => setEditing(null)} variant="ghost" size="sm" icon="x">Cancel</Btn>
                    </>
                  ) : (
                    <Btn onClick={() => startEdit(student.id)} variant="outline" size="sm" icon="edit">Edit Stats</Btn>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 16 }}>
                {/* LeetCode */}
                <div style={{ background: 'var(--bg)', borderRadius: 14, padding: 18, border: '1px solid #f59e0b33' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 9, background: '#f59e0b18', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}><Icon name="code" size={17} /></div>
                    <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--t1)' }}>LeetCode</span>
                  </div>
                  {isEditing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {[['solved','Solved'],['easy','Easy'],['medium','Medium'],['hard','Hard'],['streak','Streak']].map(([k,l]) => (
                        <div key={k} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: 13, color: 'var(--t2)' }}>{l}</span>
                          {numInput(editForm.leetcode[k], e => setEditForm(f => ({ ...f, leetcode: { ...f.leetcode, [k]: Number(e.target.value) } })))}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div style={{ fontSize: 32, fontWeight: 800, color: '#f59e0b', marginBottom: 6 }}>{data.leetcode.solved}</div>
                      <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 12 }}>Problems Solved</div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                        <Badge text={`E: ${data.leetcode.easy}`} color="#10b981" />
                        <Badge text={`M: ${data.leetcode.medium}`} color="#f59e0b" />
                        <Badge text={`H: ${data.leetcode.hard}`} color="#ef4444" />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#ef4444', fontWeight: 700 }}>
                        <Icon name="flame" size={15} />{data.leetcode.streak} day streak
                      </div>
                    </>
                  )}
                </div>

                {/* SkillRack */}
                <div style={{ background: 'var(--bg)', borderRadius: 14, padding: 18, border: '1px solid #10b98133' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 9, background: '#10b98118', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}><Icon name="trophy" size={17} /></div>
                    <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--t1)' }}>SkillRack</span>
                  </div>
                  {isEditing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {[['score','Score'],['problems','Problems']].map(([k,l]) => (
                        <div key={k} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: 13, color: 'var(--t2)' }}>{l}</span>
                          {numInput(editForm.skillrack[k], e => setEditForm(f => ({ ...f, skillrack: { ...f.skillrack, [k]: Number(e.target.value) } })))}
                        </div>
                      ))}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 13, color: 'var(--t2)' }}>Badge</span>
                        <select value={editForm.skillrack.badge} onChange={e => setEditForm(f => ({ ...f, skillrack: { ...f.skillrack, badge: e.target.value } }))}
                          style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 10px', color: 'var(--t1)', fontSize: 13, outline: 'none' }}>
                          {['Bronze','Silver','Gold','Platinum'].map(b => <option key={b}>{b}</option>)}
                        </select>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div style={{ fontSize: 32, fontWeight: 800, color: '#10b981', marginBottom: 6 }}>{data.skillrack.score}</div>
                      <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 12 }}>Total Score</div>
                      <Badge text={data.skillrack.badge} color={data.skillrack.badge === 'Gold' ? '#f59e0b' : data.skillrack.badge === 'Silver' ? '#94a3b8' : '#cd7f32'} />
                      <div style={{ fontSize: 13, color: 'var(--t3)', marginTop: 10 }}>{data.skillrack.problems} problems solved</div>
                    </>
                  )}
                </div>

                {/* CodeChef */}
                <div style={{ background: 'var(--bg)', borderRadius: 14, padding: 18, border: '1px solid #8b5cf633' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 9, background: '#8b5cf618', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6' }}><Icon name="star" size={17} /></div>
                    <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--t1)' }}>CodeChef</span>
                  </div>
                  {isEditing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {[['rating','Rating'],['stars','Stars (1-5)']].map(([k,l]) => (
                        <div key={k} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: 13, color: 'var(--t2)' }}>{l}</span>
                          {numInput(editForm.codechef[k], e => setEditForm(f => ({ ...f, codechef: { ...f.codechef, [k]: Number(e.target.value) } })))}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div style={{ fontSize: 32, fontWeight: 800, color: '#8b5cf6', marginBottom: 6 }}>{data.codechef.rating}</div>
                      <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 12 }}>Rating</div>
                      <div style={{ color: '#f59e0b', fontSize: 20 }}>{'★'.repeat(data.codechef.stars)}{'☆'.repeat(5 - data.codechef.stars)}</div>
                    </>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
