import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ClipboardList, User, LogOut, UserPlus, ChevronLeft, ChevronRight, Activity } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../contexts/ToastContext';

interface AppShellProps {
  children: React.ReactNode;
}

const navItems = [
  { label: 'Home', icon: Home, path: '/dashboard' },
  { label: 'Cases', icon: ClipboardList, path: '/cases' },
  { label: 'Profile', icon: User, path: '/profile' },
];

export default function AppShell({ children }: AppShellProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { toast } = useToast();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    try { await logout(); } catch { /* ignore */ }
    toast('Securely logged out.', 'info');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 flex flex-col md:flex-row font-sans transition-colors duration-200 pb-16 md:pb-0">
      {/* Desktop sidebar */}
      <aside className={`hidden md:flex relative ${collapsed ? 'w-16 p-2.5' : 'w-60 p-4'} bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex-col justify-between shrink-0 select-none transition-all duration-300`}>
        {/* Floating Edge Collapse Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3.5 top-6 z-20 w-7 h-7 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white shadow-sm hover:shadow transition-all duration-200 hover:scale-105 active:scale-95"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5 stroke-[2.5]" />
          )}
        </button>

        <div>
          {/* Logo Header matching reference */}
          <div className={`flex items-center ${collapsed ? 'justify-center mb-8' : 'mb-8 px-1'}`}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0B132B] dark:bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <div className="w-5 h-5 border-2 border-white rounded-md flex items-center justify-center p-0.5">
                  <Activity className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              </div>
              {!collapsed && (
                <span className="text-lg font-bold tracking-tight text-[#0B132B] dark:text-white font-sans">
                  MedConnect
                </span>
              )}
            </div>
          </div>

          {/* Navigation items */}
          <nav className="space-y-1.5">
            {navItems.map(({ label, icon: Icon, path }) => {
              const active = location.pathname === path;
              return (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  title={collapsed ? label : undefined}
                  className={`w-full flex items-center ${collapsed ? 'justify-center px-2 py-3' : 'gap-3.5 px-4 py-3'} rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? 'bg-[#0B132B] text-white dark:bg-blue-600 dark:text-white shadow-sm font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${active ? 'text-white' : 'text-slate-700 dark:text-slate-300'}`} />
                  {!collapsed && <span className="text-sm">{label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        <div>
          {/* Bottom Card Banner matching reference screenshot */}
          {!collapsed && (
            <div className="bg-white dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl p-4 mb-4 relative overflow-hidden shadow-2xs">
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center mb-3">
                <UserPlus className="w-4 h-4 stroke-[2]" />
              </div>
              <h4 className="text-xs font-bold text-[#0B132B] dark:text-slate-100 mb-1">
                Connect. Share. Heal.
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                Building a community of trusted medical professionals.
              </p>
              {/* Heartbeat ECG wave illustration matching reference */}
              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/40 flex items-center justify-between text-slate-300 dark:text-slate-600">
                <svg className="w-full h-6" viewBox="0 0 160 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M 0 12 L 35 12 L 42 4 L 50 20 L 58 1 L 66 23 L 74 12 L 130 12" />
                  <path d="M 138 9 C 136 6, 132 8, 135 12 L 138 15 L 141 12 C 144 8, 140 6, 138 9 Z" fill="currentColor" opacity="0.4" />
                </svg>
              </div>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            title={collapsed ? "Logout" : undefined}
            className={`w-full flex items-center ${collapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-4 py-2.5'} rounded-xl text-xs font-semibold text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-around py-2 px-2 md:hidden shadow-lg">
        {navItems.map(({ label, icon: Icon, path }) => {
          const active = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                active ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[9px] font-semibold">{label}</span>
            </button>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-rose-500"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-[9px] font-semibold">Logout</span>
        </button>
      </nav>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
    </div>
  );
}

