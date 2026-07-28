import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Building, Award } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../contexts/ToastContext';
import { useSpecializations } from '../hooks/useSpecializations';

import { DESIGNATIONS } from '../utils/constants';

export default function ProfileComplete() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, completeProfile } = useAuth();
  const { toast } = useToast();
  const { specializations } = useSpecializations();

  const initial = (location.state as { firstName?: string; lastName?: string }) || {};

  const sessionName = user?.name || '';
  const spaceIdx = sessionName.indexOf(' ');
  const initialFirstName = initial.firstName || (spaceIdx > -1 ? sessionName.slice(0, spaceIdx) : sessionName);
  const initialLastName = initial.lastName || (spaceIdx > -1 ? sessionName.slice(spaceIdx + 1) : sessionName);

  const [designation, setDesignation] = useState('Select Designation');
  const [specializationId, setSpecializationId] = useState('');
  const [hospital, setHospital] = useState('');
  const [bio, setBio] = useState('');
  const [mobile, setMobile] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const designations = DESIGNATIONS;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    const newErrors: Record<string, string> = {};
    if (designation === 'Select Designation') newErrors.designation = 'Please select your rank';
    if (!specializationId) newErrors.specializationId = 'Please select your field';
    if (!hospital.trim()) newErrors.hospital = 'Hospital is required';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast('Please complete your profile.', 'error');
      return;
    }
    setIsLoading(true);
    try {
      await completeProfile({
        firstName: initialFirstName,
        lastName: initialLastName,
        designation,
        specializationId,
        hospital: hospital.trim(),
        mobile: mobile.trim(),
        bio: bio.trim(),
        gender: 'male',
      });
      toast('Profile completed! Welcome to MedConnect.', 'success');
      setTimeout(() => navigate('/dashboard'), 300);
    } catch (error: any) {
      toast(error?.message || 'Could not save profile.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl border border-slate-100 p-8 md:p-10 shadow-xl shadow-slate-100/40">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-slate-600 text-[10px] font-bold tracking-wider uppercase mb-4 shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-700" /> Complete Your Profile
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 font-display">A few more details</h2>
        <p className="text-slate-400 text-xs mt-1">This helps peers find and trust your clinical input.</p>

        <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Designation</label>
            <div className="relative">
              <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select value={designation} onChange={(e) => { setDesignation(e.target.value); if (errors.designation) setErrors({ ...errors, designation: '' }); }} className={`w-full pl-9 pr-4 py-2.5 bg-white border ${errors.designation ? 'border-rose-400' : 'border-slate-200'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-100 transition-all`} id="complete-designation">
                <option disabled>Select Designation</option>
                {designations.map((d) => (<option key={d} value={d}>{d}</option>))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Specialization</label>
            <select value={specializationId} onChange={(e) => { setSpecializationId(e.target.value); if (errors.specializationId) setErrors({ ...errors, specializationId: '' }); }} className={`w-full px-4 py-2.5 bg-white border ${errors.specializationId ? 'border-rose-400' : 'border-slate-200'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-100 transition-all`} id="complete-specialization">
              <option disabled value="">Select Specialization</option>
              {specializations.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Hospital / Institution</label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={hospital} onChange={(e) => { setHospital(e.target.value); if (errors.hospital) setErrors({ ...errors, hospital: '' }); }} placeholder="Saint Mary Medical Center" className={`w-full pl-9 pr-4 py-2.5 bg-white border ${errors.hospital ? 'border-rose-400' : 'border-slate-200'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-100 transition-all`} id="complete-hospital" />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Mobile</label>
            <input value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="+1 (555) 000-0000" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-100 transition-all" id="complete-mobile" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Short Bio</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} placeholder="Accredited specialist focused on collaborative diagnostics." className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-100 transition-all" id="complete-bio" />
          </div>

          <div className="sm:col-span-2">
            <button type="submit" disabled={isLoading} className={`w-full py-3 rounded-xl text-sm font-bold shadow-lg shadow-slate-950/10 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 ${isLoading ? 'bg-slate-400 text-slate-100' : 'bg-black text-white hover:bg-slate-900'}`} id="complete-submit-btn">
              {isLoading ? 'Saving…' : 'Save & Enter Portal'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
