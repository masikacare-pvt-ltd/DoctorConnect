import { useState } from 'react';
import {
  ArrowLeft, Search, Check, ChevronRight,
  Droplet, TestTube, Activity, Microscope,
  Radio, HeartPulse, Stethoscope, Dna, FileText, MoreHorizontal
} from 'lucide-react';

export interface ReportSelection {
  mainCategory: string;
  subCategory: string;
  testItem: string;
  tags: string[];
}

interface SelectReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (selection: ReportSelection) => void;
}

// Main categories matching Step 1 in UI reference
const MAIN_CATEGORIES = [
  { id: 'blood', name: 'Blood Test', icon: Droplet, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40 border-rose-200' },
  { id: 'urine', name: 'Urine Test', icon: TestTube, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200' },
  { id: 'stool', name: 'Stool Test', icon: TestTube, color: 'text-amber-700 bg-amber-50 dark:bg-amber-950/40 border-amber-200' },
  { id: 'pathology', name: 'Pathology / Biopsy', icon: Microscope, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40 border-purple-200' },
  { id: 'xray', name: 'X-Ray', icon: Radio, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200' },
  { id: 'usg', name: 'Ultrasound (USG)', icon: Activity, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200' },
  { id: 'mri', name: 'MRI', icon: Activity, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40 border-blue-200' },
  { id: 'ct', name: 'CT Scan', icon: Radio, color: 'text-violet-500 bg-violet-50 dark:bg-violet-950/40 border-violet-200' },
  { id: 'ecg', name: 'ECG / Echo', icon: HeartPulse, color: 'text-pink-500 bg-pink-50 dark:bg-pink-950/40 border-pink-200' },
  { id: 'endoscopy', name: 'Endoscopy', icon: Stethoscope, color: 'text-orange-500 bg-orange-50 dark:bg-orange-950/40 border-orange-200' },
  { id: 'genetic', name: 'Genetic Test', icon: Dna, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200' },
  { id: 'checkup', name: 'Health Checkup Report', icon: FileText, color: 'text-sky-500 bg-sky-50 dark:bg-sky-950/40 border-sky-200' },
  { id: 'others', name: 'Others', icon: MoreHorizontal, color: 'text-slate-500 bg-slate-50 dark:bg-slate-800 border-slate-200' },
];

// Subcategories and detailed test cards
const SUBCATEGORIES_DATA: Record<string, {
  name: string;
  desc: string;
  iconBg?: string;
  tests: { title: string; desc: string; code?: string; tags: string[] }[];
}[]> = {
  blood: [
    {
      name: 'Hematology',
      desc: 'Complete blood counts, cell morphology, and coagulation profiles',
      tests: [
        { title: 'Complete Blood Count (CBC)', desc: 'Full evaluation of red cells, white cells, hemoglobin & platelets', tags: ['CBC', 'Hemoglobin', 'Platelets'] },
        { title: 'ESR (Erythrocyte Sedimentation Rate)', desc: 'Nonspecific marker for systemic inflammation', tags: ['ESR', 'Inflammation'] },
        { title: 'Peripheral Blood Smear', desc: 'Microscopic cell morphology examination', tags: ['Blood Smear', 'Morphology'] },
        { title: 'Prothrombin Time (PT/INR)', desc: 'Evaluates extrinsic coagulation pathway', tags: ['Coagulation', 'PT/INR'] },
        { title: 'APTT', desc: 'Evaluates intrinsic coagulation pathway', tags: ['Coagulation', 'APTT'] },
        { title: 'Blood Grouping & Rh Typing', desc: 'ABO and Rh factor identification', tags: ['Blood Type', 'Rh Factor'] },
      ]
    },
    {
      name: 'Biochemistry',
      desc: 'Serum chemistry, electrolytes, proteins, and organ function markers',
      tests: [
        { title: 'Comprehensive Metabolic Panel (CMP)', desc: 'Evaluates glucose, electrolytes, kidney & liver function', tags: ['CMP', 'Metabolic', 'Electrolytes'] },
        { title: 'Serum Electrolytes (Na, K, Cl, Bicarb)', desc: 'Fluid & electrolyte balance assessment', tags: ['Sodium', 'Potassium', 'Electrolytes'] },
        { title: 'Serum Creatinine & BUN', desc: 'Primary renal clearance indicators', tags: ['Renal', 'Creatinine', 'BUN'] },
        { title: 'Fast Blood Sugar (FBS)', desc: 'Baseline glucose measurement', tags: ['Diabetes', 'Glucose', 'FBS'] },
        { title: 'HbA1c (Glycated Hemoglobin)', desc: '3-month average blood glucose control', tags: ['Diabetes', 'HbA1c', 'Glycemic'] },
        { title: 'Serum Uric Acid', desc: 'Gout & purine metabolism marker', tags: ['Uric Acid', 'Gout'] },
      ]
    },
    {
      name: 'Hormone & Endocrine',
      desc: 'Hormonal assays to evaluate endocrine gland function and balance',
      tests: [
        { title: 'Thyroid Profile (T3, T4, TSH)', desc: 'Evaluate thyroid gland function', tags: ['Thyroid', 'T3', 'T4', 'TSH'] },
        { title: 'T3 (Triiodothyronine)', desc: 'Measures triiodothyronine level in blood', tags: ['Thyroid', 'T3'] },
        { title: 'T4 (Thyroxine)', desc: 'Measures thyroxine level in blood', tags: ['Thyroid', 'T4'] },
        { title: 'TSH (Thyroid Stimulating Hormone)', desc: 'Assesses thyroid stimulating hormone level', tags: ['Thyroid', 'TSH'] },
        { title: 'Free T3', desc: 'Free triiodothyronine level in blood', tags: ['Thyroid', 'Free T3'] },
        { title: 'Free T4', desc: 'Free thyroxine level in blood', tags: ['Thyroid', 'Free T4'] },
        { title: 'Cortisol (AM/PM)', desc: 'Stress hormone level evaluation', tags: ['Adrenal', 'Cortisol'] },
        { title: 'Prolactin', desc: 'Assess prolactin hormone level', tags: ['Pituitary', 'Prolactin'] },
        { title: 'LH (Luteinizing Hormone)', desc: 'Evaluation of reproductive hormone (LH)', tags: ['Reproductive', 'LH'] },
        { title: 'FSH (Follicle Stimulating Hormone)', desc: 'Evaluation of reproductive hormone (FSH)', tags: ['Reproductive', 'FSH'] },
        { title: 'Estradiol (E2)', desc: 'Estrogen hormone level in blood', tags: ['Estrogen', 'Estradiol'] },
        { title: 'Testosterone', desc: 'Male hormone level evaluation', tags: ['Androgen', 'Testosterone'] },
      ]
    },
    {
      name: 'Infectious Disease',
      desc: 'Serology and molecular diagnostic assays for infectious pathogens',
      tests: [
        { title: 'HIV 1 & 2 Antibodies', desc: 'Screening for Human Immunodeficiency Virus', tags: ['HIV', 'Serology'] },
        { title: 'HBsAg (Hepatitis B Surface Antigen)', desc: 'Screening for acute or chronic Hepatitis B infection', tags: ['Hepatitis B', 'HBsAg'] },
        { title: 'Anti-HCV (Hepatitis C Antibody)', desc: 'Screening for Hepatitis C viral exposure', tags: ['Hepatitis C', 'Anti-HCV'] },
        { title: 'Dengue NS1 Antigen & IgM/IgG', desc: 'Rapid serological diagnosis of Dengue fever', tags: ['Dengue', 'Viral Fever'] },
        { title: 'Widal / Typhoid Test', desc: 'Serological test for Enteric Fever (Salmonella)', tags: ['Typhoid', 'Widal'] },
        { title: 'COVID-19 RT-PCR / Antigen', desc: 'Detection of SARS-CoV-2 viral RNA', tags: ['COVID-19', 'RT-PCR'] },
      ]
    },
    {
      name: 'Liver Function (LFT)',
      desc: 'Hepatic enzymes, bilirubin fractions, and synthetic function tests',
      tests: [
        { title: 'Complete Liver Function Test (LFT)', desc: 'Bilirubin, SGOT/AST, SGPT/ALT, Alk Phos, Protein, Albumin', tags: ['LFT', 'Liver', 'Bilirubin'] },
        { title: 'SGPT / ALT', desc: 'Specific liver parenchymal injury enzyme', tags: ['ALT', 'Liver Enzyme'] },
        { title: 'SGOT / AST', desc: 'Liver and cardiac cellular enzyme', tags: ['AST', 'Liver Enzyme'] },
        { title: 'Serum Bilirubin (Total & Direct)', desc: 'Evaluation of jaundice & biliary clearance', tags: ['Bilirubin', 'Jaundice'] },
      ]
    },
    {
      name: 'Kidney Function (KFT)',
      desc: 'Renal panel including creatinine, BUN, electrolytes, and clearance',
      tests: [
        { title: 'Complete Kidney Function Test (KFT)', desc: 'Serum Creatinine, Urea, Uric Acid, Na, K, Chloride', tags: ['KFT', 'Kidney', 'Creatinine'] },
        { title: 'eGFR (Estimated GFR)', desc: 'Glomerular filtration rate calculation for CKD staging', tags: ['eGFR', 'CKD', 'Kidney'] },
        { title: 'Serum Electrolytes Panel', desc: 'Sodium, Potassium, Chloride and Bicarbonate', tags: ['Electrolytes', 'Kidney'] },
      ]
    },
    {
      name: 'Cardiac Markers',
      desc: 'Myocardial injury enzymes and heart failure biomarkers',
      tests: [
        { title: 'Troponin I / Troponin T (High Sensitivity)', desc: 'Gold standard cardiac biomarker for acute myocardial infarction', tags: ['Troponin', 'Cardiac', 'MI'] },
        { title: 'NT-proBNP / BNP', desc: 'Biomarker for heart failure diagnosis and monitoring', tags: ['BNP', 'Heart Failure', 'Cardiac'] },
        { title: 'CK-MB', desc: 'Creatine kinase isoenzyme for myocardial injury', tags: ['CK-MB', 'Cardiac'] },
        { title: 'hs-CRP (High-Sensitivity C-Reactive Protein)', desc: 'Cardiovascular risk stratification marker', tags: ['hs-CRP', 'Cardiac Risk'] },
      ]
    },
    {
      name: 'Diabetes / Glucose',
      desc: 'Glycemic monitoring, fasting/postprandial glucose, and insulin levels',
      tests: [
        { title: 'HbA1c & Fasting Glucose', desc: 'Comprehensive diabetes screening profile', tags: ['Diabetes', 'HbA1c', 'Glucose'] },
        { title: 'Oral Glucose Tolerance Test (OGTT)', desc: 'Gestational and impaired glucose tolerance evaluation', tags: ['OGTT', 'Glucose'] },
        { title: 'Fasting Serum Insulin', desc: 'Insulin resistance & beta-cell function evaluation', tags: ['Insulin', 'Diabetes'] },
      ]
    },
    {
      name: 'Iron Studies',
      desc: 'Serum iron, total iron binding capacity, and ferritin reserves',
      tests: [
        { title: 'Complete Iron Profile', desc: 'Serum Iron, TIBC, UIBC, % Saturation & Serum Ferritin', tags: ['Iron', 'Ferritin', 'Anemia'] },
        { title: 'Serum Ferritin', desc: 'Primary indicator of body iron storage', tags: ['Ferritin', 'Iron Storage'] },
      ]
    },
    {
      name: 'Vitamins & Minerals',
      desc: 'Micronutrient status including Vitamin D, B12, Calcium & Magnesium',
      tests: [
        { title: 'Vitamin D3 (25-Hydroxy)', desc: 'Bone health and vitamin D sufficiency level', tags: ['Vitamin D', 'Calcium'] },
        { title: 'Vitamin B12 (Cyanocobalamin)', desc: 'Nerve function and megaloblastic anemia marker', tags: ['Vitamin B12', 'Neurology'] },
        { title: 'Serum Calcium & Phosphorus', desc: 'Bone metabolic panel', tags: ['Calcium', 'Bone Health'] },
      ]
    },
    {
      name: 'Others',
      desc: 'Specialized immunological, allergy, and rare serum diagnostic assays',
      tests: [
        { title: 'Total IgE (Allergy Panel)', desc: 'Screening for allergic hyper-responsiveness', tags: ['Allergy', 'IgE'] },
        { title: 'ANA (Antinuclear Antibodies)', desc: 'Autoimmune disease screening panel', tags: ['Autoimmune', 'ANA'] },
      ]
    }
  ],
  xray: [
    {
      name: 'Chest X-Ray',
      desc: 'Thoracic radiographs evaluating lung parenchyma, pleura & cardiac silhouette',
      tests: [
        { title: 'Chest X-Ray PA View', desc: 'Standard posterior-anterior view of chest', tags: ['Chest X-Ray', 'Lungs', 'Radiology'] },
        { title: 'Chest X-Ray AP / Lateral View', desc: 'Anterior-posterior or lateral view for localized lesions', tags: ['Chest X-Ray', 'Lateral'] },
      ]
    },
    {
      name: 'Bone & Joint',
      desc: 'Radiographs of extremities, fractures, degenerative joint disease',
      tests: [
        { title: 'X-Ray Knee Joint (AP & Lateral)', desc: 'Evaluation of joint space narrowing & osteoarthritis', tags: ['X-Ray', 'Knee', 'Joint'] },
        { title: 'X-Ray Shoulder Joint', desc: 'Trauma, dislocation, and calcific tendinitis assessment', tags: ['X-Ray', 'Shoulder'] },
        { title: 'X-Ray Pelvis with Both Hips', desc: 'Hip joint pathology and pelvic fracture assessment', tags: ['X-Ray', 'Hip', 'Pelvis'] },
      ]
    },
    {
      name: 'Spine X-Ray',
      desc: 'Cervical, thoracic, lumbar, and lumbosacral spine radiographs',
      tests: [
        { title: 'X-Ray Lumbar Spine (AP & Lat)', desc: 'Evaluation of disc space, spondylolisthesis & osteophytes', tags: ['Spine', 'Lumbar X-Ray'] },
        { title: 'X-Ray Cervical Spine', desc: 'Cervical lordosis and neural foraminal stenosis evaluation', tags: ['Spine', 'Cervical X-Ray'] },
      ]
    }
  ]
};

// Fallback generator for other categories so every category is functional
function getCategorySubData(catId: string, catName: string) {
  if (SUBCATEGORIES_DATA[catId]) return SUBCATEGORIES_DATA[catId];
  return [
    {
      name: `General ${catName}`,
      desc: `Standard diagnostic reporting for ${catName}`,
      tests: [
        { title: `${catName} - Standard Report`, desc: `Comprehensive summary and findings for ${catName}`, tags: [catName, 'Diagnostic'] },
        { title: `${catName} - Follow-up / Serial`, desc: `Comparative serial assessment for ${catName}`, tags: [catName, 'Follow-up'] },
        { title: `${catName} - Urgent / Emergency`, desc: `Priority emergency imaging or test findings`, tags: [catName, 'Emergency'] },
      ]
    },
    {
      name: `Specialized ${catName}`,
      desc: `Advanced contrast, targeted or sub-specialty ${catName} protocols`,
      tests: [
        { title: `${catName} - Advanced Protocol`, desc: `High resolution / contrast-enhanced study`, tags: [catName, 'Specialized'] },
        { title: `${catName} - Guided Procedure / Biopsy`, desc: `Interventional guided study procedure`, tags: [catName, 'Procedure'] },
      ]
    }
  ];
}

export default function SelectReportModal({ isOpen, onClose, onSelect }: SelectReportModalProps) {
  const [selectedMainCat, setSelectedMainCat] = useState<string>('blood');
  const [selectedSubCatIndex, setSelectedSubCatIndex] = useState<number>(2); // Default to 'Hormone & Endocrine' (idx 2)
  const [selectedTestTitle, setSelectedTestTitle] = useState<string>('Thyroid Profile (T3, T4, TSH)');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const currentMainCatObj = MAIN_CATEGORIES.find((c) => c.id === selectedMainCat) || MAIN_CATEGORIES[0];
  const subCategoriesList = getCategorySubData(selectedMainCat, currentMainCatObj.name);
  const activeSubCat = subCategoriesList[selectedSubCatIndex] || subCategoriesList[0];

  const filteredTests = activeSubCat.tests.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleConfirmSelect = (testItem: { title: string; tags: string[] }) => {
    onSelect({
      mainCategory: currentMainCatObj.name,
      subCategory: `${activeSubCat.name} - ${testItem.title}`,
      testItem: testItem.title,
      tags: testItem.tags,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-3xl max-w-6xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header bar matching "Add Report" reference UI */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2]" />
            </button>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[#0B132B] dark:text-white font-sans">
                Add Report
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Select the type of report you want to upload
              </p>
            </div>
          </div>

          {/* Search box on right */}
          <div className="relative hidden md:block w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subcategory..."
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            />
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* STEP 1: Choose Main Category Horizontal Row matching UI reference */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#0B132B] text-white text-[11px] font-bold flex items-center justify-center">1</span>
              <h3 className="text-xs font-bold text-[#0B132B] dark:text-slate-100 tracking-wide uppercase">
                Choose Main Category
              </h3>
            </div>

            {/* Main Category Cards Row */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {MAIN_CATEGORIES.map((cat) => {
                const isActive = selectedMainCat === cat.id;
                const IconComponent = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedMainCat(cat.id);
                      setSelectedSubCatIndex(0);
                    }}
                    className={`relative flex flex-col items-center justify-center p-3.5 rounded-2xl min-w-[100px] border transition-all shrink-0 select-none ${
                      isActive
                        ? 'bg-[#0B132B] text-white border-[#0B132B] shadow-md scale-102'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${
                      isActive ? 'bg-white/10 text-white' : cat.color
                    }`}>
                      <IconComponent className="w-5 h-5 stroke-[2]" />
                    </div>
                    <span className={`text-[11px] font-bold text-center leading-tight ${isActive ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                      {cat.name}
                    </span>

                    {/* Speech Triangle Pointer pointing down for active item matching screenshot */}
                    {isActive && (
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[7px] border-t-[#0B132B]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Choose Subcategory & Grid matching UI reference */}
          <div className="space-y-3 pt-2 border-t border-slate-200/80 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#0B132B] text-white text-[11px] font-bold flex items-center justify-center">2</span>
                <h3 className="text-xs font-bold text-[#0B132B] dark:text-slate-100 tracking-wide uppercase">
                  Choose Subcategory – <span className="text-blue-600 dark:text-blue-400">{currentMainCatObj.name}</span>
                </h3>
              </div>

              {/* Search box on mobile */}
              <div className="relative md:hidden w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search subcategory..."
                  className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400"
                />
              </div>
            </div>

            {/* Split layout: Subcategory Menu (Left) + Subcategory Test Cards (Right) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start pt-1">
              
              {/* Left Subcategory Vertical List */}
              <div className="md:col-span-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-2 space-y-1 shadow-2xs">
                {subCategoriesList.map((sub, idx) => {
                  const isActive = selectedSubCatIndex === idx;
                  return (
                    <button
                      key={sub.name}
                      onClick={() => setSelectedSubCatIndex(idx)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                        isActive
                          ? 'bg-[#EEF2FF] text-[#4F46E5] dark:bg-indigo-950/50 dark:text-indigo-400 font-bold shadow-2xs'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="truncate">{sub.name}</span>
                      <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-[#4F46E5] translate-x-0.5' : 'text-slate-400'}`} />
                    </button>
                  );
                })}
              </div>

              {/* Right Cards Area */}
              <div className="md:col-span-9 space-y-4">
                
                {/* Active Subcategory Banner Card matching reference screenshot */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4.5 shadow-2xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0B132B] dark:bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Activity className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#0B132B] dark:text-white font-sans">
                      {activeSubCat.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                      {activeSubCat.desc}
                    </p>
                  </div>
                </div>

                {/* Test Cards Grid matching reference UI */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {filteredTests.map((test) => {
                    const isSelected = selectedTestTitle === test.title;
                    return (
                      <div
                        key={test.title}
                        onClick={() => setSelectedTestTitle(test.title)}
                        className={`bg-white dark:bg-slate-900 border rounded-2xl p-4 cursor-pointer transition-all flex flex-col justify-between space-y-3 relative group hover:shadow-md ${
                          isSelected
                            ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/20 dark:bg-indigo-950/30'
                            : 'border-slate-200/80 dark:border-slate-800 hover:border-indigo-300'
                        }`}
                      >
                        {/* Circle Badge with Test Icon / Code */}
                        <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-xs border border-purple-100 dark:border-purple-900/60 mx-auto">
                          {test.title.split(' ')[0].slice(0, 3).toUpperCase()}
                        </div>

                        <div className="text-center space-y-1">
                          <h5 className="text-xs font-bold text-[#0B132B] dark:text-white leading-snug">
                            {test.title}
                          </h5>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500 line-clamp-2 font-normal leading-tight">
                            {test.desc}
                          </p>
                        </div>

                        {/* Quick Select Checkmark or Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTestTitle(test.title);
                            handleConfirmSelect(test);
                          }}
                          className={`w-full py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
                            isSelected
                              ? 'bg-[#4F46E5] text-white shadow-xs'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600'
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <Check className="w-3.5 h-3.5" /> Selected
                            </>
                          ) : (
                            'Select Test'
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer Bar with Next button matching reference */}
        <div className="bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500 font-medium">
            Selected: <span className="font-bold text-[#0B132B] dark:text-white">{currentMainCatObj.name} → {activeSubCat.name} ({selectedTestTitle})</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                const currentTest = activeSubCat.tests.find((t) => t.title === selectedTestTitle) || activeSubCat.tests[0];
                handleConfirmSelect(currentTest);
              }}
              className="px-6 py-2.5 bg-[#0B132B] hover:bg-slate-900 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-2 transition-all active:scale-95"
            >
              Next
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
