import React from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
    </div>
  );
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isProfileComplete, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isProfileComplete) return <Navigate to="/complete-profile" replace />;
  return <>{children}</>;
}

export function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isProfileComplete, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (isAuthenticated && isProfileComplete) return <Navigate to="/dashboard" replace />;
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
