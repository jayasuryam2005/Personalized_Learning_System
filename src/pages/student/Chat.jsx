import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Avatar, Icon, Empty } from '../../components/UI';
import { loadDb } from '../../utils/storage';

export default function Chat() {
  const { user }  = useAuth();
  const { db, allUsers, addMessage, markRead, update } = useApp();
  const [selected, setSelected] = useState(null);
  const [input, setInput]       = useState('');
  const bottomRef = useRef(null);
  const pollRef   = useRef(null);

  // ── Poll localStorage every 1s so both sides see new messages instantly ──
  useEffect(() => {
    pollRef.current = setInterval(() => {
      const fresh = loadDb();
      // Only trigger update if messages actually changed
      update(prev => {
        if (JSON.stringify(prev.messages) === JSON.stringify(fresh.messages)) return prev;
        return { ...prev, messages: fresh.messages };
      });
    }, 1000);
    return () => clearInterval(pollRef.current);
  }, [update]);

  // Build contact list
  let contacts = [];
  if (user.role === 'student') {
    contacts = allUsers.filter(u => u.id === user.teacherId);
  } else if (user.role === 'teacher') {
    contacts = allUsers.filter(u => u.role === 'student' && u.teacherId === user.id);
  }

  useEffect(() => {
    if (contacts.length && !selected) setSelected(contacts[0]);
  }, [contacts.length]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [db.messages, selected]);

  useEffect(() => {
    if (selected) markRead(selected.id, user.id);
  }, [selected, db.messages.length]);

  const convo = selected
    ? db.messages
        .filter(m =>
          (m.from === user.id && m.to === selected.id) ||
          (m.from === selected.id && m.to === user.id)
        )
        .sort((a, b) => a.id - b.id)
    : [];

  const send = () => {
    if (!input.trim() || !selected) return;
    addMessage({
      from: user.id,
      to: selected.id,
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString(),
      read: false,
    });
    setInput('');
  };

  return (
    <div className="page" style={{ padding: 32, height: 'calc(100vh - 32px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--t1)', fontFamily: 'Syne, sans-serif', letterSpacing: '-0.5px' }}>Messages</h1>
        <p style={{ color: 'var(--t3)', fontSize: 14, marginTop: 5 }}>
          {user.role === 'student' ? 'Chat with your instructor' : 'Communicate with your students'}
        </p>
      </div>

      <div style={{ flex: 1, display: 'flex', gap: 20, minHeight: 0 }}>

        {/* Contacts sidebar */}
        <div style={{ width: 260, background: 'var(--card)', borderRadius: 16, border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', fontSize: 12, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            Contacts
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {contacts.length === 0 && <Empty emoji="👥" title="No contacts" sub="No one assigned yet" />}
            {contacts.map(c => {
              const unread = db.messages.filter(m => m.from === c.id && m.to === user.id && !m.read).length;
              const lastMsg = db.messages
                .filter(m => (m.from === c.id && m.to === user.id) || (m.from === user.id && m.to === c.id))
                .sort((a, b) => a.id - b.id)
                .slice(-1)[0];
              const isSelected = selected?.id === c.id;
              return (
                <button key={c.id} onClick={() => setSelected(c)}
                  style={{ width: '100%', padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 12, background: isSelected ? '#6366f118' : 'transparent', border: 'none', cursor: 'pointer', borderBottom: '1px solid var(--border)', textAlign: 'left', transition: 'background .15s' }}
                  onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'var(--hover)'; }}
                  onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <Avatar user={c} size={38} />
                    {/* Online dot */}
                    <div style={{ position: 'absolute', bottom: 1, right: 1, width: 9, height: 9, borderRadius: '50%', background: '#10b981', border: '2px solid var(--card)' }} />
                  </div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: lastMsg ? 'var(--t2)' : 'var(--t3)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {lastMsg ? lastMsg.text : `Say hi to ${c.name.split(' ')[0]}!`}
                    </div>
                  </div>
                  {unread > 0 && (
                    <span style={{ background: '#6366f1', color: '#fff', borderRadius: '50%', width: 20, height: 20, fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {unread}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat area */}
        <div style={{ flex: 1, background: 'var(--card)', borderRadius: 16, border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {selected ? (
            <>
              {/* Header */}
              <div style={{ padding: '14px 22px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ position: 'relative' }}>
                  <Avatar user={selected} size={40} />
                  <div style={{ position: 'absolute', bottom: 1, right: 1, width: 10, height: 10, borderRadius: '50%', background: '#10b981', border: '2px solid var(--card)' }} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--t1)' }}>{selected.name}</div>
                  <div style={{ fontSize: 12, color: '#10b981', marginTop: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ textTransform: 'capitalize' }}>{selected.role}</span>
                    <span style={{ color: 'var(--t3)' }}>· Active now</span>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {convo.length === 0 && (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Empty emoji="💬" title={`Start a conversation`} sub={`Send a message to ${selected.name}`} />
                  </div>
                )}
                {convo.map((msg, i) => {
                  const isMe = msg.from === user.id;
                  const sender = allUsers.find(u => u.id === msg.from);
                  const prevMsg = convo[i - 1];
                  const showTime = !prevMsg || msg.id - prevMsg.id > 300000;
                  return (
                    <React.Fragment key={msg.id}>
                      {showTime && (
                        <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--t3)', margin: '6px 0' }}>{msg.date} · {msg.time}</div>
                      )}
                      <div style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', gap: 8, alignItems: 'flex-end' }}>
                        {!isMe && <Avatar user={sender || selected} size={28} />}
                        <div style={{
                          maxWidth: '68%',
                          background: isMe ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'var(--bg)',
                          border: isMe ? 'none' : '1px solid var(--border)',
                          borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                          padding: '10px 16px',
                          boxShadow: isMe ? '0 4px 14px #6366f133' : 'none',
                        }}>
                          <p style={{ margin: 0, fontSize: 14, color: isMe ? '#fff' : 'var(--t1)', lineHeight: 1.55 }}>{msg.text}</p>
                          <div style={{ fontSize: 11, color: isMe ? '#ffffff88' : 'var(--t3)', marginTop: 4, textAlign: 'right' }}>{msg.time}</div>
                        </div>
                        {isMe && <Avatar user={user} size={28} />}
                      </div>
                    </React.Fragment>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)', display: 'flex', gap: 12, alignItems: 'center' }}>
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                  style={{ flex: 1, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '11px 16px', color: 'var(--t1)', fontSize: 14, outline: 'none', transition: 'border-color .2s' }}
                  onFocus={e => e.target.style.borderColor = '#6366f1'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  placeholder={`Message ${selected.name}…`}
                />
                <button onClick={send}
                  style={{ width: 44, height: 44, borderRadius: 12, background: input.trim() ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'var(--hover)', border: 'none', cursor: input.trim() ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all .2s', boxShadow: input.trim() ? '0 4px 14px #6366f133' : 'none' }}>
                  <Icon name="send" size={18} color={input.trim() ? '#fff' : 'var(--t3)'} />
                </button>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Empty emoji="💬" title="Select a conversation" sub="Choose a contact from the left panel" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}