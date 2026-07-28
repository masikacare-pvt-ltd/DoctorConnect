import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, UploadCloud, Plus, X, Heart, Eye, Clock, ThumbsUp, MessageSquare, ChevronDown, ChevronRight, Stethoscope, AlertTriangle, Activity, BookOpen } from 'lucide-react';
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
  const [description, setDescription] = useState('');
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

  const [mainCategory, setMainCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [subCategorySuggestions, setSubCategorySuggestions] = useState<string[]>([]);
  const [showSubSuggestions, setShowSubSuggestions] = useState(false);
  const [normalFindings, setNormalFindings] = useState('');
  const [abnormalFindings, setAbnormalFindings] = useState('');
  const [specialObservations, setSpecialObservations] = useState('');
  const [futureRecommendations, setFutureRecommendations] = useState('');
  const [findingsOpen, setFindingsOpen] = useState(true);
  const [patientInfoOpen, setPatientInfoOpen] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState<number | ''>('');
  const [patientGender, setPatientGender] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [chronicHistory, setChronicHistory] = useState('');
  const [geneticDisorders, setGeneticDisorders] = useState('');

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

  const handleUploadCaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      toast('Please provide a clinical description.', 'error');
      return;
    }
    if (!profile) { toast('Profile not loaded.', 'error'); return; }
    setIsUploading(true);
    try {
      const { caseId, error } = await caseApi.createCase(
        {
          title: description.split('.')[0].slice(0, 80) || 'Clinical Case',
          description,
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
        toast('Clinical case shared with the network!', 'success');
        setDescription('');
        handleClearFiles();
        setDiseaseTags([]);
        setUrgent(false);
        navigate(`/case/${caseId}`);
      }
    } catch (err: any) {
      toast(err?.message || 'Failed to submit case.', 'error');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const activeUser = profile || { firstName: 'Doctor', lastName: '', designation: '', avatarUrl: '' };
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
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 py-3 flex flex-row items-center justify-between gap-3">
          <div className="relative flex-1 min-w-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500"><Search className="w-4 h-4" /></div>
            <input
              type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search cases..."
              className="w-full pl-9 pr-8 py-2 bg-slate-50 hover:bg-slate-100/70 dark:bg-slate-800 dark:hover:bg-slate-700/70 border border-slate-200 dark:border-slate-700 rounded-full text-xs text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-100 dark:focus:ring-slate-800 transition-all"
              id="header-search-input"
            />
            {(searchQuery || searchInput) && <button onClick={() => { setSearchInput(''); setSearchQuery(''); }} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"><X className="w-3.5 h-3.5" /></button>}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => { if (unreadCount) { notifications.filter((n) => !n.read).forEach((n) => markRead(n.id)); } toast(unreadCount ? 'Marked notifications as read.' : 'Your notifications are up-to-date.', 'info'); }}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 rounded-xl transition-all relative"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white dark:border-slate-900" />}
            </button>
            <div onClick={() => navigate('/profile')} className="flex items-center gap-2 cursor-pointer pl-2 border-l border-slate-200 dark:border-slate-800 group">
              <div className="text-right hidden sm:block">
                <span className="block text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 transition-colors">{doctorFullName}</span>
                <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-medium">{activeUser.designation}</span>
              </div>
              <img src={getAvatarUrl(activeUser)} alt="My Profile Avatar" referrerPolicy="no-referrer" className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm" />
            </div>
          </div>
        </header>

        <main className="flex-1 p-3 lg:p-4 space-y-3 lg:space-y-4 overflow-y-auto">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-950 font-display">Good Morning, Dr. {activeUser.firstName}</h2>
            <p className="text-xs text-slate-400 mt-0.5">Share clinical cases with fellow doctors.</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-display mb-4">Upload New Case</h3>
                <form onSubmit={handleUploadCaseSubmit} className="space-y-4">
                  <input type="file" ref={fileInputRef} onChange={handleFileSelectChange} className="hidden" accept="image/*" multiple id="clinical-file-input" />
                  <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={handleTriggerUpload}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 relative group overflow-hidden ${dragActive ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50/50'}`} id="drag-drop-zone">
                    {isUploading ? (
                      <div className="w-full max-w-xs py-4 space-y-3">
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />Securely ingesting medical images…</span>
                          <span className="font-mono">{uploadProgress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-600 transition-all duration-150 rounded-full" style={{ width: `${uploadProgress}%` }} /></div>
                      </div>
                    ) : uploadError ? (
                      <div className="py-2 text-center space-y-2">
                        <span className="block text-xs font-semibold text-rose-600">⚠️ {uploadError}</span>
                        <button type="button" onClick={(e) => { e.stopPropagation(); handleTriggerUpload(); }} className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded text-[10px] font-bold">Retry Upload</button>
                      </div>
                    ) : previews.length > 0 ? (
                      <div className="w-full space-y-3">
                        <div className="flex flex-wrap items-center justify-center gap-4">
                          {previews.map((url, idx) => (
                            <div key={idx} className="relative group/thumb border border-slate-200 rounded-lg p-1.5 bg-slate-50 max-w-[140px]">
                              <img src={url} alt={`Preview ${idx + 1}`} loading="lazy" className="h-20 w-24 object-cover rounded border border-slate-100 mx-auto" referrerPolicy="no-referrer" />
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center justify-center gap-2.5 mt-2">
                          <button type="button" onClick={(e) => { e.stopPropagation(); handleClearFiles(); }} className="text-[10px] text-slate-400 hover:text-slate-600 font-bold underline decoration-dotted">Remove all</button>
                          <span className="text-slate-300">|</span>
                          <button type="button" onClick={(e) => { e.stopPropagation(); handleTriggerUpload(); }} className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold underline decoration-dotted">Add more images</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="p-3 bg-slate-50 rounded-full text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors"><UploadCloud className="w-6 h-6" /></div>
                        <div>
                          <span className="block text-xs font-semibold text-slate-800">Drag and drop clinical scans / photography</span>
                          <span className="block text-[10px] text-slate-400 mt-1">Supports high-resolution JPG, PNG, WEBP (auto-compressed)</span>
                        </div>
                      </>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Description</label>
                      <VoiceInputButton
                        id="case-description-voice-btn"
                        onTranscript={(text) => setDescription((prev) => (prev ? `${prev} ${text}`.trim() : text.trim()))}
                      />
                    </div>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the medical findings clearly and accurately based on the uploaded report. Include only clinically relevant observations." rows={3} className="w-full p-4 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs focus:bg-white focus:outline-none transition-all" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Main Category</label>
                      <input type="text" value={mainCategory} onChange={(e) => setMainCategory(e.target.value)} placeholder="e.g. Radiology, Cardiology, Neurology..." className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-100" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Sub Category</label>
                      <div className="relative">
                        <input type="text" value={subCategory} onChange={(e) => { setSubCategory(e.target.value); setShowSubSuggestions(true); }} onFocus={() => setShowSubSuggestions(true)} onBlur={handleSubCategoryBlur} placeholder="e.g. Chest X-Ray, MRI Brain..." className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-100" />
                        {showSubSuggestions && subCategorySuggestions.length > 0 && (
                          <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                            {subCategorySuggestions.filter((s) => s.toLowerCase().includes(subCategory.toLowerCase())).map((s) => (
                              <button key={s} type="button" onMouseDown={() => handleSubCategorySelect(s)} className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors">{s}</button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Disease Tags</label>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {diseaseTags.map((t) => (
                          <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-800 rounded-full text-[10px] font-medium border border-slate-200">
                            {t}<button type="button" onClick={() => handleRemoveTag(t)} className="text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200"><X className="w-2.5 h-2.5" /></button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input type="text" value={tempTag} onChange={(e) => setTempTag(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(e); } }} placeholder="Add tag..." className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none" />
                        <button type="button" onClick={handleAddTag} className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-xs"><Plus className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input type="checkbox" id="urgent-toggle" checked={urgent} onChange={(e) => setUrgent(e.target.checked)} className="rounded text-amber-600 focus:ring-amber-400" />
                    <label htmlFor="urgent-toggle" className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Doctor Feedback Required</label>
                  </div>

                  <div className="border-t border-slate-100 pt-4">
                    <button type="button" onClick={() => setFindingsOpen(!findingsOpen)} className="flex items-center gap-2 w-full text-left">
                      {findingsOpen ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Structured Findings</span>
                    </button>
                    {findingsOpen && (
                      <div className="mt-3 space-y-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5"><Activity className="w-3 h-3 text-emerald-500" />Normal Findings</label>
                          <textarea value={normalFindings} onChange={(e) => setNormalFindings(e.target.value)} placeholder="Document normal anatomical structures and physiological parameters..." rows={2} className="w-full p-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-xs focus:bg-white focus:outline-none transition-all" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5"><AlertTriangle className="w-3 h-3 text-rose-500" />Abnormal Findings</label>
                          <textarea value={abnormalFindings} onChange={(e) => setAbnormalFindings(e.target.value)} placeholder="Describe any pathological findings, lesions, or deviations from normal..." rows={2} className="w-full p-3 bg-slate-50 border border-slate-200 focus:border-rose-500 rounded-xl text-xs focus:bg-white focus:outline-none transition-all" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5"><Stethoscope className="w-3 h-3 text-amber-500" />Special Observations</label>
                          <textarea value={specialObservations} onChange={(e) => setSpecialObservations(e.target.value)} placeholder="Note any unique or noteworthy clinical observations..." rows={2} className="w-full p-3 bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-xl text-xs focus:bg-white focus:outline-none transition-all" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5"><BookOpen className="w-3 h-3 text-blue-500" />Future Recommendations</label>
                          <textarea value={futureRecommendations} onChange={(e) => setFutureRecommendations(e.target.value)} placeholder="Suggest follow-up tests, imaging modalities, or clinical monitoring plans..." rows={2} className="w-full p-3 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-xs focus:bg-white focus:outline-none transition-all" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-slate-100 pt-4">
                    <button type="button" onClick={() => setPatientInfoOpen(!patientInfoOpen)} className="flex items-center gap-2 w-full text-left">
                      {patientInfoOpen ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Patient Information</span>
                      <span className="text-[9px] text-slate-300 font-normal lowercase">(optional)</span>
                    </button>
                    {patientInfoOpen && (
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Name</label>
                          <input type="text" value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="Patient name" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-100" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Age</label>
                          <input type="number" value={patientAge} onChange={(e) => setPatientAge(e.target.value ? Number(e.target.value) : '')} placeholder="Age" min={0} max={150} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-100" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Gender</label>
                          <select value={patientGender} onChange={(e) => setPatientGender(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-100">
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Blood Group</label>
                          <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-100">
                            <option value="">Select</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                          </select>
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Chronic History</label>
                          <textarea value={chronicHistory} onChange={(e) => setChronicHistory(e.target.value)} placeholder="Document any chronic conditions or ongoing treatments..." rows={2} className="w-full p-3 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs focus:bg-white focus:outline-none transition-all" />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Genetic Disorders</label>
                          <textarea value={geneticDisorders} onChange={(e) => setGeneticDisorders(e.target.value)} placeholder="Note any known genetic conditions or family history..." rows={2} className="w-full p-3 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs focus:bg-white focus:outline-none transition-all" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button type="submit" disabled={isUploading} className="px-5 py-2.5 bg-black hover:bg-slate-900 text-white rounded-lg text-xs font-bold shadow-md active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-60">
                      {isUploading ? 'Uploading…' : 'Upload Case'} <span className="text-sm">➤</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-950 font-display">Recent Cases</h3>
              <button onClick={() => navigate('/cases')} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5" id="view-all-cases-btn">View All <span className="text-sm">→</span></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {casesLoading ? (
                <div className="col-span-2 flex items-center justify-center py-12 text-slate-400"><div className="w-5 h-5 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin" /></div>
              ) : filteredCases.length === 0 ? (
                <div className="col-span-2 text-center py-12 text-slate-400 text-sm">No cases found. Share the first clinical case above.</div>
              ) : (
                filteredCases.map((c: ClinicalCase) => (
                  <div key={c.id} onClick={() => navigate(`/case/${c.id}`)} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between cursor-pointer" id={`case-card-${c.id}`}>
                    <div className="p-4 flex items-center justify-between border-b border-slate-50 bg-slate-50/20">
                      <div className="flex items-center gap-2">
                        <img src={c.authorAvatar} alt="Author Avatar" referrerPolicy="no-referrer" className="w-7 h-7 rounded-full border border-slate-200" />
                        <div>
                          <span className="block text-xs font-bold text-slate-800 leading-tight">{c.authorName}</span>
                          <span className="block text-[9px] text-slate-400">{c.category} • {formatRelativeTime(c.createdAt)}</span>
                        </div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); if (user) toggle({ caseId: c.id, caseTitle: c.title, caseCover: c.coverImage, authorName: c.authorName, createdAt: new Date().toISOString() }); }} className={`text-slate-400 hover:text-rose-500 transition-colors ${bookmarkIds.has(c.id) ? 'text-rose-500' : ''}`} title="Bookmark">
                        <Heart className="w-4 h-4" fill={bookmarkIds.has(c.id) ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                    <div className="h-44 overflow-hidden relative border-b border-slate-100">
                      {c.coverImage ? (
                        <img src={c.coverImage} alt="Case Visual" loading="lazy" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300 text-xs">No image</div>
                      )}
                      {c.urgent && <span className="absolute top-3 right-3 px-2 py-0.5 bg-rose-500 text-white text-[9px] font-extrabold uppercase rounded-md tracking-wider">Urgent</span>}
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-slate-900 line-clamp-1">{c.title}</span>
                          {c.caseNumber && <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-bold shrink-0 border border-slate-200">{c.caseNumber}</span>}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed font-normal line-clamp-2">{c.description}</p>
                        {c.diseaseTags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1.5">
                            {c.diseaseTags.map((tag, i) => (<span key={i} className="text-[9px] font-semibold bg-indigo-50/70 text-indigo-600 px-2 py-0.5 rounded-full border border-indigo-100/50">#{tag}</span>))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-50 text-slate-400">
                        <span className="flex items-center gap-1 text-[10px] font-semibold"><MessageSquare className="w-3.5 h-3.5" />{c.commentsCount}</span>
                        <span className="flex items-center gap-1 text-[10px] font-semibold"><ThumbsUp className="w-3.5 h-3.5" />{c.likesCount || 0}</span>
                        <span className="flex items-center gap-1 text-[10px] font-semibold"><Eye className="w-3.5 h-3.5" />{c.viewsCount}</span>
                        <span className="flex items-center gap-1 text-[10px] font-semibold"><Clock className="w-3.5 h-3.5" />{formatRelativeTime(c.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
    </AppShell>
  );
}
