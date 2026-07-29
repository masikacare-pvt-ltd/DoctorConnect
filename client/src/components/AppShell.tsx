import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ClipboardList, User, LogOut, Stethoscope, UserPlus, ChevronLeft, ChevronRight } from 'lucide-react';
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
      <aside className={`hidden md:flex relative ${collapsed ? 'w-16 p-2.5' : 'w-48 p-3.5'} bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex-col justify-between shrink-0 select-none transition-all duration-300`}>
        {/* Floating Edge Collapse Toggle Button matching reference */}
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
          {/* Logo Header */}
          <div className={`flex items-center ${collapsed ? 'justify-center mb-6' : 'mb-6 px-1'}`}>
            <div className="flex items-center gap-2">
              <div className="text-blue-600 dark:text-blue-400 shrink-0">
                <Stethoscope className="w-6 h-6 stroke-[2.2]" />
              </div>
              {!collapsed && (
                <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white font-display">
                  MedConnect
                </span>
              )}
            </div>
          </div>

          {/* Navigation items */}
          <nav className="space-y-1">
            {navItems.map(({ label, icon: Icon, path }) => {
              const active = location.pathname === path;
              return (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  title={collapsed ? label : undefined}
                  className={`w-full flex items-center ${collapsed ? 'justify-center px-2 py-2.5' : 'gap-2.5 px-3 py-2.5'} rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-[#EEF2FF] text-[#3B82F6] dark:bg-blue-950/50 dark:text-blue-400 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className={`p-1 rounded-lg shrink-0 ${active ? 'bg-[#3B82F6] text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  {!collapsed && <span>{label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        <div>
          {/* Bottom Card Banner */}
          {!collapsed && (
            <div className="bg-gradient-to-b from-blue-50/50 to-indigo-50/30 dark:from-slate-800/40 dark:to-slate-800/20 border border-blue-100/60 dark:border-slate-700/50 rounded-xl p-3 mb-3 relative overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-blue-100/80 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2">
                <UserPlus className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-[11px] font-bold text-slate-900 dark:text-slate-100 mb-0.5">
                Connect. Share. Heal.
              </h4>
              <p className="text-[10px] text-slate-400 leading-snug">
                Building a community of trusted medical professionals.
              </p>
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
