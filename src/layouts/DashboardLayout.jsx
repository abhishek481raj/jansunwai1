import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink, useLocation, Outlet } from 'react-router-dom';
import {
  Shield, LayoutDashboard, FilePlus, FileText, MapPin,
  ClipboardList, CheckSquare, Users, Building2, Bell,
  LogOut, Menu, X, Sun, Moon, CheckCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import LanguageSelector from '../components/LanguageSelector';
import { notificationsAPI } from '../services/api';

const NAV_ITEMS = {
  citizen: [
    { label: 'dashboard.dashboard', path: '/citizen/dashboard', Icon: LayoutDashboard },
    { label: 'dashboard.file_complaint', path: '/citizen/file', Icon: FilePlus },
    { label: 'dashboard.my_complaints', path: '/citizen/complaints', Icon: FileText },
    { label: 'dashboard.track', path: '/citizen/track', Icon: MapPin },
  ],
  officer: [
    { label: 'dashboard.dashboard', path: '/officer/dashboard', Icon: LayoutDashboard },
    { label: 'dashboard.assigned', path: '/officer/assigned', Icon: ClipboardList },
    { label: 'dashboard.resolved', path: '/officer/resolved', Icon: CheckSquare },
  ],
  admin: [
    { label: 'dashboard.dashboard', path: '/admin/dashboard', Icon: LayoutDashboard },
    { label: 'dashboard.all_complaints', path: '/admin/complaints', Icon: FileText },
    { label: 'dashboard.officers', path: '/admin/officers', Icon: Users },
    { label: 'dashboard.departments', path: '/admin/departments', Icon: Building2 },
  ],
};

const ROLE_COLORS = {
  citizen: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Citizen' },
  officer: { bg: 'bg-green-100', text: 'text-green-800', label: 'Officer' },
  admin: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Admin' },
};

function getPageTitle(pathname, t) {
  const map = {
    '/citizen/dashboard': t('dashboard.dashboard'),
    '/citizen/file': t('dashboard.file_complaint'),
    '/citizen/complaints': t('dashboard.my_complaints'),
    '/citizen/track': t('dashboard.track'),
    '/officer/dashboard': t('dashboard.dashboard'),
    '/officer/assigned': t('dashboard.assigned'),
    '/officer/resolved': t('dashboard.resolved'),
    '/admin/dashboard': t('dashboard.dashboard'),
    '/admin/complaints': t('dashboard.all_complaints'),
    '/admin/officers': t('dashboard.officers'),
    '/admin/departments': t('dashboard.departments'),
  };
  return map[pathname] || 'JanSunwai';
}

function getInitials(name = '') {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function NotificationPanel({ userId, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = useCallback(async () => {
    if (!userId) return;
    try {
      const data = await notificationsAPI.getMyNotifications(userId);
      setNotifications(data.slice(0, 5));
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { fetchNotifs(); }, [fetchNotifs]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden"
      role="dialog"
      aria-label="Notifications panel"
    >
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-gray-800 dark:text-white text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <span className="text-[10px] font-bold bg-red-500 text-white rounded-full px-1.5 py-0.5">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1 text-xs font-semibold text-[#FF9933] hover:underline transition"
            aria-label="Mark all notifications as read"
          >
            <CheckCheck size={13} />
            Mark all read
          </button>
        )}
      </div>

      <div className="divide-y divide-gray-50 dark:divide-gray-700 max-h-80 overflow-y-auto">
        {loading ? (
          <div className="py-6 flex items-center justify-center">
            <div className="w-5 h-5 rounded-full border-2 border-gray-200 border-t-[#FF9933] animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-8 text-center">
            <Bell size={24} className="text-gray-300 mx-auto mb-2" />
            <p className="text-xs text-gray-400">No notifications yet</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition cursor-pointer relative ${
                !notif.read ? 'border-l-2 border-blue-500' : ''
              }`}
            >
              {!notif.read && (
                <div className="absolute top-3.5 right-4 w-2 h-2 rounded-full bg-blue-500" aria-hidden="true" />
              )}
              <div className="text-sm font-semibold text-gray-800 dark:text-white pr-5">{notif.title}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 pr-5">{notif.message}</div>
              <div className="text-[11px] text-gray-400 mt-1">{timeAgo(notif.createdAt)}</div>
            </div>
          ))
        )}
      </div>

      <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700">
        <button
          onClick={onClose}
          className="w-full text-center text-xs font-semibold text-[#FF9933] hover:underline transition"
        >
          View all notifications
        </button>
      </div>
    </motion.div>
  );
}

function SidebarContent({ navItems, user, initials, roleStyle, t, logout }) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #FF9933, #E8870D)' }}
          >
            <Shield size={18} color="white" strokeWidth={2.2} />
          </div>
          <div>
            <div className="text-white font-bold text-sm leading-none">JanSunwai</div>
            <div className="text-[10px] text-blue-300 mt-0.5 font-medium tracking-wide uppercase">Grievance Portal</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto" aria-label="Main navigation">
        {navItems.map(({ label, path, Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all relative group ${
                isActive
                  ? 'text-[#FF9933] bg-white/10'
                  : 'text-blue-200 hover:text-white hover:bg-white/5'
              }`
            }
            aria-label={t(label)}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-[#FF9933]" />
                )}
                <Icon size={17} strokeWidth={isActive ? 2.2 : 1.8} />
                <span>{t(label)}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5 mb-2">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #FF9933, #E8870D)' }}
            aria-hidden="true"
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-sm font-semibold truncate">{user?.name}</div>
            <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-full ${roleStyle.bg} ${roleStyle.text}`}>
              {roleStyle.label}
            </span>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition text-sm font-medium"
          aria-label="Logout"
        >
          <LogOut size={16} />
          {t('dashboard.logout')}
        </button>
      </div>
    </div>
  );
}

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { dark, toggle: toggleTheme } = useTheme();
  const { t } = useTranslation();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  const navItems = NAV_ITEMS[user?.role] || [];
  const roleStyle = ROLE_COLORS[user?.role] || ROLE_COLORS.citizen;
  const pageTitle = getPageTitle(location.pathname, t);
  const initials = getInitials(user?.name);

  useEffect(() => {
    function handleClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    }
    if (notifOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [notifOpen]);

  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  const sidebarProps = { navItems, user, initials, roleStyle, t, logout };

  return (
    <div className="flex h-screen bg-[#F0F4F8] dark:bg-gray-900 overflow-hidden transition-colors duration-300">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-navy focus:rounded-lg focus:font-semibold focus:shadow-lg"
      >
        Skip to content
      </a>

      <aside className="hidden lg:flex w-64 flex-col flex-shrink-0 bg-[#0C2340]">
        <SidebarContent {...sidebarProps} />
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed top-0 left-0 h-full w-64 bg-[#0C2340] z-50 flex flex-col"
              aria-label="Mobile navigation"
            >
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition"
                aria-label="Close navigation"
              >
                <X size={20} />
              </button>
              <SidebarContent {...sidebarProps} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 md:px-6 h-16 flex items-center gap-4 flex-shrink-0 transition-colors duration-300">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu size={20} />
          </button>

          <h1 className="text-base md:text-lg font-bold text-[#0C2340] dark:text-white flex-1">{pageTitle}</h1>

          <div className="flex items-center gap-2 md:gap-3">
            <LanguageSelector />

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-600 dark:text-gray-300"
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={dark ? 'sun' : 'moon'}
                  initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  {dark ? <Sun size={20} /> : <Moon size={20} />}
                </motion.div>
              </AnimatePresence>
            </button>

            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-600 dark:text-gray-300"
                aria-label="Open notifications"
                aria-expanded={notifOpen}
              >
                <Bell size={20} />
                <span
                  className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center"
                  aria-hidden="true"
                >
                  2
                </span>
              </button>
              <AnimatePresence>
                {notifOpen && (
                  <NotificationPanel userId={user?.id} onClose={() => setNotifOpen(false)} />
                )}
              </AnimatePresence>
            </div>

            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #FF9933, #E8870D)' }}
              aria-label={`Logged in as ${user?.name}`}
            >
              {initials}
            </div>
          </div>
        </header>

        <main id="main-content" className="flex-1 overflow-y-auto p-4 md:p-6 transition-colors duration-300">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
