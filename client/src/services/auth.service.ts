import { authClient } from '../lib/auth-client';
import { apiPost, apiGet, apiPatch } from '../lib/api';
import type { Profile } from '../types/domain';
import type { ProfileInput, SignupInput, LoginInput } from '../validation';

interface RawProfile {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatarData?: string;
  avatarUrl?: string;
  image?: string;
  gender?: string;
  designation?: string;
  specialization?: string;
  hospital?: string;
  mobile?: string;
  bio?: string;
  credentials?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export async function register(input: SignupInput): Promise<void> {
  const { error } = await authClient.signUp.email({
    email: input.email,
    password: input.password,
    name: `${input.firstName} ${input.lastName}`,
  });
  if (error) throw new Error(error.message);
}

export async function login(input: LoginInput): Promise<void> {
  const { error, data } = await authClient.signIn.email({
    email: input.email,
    password: input.password,
  });
  if (error) throw new Error(error.message);
  if (!data?.session) throw new Error('Login succeeded but no session returned.');
}

export async function loginWithGoogle(): Promise<void> {
  const { error } = await authClient.signIn.social({ provider: "google" });
  if (error) throw new Error(error.message);
}

export async function logout(): Promise<void> {
  const { error } = await authClient.signOut();
  if (error) throw new Error(error.message || 'Failed to sign out');
}

export async function resetPassword(email: string): Promise<void> {
  const { error } = await (authClient as any).forgetPassword({ email, redirectTo: "/reset-password" });
  if (error) throw new Error(error.message);
}

async function mapProfile(raw: RawProfile): Promise<Profile> {
  return {
    firstName: raw.firstName || '',
    lastName: raw.lastName || '',
    displayName: raw.displayName || '',
    avatarUrl: raw.avatarData || raw.avatarUrl || raw.image || '',
    avatarData: raw.avatarData || '',
    gender: raw.gender || 'male',
    designation: raw.designation || '',
    specializationId: raw.specialization || '',
    hospital: raw.hospital || '',
    mobile: raw.mobile || '',
    bio: raw.bio || '',
    credentials: raw.credentials || [],
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || new Date().toISOString(),
  };
}

export async function completeProfile(input: ProfileInput & { gender?: string }): Promise<Profile> {
  const { data } = await apiPost('/api/profile/complete', {
    firstName: input.firstName,
    lastName: input.lastName,
    designation: input.designation,
    specializationId: input.specializationId,
    hospital: input.hospital,
    mobile: input.mobile,
    bio: input.bio,
    gender: input.gender || 'male',
  });
  return mapProfile(data);
}

export async function updateProfile(input: ProfileInput & { gender?: string }): Promise<Profile> {
  const { data } = await apiPatch('/api/profile', {
    firstName: input.firstName,
    lastName: input.lastName,
    designation: input.designation,
    specializationId: input.specializationId,
    hospital: input.hospital,
    mobile: input.mobile,
    bio: input.bio,
    gender: input.gender,
  });
  return mapProfile(data);
}

export async function uploadAvatar(imageData: string): Promise<Profile> {
  const { data } = await apiPost('/api/profile/avatar', { imageData });
  return mapProfile(data);
}

export async function fetchProfile(): Promise<Profile | null> {
  try {
    const { data } = await apiGet('/api/profile/me');
    if (!data) return null;
    return mapProfile(data);
  } catch {
    return null;
  }
}
