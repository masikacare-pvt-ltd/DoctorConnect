import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search, ChevronRight, MoreHorizontal
} from 'lucide-react';
import { getTestIcon } from './icons/IconRegistry';
import * as CatIcons from './icons/CategoryIcons';
import { getCategorySubData } from './SelectReportModal';
import AppShell from './AppShell';

export interface ReportSelection {
  mainCategory: string;
  subCategory: string;
  testItem: string;
  tags: string[];
}


const MAIN_CATEGORIES = [
  { id: 'blood',     name: 'Blood Test',           icon: CatIcons.IconBloodDrop,      color: 'bg-rose-50 text-rose-500 dark:bg-rose-950/50 dark:text-rose-400',     iconBg: 'bg-rose-50 dark:bg-rose-950/50',     iconColor: 'text-rose-500 dark:text-rose-400',   textColor: 'text-rose-600 dark:text-rose-400' },
  { id: 'urine',     name: 'Urine Test',            icon: CatIcons.IconUrineDipstick,  color: 'bg-amber-50 text-amber-500 dark:bg-amber-950/50 dark:text-amber-400', iconBg: 'bg-amber-50 dark:bg-amber-950/50',   iconColor: 'text-amber-500 dark:text-amber-400', textColor: 'text-amber-600 dark:text-amber-400' },
  { id: 'stool',     name: 'Stool Test',            icon: CatIcons.IconStoolJar,       color: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-950/50 dark:text-yellow-400', iconBg: 'bg-yellow-50 dark:bg-yellow-950/50', iconColor: 'text-yellow-600 dark:text-yellow-400', textColor: 'text-yellow-600 dark:text-yellow-400' },
  { id: 'pathology', name: 'Pathology / Biopsy',    icon: CatIcons.IconBiopsySlide,    color: 'bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400', iconBg: 'bg-purple-50 dark:bg-purple-950/50', iconColor: 'text-purple-600 dark:text-purple-400', textColor: 'text-purple-600 dark:text-purple-400' },
  { id: 'xray',      name: 'X-Ray',                 icon: CatIcons.IconChestXRay,      color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400',     iconBg: 'bg-blue-50 dark:bg-blue-950/50',     iconColor: 'text-blue-600 dark:text-blue-400',   textColor: 'text-blue-600 dark:text-blue-400' },
  { id: 'usg',       name: 'Ultrasound (USG)',       icon: CatIcons.IconUltrasoundProbe,color: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/50 dark:text-cyan-400',     iconBg: 'bg-cyan-50 dark:bg-cyan-950/50',     iconColor: 'text-cyan-600 dark:text-cyan-400',   textColor: 'text-cyan-600 dark:text-cyan-400' },
  { id: 'mri',       name: 'MRI',                   icon: CatIcons.IconMRIScanner,     color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400', iconBg: 'bg-indigo-50 dark:bg-indigo-950/50', iconColor: 'text-indigo-600 dark:text-indigo-400', textColor: 'text-indigo-600 dark:text-indigo-400' },
  { id: 'ct',        name: 'CT Scan',               icon: CatIcons.IconCTScanGantry,   color: 'bg-teal-50 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400',     iconBg: 'bg-teal-50 dark:bg-teal-950/50',     iconColor: 'text-teal-600 dark:text-teal-400',   textColor: 'text-teal-600 dark:text-teal-400' },
  { id: 'ecg',       name: 'ECG / Echo',            icon: CatIcons.IconECGWave,        color: 'bg-pink-50 text-pink-600 dark:bg-pink-950/50 dark:text-pink-400',     iconBg: 'bg-pink-50 dark:bg-pink-950/50',     iconColor: 'text-pink-600 dark:text-pink-400',   textColor: 'text-pink-600 dark:text-pink-400' },
  { id: 'endoscopy', name: 'Endoscopy',             icon: CatIcons.IconEndoscope,      color: 'bg-orange-50 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400', iconBg: 'bg-orange-50 dark:bg-orange-950/50', iconColor: 'text-orange-600 dark:text-orange-400', textColor: 'text-orange-600 dark:text-orange-400' },
  { id: 'genetic',   name: 'Genetic Test',          icon: CatIcons.IconDNAStrand,      color: 'bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400', iconBg: 'bg-violet-50 dark:bg-violet-950/50', iconColor: 'text-violet-600 dark:text-violet-400', textColor: 'text-violet-600 dark:text-violet-400' },
  { id: 'checkup',   name: 'Health Checkup Report', icon: CatIcons.IconCheckupReport,  color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400', iconBg: 'bg-emerald-50 dark:bg-emerald-950/50', iconColor: 'text-emerald-600 dark:text-emerald-400', textColor: 'text-emerald-600 dark:text-emerald-400' },
  { id: 'others',    name: 'Others',                icon: MoreHorizontal,              color: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',   iconBg: 'bg-slate-100 dark:bg-slate-800',     iconColor: 'text-slate-600 dark:text-slate-300', textColor: 'text-slate-700 dark:text-slate-200' },
];

function TestBadgeIcon({ title, badgeText, iconBg, iconColor, fallbackIcon: FallbackIcon }: { title: string; badgeText?: string; iconBg: string; iconColor: string; fallbackIcon?: React.ComponentType<any> }) {
  const IconComponent = getTestIcon(title);
  if (IconComponent) return (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg} ${iconColor} border border-slate-200/80 dark:border-slate-800 mx-auto shadow-2xs shrink-0`}>
      <IconComponent className={`w-5 h-5 ${iconColor}`} />
    </div>
  );
  if (FallbackIcon) return (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg} ${iconColor} border border-slate-200/80 dark:border-slate-800 mx-auto shadow-2xs shrink-0`}>
      <FallbackIcon className={`w-5 h-5 ${iconColor}`} />
    </div>
  );
  return (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg} ${iconColor} border border-slate-200/80 dark:border-slate-800 mx-auto shadow-2xs font-extrabold text-[11px] font-sans tracking-tight shrink-0`}>
      {badgeText || title.split(' ')[0]}
    </div>
  );
}

export default function AddReportPage() {
  const navigate = useNavigate();
  const [selectedMainCat, setSelectedMainCat] = useState<string>('blood');
  const [selectedSubCatIndex, setSelectedSubCatIndex] = useState<number>(0);
  const [selectedTestTitle, setSelectedTestTitle] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [customCategory, setCustomCategory] = useState<string>('');
  const [customSubCategory, setCustomSubCategory] = useState<string>('');
  const [customTestTitle, setCustomTestTitle] = useState<string>('');

  const currentMainCatObj = MAIN_CATEGORIES.find((c) => c.id === selectedMainCat) || MAIN_CATEGORIES[0];
  const subCategoriesList = getCategorySubData(selectedMainCat);
  const activeSubCat = subCategoriesList[selectedSubCatIndex] || subCategoriesList[0];

  const filteredTests = activeSubCat.tests.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleConfirm = (testItem?: { title: string; tags: string[] }) => {
    const defaultTest = testItem || activeSubCat.tests.find((t) => t.title === selectedTestTitle) || activeSubCat.tests[0];
    const finalMainCategory = customCategory.trim() ? customCategory.trim() : (selectedMainCat === 'others' ? 'Others' : currentMainCatObj.name);
    const finalSubCategoryName = customSubCategory.trim() ? customSubCategory.trim() : activeSubCat.name;
    const finalTestTitle = customTestTitle.trim() ? customTestTitle.trim() : (defaultTest?.title || selectedTestTitle || 'Custom Report');
    const selection: ReportSelection = {
      mainCategory: finalMainCategory,
      subCategory: `${finalSubCategoryName} - ${finalTestTitle}`,
      testItem: finalTestTitle,
      tags: defaultTest?.tags || [finalMainCategory, finalSubCategoryName, finalTestTitle, 'Custom'],
    };
    navigate('/dashboard', { state: { reportSelection: selection } });
  };

  const HeaderIcon = activeSubCat.badgeIcon || CatIcons.IconBloodDrop;

  return (
    <AppShell>
      <div className="flex flex-col bg-[#F8FAFC] dark:bg-slate-950 h-full overflow-hidden">

        {/* Header */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-6 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} aria-label="Go back" className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-colors">
              <ArrowLeft className="w-5 h-5 stroke-[2]" />
            </button>
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#0B132B] dark:text-white font-sans">Add Report</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Select the type of report you want to upload</p>
            </div>
          </div>
          <div className="relative hidden md:flex items-center w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none stroke-[2]" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search subcategory..."
              className="w-full pl-9 pr-4 h-9 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all font-sans leading-none" />
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 flex flex-col p-4 sm:p-5 gap-4 overflow-y-auto">

          {/* Step 1 - Main Category Rail */}
          <div className="space-y-2.5 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#0B132B] text-white text-[11px] font-bold flex items-center justify-center">1</span>
              <h3 className="text-xs font-bold text-[#0B132B] dark:text-slate-100 tracking-wide uppercase">Choose Main Category</h3>
            </div>
            <div className="w-full max-w-full overflow-x-auto overscroll-x-contain scroll-smooth snap-x snap-mandatory px-2 py-1 pb-3">
              <div className="flex min-w-max gap-3">
                {MAIN_CATEGORIES.map((cat) => {
                  const isActive = selectedMainCat === cat.id;
                  const IconComponent = cat.icon;
                  return (
                    <button key={cat.id} onClick={() => { setSelectedMainCat(cat.id); setSelectedSubCatIndex(0); }}
                      className={`relative flex h-[112px] w-[140px] shrink-0 snap-start flex-col items-center justify-center py-3 px-2 rounded-xl border transition-all duration-200 select-none ${
                        isActive ? `${cat.iconBg} ${cat.textColor} border-current ring-2 ring-current/20 shadow-xs font-bold scale-[1.02]`
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 hover:bg-slate-50/80 font-medium'}`}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-1.5 bg-white dark:bg-slate-800">
                        <IconComponent className="w-7 h-7" />
                      </div>
                  <span className="w-full text-center text-[10px] font-bold leading-tight whitespace-normal break-words">{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Step 2 - Subcategory + Tests */}
          <div className="flex flex-col gap-3 pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#0B132B] text-white text-[11px] font-bold flex items-center justify-center">2</span>
                <h3 className="text-xs font-bold text-[#0B132B] dark:text-slate-100 tracking-wide uppercase">
                  Choose Subcategory - <span className={currentMainCatObj.textColor}>{currentMainCatObj.name}</span>
                </h3>
              </div>
              <div className="relative md:hidden flex items-center w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none stroke-[2]" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search subcategory..."
                  className="w-full pl-9 pr-4 h-9 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all font-sans leading-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-1">

              {/* Left subcategory list - fixed height on desktop, scrollable */}
              <div className="md:col-span-3 lg:col-span-3 xl:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-1.5 space-y-0.5 shadow-2xs overflow-y-auto max-h-52 md:max-h-[600px] md:sticky md:top-0">
                {subCategoriesList.map((sub, idx) => {
                  const isActive = selectedSubCatIndex === idx;
                  const MenuIcon = sub.menuIcon || CatIcons.IconBloodDrop;
                  return (
                    <button key={`${selectedMainCat}-${sub.name}-${idx}`}
                      onClick={() => { setSelectedSubCatIndex(idx); if (sub.tests.length > 0) setSelectedTestTitle(sub.tests[0].title); }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-[11px] font-semibold flex items-center justify-between transition-all ${
                        isActive ? `${sub.iconBg} ${sub.iconColor} font-bold shadow-2xs border border-current/20` : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'}`}>
                      <span className="truncate flex items-center gap-2">
                        <MenuIcon className={`w-5 h-5 shrink-0 ${sub.iconColor}`} />
                        {sub.name}
                      </span>
                      <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${isActive ? `${sub.iconColor} translate-x-0.5` : 'text-slate-400'}`} />
                    </button>
                  );
                })}
              </div>

              {/* Right test cards */}
              <div className="md:col-span-9 lg:col-span-9 xl:col-span-10 space-y-4">
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3 shadow-2xs flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${activeSubCat.iconBg} ${activeSubCat.iconColor} border border-slate-200/80 dark:border-slate-800 flex items-center justify-center shrink-0 shadow-2xs`}>
                    <HeaderIcon className={`w-5 h-5 ${activeSubCat.iconColor}`} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0B132B] dark:text-white font-sans">{activeSubCat.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{activeSubCat.desc}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {filteredTests.map((test) => {
                    const isSelected = selectedTestTitle === test.title;
                    return (
                      <div key={test.title} onClick={() => setSelectedTestTitle(test.title)}
                        className={`bg-white dark:bg-slate-900 border rounded-2xl p-3 cursor-pointer transition-all flex flex-col items-center justify-start text-center gap-2 min-h-[160px] hover:shadow-md ${
                          isSelected ? `border-current ring-2 ring-current/20 ${activeSubCat.iconBg} ${activeSubCat.iconColor}` : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300'}`}>
                        <TestBadgeIcon title={test.title} badgeText={test.badgeText} iconBg={activeSubCat.iconBg} iconColor={activeSubCat.iconColor} fallbackIcon={activeSubCat.badgeIcon} />
                        <div className="text-center space-y-0.5 w-full">
                          <h5 className="text-[11px] font-bold text-[#0B132B] dark:text-white leading-snug">{test.title}</h5>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 line-clamp-2 font-medium leading-tight">{test.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {(selectedMainCat === 'others' || activeSubCat.name.toLowerCase().includes('other') ||
                  selectedTestTitle.toLowerCase().includes('other') || selectedTestTitle.toLowerCase().includes('custom')) && (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-3 mt-3">
                    <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold">
                        <MoreHorizontal className="w-4 h-4 stroke-[2]" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#0B132B] dark:text-white font-sans">Specify Custom Category & Subcategory Report Details</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Type your custom category, subcategory, and specific test name below</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Custom Category</label>
                        <input type="text" value={customCategory} onChange={(e) => setCustomCategory(e.target.value)}
                          placeholder={selectedMainCat === 'others' ? 'e.g. Dentistry, Ophthalmology' : currentMainCatObj.name}
                          className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:bg-white transition-all" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Custom Subcategory</label>
                        <input type="text" value={customSubCategory} onChange={(e) => setCustomSubCategory(e.target.value)}
                          placeholder={`e.g. ${activeSubCat.name}`}
                          className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:bg-white transition-all" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Specific Test / Report Title</label>
                        <input type="text" value={customTestTitle} onChange={(e) => setCustomTestTitle(e.target.value)}
                          placeholder="e.g. OCT Retinal Scan, Dental OPG"
                          className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:bg-white transition-all" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500 font-medium truncate max-w-md">
            Selected: <span className="font-bold text-[#0B132B] dark:text-white">
              {customCategory.trim() || (selectedMainCat === 'others' ? 'Others' : currentMainCatObj.name)} ? {customSubCategory.trim() || activeSubCat.name} ({customTestTitle.trim() || selectedTestTitle})
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button onClick={() => navigate(-1)}
              className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs hover:bg-slate-50 transition-all">
              Cancel
            </button>
            <button onClick={() => { const t = activeSubCat.tests.find((t) => t.title === selectedTestTitle) || activeSubCat.tests[0]; handleConfirm(t); }}
              className="px-6 py-2.5 bg-[#0B132B] hover:bg-slate-900 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-2 transition-all active:scale-95">
              Next <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
