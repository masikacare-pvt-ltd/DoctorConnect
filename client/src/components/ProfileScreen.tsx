ï»¿import React, { useState, useEffect, useRef } from 'react';
import { Bell, ShieldCheck, Mail, Save, Camera, Eye, EyeOff, Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../contexts/ToastContext';
import { fetchCases } from '../services/case.service';
import { useBookmarks } from '../hooks/useBookmarks';
import { useNotifications } from '../hooks/useNotifications';
import { authClient } from '../lib/auth-client';
import { getAvatarUrl } from '../utils/avatar';
import { GENDERS } from '../utils/constants';
import AppShell from './AppShell';
import PhoneInput from './PhoneInput';
import DesignationSelect from './DesignationSelect';
import HospitalAutocomplete from './HospitalAutocomplete';
import VoiceInputButton from './VoiceInputButton';

export default function ProfileScreen() {
  const { user, profile, updateProfile, uploadAvatar } = useAuth();
  const { toast } = useToast();
  const { bookmarkIds } = useBookmarks();
  const { unreadCount } = useNotifications();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [myCaseCount, setMyCaseCount] = useState(0);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    designation: '',
    specializationId: '',
    hospital: '',
    countryCode: '+1',
    countryIso: 'US',
    mobile: '',
    bio: '',
    gender: 'male',
  });
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchCases({ authorId: user.id, page: 1, limit: 1 }).then(r => setMyCaseCount(r.total)).catch(() => {});
    }
  }, [user?.id]);

  useEffect(() => {
    if (profile) {
      setForm({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        designation: profile.designation || '',
        specializationId: profile.specializationId || '',
        hospital: profile.hospital || '',
        countryCode: profile.countryCode || '+1',
        countryIso: profile.countryIso || 'US',
        mobile: profile.mobile || '',
        bio: profile.bio || '',
        gender: profile.gender || 'male',
      });
    }
  }, [profile]);

  const activeUser = profile || { firstName: 'Medical Professional', lastName: '', designation: '', avatarUrl: '', avatarData: '', gender: 'male', email: '' };
  const doctorFullName = `Dr. ${activeUser.firstName} ${activeUser.lastName}`.trim();

  const avatarSrc = getAvatarUrl(activeUser);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast('Image must be under 5MB.', 'error'); return; }
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      setUploadingAvatar(true);
      try {
        await uploadAvatar(dataUrl);
        toast('Avatar updated!', 'success');
      } catch (err: any) {
        toast(err?.message || 'Failed to upload avatar.', 'error');
      } finally {
        setUploadingAvatar(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({ ...form });
      toast('Profile updated.', 'success');
    } catch (err: any) {
      toast(err?.message || 'Failed to update profile.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast('Passwords do not match.', 'error');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast('Password must be at least 6 characters.', 'error');
      return;
    }
    setPasswordLoading(true);
    try {
      const { error } = await (authClient as any).changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      if (error) throw new Error(error.message || 'Failed to change password');
      toast('Password changed successfully.', 'success');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      toast(err?.message || 'Failed to change password.', 'error');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <AppShell>
      <header className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-6 py-4 flex items-center justify-between gap-4">
        <h1 className="text-base font-bold text-slate-900 dark:text-white font-display">My Profile</h1>
        <div className="flex items-center gap-3">
          <button className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl relative transition-colors">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white" />}
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-y-auto">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 text-center">
            <div className="relative inline-block">
              <img src={avatarSrc} alt="avatar" referrerPolicy="no-referrer" className="w-20 h-20 rounded-full border border-slate-200 dark:border-slate-700 mx-auto shadow-sm object-cover" />
              <button onClick={() => fileInputRef.current?.click()} disabled={uploadingAvatar} className="absolute bottom-0 right-0 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-blue-700 transition-colors">
                <Camera className="w-3.5 h-3.5" />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </div>
            {uploadingAvatar && <p className="text-[10px] text-blue-600 mt-1">Uploading avatarÃ¢â‚¬Â¦</p>}
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display mt-3">{doctorFullName}</h2>
            <p className="text-xs text-slate-400">{activeUser.designation || 'Physician'}</p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900 rounded-full text-emerald-600 dark:text-emerald-400 text-[10px] font-bold mt-3">
              <ShieldCheck className="w-3 h-3" />Verified Physician
            </div>
            <div className="grid grid-cols-3 gap-2 mt-5">
              <div className="bg-[#F8FAFC] dark:bg-slate-800 rounded-2xl p-3"><span className="block text-sm font-bold text-slate-900 dark:text-slate-100 font-mono">{myCaseCount}</span><span className="block text-[9px] text-slate-400 uppercase font-semibold">Cases</span></div>
              <div className="bg-[#F8FAFC] dark:bg-slate-800 rounded-2xl p-3"><span className="block text-sm font-bold text-slate-900 dark:text-slate-100 font-mono">{bookmarkIds.size}</span><span className="block text-[9px] text-slate-400 uppercase font-semibold">Saved</span></div>
              <div className="bg-[#F8FAFC] dark:bg-slate-800 rounded-2xl p-3"><span className="block text-sm font-bold text-slate-900 dark:text-slate-100 font-mono">{profile?.credentials?.length ?? 0}</span><span className="block text-[9px] text-slate-400 uppercase font-semibold">Creds</span></div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">Professional Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">First Name</label>
                <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Last Name</label>
                <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input value={user?.email || ''} disabled className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-400" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Mobile</label>
                <PhoneInput
                  value={form.mobile}
                  countryCode={form.countryCode}
                  countryIso={form.countryIso}
                  onChange={(num, code, iso) => setForm({ ...form, mobile: num, countryCode: code, countryIso: iso })}
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Gender</label>
                <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all">
                  {GENDERS.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Designation</label>
                <DesignationSelect
                  value={form.designation}
                  onChange={(val) => setForm({ ...form, designation: val })}
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Specialization</label>
                <input
                  type="text"
                  value={form.specializationId}
                  onChange={(e) => setForm({ ...form, specializationId: e.target.value })}
                  placeholder="Enter your specialization"
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Hospital / Institution</label>
                <HospitalAutocomplete
                  value={form.hospital}
                  onChange={(val) => setForm({ ...form, hospital: val })}
                />
              </div>
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300">Bio</label>
                  <VoiceInputButton
                    id="profile-bio-voice-btn"
                    onTranscript={(text) => setForm((prev) => ({ ...prev, bio: prev.bio ? `${prev.bio} ${text}`.trim() : text.trim() }))}
                  />
                </div>
                <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all" />
              </div>
            </div>
            <div className="pt-2 flex justify-end">
              <button type="submit" disabled={loading} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-60">
                <Save className="w-4 h-4" />{loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>

          <form onSubmit={handlePasswordChange} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">Change Password</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Current Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type={showPassword.current ? 'text' : 'password'} value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} placeholder="Current" className="w-full pl-10 pr-9 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all" />
                  <button type="button" onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type={showPassword.new ? 'text' : 'password'} value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} placeholder="New password" className="w-full pl-10 pr-9 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all" />
                  <button type="button" onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Confirm New</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type={showPassword.confirm ? 'text' : 'password'} value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} placeholder="Confirm new" className="w-full pl-10 pr-9 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all" />
                  <button type="button" onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
            <div className="pt-2 flex justify-end">
              <button type="submit" disabled={passwordLoading} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-60">
                <Lock className="w-4 h-4" />{passwordLoading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </AppShell>
  );
}