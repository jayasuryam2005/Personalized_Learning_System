import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { PageHeader, Card, Badge, Icon, Empty } from '../../components/UI';

const TYPE_META = {
  pdf:   { icon: 'pdf',   color: '#ef4444', label: 'PDF' },
  doc:   { icon: 'doc',   color: '#6366f1', label: 'DOC' },
  video: { icon: 'video', color: '#f59e0b', label: 'VIDEO' },
  link:  { icon: 'link',  color: '#10b981', label: 'LINK' },
};

export default function StudentResources() {
  const { user } = useAuth();
  const { db }   = useApp();
  const [search, setSearch] = useState('');

  const myPath = db.paths.find(p => p.teacherId === user.teacherId);
  const allRes = db.resources.filter(r => r.pathId === myPath?.id);
  const filtered = allRes.filter(r => r.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="page" style={{ padding: 32 }}>
      <PageHeader title="Learning Resources" subtitle="Materials shared by your instructor"
        actions={
          <div style={{ position: 'relative' }}>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search resources…"
              style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: '9px 14px 9px 36px', color: 'var(--t1)', fontSize: 13, outline: 'none', width: 220 }}
              onFocus={e => e.target.style.borderColor = '#6366f1'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--t3)' }}>
              <Icon name="search" size={15} />
            </div>
          </div>
        } />

      {!myPath ? (
        <Empty emoji="📚" title="No learning path assigned" sub="Your instructor hasn't assigned a path yet." />
      ) : (
        myPath.modules.map(mod => {
          const modRes = filtered.filter(r => r.moduleId === mod.id);
          if (!modRes.length) return null;
          return (
            <Card key={mod.id} style={{ marginBottom: 18 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--t1)', fontFamily: 'Syne, sans-serif', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ background: '#6366f122', color: '#6366f1', borderRadius: 8, width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800 }}>{mod.order}</span>
                {mod.title}
                <Badge text={`${modRes.length} items`} color="#6366f1" />
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {modRes.map(res => {
                  const meta = TYPE_META[res.type] || TYPE_META.link;
                  return (
                    <div key={res.id} style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      background: 'var(--bg)', borderRadius: 12, padding: '14px 18px',
                      border: '1px solid var(--border)', transition: 'border-color .2s',
                    }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = meta.color + '55'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                      <div style={{ width: 42, height: 42, borderRadius: 11, background: `${meta.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: meta.color, flexShrink: 0 }}>
                        <Icon name={meta.icon} size={20} />
                      </div>
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{res.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 2 }}>{res.size || 'External'} · {res.date}</div>
                      </div>
                      <Badge text={meta.label} color={meta.color} />
                      <a href={res.url || '#'} target="_blank" rel="noreferrer"
                        style={{ color: meta.color, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}>
                        Open <Icon name="download" size={14} />
                      </a>
                    </div>
                  );
                })}
              </div>
            </Card>
          );
        })
      )}

      {myPath && filtered.length === 0 && search && (
        <Empty emoji="🔍" title="No results" sub={`Nothing matched "${search}"`} />
      )}
    </div>
  );
}
