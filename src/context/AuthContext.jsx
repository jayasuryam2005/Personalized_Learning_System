import React, { createContext, useContext, useState } from 'react';
import { useApp } from './AppContext';
import { loadAdmin } from '../utils/storage';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const { db } = useApp();

  const [sessionUser, setSessionUser] = useState(() => {
    try {
      const s = sessionStorage.getItem('skillpath_user');
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  });

  // Always derive the live user from db so refreshing never stales data.
  // Admin lives outside db, so handle separately.
  const user = (() => {
    if (!sessionUser) return null;
    if (sessionUser.role === 'admin') {
      return loadAdmin();
    }
    // Re-read from db.users so teacherId, batch etc. are always fresh
    return db.users.find(u => u.id === sessionUser.id) || null;
  })();

  const login = (email, password, role) => {
    if (role === 'admin') {
      const adm = loadAdmin();
      if (adm.email === email && adm.password === password) {
        setSessionUser(adm);
        sessionStorage.setItem('skillpath_user', JSON.stringify(adm));
        return { ok: true };
      }
      return { ok: false, error: 'Invalid admin credentials.' };
    }
    const found = db.users.find(
      u => u.email === email && u.password === password && u.role === role
    );
    if (found) {
      setSessionUser(found);
      sessionStorage.setItem('skillpath_user', JSON.stringify(found));
      return { ok: true };
    }
    return { ok: false, error: 'Invalid credentials. Contact your admin.' };
  };

  const logout = () => {
    setSessionUser(null);
    sessionStorage.removeItem('skillpath_user');
  };

  return (
    <AuthCtx.Provider value={{ user, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);