import React, { useState, useEffect, useRef } from 'react';
import { Bell, ShieldCheck, Mail, Phone, Award, Save, Building, Camera } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../contexts/ToastContext';
import { useCases } from '../hooks/useCases';
import { useBookmarks } from '../hooks/useBookmarks';
import { useNotifications } from '../hooks/useNotifications';
import { useSpecializations } from '../hooks/useSpecializations';
import { getAvatarUrl } from '../utils/avatar';
import { DESIGNATIONS, GENDERS } from '../utils/constants';
import AppShell from './AppShell';

export default function ProfileScreen() {
  const { user, profile, updateProfile, uploadAvatar } = useAuth();
  const { toast } = useToast();
  const { cases } = useCases();
  const { bookmarkIds } = useBookmarks();
  const { unreadCount } = useNotifications();
  const { specializations } = useSpecializations();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({ firstName: '', lastName: '', designation: '', specializationId: '', hospital: '', mobile: '', bio: '', gender: 'male' });
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        firstName: profile.firstName,
        lastName: profile.lastName,
        designation: profile.designation,
        specializationId: profile.specializationId,
        hospital: profile.hospital,
        mobile: profile.mobile,
        bio: profile.bio,
        gender: profile.gender || 'male',
      });
    }
  }, [profile]);

  const activeUser = profile || { firstName: 'Doctor', lastName: '', designation: '', avatarUrl: '', avatarData: '', gender: 'male', email: '' };
  const doctorFullName = `Dr. ${activeUser.firstName} ${activeUser.lastName}`.trim();
  const currentUserId = user?.id;
  const myCases = cases.filter((c) => c.authorUid === currentUserId).length;
  const designations = DESIGNATIONS;

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

  return (
    <AppShell>
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-6 py-4 flex items-center justify-between gap-4">
          <h1 className="text-sm font-bold text-slate-900 dark:text-white">My Profile</h1>
          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-xl relative"><Bell className="w-5 h-5" />{unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white" />}</button>
          </div>
        </header>

        <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center">
              <div className="relative inline-block">
                <img src={avatarSrc} alt="avatar" referrerPolicy="no-referrer" className="w-20 h-20 rounded-full border border-slate-200 mx-auto shadow-sm object-cover" />
                <button onClick={() => fileInputRef.current?.click()} disabled={uploadingAvatar} className="absolute bottom-0 right-0 w-7 h-7 bg-black text-white rounded-full flex items-center justify-center shadow-md hover:bg-slate-800 transition-colors">
                  <Camera className="w-3.5 h-3.5" />
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              </div>
              {uploadingAvatar && <p className="text-[10px] text-indigo-600 mt-1">Uploading...</p>}
              <h2 className="text-lg font-bold text-slate-950 font-display mt-3">{doctorFullName}</h2>
              <p className="text-xs text-slate-400">{activeUser.designation}</p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-700 text-[10px] font-bold mt-3"><ShieldCheck className="w-3 h-3" />Verified Physician</div>
              <div className="grid grid-cols-3 gap-2 mt-5">
                <div className="bg-slate-50 rounded-xl p-3"><span className="block text-sm font-bold text-slate-900 font-mono">{myCases}</span><span className="block text-[9px] text-slate-400 uppercase">Cases</span></div>
                <div className="bg-slate-50 rounded-xl p-3"><span className="block text-sm font-bold text-slate-900 font-mono">{bookmarkIds.size}</span><span className="block text-[9px] text-slate-400 uppercase">Saved</span></div>
                <div className="bg-slate-50 rounded-xl p-3"><span className="block text-sm font-bold text-slate-900 font-mono">{profile?.credentials?.length ?? 0}</span><span className="block text-[9px] text-slate-400 uppercase">Creds</span></div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-indigo-500" />
                <h3 className="text-sm font-bold text-slate-900 font-display">Professional Details</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">First Name</label>
                  <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-100" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Last Name</label>
                  <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-100" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input value={user?.email || ''} disabled className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Mobile</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-100" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Gender</label>
                  <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-100">
                    {GENDERS.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Designation</label>
                  <select value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-100">
                    <option disabled>Select Designation</option>
                    {designations.map((d) => (<option key={d} value={d}>{d}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Specialization</label>
                  <select value={form.specializationId} onChange={(e) => setForm({ ...form, specializationId: e.target.value })} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-100">
                    <option disabled value="">Select Specialization</option>
                    {specializations.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Hospital / Institution</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input value={form.hospital} onChange={(e) => setForm({ ...form, hospital: e.target.value })} className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-100" />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Bio</label>
                  <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-100" />
                </div>
              </div>
              <div className="pt-2 flex justify-end">
                <button type="submit" disabled={loading} className="px-5 py-2.5 bg-black hover:bg-slate-900 text-white rounded-lg text-xs font-bold shadow-md active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-60"><Save className="w-4 h-4" />{loading ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </main>
    </AppShell>
  );
}
