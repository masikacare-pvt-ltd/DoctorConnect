import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { isAdminAuthenticated } from '../lib/adminApi';

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
    </div>
  );
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isProfileComplete, isApproved, loading } = useAuth();
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => setTimedOut(true), 5000);
    return () => clearTimeout(t);
  }, [loading]);

  if (loading && !timedOut) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isProfileComplete) return <Navigate to="/complete-profile" replace />;
  if (!isApproved) return <Navigate to="/pending-approval" replace />;
  return <>{children}</>;
}

export function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isProfileComplete, isApproved, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (isAuthenticated && isProfileComplete && !isApproved) return <Navigate to="/pending-approval" replace />;
  if (isAuthenticated && isProfileComplete && isApproved) return <Navigate to="/dashboard" replace />;
  if (isAuthenticated && !isProfileComplete) return <Navigate to="/complete-profile" replace />;
  return <>{children}</>;
}

export function ProfileRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isProfileComplete, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (isProfileComplete) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const ok = isAdminAuthenticated();
    setAuthed(ok);
    setChecking(false);
  }, []);

  if (checking) return <LoadingScreen />;
  if (!authed) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}
