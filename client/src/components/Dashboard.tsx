import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Search, Bell, UploadCloud, Plus, X, ChevronDown, ChevronRight, Send,
  FileText, Tag, User as UserIcon, Sparkles
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../contexts/ToastContext';
import { useSpecializations } from '../hooks/useSpecializations';
import { useNotifications } from '../hooks/useNotifications';
import { caseApi } from '../api';
import { validateImageFile } from '../utils/image';
import { getAvatarUrl } from '../utils/avatar';
import AppShell from './AppShell';
import VoiceInputButton from './VoiceInputButton';
import { ReportSelection } from './AddReportPage';

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAuth();
  const { toast } = useToast();

  const { specializations } = useSpecializations();
  const { notifications, unreadCount, markRead } = useNotifications();

  // Case form state
  const [description, setDescription] = useState('');
  const [caseType, setCaseType] = useState<'Normal' | 'Abnormal' | 'Special'>('Normal');
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [specializationId, setSpecializationId] = useState('');
  const [urgent, setUrgent] = useState(false);
  const [diseaseTags, setDiseaseTags] = useState<string[]>([]);
  const [tempTag, setTempTag] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Category state
  const [mainCategory, setMainCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');

  // Patient Info fields
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState<number | ''>('');
  const [patientGender, setPatientGender] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [chronicHistory, setChronicHistory] = useState('');
  const [geneticDisorders, setGeneticDisorders] = useState('');
  const [genderOpen, setGenderOpen] = useState(false);
  const [bloodGroupOpen, setBloodGroupOpen] = useState(false);

  // Recommendation field & Report Modal
  const [futureRecommendations, setFutureRecommendations] = useState('');
  const [selectedReportType, setSelectedReportType] = useState<string>('General Case Summary');

  useEffect(() => {
    if (specializations.length && !specializationId) setSpecializationId(specializations[0].id);
  }, [specializations, specializationId]);

  useEffect(() => {
    const t = setTimeout(() => setSearchQuery(searchInput), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => () => previews.forEach((p) => URL.revokeObjectURL(p)), [previews]);

  // Handle report selection passed back from AddReportPage via location state
  useEffect(() => {
    if (location.state?.reportSelection) {
      handleReportSelect(location.state.reportSelection);
      // Clear the state so it doesn't re-trigger on re-render
      window.history.replaceState({}, '', location.pathname);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReportSelect = (selection: ReportSelection) => {
    setMainCategory(selection.mainCategory);
    setSubCategory(selection.subCategory);
    setSelectedReportType(selection.testItem);
    if (selection.tags && selection.tags.length) {
      const combined = Array.from(new Set([...diseaseTags, ...selection.tags]));
      setDiseaseTags(combined);
    }
    toast(`Selected ${selection.mainCategory} â†’ ${selection.testItem}`, 'success');
  };

  const handleAddTag = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (tempTag.trim() && !diseaseTags.includes(tempTag.trim())) {
      setDiseaseTags([...diseaseTags, tempTag.trim()]);
      setTempTag('');
    }
  };

  const handleRemoveTag = (tag: string) => setDiseaseTags(diseaseTags.filter((t) => t !== tag));

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadError(null);
    for (const file of Array.from(files)) {
      const err = validateImageFile(file);
      if (err) {
        setUploadError(err);
        toast(err, 'error');
        continue;
      }
      setSelectedFiles((prev) => [...prev, file]);
      setPreviews((prev) => [...prev, URL.createObjectURL(file)]);
    }
  };

  const handleFileSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => handleFiles(e.target.files);
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragActive(true); };
  const handleDragLeave = () => setDragActive(false);
  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setDragActive(false); handleFiles(e.dataTransfer.files); };
  const handleTriggerUpload = () => fileInputRef.current?.click();

  const handleClearFiles = () => {
    previews.forEach((p) => URL.revokeObjectURL(p));
    setSelectedFiles([]);
    setPreviews([]);
    setUploadError(null);
  };

  const handleResetForm = () => {
    setDescription('');
    setCaseType('Normal');
    setMainCategory('');
    setSubCategory('');
    setPatientName('');
    setPatientAge('');
    setPatientGender('');
    setBloodGroup('');
    setChronicHistory('');
    setGeneticDisorders('');
    setDiseaseTags([]);
    setFutureRecommendations('');
    setUrgent(false);
    setSelectedReportType('General Case Summary');
    handleClearFiles();
    toast('Form reset successfully.', 'info');
  };

  const handleUploadCaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      toast('Please enter case description.', 'error');
      return;
    }

    let fullDescription = description;
    const additionalNotes = [];
    if (patientName || patientAge || patientGender) {
      additionalNotes.push(`Patient: ${patientName || 'N/A'}, Age: ${patientAge || 'N/A'}, Gender: ${patientGender || 'N/A'}, Blood Group: ${bloodGroup || 'N/A'}`);
    }
    if (chronicHistory) additionalNotes.push(`Chronic History: ${chronicHistory}`);
    if (geneticDisorders) additionalNotes.push(`Genetic Disorder: ${geneticDisorders}`);
    if (selectedReportType) additionalNotes.push(`Report Type: ${selectedReportType}`);
    if (futureRecommendations) additionalNotes.push(`Future Recommendation: ${futureRecommendations}`);

    if (additionalNotes.length > 0) {
      fullDescription += `\n\n--- Patient & Clinical Info ---\n` + additionalNotes.join('\n');
    }

    setIsUploading(true);
    try {
      const { caseId, error } = await caseApi.createCase(
        {
          title: description.split('.')[0].slice(0, 80) || 'Clinical Case',
          description: fullDescription,
          specializationId: specializationId || specializations[0]?.id || '',
          caseType,
          diseaseTags,
          urgent,
          caseQuote: '',
        },
        selectedFiles,
        profile as any,
      );
      if (error) toast(error, 'error');
      else {
        toast('Case submitted successfully!', 'success');
        handleResetForm();
        navigate(`/case/${caseId}`);
      }
    } catch (err: any) {
      toast(err?.message || 'Failed to submit case.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const activeUser = profile;
  const doctorFullName = profile ? `Dr. ${profile.firstName || ''} ${profile.lastName || ''}`.trim() : '';

  return (
    <AppShell>
      {/* Header bar matching reference */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-6 py-3.5 flex flex-row items-center justify-between gap-4 select-none">
        {/* Search bar matching reference pill style */}
        <div className="relative flex-1 max-w-xl">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search clinical cases, doctors, or tags..."
            className="w-full pl-10 pr-8 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-slate-400/20 transition-all shadow-2xs"
            id="header-search-input"
          />
          {(searchQuery || searchInput) && (
            <button
              onClick={() => { setSearchInput(''); setSearchQuery(''); }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* User profile dropdown matching reference header */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            aria-label={unreadCount > 0 ? `Notifications (${unreadCount} unread)` : 'Notifications'}
            onClick={() => {
              if (unreadCount) { notifications.filter((n) => !n.read).forEach((n) => markRead(n.id)); }
              toast(unreadCount ? 'Notifications marked as read.' : 'No new notifications.', 'info');
            }}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white" aria-hidden="true" />}
          </button>

          <div
            role="button"
            tabIndex={0}
            aria-label="Go to profile"
            onClick={() => navigate('/profile')}
            onKeyDown={(e) => e.key === 'Enter' && navigate('/profile')}
            className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 p-1.5 rounded-full transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-slate-900 dark:bg-slate-700 text-white flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm shrink-0">
              {activeUser?.avatarUrl ? (
                <img
                  src={getAvatarUrl(activeUser)}
                  alt="Profile Avatar"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon className="w-5 h-5" />
              )}
            </div>
            <div className="text-left hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#0B132B] dark:text-slate-100">{doctorFullName || 'Doctor'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">{activeUser?.designation || ''}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main dashboard content scrollable area */}
      <main className="flex-1 p-5 sm:p-7 space-y-5 overflow-y-auto w-full max-w-7xl mx-auto">
        {/* Welcome Greeting */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0B132B] dark:text-white flex items-center gap-2 font-sans">
            {(() => { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'; })()}, Doctor!
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Share clinical cases with fellow doctors.
          </p>
        </div>

        {/* Upload & Form Main Container */}
        <form onSubmit={handleUploadCaseSubmit} className="space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelectChange}
            className="hidden"
            accept="image/*"
            multiple
            id="clinical-file-input"
          />

          {/* Upload Drop Zone matching reference image */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleTriggerUpload}
            className={`border-2 border-dashed rounded-2xl p-7 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 relative bg-white dark:bg-slate-900 ${
              dragActive
                ? 'border-blue-500 bg-blue-50/30 dark:bg-blue-950/20'
                : 'border-slate-200/90 dark:border-slate-700 hover:border-slate-400 hover:bg-slate-50/50'
            }`}
            id="drag-drop-zone"
            role="button"
            tabIndex={0}
            aria-label="Upload clinical images — click or drag and drop"
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleTriggerUpload(); }}
          >
            {isUploading ? (
              <div className="w-full max-w-xs py-3 flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Submitting caseâ€¦</span>
              </div>
            ) : uploadError ? (
              <div className="py-1 text-center space-y-1">
                <span className="block text-xs font-semibold text-rose-600">âš ï¸ {uploadError}</span>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleTriggerUpload(); }}
                  className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold"
                >
                  Retry Upload
                </button>
              </div>
            ) : previews.length > 0 ? (
              <div className="w-full space-y-2">
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {previews.map((url, idx) => (
                    <div key={idx} className="relative group/thumb border border-slate-200 rounded-xl p-1 bg-slate-50 max-w-[120px]">
                      <img src={url} alt={`Preview ${idx + 1}`} className="h-16 w-20 object-cover rounded-lg border border-slate-100 mx-auto" />
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-3 mt-1">
                  <button type="button" onClick={(e) => { e.stopPropagation(); handleClearFiles(); }} className="text-xs text-slate-400 hover:text-slate-600 font-medium underline">
                    Remove all
                  </button>
                  <span className="text-slate-300">|</span>
                  <button type="button" onClick={(e) => { e.stopPropagation(); handleTriggerUpload(); }} className="text-xs text-blue-600 hover:text-blue-700 font-bold">
                    Add more images
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="w-11 h-11 rounded-full bg-[#0B132B] dark:bg-blue-600 text-white flex items-center justify-center mb-1 shadow-xs">
                  <UploadCloud className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#0B132B] dark:text-slate-100">
                    Click to upload <span className="font-normal text-slate-500">or drag and drop</span>
                  </span>
                  <span className="block text-[11px] text-slate-400 mt-1">
                    JPG, PNG, DICOM files up to 15MB
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Patient Information Section Card (Single Row Layout matching Reference) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4.5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              <h3 className="text-xs font-bold text-[#0B132B] dark:text-slate-100">Patient Information</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Enter patient name"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs placeholder-slate-400 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">Age</label>
                <input
                  type="number"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Enter age"
                  min={0}
                  max={150}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs placeholder-slate-400 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">Gender</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => { setGenderOpen(!genderOpen); setBloodGroupOpen(false); }}
                    className="w-full flex items-center justify-between px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all text-left"
                  >
                    <span className={patientGender ? "text-slate-800 dark:text-slate-100 font-medium" : "text-slate-400"}>
                      {patientGender || 'Select gender'}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </button>
                  {genderOpen && (
                    <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg py-1">
                      {['Select gender', 'Male', 'Female', 'Other'].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => { setPatientGender(g === 'Select gender' ? '' : g); setGenderOpen(false); }}
                          className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">Blood Group</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => { setBloodGroupOpen(!bloodGroupOpen); setGenderOpen(false); }}
                    className="w-full flex items-center justify-between px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all text-left"
                  >
                    <span className={bloodGroup ? "text-slate-800 dark:text-slate-100 font-medium" : "text-slate-400"}>
                      {bloodGroup || 'Select blood group'}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </button>
                  {bloodGroupOpen && (
                    <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg py-1 max-h-48 overflow-y-auto">
                      {['Select blood group', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                        <button
                          key={bg}
                          type="button"
                          onClick={() => { setBloodGroup(bg === 'Select blood group' ? '' : bg); setBloodGroupOpen(false); }}
                          className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                          {bg}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">Chronic History</label>
                <input
                  type="text"
                  value={chronicHistory}
                  onChange={(e) => setChronicHistory(e.target.value)}
                  placeholder="Enter chronic history"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs placeholder-slate-400 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">Genetic Disorder</label>
                <input
                  type="text"
                  value={geneticDisorders}
                  onChange={(e) => setGeneticDisorders(e.target.value)}
                  placeholder="Enter genetic disorder"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs placeholder-slate-400 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Case Type & Description Row (2 Cards Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Case Type Card */}
            <div className="md:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4.5 shadow-2xs flex flex-col justify-between space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                <h3 className="text-xs font-bold text-[#0B132B] dark:text-slate-100">Case Type</h3>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setCaseType('Normal')}
                  className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    caseType === 'Normal'
                      ? 'border-emerald-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white ring-1 ring-emerald-500'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full border-2 border-emerald-500 flex items-center justify-center shrink-0`}>
                    {caseType === 'Normal' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                  </div>
                  Normal
                </button>
                <button
                  type="button"
                  onClick={() => setCaseType('Abnormal')}
                  className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    caseType === 'Abnormal'
                      ? 'border-rose-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white ring-1 ring-rose-500'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full border-2 border-rose-500 flex items-center justify-center shrink-0`}>
                    {caseType === 'Abnormal' && <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
                  </div>
                  Abnormal
                </button>
                <button
                  type="button"
                  onClick={() => setCaseType('Special')}
                  className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    caseType === 'Special'
                      ? 'border-indigo-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white ring-1 ring-indigo-600'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full border-2 border-indigo-600 flex items-center justify-center shrink-0`}>
                    {caseType === 'Special' && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
                  </div>
                  Special
                </button>
              </div>
            </div>

            {/* Description Card */}
            <div className="md:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4.5 shadow-2xs space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                <h3 className="text-xs font-bold text-[#0B132B] dark:text-slate-100">Description</h3>
              </div>
              <div className="relative">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter case description here..."
                  rows={2}
                  className="w-full pr-12 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all resize-none"
                />
                <div className="absolute top-2.5 right-2.5">
                  <VoiceInputButton
                    id="case-description-voice-btn"
                    onTranscript={(text) => setDescription((prev) => (prev ? `${prev} ${text}`.trim() : text.trim()))}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Select Report Type Banner Card matching reference */}
          <div className="bg-[#EEF2FF] dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 rounded-2xl p-4.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#4F46E5] text-white flex items-center justify-center shrink-0 shadow-xs">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0B132B] dark:text-white tracking-tight">
                  Select Report Type
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {selectedReportType ? `Current: ${selectedReportType}` : 'Choose the type of report you want to create'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/add-report')}
              className="bg-[#0B132B] hover:bg-slate-900 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold rounded-xl px-5 py-2.5 text-xs flex items-center gap-2 transition-all shadow-sm active:scale-95 shrink-0"
            >
              Select Report Type
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Categorization Cards (2 Rows Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Main Category */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-2xs space-y-2">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                <h3 className="text-xs font-bold text-[#0B132B] dark:text-slate-100">Main Category</h3>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={mainCategory}
                  onChange={(e) => setMainCategory(e.target.value)}
                  onClick={() => navigate('/add-report')}
                  placeholder="Select main category"
                  className="w-full pr-8 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all cursor-pointer"
                />
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Sub Category */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-2xs space-y-2">
              <div className="flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                <h3 className="text-xs font-bold text-[#0B132B] dark:text-slate-100">Sub Category</h3>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  onClick={() => { if (!subCategory) navigate('/add-report'); }}
                  placeholder="Select subcategory"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all"
                />
              </div>
            </div>

            {/* Disease Tags */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-2xs space-y-2">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                <h3 className="text-xs font-bold text-[#0B132B] dark:text-slate-100">Disease Tags</h3>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center flex-wrap gap-1.5 p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl min-h-[38px]">
                  {diseaseTags.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium border border-blue-100">
                      {t}
                      <button type="button" onClick={() => handleRemoveTag(t)} className="text-blue-400 hover:text-blue-600">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={tempTag}
                    onChange={(e) => setTempTag(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                    placeholder={diseaseTags.length === 0 ? "Add relevant disease tags" : ""}
                    className="flex-1 min-w-[150px] bg-transparent text-xs text-slate-800 dark:text-slate-100 focus:outline-none px-1 placeholder-slate-400"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleAddTag()}
                  className="w-9 h-9 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center shrink-0 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Future Recommendation */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-2xs space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                <h3 className="text-xs font-bold text-[#0B132B] dark:text-slate-100">Future Recommendation</h3>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={futureRecommendations}
                  onChange={(e) => setFutureRecommendations(e.target.value)}
                  placeholder="Enter future recommendations..."
                  className="w-full pr-10 p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all"
                />
                <div className="absolute top-2 right-2">
                  <VoiceInputButton
                    id="recommendation-voice-btn"
                    onTranscript={(text) => setFutureRecommendations((prev) => (prev ? `${prev} ${text}`.trim() : text.trim()))}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Footer matching reference */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 pb-6">
            {/* Urgent toggle checkbox */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                id="urgent-toggle"
                checked={urgent}
                onChange={(e) => setUrgent(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs text-slate-700 dark:text-slate-300 font-normal">
                Urgently feedback needed from the doctor
              </span>
            </label>

            {/* Action Buttons: Reset & Submit Case */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={handleResetForm}
                className="px-6 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs transition-all shadow-2xs flex items-center justify-center gap-2"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="px-6 py-2.5 bg-[#0B132B] hover:bg-slate-900 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2.5 disabled:opacity-60"
              >
                <Send className="w-3.5 h-3.5 stroke-[2.5]" />
                {isUploading ? 'Submitting...' : 'Submit Case'}
              </button>
            </div>
          </div>
        </form>
      </main>
    </AppShell>
  );
}
