import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../contexts/ToastContext';
import DesignationSelect from './DesignationSelect';
import HospitalAutocomplete from './HospitalAutocomplete';
import VoiceInputButton from './VoiceInputButton';

export default function ProfileComplete() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, completeProfile } = useAuth();
  const { toast } = useToast();

  const initial = (location.state as {
    firstName?: string;
    lastName?: string;
    countryCode?: string;
    countryIso?: string;
    mobile?: string;
  }) || {};

  const sessionName = user?.name || '';
  const spaceIdx = sessionName.indexOf(' ');
  const initialFirstName = initial.firstName || (spaceIdx > -1 ? sessionName.slice(0, spaceIdx) : sessionName);
  const initialLastName = initial.lastName || (spaceIdx > -1 ? sessionName.slice(spaceIdx + 1) : sessionName);

  const [designation, setDesignation] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [hospital, setHospital] = useState('');
  const [bio, setBio] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    const newErrors: Record<string, string> = {};

    if (!designation.trim()) newErrors.designation = 'Please select or enter your designation';
    if (!specialization.trim()) newErrors.specialization = 'Specialization is required';
    if (!hospital.trim()) newErrors.hospital = 'Hospital is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast('Please complete all required fields.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await completeProfile({
        firstName: initialFirstName,
        lastName: initialLastName,
        designation: designation.trim(),
        specializationId: specialization.trim(),
        hospital: hospital.trim(),
        countryCode: initial.countryCode || '+1',
        countryIso: initial.countryIso || 'US',
        mobile: (initial.mobile || '').trim(),
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
          {/* Enhanced Designation selector with search, alphabetical sorting, and custom creation */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Designation</label>
            <DesignationSelect
              id="complete-designation"
              value={designation}
              onChange={(val) => {
                setDesignation(val);
                if (errors.designation) setErrors({ ...errors, designation: '' });
              }}
              error={errors.designation}
            />
          </div>

          {/* Mandatory Specialization text input for doctors */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">
              Specialization <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="complete-specialization"
              value={specialization}
              onChange={(e) => {
                setSpecialization(e.target.value);
                if (errors.specialization) setErrors({ ...errors, specialization: '' });
              }}
              placeholder="Enter your specialization"
              className={`w-full px-4 py-2.5 bg-white border ${
                errors.specialization ? 'border-rose-400' : 'border-slate-200'
              } rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-100 transition-all`}
            />
            {errors.specialization && <p className="text-[10px] text-rose-500 mt-1">{errors.specialization}</p>}
          </div>

          {/* Hospital Autocomplete with DB persistence */}
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Hospital / Institution</label>
            <HospitalAutocomplete
              id="complete-hospital"
              value={hospital}
              onChange={(val) => {
                setHospital(val);
                if (errors.hospital) setErrors({ ...errors, hospital: '' });
              }}
              error={errors.hospital}
            />
          </div>

          {/* Short Bio with Voice-to-Text */}
          <div className="sm:col-span-2">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">Short Bio</label>
              <VoiceInputButton
                id="bio-voice-btn"
                onTranscript={(text) => setBio((prev) => (prev ? `${prev} ${text}`.trim() : text.trim()))}
              />
            </div>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Accredited specialist focused on collaborative diagnostics."
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-100 transition-all"
              id="complete-bio"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-xl text-sm font-bold shadow-lg shadow-slate-950/10 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 ${
                isLoading ? 'bg-slate-400 text-slate-100' : 'bg-black text-white hover:bg-slate-900'
              }`}
              id="complete-submit-btn"
            >
              {isLoading ? 'Saving…' : 'Save & Enter Portal'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
