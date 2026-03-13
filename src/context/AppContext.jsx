import React, { createContext, useContext, useState, useCallback } from 'react';
import { loadDb, saveDb, loadAdmin } from '../utils/storage';

const Ctx = createContext(null);

export function AppProvider({ children }) {
  const [db, setDb] = useState(() => loadDb());
  const [admin]     = useState(() => loadAdmin());

  const update = useCallback((updater) => {
    setDb(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveDb(next);
      return next;
    });
  }, []);

  const allUsers = [admin, ...db.users];

  const addUser = (user) => update(db => ({
    ...db, users: [...db.users, { ...user, id: Date.now() }],
  }));

  const deleteUser = (userId) => update(db => ({
    ...db,
    users:     db.users.filter(u => u.id !== userId),
    messages:  db.messages.filter(m => m.from !== userId && m.to !== userId),
    progress:  db.progress.filter(p => p.studentId !== userId),
    platforms: db.platforms.filter(p => p.studentId !== userId),
    roadmaps:  (db.roadmaps || []).filter(r => r.studentId !== userId),
  }));

  const addMessage = (msg) => update(db => ({
    ...db, messages: [...db.messages, { ...msg, id: Date.now() }],
  }));

  const markRead = (fromId, toId) => update(db => ({
    ...db, messages: db.messages.map(m =>
      m.from === fromId && m.to === toId ? { ...m, read: true } : m
    ),
  }));

  const addResource = (res) => update(db => ({
    ...db, resources: [...db.resources, { ...res, id: Date.now() }],
  }));

  const deleteResource = (id) => update(db => ({
    ...db, resources: db.resources.filter(r => r.id !== id),
  }));

  const addPath = (path) => update(db => ({
    ...db, paths: [...db.paths, { ...path, id: Date.now() }],
  }));

  const updateProgress = (studentId, pathId, moduleId, pct) => update(db => {
    const today = new Date().toISOString().split('T')[0];
    const exists = db.progress.find(
      p => p.studentId === studentId && p.pathId === pathId && p.moduleId === moduleId
    );
    if (exists) {
      return { ...db, progress: db.progress.map(p =>
        p.studentId === studentId && p.pathId === pathId && p.moduleId === moduleId
          ? { ...p, pct, lastActive: today } : p
      )};
    }
    return { ...db, progress: [...db.progress, { studentId, pathId, moduleId, pct, timeSpent: 0, lastActive: today }] };
  });

  const updatePlatform = (studentId, platformData) => update(db => ({
    ...db, platforms: db.platforms.map(p =>
      p.studentId === studentId ? { ...p, ...platformData } : p
    ),
  }));

  const addAnnouncement = (ann) => update(db => ({
    ...db, announcements: [{ ...ann, id: Date.now() }, ...db.announcements],
  }));

  const saveRoadmap = (roadmap) => update(db => {
    const list = db.roadmaps || [];
    const today = new Date().toISOString().split('T')[0];
    const exists = list.find(r => r.studentId === roadmap.studentId && r.teacherId === roadmap.teacherId);
    if (exists) {
      return { ...db, roadmaps: list.map(r =>
        r.studentId === roadmap.studentId && r.teacherId === roadmap.teacherId
          ? { ...r, ...roadmap, updatedAt: today } : r
      )};
    }
    return { ...db, roadmaps: [...list, { ...roadmap, id: Date.now(), createdAt: today, updatedAt: today }] };
  });

  const getRoadmap = (studentId, teacherId) =>
    (db.roadmaps || []).find(r => r.studentId === studentId && r.teacherId === teacherId) || null;

  const getPathProgress = (studentId, pathId) => {
    const path = db.paths.find(p => p.id === pathId);
    if (!path) return 0;
    const recs = db.progress.filter(p => p.studentId === studentId && p.pathId === pathId);
    if (!recs.length) return 0;
    return Math.round(recs.reduce((a, r) => a + r.pct, 0) / path.modules.length);
  };

  const getTotalTime = (studentId) =>
    db.progress.filter(p => p.studentId === studentId).reduce((a, r) => a + (r.timeSpent || 0), 0);

  const getUnread = (userId) =>
    db.messages.filter(m => m.to === userId && !m.read).length;

  return (
    <Ctx.Provider value={{
      db, admin, allUsers, update,
      addUser, deleteUser,
      addMessage, markRead,
      addResource, deleteResource,
      addPath, updateProgress, updatePlatform,
      addAnnouncement, saveRoadmap, getRoadmap,
      getPathProgress, getTotalTime, getUnread,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export const useApp = () => useContext(Ctx);
