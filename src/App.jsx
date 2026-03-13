import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';

// Student pages
import StudentDashboard  from './pages/student/Dashboard';
import StudentResources  from './pages/student/Resources';
import StudentProgress   from './pages/student/Progress';
import StudentChat       from './pages/student/Chat';
import CodingProfiles    from './pages/student/CodingProfiles';

// Teacher pages
import TeacherDashboard from './pages/teacher/Dashboard';
import TeacherPaths     from './pages/teacher/Paths';
import TeacherUpload    from './pages/teacher/Upload';
import TeacherAnnounce  from './pages/teacher/Announce';
import TeacherChat      from './pages/teacher/TeacherChat';
import TeacherRoadmap   from './pages/teacher/Roadmap';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers     from './pages/admin/Users';
import AdminPlatforms from './pages/admin/Platforms';
import AdminSettings  from './pages/admin/Settings';

const STUDENT_NAV = [
  { id: 'dashboard', label: 'Dashboard',       icon: 'home'   },
  { id: 'progress',  label: 'My Progress',     icon: 'chart'  },
  { id: 'resources', label: 'Resources',       icon: 'book'   },
  { id: 'coding',    label: 'Coding Profiles', icon: 'code'   },
  { id: 'chat',      label: 'Messages',        icon: 'chat'   },
];

const TEACHER_NAV = [
  { id: 'dashboard', label: 'Dashboard',      icon: 'home'   },
  { id: 'paths',     label: 'Learning Paths', icon: 'book'   },
  { id: 'roadmap',   label: 'Roadmaps',       icon: 'star'   },
  { id: 'upload',    label: 'Upload',         icon: 'upload' },
  { id: 'announce',  label: 'Announce',       icon: 'bell'   },
  { id: 'chat',      label: 'Messages',       icon: 'chat'   },
];

const ADMIN_NAV = [
  { id: 'dashboard', label: 'Overview',  icon: 'chart'    },
  { id: 'users',     label: 'Users',     icon: 'users'    },
  { id: 'platforms', label: 'Platforms', icon: 'trophy'   },
  { id: 'settings',  label: 'Settings',  icon: 'settings' },
];

function Portal() {
  const { user } = useAuth();
  const [page, setPage] = useState('dashboard');

  if (!user) return <Login />;

  if (user.role === 'student') {
    const pages = {
      dashboard: <StudentDashboard />,
      progress:  <StudentProgress />,
      resources: <StudentResources />,
      coding:    <CodingProfiles />,
      chat:      <StudentChat />,
    };
    return (
      <Layout activePage={page} setActivePage={setPage} navItems={STUDENT_NAV}>
        {pages[page] || pages.dashboard}
      </Layout>
    );
  }

  if (user.role === 'teacher') {
    const pages = {
      dashboard: <TeacherDashboard />,
      paths:     <TeacherPaths />,
      roadmap:   <TeacherRoadmap />,
      upload:    <TeacherUpload />,
      announce:  <TeacherAnnounce />,
      chat:      <TeacherChat />,
    };
    return (
      <Layout activePage={page} setActivePage={setPage} navItems={TEACHER_NAV}>
        {pages[page] || pages.dashboard}
      </Layout>
    );
  }

  const pages = {
    dashboard: <AdminDashboard />,
    users:     <AdminUsers />,
    platforms: <AdminPlatforms />,
    settings:  <AdminSettings />,
  };
  return (
    <Layout activePage={page} setActivePage={setPage} navItems={ADMIN_NAV}>
      {pages[page] || pages.dashboard}
    </Layout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <Portal />
      </AuthProvider>
    </AppProvider>
  );
}
