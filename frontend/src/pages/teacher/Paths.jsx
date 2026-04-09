import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { PageHeader, Card, Badge, Btn, Input, Toast, Icon, Empty } from '../../components/UI';

const COLORS = ['#6366f1','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4'];
const EMOJIS = ['🧠','🤖','💡','🔬','📊','🎯','🚀','⚡','🌐','🔐'];

export default function TeacherPaths() {
  const { user } = useAuth();
  const { db, addPath } = useApp();
  const [toast, setToast]   = useState(null);
  const [showForm, setShowForm] = useState(false);

  const myPaths = db.paths.filter(p => p.teacherId === user.id);

  const blankForm = { title: '', description: '', totalHours: '', color: COLORS[0], emoji: EMOJIS[0], modules: [{ title: '', hours: '' }] };
  const [form, setForm] = useState(blankForm);

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const addMod = () => setForm(f => ({ ...f, modules: [...f.modules, { title: '', hours: '' }] }));
  const removeMod = (i) => setForm(f => ({ ...f, modules: f.modules.filter((_, idx) => idx !== i) }));
  const updateMod = (i, key, val) => setForm(f => ({
    ...f, modules: f.modules.map((m, idx) => idx === i ? { ...m, [key]: val } : m),
  }));

  const handleCreate = () => {
    if (!form.title.trim()) return showToast('Title required.', 'error');
    if (form.modules.some(m => !m.title.trim())) return showToast('All modules need a title.', 'error');
    addPath({
      teacherId: user.id,
      title: form.title, description: form.description,
      totalHours: Number(form.totalHours) || 0,
      color: form.color, emoji: form.emoji,
      modules: form.modules.map((m, i) => ({ id: i + 1, title: m.title, hours: Number(m.hours) || 0, order: i + 1 })),
    });
    setForm(blankForm);
    setShowForm(false);
    showToast('Learning path created!');
  };

  return (
    <div className="page" style={{ padding: 32 }}>
      <PageHeader title="Learning Paths" subtitle="Create and manage structured learning journeys"
        actions={<Btn onClick={() => setShowForm(s => !s)} icon={showForm ? 'x' : 'plus'}>{showForm ? 'Cancel' : 'New Path'}</Btn>} />

      {/* Create form */}
      {showForm && (
        <Card style={{ marginBottom: 24, border: '1px solid #6366f144' }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--t1)', fontFamily: 'Syne, sans-serif', marginBottom: 22 }}>Create New Learning Path</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <Input label="Path Title" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g., Web Development Bootcamp" />
            <Input label="Total Hours (est.)" value={form.totalHours} onChange={e => setForm({ ...form, totalHours: e.target.value })} placeholder="e.g., 40" />
          </div>
          <div style={{ marginBottom: 16 }}>
            <Input label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief overview of the learning path…" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div>
              <label style={{ display: 'block', color: 'var(--t2)', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Accent Color</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {COLORS.map(c => (
                  <button key={c} onClick={() => setForm({ ...form, color: c })}
                    style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: form.color === c ? `3px solid #fff` : '3px solid transparent', cursor: 'pointer', transition: 'all .15s' }} />
                ))}
              </div>
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--t2)', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Emoji</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {EMOJIS.map(e => (
                  <button key={e} onClick={() => setForm({ ...form, emoji: e })}
                    style={{ width: 32, height: 32, borderRadius: 8, background: form.emoji === e ? `${form.color}33` : 'var(--hover)', border: form.emoji === e ? `1px solid ${form.color}` : '1px solid transparent', cursor: 'pointer', fontSize: 16 }}>
                    {e}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Modules */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <label style={{ color: 'var(--t2)', fontSize: 13, fontWeight: 600 }}>Modules</label>
              <Btn onClick={addMod} variant="ghost" size="sm" icon="plus">Add Module</Btn>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {form.modules.map((mod, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: `${form.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: form.color, fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{i + 1}</div>
                  <input value={mod.title} onChange={e => updateMod(i, 'title', e.target.value)}
                    style={{ flex: 1, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 9, padding: '9px 13px', color: 'var(--t1)', fontSize: 13, outline: 'none' }}
                    placeholder="Module title…"
                    onFocus={e => e.target.style.borderColor = form.color}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                  <input value={mod.hours} onChange={e => updateMod(i, 'hours', e.target.value)}
                    style={{ width: 80, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 9, padding: '9px 13px', color: 'var(--t1)', fontSize: 13, outline: 'none' }}
                    placeholder="hrs"
                    onFocus={e => e.target.style.borderColor = form.color}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                  {form.modules.length > 1 && (
                    <button onClick={() => removeMod(i)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 4 }}>
                      <Icon name="x" size={15} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Btn onClick={handleCreate} icon="check" size="lg">Create Learning Path</Btn>
        </Card>
      )}

      {/* Existing paths */}
      {myPaths.length === 0 ? (
        <Empty emoji="🗺️" title="No learning paths yet" sub="Create your first path using the button above." />
      ) : (
        myPaths.map(path => {
          const resCount = db.resources.filter(r => r.pathId === path.id).length;
          return (
            <Card key={path.id} accent={path.color} style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ fontSize: 40 }}>{path.emoji}</div>
                  <div>
                    <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--t1)', fontFamily: 'Syne, sans-serif' }}>{path.title}</h3>
                    <p style={{ color: 'var(--t3)', fontSize: 13, marginTop: 4 }}>{path.description}</p>
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <Badge text={`${path.totalHours}h`} color={path.color} />
                      <Badge text={`${path.modules.length} modules`} color="#64748b" />
                      <Badge text={`${resCount} resources`} color="#8b5cf6" />
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 10 }}>
                {path.modules.map((mod, i) => (
                  <div key={mod.id} style={{ background: 'var(--bg)', borderRadius: 12, padding: 14, border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 8 }}>
                      <div style={{ width: 26, height: 26, borderRadius: 7, background: `${path.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: path.color, fontSize: 12, fontWeight: 800 }}>{i + 1}</div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>{mod.title}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--t3)' }}>{mod.hours}h estimated</div>
                  </div>
                ))}
              </div>
            </Card>
          );
        })
      )}

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
