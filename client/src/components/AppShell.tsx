import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, MessageSquare, User, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../contexts/ToastContext';

interface AppShellProps {
  children: React.ReactNode;
}

const navItems = [
  { label: 'Home', icon: Home, path: '/dashboard' },
  { label: 'Cases', icon: MessageSquare, path: '/cases' },
  { label: 'Profile', icon: User, path: '/profile' },
];

export default function AppShell({ children }: AppShellProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try { await logout(); } catch {}
    toast('Securely logged out.', 'info');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row font-sans transition-colors duration-200 pb-16 md:pb-0">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-48 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-black dark:bg-indigo-600 flex items-center justify-center shadow-sm">
              <span className="text-white text-lg font-bold">+</span>
            </div>
            <div>
              <span className="text-sm font-extrabold tracking-tight text-slate-950 dark:text-white font-display block leading-none">MedConnect</span>
              <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold tracking-wider uppercase mt-0.5 block">Doctor Portal</span>
            </div>
          </div>
          <nav className="space-y-1">
            {navItems.map(({ label, icon: Icon, path }) => {
              const active = location.pathname === path;
              return (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    active
                      ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10 dark:bg-slate-800'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              );
            })}
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all mt-6"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
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
                active ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
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
