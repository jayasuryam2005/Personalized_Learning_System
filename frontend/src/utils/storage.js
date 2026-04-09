const DB_KEY    = 'skillpath_db';
const ADMIN_KEY = 'skillpath_admin';

const ADMIN_SEED = {
  id: 1, role: 'admin', name: 'Admin',
  email: 'admin@skillpath.com', password: 'admin@123', avatar: 'A',
};

export function loadAdmin() {
  try {
    const raw = localStorage.getItem(ADMIN_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  localStorage.setItem(ADMIN_KEY, JSON.stringify(ADMIN_SEED));
  return ADMIN_SEED;
}

export function saveAdmin(admin) {
  try { localStorage.setItem(ADMIN_KEY, JSON.stringify(admin)); } catch (_) {}
}

const emptyDb = () => ({
  users: [], paths: [], resources: [], progress: [],
  platforms: [], messages: [], announcements: [], roadmaps: [],
});

export function loadDb() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  const db = emptyDb();
  saveDb(db);
  return db;
}

export function saveDb(state) {
  try { localStorage.setItem(DB_KEY, JSON.stringify(state)); } catch (_) {}
}

export function resetDb() {
  localStorage.removeItem(DB_KEY);
  return emptyDb();
}
