import React, { useState } from 'react';
import { Icon, Avatar } from './UI';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export default function Layout({ children, activePage, setActivePage, navItems }) {
  const { user, logout } = useAuth();
  const { getUnread } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  const roleColors = { admin: '#f59e0b', teacher: '#6366f1', student: '#10b981' };
  const rc = roleColors[user?.role] || '#6366f1';
  const unread = getUnread(user?.id);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: collapsed ? 68 : 240,
        background: 'linear-gradient(180deg,#0f172a 0%,#020817 100%)',
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        transition: 'width .3s ease',
        flexShrink: 0, position: 'sticky', top: 0, height: '100vh', overflow: 'hidden',
      }}>

        {/* Logo */}
        <div style={{ padding: '18px 14px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border)', overflow: 'hidden' }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12, flexShrink: 0,
            background: `linear-gradient(135deg,${rc},${rc}88)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 4px 14px ${rc}33`,
          }}>
            <Icon name="book" size={20} color="#fff" />
          </div>
          {!collapsed && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--t1)', fontFamily: 'Syne, sans-serif', whiteSpace: 'nowrap' }}>SkillPath</div>

            </div>
          )}
        </div>

        {/* Role chip */}
        {!collapsed && (
          <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ background: `${rc}18`, border: `1px solid ${rc}33`, borderRadius: 8, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: rc }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: rc, textTransform: 'capitalize' }}>{user?.role} Portal</span>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav style={{ flex: 1, padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: 3, overflowY: 'auto' }}>
          {navItems.map(item => {
            const active = activePage === item.id;
            const showBadge = item.id === 'chat' && unread > 0;
            return (
              <button key={item.id} onClick={() => setActivePage(item.id)}
                title={collapsed ? item.label : ''}
                style={{
                  display: 'flex', alignItems: 'center', gap: 11,
                  padding: collapsed ? '11px 14px' : '10px 14px',
                  borderRadius: 10, border: 'none', cursor: 'pointer', width: '100%',
                  background: active ? `${rc}20` : 'transparent',
                  color: active ? rc : 'var(--t3)',
                  transition: 'all .15s', textAlign: 'left',
                  position: 'relative', justifyContent: collapsed ? 'center' : 'flex-start',
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--hover)'; e.currentTarget.style.color = 'var(--t2)'; }}}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--t3)'; }}}>
                <Icon name={item.icon} size={19} />
                {!collapsed && <span style={{ fontSize: 14, fontWeight: active ? 700 : 500, whiteSpace: 'nowrap', flex: 1 }}>{item.label}</span>}
                {showBadge && (
                  <span style={{
                    background: '#ef4444', color: '#fff', borderRadius: '50%',
                    width: 18, height: 18, fontSize: 10, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: collapsed ? 'absolute' : 'static', top: 6, right: 6,
                  }}>{unread}</span>
                )}
                {active && !collapsed && (
                  <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', width: 3, height: 18, background: rc, borderRadius: '3px 0 0 3px' }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: '10px 8px', borderTop: '1px solid var(--border)' }}>
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, marginBottom: 6, background: 'var(--hover)', overflow: 'hidden' }}>
              <Avatar user={user} size={32} />
              <div style={{ overflow: 'hidden', flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
                <div style={{ fontSize: 11, color: 'var(--t3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
              </div>
            </div>
          )}
          <button onClick={logout}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10, border: 'none', cursor: 'pointer', background: 'transparent', color: '#ef4444', width: '100%', justifyContent: collapsed ? 'center' : 'flex-start', transition: 'background .15s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#ef444418'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            title={collapsed ? 'Log out' : ''}>
            <Icon name="logout" size={18} />
            {!collapsed && <span style={{ fontSize: 14, fontWeight: 600 }}>Log Out</span>}
          </button>
          <button onClick={() => setCollapsed(c => !c)}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10, border: 'none', cursor: 'pointer', background: 'transparent', color: 'var(--t3)', width: '100%', marginTop: 2, justifyContent: collapsed ? 'center' : 'flex-start', transition: 'background .15s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <Icon name={collapsed ? 'menu' : 'x'} size={18} />
            {!collapsed && <span style={{ fontSize: 14 }}>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{ flex: 1, overflow: 'auto', minWidth: 0 }}>
        {children}
      </main>
    </div>
  );
}
