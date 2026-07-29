import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Bell, UploadCloud, Plus, X, Heart, Eye, Clock, ThumbsUp,
  ChevronDown, CheckCircle2, AlertCircle, Star, Send, RotateCcw
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../contexts/ToastContext';
import { useCases } from '../hooks/useCases';
import { useSpecializations } from '../hooks/useSpecializations';
import { useBookmarks } from '../hooks/useBookmarks';
import { useNotifications } from '../hooks/useNotifications';
import { caseApi } from '../api';
import { formatRelativeTime } from '../utils/time';
import type { ClinicalCase } from '../types/domain';
import { validateImageFile } from '../utils/image';
import { getAvatarUrl } from '../utils/avatar';
import AppShell from './AppShell';
import VoiceInputButton from './VoiceInputButton';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const { specializations } = useSpecializations();
  const { bookmarkIds, toggle } = useBookmarks();
  const { notifications, unreadCount, markRead } = useNotifications();

  // Case form state
  const [description, setDescription] = useState('');
  const [caseType, setCaseType] = useState<'Normal' | 'Abnormal' | 'Special'>('Normal');
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { cases, loading: casesLoading } = useCases(undefined, searchQuery);
  const [specializationId, setSpecializationId] = useState('');
  const [urgent, setUrgent] = useState(false);
  const [diseaseTags, setDiseaseTags] = useState<string[]>([]);
  const [tempTag, setTempTag] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Category state
  const [mainCategory, setMainCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [subCategorySuggestions, setSubCategorySuggestions] = useState<string[]>([]);
  const [showSubSuggestions, setShowSubSuggestions] = useState(false);

  // Patient Info fields (Reference UI top block)
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState<number | ''>('');
  const [patientGender, setPatientGender] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [chronicHistory, setChronicHistory] = useState('');
  const [geneticDisorders, setGeneticDisorders] = useState('');
  const [genderOpen, setGenderOpen] = useState(false);
  const [bloodGroupOpen, setBloodGroupOpen] = useState(false);
  const [mainCategoryOpen, setMainCategoryOpen] = useState(false);

  // Recommendation field
  const [futureRecommendations, setFutureRecommendations] = useState('');

  useEffect(() => {
    if (specializations.length && !specializationId) setSpecializationId(specializations[0].id);
  }, [specializations, specializationId]);

  useEffect(() => {
    const t = setTimeout(() => setSearchQuery(searchInput), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => () => previews.forEach((p) => URL.revokeObjectURL(p)), [previews]);

  useEffect(() => {
    caseApi.fetchSubCategories().then((list) => {
      if (list && list.length) setSubCategorySuggestions(list);
    }).catch(() => {});
  }, []);

  const handleSubCategorySelect = (value: string) => {
    setSubCategory(value);
    setShowSubSuggestions(false);
  };

  const handleSubCategoryBlur = () => {
    setTimeout(() => setShowSubSuggestions(false), 200);
    if (subCategory.trim() && !subCategorySuggestions.includes(subCategory.trim())) {
      caseApi.saveSubCategory(subCategory.trim()).catch(() => {});
      setSubCategorySuggestions((prev) => [...prev, subCategory.trim()]);
    }
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
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
    handleClearFiles();
    toast('Form reset successfully.', 'info');
  };

  const handleUploadCaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      toast('Please enter case description.', 'error');
      return;
    }
    if (!profile) { toast('Profile not loaded.', 'error'); return; }

    // Combine structured observations into description if present
    let fullDescription = description;
    const additionalNotes = [];
    if (patientName || patientAge || patientGender) {
      additionalNotes.push(`Patient: ${patientName || 'N/A'}, Age: ${patientAge || 'N/A'}, Gender: ${patientGender || 'N/A'}, Blood Group: ${bloodGroup || 'N/A'}`);
    }
    if (chronicHistory) additionalNotes.push(`Chronic History: ${chronicHistory}`);
    if (geneticDisorders) additionalNotes.push(`Genetic Disorder: ${geneticDisorders}`);
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
          diseaseTags,
          urgent,
          caseQuote: '',
        },
        selectedFiles,
        profile,
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
      setUploadProgress(0);
    }
  };

  const activeUser = profile || { firstName: 'Arjun', lastName: 'Verma', designation: 'Cardiologist', avatarUrl: '' };
  const doctorFullName = `Dr. ${activeUser.firstName} ${activeUser.lastName}`.trim();

  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        (c.caseNumber && c.caseNumber.toLowerCase().includes(q)) ||
        c.diseaseTags.some((t) => t.toLowerCase().includes(q)) ||
        c.category.toLowerCase().includes(q) ||
        c.authorName.toLowerCase().includes(q)
      );
    });
  }, [cases, searchQuery]);

  return (
    <AppShell>
      {/* Header bar */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-6 py-4 flex flex-row items-center justify-between gap-4 select-none">
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
            className="w-full pl-10 pr-8 py-2.5 bg-[#F8FAFC] hover:bg-slate-100/70 dark:bg-slate-800 dark:hover:bg-slate-700/70 border border-slate-200/60 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
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
            onClick={() => {
              if (unreadCount) { notifications.filter((n) => !n.read).forEach((n) => markRead(n.id)); }
              toast(unreadCount ? 'Notifications marked as read.' : 'No new notifications.', 'info');
            }}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white" />}
          </button>
          <div
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 p-1 rounded-full transition-colors"
          >
            <img
              src={getAvatarUrl(activeUser)}
              alt="Profile Avatar"
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-sm"
            />
            <div className="text-left hidden sm:block">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{doctorFullName}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <span className="text-[11px] text-slate-400 font-medium block -mt-0.5">{activeUser.designation || 'Cardiologist'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main dashboard content scrollable area */}
      <main className="flex-1 p-5 sm:p-6 space-y-4 overflow-y-auto w-full">
        {/* Welcome Greeting */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2 font-display">
            Good morning, Dr. {activeUser.firstName || 'Arjun'} <span className="text-xl sm:text-2xl">👋</span>
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Share clinical cases with fellow doctors.</p>
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

          {/* Upload Drop Zone matching 1st reference image */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleTriggerUpload}
            className={`border border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 relative bg-white dark:bg-slate-900 ${
              dragActive
                ? 'border-blue-500 bg-blue-50/20'
                : 'border-blue-200/80 dark:border-slate-700 hover:border-blue-400 hover:bg-slate-50/50'
            }`}
            id="drag-drop-zone"
          >
            {isUploading ? (
              <div className="w-full max-w-xs py-2 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                    Uploading files…
                  </span>
                  <span className="font-mono">{uploadProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 transition-all duration-150 rounded-full" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            ) : uploadError ? (
              <div className="py-1 text-center space-y-1">
                <span className="block text-xs font-semibold text-rose-600">⚠️ {uploadError}</span>
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
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center mb-0.5">
                  <UploadCloud className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Click to upload <span className="font-normal text-slate-400">or drag and drop</span>
                  </span>
                  <span className="block text-[11px] text-slate-400 mt-0.5">
                    JPG, PNG, DICOM files up to 20MB
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Patient Information Section Card (Single Row Layout matching Reference 1) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 space-y-2.5">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">Patient Information</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Name</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Enter patient name"
                  className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs placeholder-slate-400 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Age</label>
                <input
                  type="number"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Enter age"
                  min={0}
                  max={150}
                  className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs placeholder-slate-400 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Gender</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => { setGenderOpen(!genderOpen); setBloodGroupOpen(false); setMainCategoryOpen(false); }}
                    className="w-full flex items-center justify-between px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all text-left"
                  >
                    <span>{patientGender || 'Select gender'}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </button>
                  {genderOpen && (
                    <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg py-1">
                      {['Select gender', 'Male', 'Female', 'Other'].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => { setPatientGender(g === 'Select gender' ? '' : g); setGenderOpen(false); }}
                          className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors"
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Blood Group</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => { setBloodGroupOpen(!bloodGroupOpen); setGenderOpen(false); setMainCategoryOpen(false); }}
                    className="w-full flex items-center justify-between px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all text-left"
                  >
                    <span>{bloodGroup || 'Select blood group'}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </button>
                  {bloodGroupOpen && (
                    <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg py-1 max-h-48 overflow-y-auto">
                      {['Select blood group', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                        <button
                          key={bg}
                          type="button"
                          onClick={() => { setBloodGroup(bg === 'Select blood group' ? '' : bg); setBloodGroupOpen(false); }}
                          className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors"
                        >
                          {bg}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Chronic History</label>
                <input
                  type="text"
                  value={chronicHistory}
                  onChange={(e) => setChronicHistory(e.target.value)}
                  placeholder="Enter chronic history"
                  className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs placeholder-slate-400 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Genetic Disorder</label>
                <input
                  type="text"
                  value={geneticDisorders}
                  onChange={(e) => setGeneticDisorders(e.target.value)}
                  placeholder="Enter genetic disorder"
                  className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs placeholder-slate-400 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Case Type & Description Section (2-Column Grid matching Reference 1) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
              {/* Case Type Column */}
              <div className="md:col-span-4 space-y-2">
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">Case Type</h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCaseType('Normal')}
                    className={`flex-1 flex items-center justify-center gap-1 px-2.5 py-2 rounded-xl border text-xs font-bold transition-all ${
                      caseType === 'Normal'
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/40'
                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Normal
                  </button>
                  <button
                    type="button"
                    onClick={() => setCaseType('Abnormal')}
                    className={`flex-1 flex items-center justify-center gap-1 px-2.5 py-2 rounded-xl border text-xs font-bold transition-all ${
                      caseType === 'Abnormal'
                        ? 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-950/40'
                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <AlertCircle className="w-3.5 h-3.5 text-orange-500" /> Abnormal
                  </button>
                  <button
                    type="button"
                    onClick={() => setCaseType('Special')}
                    className={`flex-1 flex items-center justify-center gap-1 px-2.5 py-2 rounded-xl border text-xs font-bold transition-all ${
                      caseType === 'Special'
                        ? 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950/40'
                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Star className="w-3.5 h-3.5 text-purple-500" /> Special
                  </button>
                </div>
              </div>

              {/* Description Column */}
              <div className="md:col-span-8 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">Description</h3>
                </div>
                <div className="relative">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter case description here..."
                    rows={2.5 as any}
                    className="w-full p-3 pr-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                  />
                  <div className="absolute bottom-2.5 right-2.5">
                    <VoiceInputButton
                      id="case-description-voice-btn"
                      onTranscript={(text) => setDescription((prev) => (prev ? `${prev} ${text}`.trim() : text.trim()))}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Category & Sub Category Card (2 Columns matching Reference 1) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-1.5">Main Category</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => { setMainCategoryOpen(!mainCategoryOpen); setGenderOpen(false); setBloodGroupOpen(false); }}
                    className="w-full flex items-center justify-between px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all text-left"
                  >
                    <span>{mainCategory || 'Select main category'}</span>
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  </button>
                  {mainCategoryOpen && (
                    <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg py-1 max-h-48 overflow-y-auto">
                      {['Select main category', 'Cardiology', 'Radiology', 'Dermatology', 'Neurology', 'Orthopedics', 'General Medicine'].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => { setMainCategory(cat === 'Select main category' ? '' : cat); setMainCategoryOpen(false); }}
                          className="w-full text-left px-3.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors"
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-1.5">Sub Category</label>
                <div className="relative">
                  <input
                    type="text"
                    value={subCategory}
                    onChange={(e) => { setSubCategory(e.target.value); setShowSubSuggestions(true); }}
                    onFocus={() => setShowSubSuggestions(true)}
                    onBlur={handleSubCategoryBlur}
                    placeholder="Select subcategory"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                  {showSubSuggestions && subCategorySuggestions.length > 0 && (
                    <div className="absolute z-30 top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg max-h-40 overflow-y-auto">
                      {subCategorySuggestions.filter((s) => s.toLowerCase().includes(subCategory.toLowerCase())).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onMouseDown={() => handleSubCategorySelect(s)}
                          className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Disease Tags Card matching Reference 1 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 space-y-1.5">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">Disease Tags</h3>
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
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(e); } }}
                  placeholder={diseaseTags.length === 0 ? "Add relevant disease tags" : ""}
                  className="flex-1 min-w-[150px] bg-transparent text-xs text-slate-800 dark:text-slate-100 focus:outline-none px-1 placeholder-slate-400"
                />
              </div>
              <button
                type="button"
                onClick={handleAddTag}
                className="w-9 h-9 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 border border-blue-200 dark:border-blue-800 rounded-xl flex items-center justify-center shrink-0 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Future Recommendation Card matching Reference 1 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 space-y-1.5">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">Future Recommendation</h3>
            <div className="relative">
              <input
                type="text"
                value={futureRecommendations}
                onChange={(e) => setFutureRecommendations(e.target.value)}
                placeholder="Enter future recommendations..."
                className="w-full p-3 pr-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              />
              <div className="absolute bottom-2.5 right-2.5">
                <VoiceInputButton
                  id="recommendation-voice-btn"
                  onTranscript={(text) => setFutureRecommendations((prev) => (prev ? `${prev} ${text}`.trim() : text.trim()))}
                />
              </div>
            </div>
          </div>

          {/* Bottom Action Footer matching Reference 1 */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1 pb-4">
            {/* Urgent toggle checkbox */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                id="urgent-toggle"
                checked={urgent}
                onChange={(e) => setUrgent(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Urgently feedback needed from the doctor
              </span>
            </label>

            {/* Action Buttons: Reset & Submit Case */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={handleResetForm}
                className="px-5 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                Reset
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="px-5 py-2 bg-[#3B82F6] hover:bg-blue-600 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
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

