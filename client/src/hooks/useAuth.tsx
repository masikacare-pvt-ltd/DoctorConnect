import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useSession } from '../lib/auth-client';
import * as authApi from '../services/auth.service';
import type { Profile } from '../types/domain';
import type { LoginInput, SignupInput, ProfileInput } from '../validation';

interface AuthUser {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null;
  role: string;
  approvalStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthContextValue {
  user: AuthUser | null;
  profile: Profile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isProfileComplete: boolean;
  isAdmin: boolean;
  isApproved: boolean;
  userRole: string;
  approvalStatus: string;
  register: (input: SignupInput) => Promise<void>;
  login: (input: LoginInput) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  completeProfile: (input: ProfileInput & { gender?: string }) => Promise<Profile>;
  updateProfile: (input: ProfileInput & { gender?: string }) => Promise<Profile>;
  uploadAvatar: (imageData: string) => Promise<Profile>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (session?.user) {
      setProfileLoaded(false);
      authApi.fetchProfile().then((p) => {
        if (cancelled) return;
        if (p) setProfile(p);
        setProfileLoaded(true);
      });
    } else if (!isPending) {
      setProfile(null);
      setProfileLoaded(true);
    }
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id, isPending]);

  const userWithRole = useMemo(() => {
    const u = session?.user as any;
    if (!u) return null;
    return {
      ...u,
      role: u.role || 'doctor',
      approvalStatus: u.approvalStatus || 'pending',
    } as AuthUser;
  }, [session?.user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: userWithRole,
      profile,
      loading: isPending || !profileLoaded,
      isAuthenticated: !!userWithRole,
      isProfileComplete: !!(profile?.firstName && profile?.specializationId),
      isAdmin: userWithRole?.role === 'admin',
      isApproved: userWithRole?.approvalStatus === 'approved',
      userRole: userWithRole?.role || 'doctor',
      approvalStatus: userWithRole?.approvalStatus || 'pending',
      register: (input) => authApi.register(input),
      login: (input) => authApi.login(input),
      loginWithGoogle: () => authApi.loginWithGoogle(),
      logout: () => authApi.logout(),
      resetPassword: (email) => authApi.resetPassword(email),
      completeProfile: (input) => authApi.completeProfile(input).then(p => { setProfile(p); return p; }),
      updateProfile: (input) => authApi.updateProfile(input).then(p => { setProfile(p); return p; }),
      uploadAvatar: (imageData) => authApi.uploadAvatar(imageData).then(p => { setProfile(p); return p; }),
    }),
    [userWithRole, profile, isPending, profileLoaded],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
