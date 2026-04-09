import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { PageHeader, Card, Badge, Avatar, Btn, Input, Toast, Empty, Icon } from '../../components/UI';

const STEP_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
const STATUS_META = {
  pending:     { label: 'Pending',     color: '#64748b' },
  in_progress: { label: 'In Progress', color: '#f59e0b' },
  completed:   { label: 'Completed',   color: '#10b981' },
};

function RoadmapStep({ step, index, color, onUpdate, onDelete }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', position: 'relative' }}>
      {/* connector line */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${color}22`, border: `2px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, fontWeight: 800, fontSize: 14 }}>{index + 1}</div>
        <div style={{ width: 2, flex: 1, background: `${color}33`, minHeight: 20, marginTop: 4 }} />
      </div>

      <div style={{ flex: 1, background: 'var(--bg)', borderRadius: 14, padding: 16, border: `1px solid ${color}33`, marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
          <input value={step.title} onChange={e => onUpdate({ ...step, title: e.target.value })}
            placeholder="Step title…"
            style={{ flex: 1, minWidth: 160, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 9, padding: '8px 12px', color: 'var(--t1)', fontSize: 14, fontWeight: 700, outline: 'none', transition: 'border-color .2s' }}
            onFocus={e => e.target.style.borderColor = color}
            onBlur={e => e.target.style.borderColor = 'var(--border)'} />
          <input value={step.duration} onChange={e => onUpdate({ ...step, duration: e.target.value })}
            placeholder="Duration (e.g. 2 weeks)"
            style={{ width: 160, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 9, padding: '8px 12px', color: 'var(--t1)', fontSize: 13, outline: 'none', transition: 'border-color .2s' }}
            onFocus={e => e.target.style.borderColor = color}
            onBlur={e => e.target.style.borderColor = 'var(--border)'} />
          <select value={step.status} onChange={e => onUpdate({ ...step, status: e.target.value })}
            style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 9, padding: '8px 12px', color: STATUS_META[step.status]?.color || 'var(--t2)', fontSize: 13, outline: 'none', cursor: 'pointer', fontWeight: 700 }}>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button onClick={onDelete}
            style={{ background: 'transparent', border: '1px solid #ef444433', borderRadius: 9, padding: '8px 10px', cursor: 'pointer', color: '#ef4444', transition: 'background .15s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#ef444422'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <Icon name="trash" size={15} />
          </button>
        </div>

        <textarea value={step.description} onChange={e => onUpdate({ ...step, description: e.target.value })}
          placeholder="Describe what the student should do in this step…"
          rows={2}
          style={{ width: '100%', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 9, padding: '9px 12px', color: 'var(--t1)', fontSize: 13, outline: 'none', resize: 'vertical', lineHeight: 1.5, transition: 'border-color .2s' }}
          onFocus={e => e.target.style.borderColor = color}
          onBlur={e => e.target.style.borderColor = 'var(--border)'} />

        <div style={{ marginTop: 10 }}>
          <input value={step.resources} onChange={e => onUpdate({ ...step, resources: e.target.value })}
            placeholder="Resources / links (comma separated)"
            style={{ width: '100%', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 9, padding: '8px 12px', color: 'var(--t1)', fontSize: 12, outline: 'none', transition: 'border-color .2s' }}
            onFocus={e => e.target.style.borderColor = color}
            onBlur={e => e.target.style.borderColor = 'var(--border)'} />
        </div>
      </div>
    </div>
  );
}

function RoadmapView({ roadmap }) {
  const color = roadmap.color || '#6366f1';
  const done  = roadmap.steps.filter(s => s.status === 'completed').length;
  const pct   = roadmap.steps.length ? Math.round((done / roadmap.steps.length) * 100) : 0;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h4 style={{ fontSize: 17, fontWeight: 800, color: 'var(--t1)', fontFamily: 'Syne, sans-serif' }}>{roadmap.title}</h4>
          {roadmap.goal && <p style={{ color: 'var(--t3)', fontSize: 13, marginTop: 4 }}>{roadmap.goal}</p>}
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ fontSize: 13, color, fontWeight: 700 }}>{done}/{roadmap.steps.length} steps done</div>
          <Badge text={`${pct}%`} color={color} />
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ background: 'var(--hover)', borderRadius: 999, height: 8, marginBottom: 20, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, background: color, height: '100%', borderRadius: 999, transition: 'width .6s ease' }} />
      </div>

      {/* Steps */}
      {roadmap.steps.map((step, i) => {
        const sm = STATUS_META[step.status] || STATUS_META.pending;
        return (
          <div key={step.id} style={{ display: 'flex', gap: 14, marginBottom: 14, alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: step.status === 'completed' ? `${color}22` : 'var(--hover)', border: `2px solid ${step.status === 'completed' ? color : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: step.status === 'completed' ? color : 'var(--t3)' }}>
                {step.status === 'completed' ? <Icon name="check" size={15} /> : <span style={{ fontWeight: 800, fontSize: 13 }}>{i + 1}</span>}
              </div>
              {i < roadmap.steps.length - 1 && <div style={{ width: 2, height: 24, background: 'var(--border)', marginTop: 4 }} />}
            </div>
            <div style={{ flex: 1, background: 'var(--bg)', borderRadius: 12, padding: '12px 16px', border: `1px solid ${step.status === 'completed' ? `${color}33` : 'var(--border)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap', marginBottom: step.description ? 6 : 0 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>{step.title}</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  {step.duration && <Badge text={step.duration} color="#64748b" />}
                  <Badge text={sm.label} color={sm.color} />
                </div>
              </div>
              {step.description && <p style={{ margin: 0, color: 'var(--t2)', fontSize: 13, lineHeight: 1.6 }}>{step.description}</p>}
              {step.resources && (
                <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {step.resources.split(',').map((r, ri) => r.trim() && (
                    <a key={ri} href={r.trim().startsWith('http') ? r.trim() : `https://${r.trim()}`} target="_blank" rel="noreferrer"
                      style={{ fontSize: 11, color: color, background: `${color}18`, borderRadius: 6, padding: '3px 8px', border: `1px solid ${color}33`, fontWeight: 600 }}>
                      {r.trim()} ↗
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function TeacherRoadmap() {
  const { user } = useAuth();
  const { db, saveRoadmap, getRoadmap } = useApp();

  const myStudents = db.users.filter(u => u.role === 'student' && u.teacherId === user.id);
  const [selectedId, setSelectedId] = useState(myStudents[0]?.id || null);
  const [editing, setEditing]       = useState(false);
  const [toast, setToast]           = useState(null);

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const selectedStudent = db.users.find(u => u.id === selectedId);
  const existing = selectedId ? getRoadmap(selectedId, user.id) : null;

  const blankRoadmap = () => ({
    title: `Personal Roadmap for ${selectedStudent?.name || 'Student'}`,
    goal: '',
    color: '#6366f1',
    steps: [
      { id: Date.now(), title: '', description: '', duration: '', resources: '', status: 'pending' },
    ],
  });

  const [form, setForm] = useState(existing || blankRoadmap());

  const switchStudent = (id) => {
    setSelectedId(id);
    setEditing(false);
    const rm = getRoadmap(id, user.id);
    const s  = db.users.find(u => u.id === id);
    setForm(rm || {
      title: `Personal Roadmap for ${s?.name || 'Student'}`,
      goal: '', color: '#6366f1',
      steps: [{ id: Date.now(), title: '', description: '', duration: '', resources: '', status: 'pending' }],
    });
  };

  const addStep = () => setForm(f => ({
    ...f,
    steps: [...f.steps, { id: Date.now(), title: '', description: '', duration: '', resources: '', status: 'pending' }],
  }));

  const updateStep = (id, updated) => setForm(f => ({
    ...f, steps: f.steps.map(s => s.id === id ? updated : s),
  }));

  const deleteStep = (id) => setForm(f => ({
    ...f, steps: f.steps.filter(s => s.id !== id),
  }));

  const handleSave = () => {
    if (!form.title.trim()) return showToast('Roadmap title is required.', 'error');
    if (form.steps.some(s => !s.title.trim())) return showToast('All steps need a title.', 'error');
    saveRoadmap({ ...form, studentId: selectedId, teacherId: user.id });
    setEditing(false);
    showToast('Roadmap saved successfully!');
  };

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  return (
    <div className="page" style={{ padding: 32 }}>
      <PageHeader title="Student Roadmaps" subtitle="Create personalized learning roadmaps for each student" />

      {myStudents.length === 0 ? (
        <Empty emoji="👥" title="No students assigned" sub="Students will appear here once assigned to you." />
      ) : (
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>

          {/* Student list */}
          <div style={{ width: 230, flexShrink: 0 }}>
            <Card style={{ padding: 12 }}>
              <div style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 10, padding: '0 6px' }}>Your Students</div>
              {myStudents.map(s => {
                const rm = getRoadmap(s.id, user.id);
                const isSelected = s.id === selectedId;
                return (
                  <button key={s.id} onClick={() => switchStudent(s.id)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 10px', borderRadius: 10, border: 'none', cursor: 'pointer', background: isSelected ? '#6366f122' : 'transparent', textAlign: 'left', transition: 'background .15s', marginBottom: 4 }}
                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'var(--hover)'; }}
                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}>
                    <Avatar user={s} size={34} />
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</div>
                      <div style={{ fontSize: 11, color: rm ? '#10b981' : 'var(--t3)', marginTop: 2, fontWeight: 600 }}>
                        {rm ? `${rm.steps.length} steps` : 'No roadmap'}
                      </div>
                    </div>
                    {rm && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />}
                  </button>
                );
              })}
            </Card>
          </div>

          {/* Roadmap panel */}
          <div style={{ flex: 1, minWidth: 320 }}>
            {selectedStudent && (
              <Card accent={form.color}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24, flexWrap: 'wrap' }}>
                  <Avatar user={selectedStudent} size={48} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--t1)', fontFamily: 'Syne, sans-serif' }}>{selectedStudent.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--t3)', marginTop: 3 }}>{selectedStudent.batch} · {selectedStudent.email}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {!editing && (
                      <Btn onClick={() => setEditing(true)} variant="outline" size="sm" icon="edit">
                        {existing ? 'Edit Roadmap' : 'Create Roadmap'}
                      </Btn>
                    )}
                    {editing && (
                      <>
                        <Btn onClick={handleSave} variant="success" size="sm" icon="check">Save</Btn>
                        <Btn onClick={() => { setEditing(false); setForm(existing || blankRoadmap()); }} variant="ghost" size="sm" icon="x">Cancel</Btn>
                      </>
                    )}
                  </div>
                </div>

                {/* Edit mode */}
                {editing && (
                  <div style={{ marginBottom: 28 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                      <Input label="Roadmap Title" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g., Full Stack Journey" />
                      <Input label="Goal / Target" value={form.goal} onChange={e => setForm({ ...form, goal: e.target.value })} placeholder="e.g., Get placed in top MNC" />
                    </div>
                    <div style={{ marginBottom: 20 }}>
                      <label style={{ display: 'block', color: 'var(--t2)', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Roadmap Color</label>
                      <div style={{ display: 'flex', gap: 10 }}>
                        {COLORS.map(c => (
                          <button key={c} onClick={() => setForm({ ...form, color: c })}
                            style={{ width: 30, height: 30, borderRadius: '50%', background: c, border: form.color === c ? '3px solid #fff' : '3px solid transparent', cursor: 'pointer', boxShadow: form.color === c ? `0 0 0 2px ${c}` : 'none', transition: 'all .15s' }} />
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                      <h4 style={{ fontSize: 15, fontWeight: 800, color: 'var(--t1)', fontFamily: 'Syne, sans-serif' }}>Steps</h4>
                      <Btn onClick={addStep} variant="ghost" size="sm" icon="plus">Add Step</Btn>
                    </div>

                    {form.steps.map((step, i) => (
                      <RoadmapStep key={step.id} step={step} index={i} color={form.color}
                        onUpdate={(updated) => updateStep(step.id, updated)}
                        onDelete={() => deleteStep(step.id)} />
                    ))}
                  </div>
                )}

                {/* View mode */}
                {!editing && existing && <RoadmapView roadmap={existing} />}

                {!editing && !existing && (
                  <Empty emoji="🗺️" title="No roadmap yet" sub="Click 'Create Roadmap' to build a personalized plan for this student." />
                )}
              </Card>
            )}
          </div>
        </div>
      )}

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
