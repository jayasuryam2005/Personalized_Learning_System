import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { PageHeader, Card, Badge, Icon, Btn, Input, Select, Toast } from '../../components/UI';

const TYPE_META = {
  pdf:   { icon: 'pdf',   color: '#ef4444' },
  doc:   { icon: 'doc',   color: '#6366f1' },
  video: { icon: 'video', color: '#f59e0b' },
  link:  { icon: 'link',  color: '#10b981' },
};

export default function TeacherUpload() {
  const { user } = useAuth();
  const { db, addResource, deleteResource } = useApp();
  const [toast, setToast] = useState(null);

  const myPaths = db.paths.filter(p => p.teacherId === user.id);

  const blank = { title: '', type: 'pdf', url: '', pathId: '', moduleId: '', size: '' };
  const [form, setForm] = useState(blank);

  const selPath = myPaths.find(p => p.id === Number(form.pathId));

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const handleSubmit = () => {
    if (!form.title.trim()) return showToast('Title is required.', 'error');
    if (!form.pathId)       return showToast('Select a learning path.', 'error');
    if (!form.moduleId)     return showToast('Select a module.', 'error');
    addResource({
      title: form.title, type: form.type,
      url: form.url || '#', size: form.size,
      pathId: Number(form.pathId), moduleId: Number(form.moduleId),
      uploadedBy: user.id,
      date: new Date().toISOString().split('T')[0],
    });
    setForm(blank);
    showToast('Resource uploaded successfully!');
  };

  const myResources = db.resources.filter(r => r.uploadedBy === user.id).slice().reverse();

  return (
    <div className="page" style={{ padding: 32 }}>
      <PageHeader title="Upload Resources" subtitle="Add learning materials for your students" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 1080 }}>
        {/* Upload form */}
        <Card>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--t1)', fontFamily: 'Syne, sans-serif', marginBottom: 22 }}>Add New Resource</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input label="Resource Title" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g., Arrays Cheat Sheet" />

            <Select label="Resource Type" required value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
              options={[
                { value: 'pdf',   label: '📄 PDF Document' },
                { value: 'doc',   label: '📝 Word Document' },
                { value: 'video', label: '🎥 Video' },
                { value: 'link',  label: '🔗 External Link' },
              ]} />

            <Select label="Learning Path" required value={form.pathId} onChange={e => setForm({ ...form, pathId: e.target.value, moduleId: '' })}
              options={[{ value: '', label: 'Select a path…' }, ...myPaths.map(p => ({ value: String(p.id), label: p.title }))]} />

            {selPath && (
              <Select label="Module" required value={form.moduleId} onChange={e => setForm({ ...form, moduleId: e.target.value })}
                options={[{ value: '', label: 'Select module…' }, ...selPath.modules.map(m => ({ value: String(m.id), label: m.title }))]} />
            )}

            <Input label="URL / Link" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://…" />

            {(form.type === 'pdf' || form.type === 'doc') && (
              <Input label="File Size (optional)" value={form.size} onChange={e => setForm({ ...form, size: e.target.value })} placeholder="e.g., 2.4 MB" />
            )}

            <Btn onClick={handleSubmit} icon="upload" size="lg" style={{ marginTop: 4 }}>Upload Resource</Btn>
          </div>
        </Card>

        {/* Recent uploads */}
        <Card>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--t1)', fontFamily: 'Syne, sans-serif', marginBottom: 18 }}>
            My Uploads <Badge text={myResources.length} color="#6366f1" />
          </h3>
          {myResources.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 0', color: 'var(--t3)' }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>📤</div>
              <div>No resources uploaded yet.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 520, overflowY: 'auto' }}>
              {myResources.map(res => {
                const meta = TYPE_META[res.type] || TYPE_META.link;
                const path = db.paths.find(p => p.id === res.pathId);
                const mod  = path?.modules.find(m => m.id === res.moduleId);
                return (
                  <div key={res.id} style={{ background: 'var(--bg)', borderRadius: 12, padding: '12px 14px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 9, background: `${meta.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: meta.color, flexShrink: 0 }}>
                      <Icon name={meta.icon} size={18} />
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{res.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>{mod?.title || '—'} · {res.date}</div>
                    </div>
                    <Badge text={res.type.toUpperCase()} color={meta.color} />
                    <button onClick={() => { deleteResource(res.id); showToast('Resource deleted.', 'info'); }}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 4 }}
                      title="Delete">
                      <Icon name="trash" size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
