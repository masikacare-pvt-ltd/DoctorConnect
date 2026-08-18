import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Trash2, LogOut, ClipboardList } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { clearAdminToken } from '../lib/adminApi';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { label: 'Medical Professionals', icon: Users, path: '/admin/doctors' },
  { label: 'Cases', icon: FileText, path: '/admin/cases' },
  { label: 'AI Reports', icon: ClipboardList, path: '/admin/reports' },
];

const recycleItem = { label: 'Recycle Bin', icon: Trash2, path: '/admin/recycle-bin' };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleLogout = () => {
    clearAdminToken();
    toast('Logged out.', 'info');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row pb-16 md:pb-0">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 bg-white border-r border-slate-200 p-4 flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center shadow-sm">
              <span className="text-white text-lg font-bold">+</span>
            </div>
            <div>
              <span className="text-sm font-extrabold tracking-tight text-slate-950 block leading-none">MedConnect</span>
              <span className="text-[9px] text-slate-400 font-semibold tracking-wider uppercase block">Admin Panel</span>
            </div>
          </div>
          <nav className="space-y-1">
            {navItems.map(({ label, icon: Icon, path }) => {
              const active = path === '/admin' ? location.pathname === path : location.pathname.startsWith(path);
              return (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    active
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'text-slate-500 hover:text-slate-950 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="space-y-1">
          <button
            onClick={() => navigate(recycleItem.path)}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              recycleItem.path === '/admin' ? location.pathname === recycleItem.path : location.pathname.startsWith(recycleItem.path)
                ? 'bg-red-100 text-red-700'
                : 'text-red-500 hover:text-red-700 hover:bg-red-50'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            {recycleItem.label}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 flex items-center justify-around py-2 px-2 md:hidden shadow-lg">
        {navItems.map(({ label, icon: Icon, path }) => {
          const active = path === '/admin' ? location.pathname === path : location.pathname.startsWith(path);
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors ${
                active ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[8px] font-semibold">{label}</span>
            </button>
          );
        })}
        <button
          onClick={() => navigate(recycleItem.path)}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors ${
            recycleItem.path === '/admin' ? location.pathname === recycleItem.path : location.pathname.startsWith(recycleItem.path)
              ? 'text-red-600' : 'text-red-500'
          }`}
        >
          <Trash2 className="w-5 h-5" />
          <span className="text-[8px] font-semibold">{recycleItem.label}</span>
        </button>
        <button onClick={handleLogout} className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-rose-500">
          <LogOut className="w-5 h-5" />
          <span className="text-[8px] font-semibold">Logout</span>
        </button>
      </nav>

      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
    </div>
  );
}
