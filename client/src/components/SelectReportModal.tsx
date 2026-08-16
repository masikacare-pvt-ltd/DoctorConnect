import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Search,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';
import {
  BloodCells,
  BiochemistryLaboratory,
  Endocrinology,
  Virus,
  Liver,
  Kidneys,
  HeartCardiogram,
  DiabetesMeasure,
  Biomarker,
  Nutrition,
  MicroscopeWithSpecimen,
  HematologyLaboratory,
  Bacteria,
  Thyroid,
  Cardiology,
  Dna,
  UrineSample,
  MedicalSample,
  Radiology,
  Sonography,
  Biopsy,
  Gastroenterology,
  Nephrology,
  Oncology,
  Heart,
  Lungs,
  Stethoscope,
  LabSearch,
  Orthopaedics,
  Gynecology,
  Pediatrics,
  Neurology,
  EarsNoseAndThroat,
  Urology,
  Hepatology,
  GeneralSurgery,
  Skull,
  Tooth,
  BloodDrop,
  Colon,
} from 'healthicons-react';
import { getTestIcon } from './icons/IconRegistry';
import * as CatIcons from './icons/CategoryIcons';

export interface ReportSelection {
  mainCategory: string;
  subCategory: string;
  testItem: string;
  tags: string[];
}

interface SubCategoryItem {
  name: string;
  desc: string;
  iconBg: string;
  iconColor: string;
  badgeIcon: React.ComponentType<any>;
  menuIcon: React.ComponentType<any>;
  tests: Array<{ title: string; desc: string; badgeText: string; tags: string[] }>;
}

const MAIN_CATEGORIES = [
  { id: 'blood', name: 'Blood Test', icon: CatIcons.IconBloodDrop, color: 'bg-rose-50 text-rose-500 dark:bg-rose-950/50 dark:text-rose-400', iconBg: 'bg-rose-50 dark:bg-rose-950/50', iconColor: 'text-rose-500 dark:text-rose-400', textColor: 'text-rose-600 dark:text-rose-400' },
  { id: 'urine', name: 'Urine Test', icon: CatIcons.IconUrineDipstick, color: 'bg-amber-50 text-amber-500 dark:bg-amber-950/50 dark:text-amber-400', iconBg: 'bg-amber-50 dark:bg-amber-950/50', iconColor: 'text-amber-500 dark:text-amber-400', textColor: 'text-amber-600 dark:text-amber-400' },
  { id: 'stool', name: 'Stool Test', icon: CatIcons.IconStoolJar, color: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-950/50 dark:text-yellow-400', iconBg: 'bg-yellow-50 dark:bg-yellow-950/50', iconColor: 'text-yellow-600 dark:text-yellow-400', textColor: 'text-yellow-600 dark:text-yellow-400' },
  { id: 'pathology', name: 'Pathology / Biopsy', icon: CatIcons.IconBiopsySlide, color: 'bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400', iconBg: 'bg-purple-50 dark:bg-purple-950/50', iconColor: 'text-purple-600 dark:text-purple-400', textColor: 'text-purple-600 dark:text-purple-400' },
  { id: 'xray', name: 'X-Ray', icon: CatIcons.IconChestXRay, color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400', iconBg: 'bg-blue-50 dark:bg-blue-950/50', iconColor: 'text-blue-600 dark:text-blue-400', textColor: 'text-blue-600 dark:text-blue-400' },
  { id: 'usg', name: 'Ultrasound (USG)', icon: CatIcons.IconUltrasoundProbe, color: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/50 dark:text-cyan-400', iconBg: 'bg-cyan-50 dark:bg-cyan-950/50', iconColor: 'text-cyan-600 dark:text-cyan-400', textColor: 'text-cyan-600 dark:text-cyan-400' },
  { id: 'mri', name: 'MRI', icon: CatIcons.IconMRIScanner, color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400', iconBg: 'bg-indigo-50 dark:bg-indigo-950/50', iconColor: 'text-indigo-600 dark:text-indigo-400', textColor: 'text-indigo-600 dark:text-indigo-400' },
  { id: 'ct', name: 'CT Scan', icon: CatIcons.IconCTScanGantry, color: 'bg-teal-50 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400', iconBg: 'bg-teal-50 dark:bg-teal-950/50', iconColor: 'text-teal-600 dark:text-teal-400', textColor: 'text-teal-600 dark:text-teal-400' },
  { id: 'ecg', name: 'ECG / Echo', icon: CatIcons.IconECGWave, color: 'bg-pink-50 text-pink-600 dark:bg-pink-950/50 dark:text-pink-400', iconBg: 'bg-pink-50 dark:bg-pink-950/50', iconColor: 'text-pink-600 dark:text-pink-400', textColor: 'text-pink-600 dark:text-pink-400' },
  { id: 'endoscopy', name: 'Endoscopy', icon: CatIcons.IconEndoscope, color: 'bg-orange-50 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400', iconBg: 'bg-orange-50 dark:bg-orange-950/50', iconColor: 'text-orange-600 dark:text-orange-400', textColor: 'text-orange-600 dark:text-orange-400' },
  { id: 'genetic', name: 'Genetic Test', icon: CatIcons.IconDNAStrand, color: 'bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400', iconBg: 'bg-violet-50 dark:bg-violet-950/50', iconColor: 'text-violet-600 dark:text-violet-400', textColor: 'text-violet-600 dark:text-violet-400' },
  { id: 'checkup', name: 'Health Checkup Report', icon: CatIcons.IconCheckupReport, color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400', iconBg: 'bg-emerald-50 dark:bg-emerald-950/50', iconColor: 'text-emerald-600 dark:text-emerald-400', textColor: 'text-emerald-600 dark:text-emerald-400' },
  { id: 'others', name: 'Others', icon: MoreHorizontal, color: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300', iconBg: 'bg-slate-100 dark:bg-slate-800', iconColor: 'text-slate-600 dark:text-slate-300', textColor: 'text-slate-700 dark:text-slate-200' },
];

// Custom SVG Test Badge renderer using IconRegistry for pixel-perfect medical icons
function TestBadgeIcon({ title, badgeText, iconBg, iconColor, fallbackIcon: FallbackIcon }: { title: string; badgeText?: string; iconBg: string; iconColor: string; fallbackIcon?: React.ComponentType<any> }) {
  const IconComponent = getTestIcon(title);

  if (IconComponent) {
    return (
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg} ${iconColor} border border-slate-200/80 dark:border-slate-800 mx-auto shadow-2xs shrink-0`}>
        <IconComponent className="w-5 h-5 stroke-[1.8] stroke-current fill-none" />
      </div>
    );
  }

  // Every reference tile has a medical illustration.  Use its subcategory
  // illustration for tests which do not need a more specific registry icon.
  if (FallbackIcon) {
    return (
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg} ${iconColor} border border-slate-200/80 dark:border-slate-800 mx-auto shadow-2xs shrink-0`}>
        <FallbackIcon className="w-5 h-5 stroke-[1.8] stroke-current fill-none" />
      </div>
    );
  }

  // Fallback text badge for unmapped or custom user tests
  return (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg} ${iconColor} border border-slate-200/80 dark:border-slate-800 mx-auto shadow-2xs font-extrabold text-[11px] font-sans tracking-tight shrink-0`}>
      {badgeText || title.split(' ')[0]}
    </div>
  );
}

// Complete Blood Test data matching all 11 reference UI screenshots exactly
const BLOOD_TEST_SUBCATEGORIES: SubCategoryItem[] = [
  {
    name: 'Hematology',
    desc: 'Complete blood cell analysis and related tests',
    iconBg: 'bg-rose-50 dark:bg-rose-950/50',
    iconColor: 'text-rose-500 dark:text-rose-400',
    badgeIcon: BloodCells,
    menuIcon: BloodCells,
    tests: [
      { title: 'Complete Blood Count (CBC)', desc: 'Overall health summary including RBC, WBC, Platelets, Hb, etc.', badgeText: 'CBC', tags: ['CBC', 'Hemoglobin', 'Platelets', 'RBC', 'WBC'] },
      { title: 'Peripheral Blood Smear (PBS)', desc: 'Examination of blood cells under microscope', badgeText: 'PBS', tags: ['Blood Smear', 'Morphology'] },
      { title: 'Hemoglobin (Hb)', desc: 'Measures the amount of hemoglobin in blood', badgeText: 'Hb', tags: ['Hemoglobin', 'Anemia'] },
      { title: 'PCV / Hematocrit (HCT)', desc: 'Proportion of red blood cells in blood', badgeText: 'PCV', tags: ['PCV', 'Hematocrit'] },
      { title: 'ESR', desc: 'Erythrocyte Sedimentation Rate', badgeText: 'ESR', tags: ['ESR', 'Inflammation'] },
      { title: 'RBC Count', desc: 'Measures the number of red blood cells', badgeText: 'RBC', tags: ['RBC', 'Red Cells'] },
      { title: 'WBC Count', desc: 'Measures the number of white blood cells', badgeText: 'WBC', tags: ['WBC', 'Leukocytes'] },
      { title: 'Platelet Count', desc: 'Measures the number of platelets in blood', badgeText: 'PLT', tags: ['Platelets', 'Thrombocytes'] },
      { title: 'Blood Group & RH Typing', desc: 'Determine blood group and Rh factor', badgeText: 'ABO', tags: ['Blood Group', 'Rh Factor'] },
      { title: 'Bleeding Time (BT) / Clotting Time (CT)', desc: 'Assess blood clotting function', badgeText: 'BT/CT', tags: ['Bleeding Time', 'Clotting'] }
    ]
  },
  {
    name: 'Biochemistry',
    desc: 'Chemical analysis of blood to assess organ function and overall health',
    iconBg: 'bg-pink-50 dark:bg-pink-950/50',
    iconColor: 'text-pink-500 dark:text-pink-400',
    badgeIcon: BiochemistryLaboratory, menuIcon: BiochemistryLaboratory,
    tests: [
      { title: 'Liver Function Test (LFT)', desc: 'Assess liver health and its functioning', badgeText: 'LFT', tags: ['LFT', 'Liver'] },
      { title: 'Kidney Function Test (KFT)', desc: 'Evaluate kidney function and filtration', badgeText: 'KFT', tags: ['KFT', 'Kidney'] },
      { title: 'Lipid Profile', desc: 'Cholesterol, Triglycerides, HDL, LDL, VLDL, Total Cholesterol', badgeText: 'LIPID', tags: ['Lipid', 'Cholesterol', 'Triglycerides'] },
      { title: 'Blood Sugar (Fasting & PP)', desc: 'Fasting and Postprandial blood glucose levels', badgeText: 'GLU', tags: ['Glucose', 'Fasting Sugar', 'PPBS'] },
      { title: 'HbA1c', desc: 'Average blood sugar level over past 2–3 months', badgeText: 'A1C', tags: ['HbA1c', 'Glycated Hemoglobin'] },
      { title: 'Electrolytes', desc: 'Sodium, Potassium, Chloride, Bicarbonate, Calcium', badgeText: 'ELEC', tags: ['Electrolytes', 'Sodium', 'Potassium'] },
      { title: 'Uric Acid', desc: 'Detects uric acid levels in blood', badgeText: 'UA', tags: ['Uric Acid', 'Gout'] },
      { title: 'Calcium', desc: 'Total calcium level in blood', badgeText: 'Ca', tags: ['Calcium', 'Bone Health'] },
      { title: 'Phosphorus', desc: 'Phosphate levels in blood', badgeText: 'P', tags: ['Phosphorus', 'Phosphate'] },
      { title: 'Total Protein', desc: 'Total protein level in blood', badgeText: 'TP', tags: ['Total Protein', 'Albumin'] },
      { title: 'Albumin', desc: 'Albumin level in blood (Protein made by liver)', badgeText: 'ALB', tags: ['Albumin', 'Liver Protein'] },
      { title: 'Globulin', desc: 'Globulin level in blood (Immune proteins)', badgeText: 'GLOB', tags: ['Globulin', 'Immune Protein'] }
    ]
  },
  {
    name: 'Hormone & Endocrine',
    desc: 'Hormonal assays to evaluate endocrine gland function and balance',
    iconBg: 'bg-purple-50 dark:bg-purple-950/50',
    iconColor: 'text-purple-600 dark:text-purple-400',
    badgeIcon: Endocrinology, menuIcon: Endocrinology,
    tests: [
      { title: 'Thyroid Profile (T3, T4, TSH)', desc: 'Evaluate thyroid gland function', badgeText: 'TFT', tags: ['Thyroid', 'T3', 'T4', 'TSH'] },
      { title: 'T3 (Triiodothyronine)', desc: 'Measures triiodothyronine level in blood', badgeText: 'T3', tags: ['T3', 'Thyroid'] },
      { title: 'T4 (Thyroxine)', desc: 'Measures thyroxine level in blood', badgeText: 'T4', tags: ['T4', 'Thyroxine'] },
      { title: 'TSH (Thyroid Stimulating Hormone)', desc: 'Assesses thyroid stimulating hormone level', badgeText: 'TSH', tags: ['TSH', 'Thyroid'] },
      { title: 'Free T3', desc: 'Free triiodothyronine level in blood', badgeText: 'FT3', tags: ['Free T3', 'Thyroid'] },
      { title: 'Free T4', desc: 'Free thyroxine level in blood', badgeText: 'FT4', tags: ['Free T4', 'Thyroid'] },
      { title: 'Cortisol (AM/PM)', desc: 'Stress hormone level evaluation', badgeText: 'CORT', tags: ['Cortisol', 'Adrenal'] },
      { title: 'Prolactin', desc: 'Assess prolactin hormone level', badgeText: 'PRL', tags: ['Prolactin', 'Pituitary'] },
      { title: 'LH (Luteinizing Hormone)', desc: 'Evaluation of reproductive hormone (LH)', badgeText: 'LH', tags: ['LH', 'Reproductive'] },
      { title: 'FSH (Follicle Stimulating Hormone)', desc: 'Evaluation of reproductive hormone (FSH)', badgeText: 'FSH', tags: ['FSH', 'Reproductive'] },
      { title: 'Estradiol (E2)', desc: 'Estrogen hormone level in blood', badgeText: 'E2', tags: ['Estradiol', 'Estrogen'] },
      { title: 'Testosterone', desc: 'Male hormone level evaluation', badgeText: 'TEST', tags: ['Testosterone', 'Androgen'] }
    ]
  },
  {
    name: 'Infectious Disease',
    desc: 'Tests to detect infections caused by bacteria, viruses, parasites and other pathogens',
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/50',
    iconColor: 'text-emerald-500 dark:text-emerald-400',
    badgeIcon: Virus, menuIcon: Virus,
    tests: [
      { title: 'Typhoid (Widal Test)', desc: 'Detects Salmonella typhi infection', badgeText: 'WIDAL', tags: ['Typhoid', 'Widal', 'Salmonella'] },
      { title: 'Malaria Parasite (MP) Test', desc: 'Detects malaria parasite in blood', badgeText: 'MP', tags: ['Malaria', 'MP Test', 'Parasite'] },
      { title: 'Dengue NS1 Antigen', desc: 'Early detection of dengue infection', badgeText: 'NS1', tags: ['Dengue', 'NS1', 'Fever'] },
      { title: 'Dengue IgG & IgM Antibody', desc: 'Detects past and recent dengue infection', badgeText: 'DEN', tags: ['Dengue Antibody', 'IgG', 'IgM'] },
      { title: 'Chikungunya IgM', desc: 'Detects Chikungunya virus infection', badgeText: 'CHIK', tags: ['Chikungunya', 'Viral'] },
      { title: 'Leptospira IgM', desc: 'Detects Leptospira infection', badgeText: 'LEPTO', tags: ['Leptospira', 'Bacterial'] },
      { title: 'HIV 1 & 2 (ELISA)', desc: 'Screening test for HIV infection', badgeText: 'HIV', tags: ['HIV', 'ELISA', 'Serology'] },
      { title: 'HBsAg', desc: 'Hepatitis B surface antigen test', badgeText: 'HBsAg', tags: ['Hepatitis B', 'HBsAg'] },
      { title: 'Anti HCV', desc: 'Hepatitis C virus antibody test', badgeText: 'HCV', tags: ['Hepatitis C', 'Anti-HCV'] },
      { title: 'VDRL / RPR', desc: 'Screening test for syphilis infection', badgeText: 'VDRL', tags: ['VDRL', 'Syphilis', 'RPR'] },
      { title: 'TB (AFB) Test', desc: 'Detects Mycobacterium tuberculosis', badgeText: 'AFB', tags: ['Tuberculosis', 'TB', 'AFB'] },
      { title: 'CRP (C-Reactive Protein)', desc: 'Detects inflammation due to infections', badgeText: 'CRP', tags: ['CRP', 'Inflammation'] }
    ]
  },
  {
    name: 'Liver Function (LFT)',
    desc: 'Tests to assess liver health and its ability to function properly',
    iconBg: 'bg-amber-50 dark:bg-amber-950/50',
    iconColor: 'text-amber-500 dark:text-amber-400',
    badgeIcon: Liver, menuIcon: Liver,
    tests: [
      { title: 'SGOT (AST)', desc: 'Aspartate Aminotransferase enzyme level', badgeText: 'SGOT', tags: ['SGOT', 'AST', 'Liver Enzyme'] },
      { title: 'SGPT (ALT)', desc: 'Alanine Aminotransferase enzyme level', badgeText: 'SGPT', tags: ['SGPT', 'ALT', 'Liver Enzyme'] },
      { title: 'Alkaline Phosphatase (ALP)', desc: 'Alkaline Phosphatase enzyme level', badgeText: 'ALP', tags: ['ALP', 'Alkaline Phosphatase'] },
      { title: 'GGT (Gamma GT)', desc: 'Gamma Glutamyl Transferase enzyme level', badgeText: 'GGT', tags: ['GGT', 'Gamma GT'] },
      { title: 'Total Bilirubin', desc: 'Measures total bilirubin in blood', badgeText: 'TBIL', tags: ['Total Bilirubin', 'Jaundice'] },
      { title: 'Direct Bilirubin', desc: 'Measures direct (conjugated) bilirubin in blood', badgeText: 'DBIL', tags: ['Direct Bilirubin', 'Conjugated'] },
      { title: 'Indirect Bilirubin', desc: 'Measures indirect (unconjugated) bilirubin', badgeText: 'IBIL', tags: ['Indirect Bilirubin', 'Jaundice'] },
      { title: 'Total Protein', desc: 'Measures total protein in blood', badgeText: 'TPROT', tags: ['Total Protein', 'Liver'] },
      { title: 'Albumin', desc: 'Measures albumin level in blood', badgeText: 'ALB', tags: ['Albumin', 'Serum Protein'] },
      { title: 'Globulin', desc: 'Measures globulin level in blood', badgeText: 'GLOB', tags: ['Globulin', 'Serum Protein'] },
      { title: 'A/G Ratio', desc: 'Albumin to Globulin ratio', badgeText: 'A/G', tags: ['A/G Ratio', 'Albumin Globulin'] },
      { title: 'LDH (Lactate Dehydrogenase)', desc: 'Lactate Dehydrogenase enzyme level', badgeText: 'LDH', tags: ['LDH', 'Enzyme'] }
    ]
  },
  {
    name: 'Kidney Function (KFT)',
    desc: 'Tests to evaluate kidney health and filtration function',
    iconBg: 'bg-[#EEF2FF] dark:bg-indigo-950/50',
    iconColor: 'text-[#4F46E5] dark:text-indigo-400',
    badgeIcon: Kidneys, menuIcon: Kidneys,
    tests: [
      { title: 'Serum Creatinine', desc: 'Measures creatinine level in blood', badgeText: 'CREAT', tags: ['Creatinine', 'Renal', 'KFT'] },
      { title: 'Blood Urea', desc: 'Measures urea level in blood', badgeText: 'UREA', tags: ['Urea', 'Renal Function'] },
      { title: 'BUN', desc: 'Blood Urea Nitrogen level', badgeText: 'BUN', tags: ['BUN', 'Blood Urea Nitrogen'] },
      { title: 'Uric Acid', desc: 'Measures uric acid level in blood', badgeText: 'UA', tags: ['Uric Acid', 'Gout'] },
      { title: 'eGFR', desc: 'Estimated Glomerular Filtration Rate', badgeText: 'eGFR', tags: ['eGFR', 'Glomerular Filtration'] },
      { title: 'Sodium (Na+)', desc: 'Measures sodium level in blood', badgeText: 'Na+', tags: ['Sodium', 'Electrolytes'] },
      { title: 'Potassium (K+)', desc: 'Measures potassium level in blood', badgeText: 'K+', tags: ['Potassium', 'Electrolytes'] },
      { title: 'Chloride (Cl-)', desc: 'Measures chloride level in blood', badgeText: 'Cl-', tags: ['Chloride', 'Electrolytes'] },
      { title: 'Calcium', desc: 'Measures calcium level in blood', badgeText: 'Ca', tags: ['Calcium', 'KFT'] },
      { title: 'Phosphorus', desc: 'Measures phosphorus level in blood', badgeText: 'P', tags: ['Phosphorus', 'Phosphate'] },
      { title: 'Magnesium', desc: 'Measures magnesium level in blood', badgeText: 'Mg', tags: ['Magnesium', 'KFT'] },
      { title: 'Bicarbonate (HCO3-)', desc: 'Measures bicarbonate level in blood', badgeText: 'HCO3', tags: ['Bicarbonate', 'Acid-Base'] }
    ]
  },
  {
    name: 'Cardiac Markers',
    desc: 'Tests to assess heart health and detect cardiac injury or stress',
    iconBg: 'bg-rose-50 dark:bg-rose-950/50',
    iconColor: 'text-rose-600 dark:text-rose-400',
    badgeIcon: HeartCardiogram, menuIcon: HeartCardiogram,
    tests: [
      { title: 'Troponin I', desc: 'Highly specific marker for heart muscle injury', badgeText: 'TnI', tags: ['Troponin I', 'Cardiac Injury', 'MI'] },
      { title: 'Troponin T', desc: 'Specific marker for cardiac injury', badgeText: 'TnT', tags: ['Troponin T', 'Cardiac Injury'] },
      { title: 'CK-MB', desc: 'Creatine Kinase – MB isoenzyme', badgeText: 'CK-MB', tags: ['CK-MB', 'Myocardial Injury'] },
      { title: 'BNP', desc: 'B-type Natriuretic Peptide', badgeText: 'BNP', tags: ['BNP', 'Heart Failure'] },
      { title: 'NT-proBNP', desc: 'N-terminal pro B-type Natriuretic Peptide', badgeText: 'NT-pro', tags: ['NT-proBNP', 'Heart Failure'] },
      { title: 'Myoglobin', desc: 'Early marker for muscle injury', badgeText: 'MYO', tags: ['Myoglobin', 'Muscle Injury'] },
      { title: 'LDH', desc: 'Lactate Dehydrogenase – indicator of tissue damage', badgeText: 'LDH', tags: ['LDH', 'Tissue Damage'] },
      { title: 'hs-CRP', desc: 'High sensitivity C-Reactive Protein (inflammation marker)', badgeText: 'hs-CRP', tags: ['hs-CRP', 'Cardiac Risk'] },
      { title: 'D-Dimer', desc: 'Marker for clot formation and breakdown', badgeText: 'DD', tags: ['D-Dimer', 'Thrombosis', 'Clotting'] },
      { title: 'Homocysteine', desc: 'Amino acid associated with cardiovascular risk', badgeText: 'HCY', tags: ['Homocysteine', 'Cardiovascular Risk'] }
    ]
  },
  {
    name: 'Diabetes / Glucose',
    desc: 'Tests to evaluate blood sugar levels and diabetes control',
    iconBg: 'bg-indigo-50 dark:bg-indigo-950/50',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    badgeIcon: DiabetesMeasure, menuIcon: DiabetesMeasure,
    tests: [
      { title: 'Fasting Blood Sugar (FBS)', desc: 'Measures blood glucose after an overnight fast', badgeText: 'FBS', tags: ['FBS', 'Fasting Glucose', 'Diabetes'] },
      { title: 'Postprandial Blood Sugar (PPBS)', desc: 'Measures blood glucose 2 hours after meal', badgeText: 'PPBS', tags: ['PPBS', 'Postprandial', 'Glucose'] },
      { title: 'Random Blood Sugar (RBS)', desc: 'Measures blood glucose at any random time', badgeText: 'RBS', tags: ['RBS', 'Random Glucose'] },
      { title: 'HbA1c', desc: 'Average blood glucose control over 2–3 months', badgeText: 'HbA1c', tags: ['HbA1c', 'Glycated Hemoglobin'] },
      { title: 'Oral Glucose Tolerance Test (OGTT)', desc: "Assesses body's response to glucose load", badgeText: 'OGTT', tags: ['OGTT', 'Glucose Tolerance'] },
      { title: 'Fasting Insulin', desc: 'Measures baseline insulin level', badgeText: 'INS', tags: ['Insulin', 'Fasting Insulin'] },
      { title: 'C-Peptide', desc: 'Reflects endogenous insulin production', badgeText: 'C-Pep', tags: ['C-Peptide', 'Insulin Secretion'] },
      { title: 'Fructosamine', desc: 'Average blood glucose control over 2–3 weeks', badgeText: 'FRUC', tags: ['Fructosamine', 'Glycemic Control'] },
      { title: 'GAD Antibody', desc: 'Helps in diagnosis of Type 1 Diabetes', badgeText: 'GAD', tags: ['GAD Antibody', 'Type 1 Diabetes'] }
    ]
  },
  {
    name: 'Iron Studies',
    desc: 'Tests to evaluate iron status and detect iron deficiency or overload',
    iconBg: 'bg-amber-50 dark:bg-amber-950/50',
    iconColor: 'text-amber-600 dark:text-amber-400',
    badgeIcon: Biomarker, menuIcon: Biomarker,
    tests: [
      { title: 'Serum Iron', desc: 'Measures the level of iron in the blood', badgeText: 'Fe', tags: ['Serum Iron', 'Iron Deficiency'] },
      { title: 'Serum Ferritin', desc: 'Reflects body iron stores and deficiency', badgeText: 'FERR', tags: ['Ferritin', 'Iron Stores'] },
      { title: 'Total Iron Binding Capacity (TIBC)', desc: "Measures the blood's capacity to bind iron", badgeText: 'TIBC', tags: ['TIBC', 'Iron Binding'] },
      { title: 'Unsaturated Iron Binding Capacity (UIBC)', desc: 'Indicates iron binding capacity not bound to iron', badgeText: 'UIBC', tags: ['UIBC', 'Unsaturated Iron'] },
      { title: 'Transferrin', desc: 'Main protein that binds and transports iron', badgeText: 'TRSF', tags: ['Transferrin', 'Iron Transport'] },
      { title: 'Transferrin Saturation', desc: 'Percentage of transferrin saturated with iron', badgeText: '%Sat', tags: ['Transferrin Saturation', 'Iron'] },
      { title: 'Soluble Transferrin Receptor (sTfR)', desc: 'Helps detect iron deficiency even in chronic disease', badgeText: 'sTfR', tags: ['sTfR', 'Iron Deficiency'] },
      { title: 'Reticulocyte Hemoglobin Content (Ret-He)', desc: 'Indicates available iron for red blood cell production', badgeText: 'Ret-He', tags: ['Ret-He', 'Erythropoiesis'] }
    ]
  },
  {
    name: 'Vitamins & Minerals',
    desc: 'Tests to assess vitamin and mineral levels for better health & immunity',
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/50',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    badgeIcon: Nutrition, menuIcon: Nutrition,
    tests: [
      { title: 'Vitamin D (25-OH)', desc: 'Measures vitamin D level for bone & immunity', badgeText: 'Vit D', tags: ['Vitamin D', '25-OH', 'Bone Health'] },
      { title: 'Vitamin B12', desc: 'Essential for nerve function and red blood cell formation', badgeText: 'B12', tags: ['Vitamin B12', 'Cyanocobalamin'] },
      { title: 'Folate (Vitamin B9)', desc: 'Important for cell growth and DNA synthesis', badgeText: 'B9', tags: ['Folate', 'Vitamin B9', 'Folic Acid'] },
      { title: 'Vitamin A', desc: 'Supports vision, immunity and skin health', badgeText: 'Vit A', tags: ['Vitamin A', 'Retinol'] },
      { title: 'Vitamin E', desc: 'Powerful antioxidant for cell protection', badgeText: 'Vit E', tags: ['Vitamin E', 'Tocopherol'] },
      { title: 'Vitamin K', desc: 'Essential for blood clotting and bone health', badgeText: 'Vit K', tags: ['Vitamin K', 'Coagulation'] },
      { title: 'Vitamin C', desc: 'Supports immunity and wound healing', badgeText: 'Vit C', tags: ['Vitamin C', 'Ascorbic Acid'] },
      { title: 'Zinc', desc: 'Supports immunity, growth and cell repair', badgeText: 'Zn', tags: ['Zinc', 'Trace Mineral'] },
      { title: 'Copper', desc: 'Essential for iron metabolism and enzyme function', badgeText: 'Cu', tags: ['Copper', 'Ceruloplasmin'] },
      { title: 'Selenium', desc: 'Antioxidant mineral for cell protection', badgeText: 'Se', tags: ['Selenium', 'Antioxidant'] },
      { title: 'Magnesium', desc: 'Supports muscles, nerves and energy production', badgeText: 'Mg', tags: ['Magnesium', 'Electrolyte'] },
      { title: 'Calcium', desc: 'Essential for bones, teeth and muscle function', badgeText: 'Ca', tags: ['Calcium', 'Bone Health'] }
    ]
  },
  {
    name: 'Others',
    desc: 'Specialized and advanced blood investigations',
    iconBg: 'bg-[#EEF2FF] dark:bg-indigo-950/50',
    iconColor: 'text-[#4F46E5] dark:text-indigo-400',
    badgeIcon: LabSearch, menuIcon: LabSearch,
    tests: [
      { title: 'ANA (ANA Screen)', desc: 'Antinuclear Antibody Screening', badgeText: 'ANA', tags: ['ANA', 'Antinuclear Antibody', 'Autoimmune'] },
      { title: 'ANCA', desc: 'Anti Neutrophil Cytoplasmic Antibody', badgeText: 'ANCA', tags: ['ANCA', 'Vasculitis'] },
      { title: 'Anti-dsDNA', desc: 'Anti Double Stranded DNA Antibody', badgeText: 'dsDNA', tags: ['Anti-dsDNA', 'Lupus', 'SLE'] },
      { title: 'Rheumatoid Factor (RF)', desc: 'Helps in diagnosing rheumatoid arthritis', badgeText: 'RF', tags: ['Rheumatoid Factor', 'RF', 'Arthritis'] },
      { title: 'Anti-CCP', desc: 'Anti Cyclic Citrullinated Peptide Antibody', badgeText: 'aCCP', tags: ['Anti-CCP', 'Rheumatoid'] },
      { title: 'Procalcitonin (PCT)', desc: 'Marker for bacterial infection & sepsis', badgeText: 'PCT', tags: ['Procalcitonin', 'Sepsis', 'Infection'] },
      { title: 'Interleukin-6 (IL-6)', desc: 'Inflammation and immune response marker', badgeText: 'IL-6', tags: ['Interleukin-6', 'IL-6', 'Cytokine'] },
      { title: 'D-Dimer', desc: 'Helps in detecting blood clots (thrombosis)', badgeText: 'DD', tags: ['D-Dimer', 'Thrombosis', 'Clotting'] },
      { title: 'Beta-hCG', desc: 'Pregnancy hormone quantitative test', badgeText: 'hCG', tags: ['Beta-hCG', 'Pregnancy'] },
      { title: 'PSA', desc: 'Prostate Specific Antigen (For prostate health)', badgeText: 'PSA', tags: ['PSA', 'Prostate'] },
      { title: 'CA-125', desc: 'Tumor marker for ovarian cancer monitoring', badgeText: 'CA125', tags: ['CA-125', 'Ovarian Tumor Marker'] },
      { title: 'CA 19-9', desc: 'Tumor marker for pancreatic & GI cancers', badgeText: 'CA199', tags: ['CA 19-9', 'Pancreatic Marker'] },
      { title: 'CEA', desc: 'Carcinoembryonic Antigen (Tumor marker)', badgeText: 'CEA', tags: ['CEA', 'Carcinoembryonic'] },
      { title: 'AFP', desc: 'Alpha Fetoprotein (Liver tumor marker)', badgeText: 'AFP', tags: ['AFP', 'Alpha Fetoprotein'] },
      { title: 'Ferritin', desc: 'Iron storage protein (Tumor & inflammation marker)', badgeText: 'FERR', tags: ['Ferritin', 'Inflammation Marker'] }
    ]
  },
  {
    name: 'Others',
    desc: 'Unlisted blood investigations and custom patient reports',
    iconBg: 'bg-slate-100 dark:bg-slate-800',
    iconColor: 'text-slate-600 dark:text-slate-300',
    badgeIcon: MoreHorizontal,
    menuIcon: MoreHorizontal,
    tests: [
      { title: 'Custom / Other Blood Report', desc: 'General unclassified blood investigation summary', badgeText: 'OTHER', tags: ['Blood', 'Custom', 'Other'] }
    ]
  }
];

// Pathology / Biopsy Subcategories matching reference UI
const PATHOLOGY_SUBCATEGORIES: SubCategoryItem[] = [
  {
    name: 'Cytology',
    desc: 'Study of individual cells to detect abnormalities, infections, and malignancies',
    iconBg: 'bg-purple-50 dark:bg-purple-950/50',
    iconColor: 'text-purple-600 dark:text-purple-400',
    badgeIcon: MicroscopeWithSpecimen,
    menuIcon: MicroscopeWithSpecimen,
    tests: [
      { title: 'FNAC (Fine Needle Aspiration Cytology)', desc: 'Detects benign or malignant lesions in lumps/swelling', badgeText: 'FNAC', tags: ['FNAC', 'Aspiration', 'Cytology'] },
      { title: 'Thyroid FNAC', desc: 'Cytological evaluation of thyroid nodules', badgeText: 'THY', tags: ['Thyroid FNAC', 'Thyroid', 'Cytology'] },
      { title: 'Breast FNAC', desc: 'Cytology to evaluate breast lumps', badgeText: 'BRE', tags: ['Breast FNAC', 'Breast', 'Cytology'] },
      { title: 'Sputum Cytology', desc: 'Detects malignant or abnormal cells in sputum', badgeText: 'SPUT', tags: ['Sputum', 'Respiratory', 'Cytology'] },
      { title: 'Urine Cytology', desc: 'Detects abnormal or malignant cells in urine', badgeText: 'URINE', tags: ['Urine Cytology', 'Urothelial'] },
      { title: 'Pap Smear', desc: 'Screening test for cervical abnormalities and infections', badgeText: 'PAP', tags: ['Pap Smear', 'Cervical', 'Screening'] },
      { title: 'Body Fluid Cytology', desc: 'Analysis of cells in pleural, ascitic, pericardial and other fluids', badgeText: 'FLUID', tags: ['Body Fluid', 'Pleural', 'Ascitic', 'Cytology'] },
      { title: 'Brush Cytology', desc: 'Cytological study using brush from suspicious lesions', badgeText: 'BRUSH', tags: ['Brush Cytology', 'Endoscopic', 'Cytology'] }
    ]
  },
  {
    name: 'Histopathology (Biopsy)',
    desc: 'Microscopic examination of tissue to diagnose diseases, evaluate lesions, and guide treatment',
    iconBg: 'bg-indigo-50 dark:bg-indigo-950/50',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    badgeIcon: Biopsy,
    menuIcon: Biopsy,
    tests: [
      { title: 'Skin Biopsy', desc: 'Evaluation of skin lesions, growths, and inflammatory conditions', badgeText: 'SKIN', tags: ['Skin', 'Dermatopathology'] },
      { title: 'Liver Biopsy', desc: 'Assesses liver diseases, fibrosis, inflammation, and other abnormalities', badgeText: 'LIVER', tags: ['Liver Biopsy', 'Liver', 'Hepatology'] },
      { title: 'Kidney Biopsy', desc: 'Diagnosis of glomerular and renal parenchymal disorders', badgeText: 'RENAL', tags: ['Kidney Biopsy', 'Renal', 'Glomerular'] },
      { title: 'Bone Marrow Biopsy', desc: 'Evaluation of blood cell production and marrow disorders', badgeText: 'BM', tags: ['Bone Marrow Biopsy', 'Marrow', 'Hematology'] },
      { title: 'GI Biopsy', desc: 'Examination of gastrointestinal tissue for inflammatory and neoplastic conditions', badgeText: 'GI', tags: ['GI Biopsy', 'Gastrointestinal', 'Colon'] },
      { title: 'Cervical Biopsy', desc: 'Assessment of cervical lesions and precancerous changes', badgeText: 'CERV', tags: ['Cervical Biopsy', 'Cervical', 'Gynecology'] },
      { title: 'Prostate Biopsy', desc: 'Detection of prostate cancer and other prostate disorders', badgeText: 'PROS', tags: ['Prostate Biopsy', 'Prostate', 'Urology'] },
      { title: 'Endometrial Biopsy', desc: 'Evaluation of abnormal uterine bleeding and endometrial pathology', badgeText: 'ENDO', tags: ['Endometrial Biopsy', 'Uterus', 'Gynecology'] },
      { title: 'Lung Biopsy', desc: 'Diagnosis of pulmonary nodules, infections, and malignancies', badgeText: 'LUNG', tags: ['Lung Biopsy', 'Pulmonary', 'Respiratory'] },
      { title: 'Lymph Node Biopsy', desc: 'Assessment of lymphadenopathy and hematolymphoid malignancies', badgeText: 'LN', tags: ['Lymph Node Biopsy', 'Lymphoma', 'Lymph Node'] },
      { title: 'Small Tissue Biopsy (Punch / Core)', desc: 'Histopathological evaluation of small tissue specimen', badgeText: 'CORE', tags: ['Biopsy', 'Core', 'Punch'] },
      { title: 'Large Resection Specimen', desc: 'Comprehensive examination of surgically excised organ/tissue', badgeText: 'RESECT', tags: ['Resection', 'Surgical Specimen'] }
    ]
  },
  {
    name: 'Hematopathology',
    desc: 'Evaluation and diagnosis of blood, bone marrow, and lymphoid disorders',
    iconBg: 'bg-rose-50 dark:bg-rose-950/50',
    iconColor: 'text-rose-600 dark:text-rose-400',
    badgeIcon: HematologyLaboratory,
    menuIcon: HematologyLaboratory,
    tests: [
      { title: 'Bone Marrow Aspiration (Study)', desc: 'Morphological evaluation of marrow cells for diagnosis', badgeText: 'BMA', tags: ['Bone Marrow Aspiration', 'Marrow', 'Morphology'] },
      { title: 'Bone Marrow Biopsy (Trephine)', desc: 'Assessment of marrow architecture and pathology', badgeText: 'BMB', tags: ['Bone Marrow Biopsy', 'Trephine', 'Marrow'] },
      { title: 'Peripheral Blood Smear Review', desc: 'Morphological examination of peripheral blood cells', badgeText: 'PBS', tags: ['Blood Smear', 'Peripheral Blood', 'Morphology'] },
      { title: 'Lymph Node Pathology', desc: 'Evaluation of lymph node disorders and malignancies', badgeText: 'LNP', tags: ['Lymph Node', 'Lymphoma', 'Pathology'] },
      { title: 'Leukemia Workup', desc: 'Comprehensive evaluation for acute and chronic leukemias', badgeText: 'LEU', tags: ['Leukemia', 'Workup', 'Hematology'] },
      { title: 'Lymphoma Workup', desc: 'Classification and subtyping of Hodgkin and non-Hodgkin lymphomas', badgeText: 'LYM', tags: ['Lymphoma', 'Hodgkin', 'Non-Hodgkin'] },
      { title: 'Plasma Cell Disorders', desc: 'Evaluation for multiple myeloma and related plasma cell dyscrasias', badgeText: 'PCD', tags: ['Plasma Cell', 'Multiple Myeloma', 'Myeloma'] },
      { title: 'Myelodysplastic Syndrome (MDS)', desc: 'Diagnosis and classification of MDS and related disorders', badgeText: 'MDS', tags: ['MDS', 'Myelodysplastic', 'Bone Marrow'] },
      { title: 'Myeloproliferative Neoplasms (MPN)', desc: 'Evaluation of PV, ET, CML and other MPNs', badgeText: 'MPN', tags: ['MPN', 'Myeloproliferative', 'CML', 'PV'] },
      { title: 'Hemoglobinopathy Evaluation', desc: 'Detection and characterization of hemoglobin disorders (Thalassemia, SCD, etc.)', badgeText: 'HGB', tags: ['Hemoglobinopathy', 'Thalassemia', 'Sickle Cell'] }
    ]
  },
  {
    name: 'Immunohistochemistry (IHC)',
    desc: 'Uses antibodies to detect specific antigens in tissues for accurate diagnosis, classification, and treatment guidance',
    iconBg: 'bg-pink-50 dark:bg-pink-950/50',
    iconColor: 'text-pink-600 dark:text-pink-400',
    badgeIcon: Biomarker,
    menuIcon: Biomarker,
    tests: [
      { title: 'ER (Estrogen Receptor)', desc: 'Estrogen receptor status for breast cancer', badgeText: 'ER', tags: ['ER', 'Estrogen Receptor', 'Breast Cancer'] },
      { title: 'PR (Progesterone Receptor)', desc: 'Progesterone receptor status for breast cancer', badgeText: 'PR', tags: ['PR', 'Progesterone Receptor', 'Breast Cancer'] },
      { title: 'HER2/neu', desc: 'Human Epidermal Growth Factor Receptor 2', badgeText: 'HER2', tags: ['HER2', 'HER2/neu', 'Breast Cancer'] },
      { title: 'Ki-67', desc: 'Cell proliferation marker for tumor grading', badgeText: 'Ki67', tags: ['Ki-67', 'Proliferation', 'Tumor'] },
      { title: 'p53', desc: 'Tumor suppressor gene protein expression', badgeText: 'p53', tags: ['p53', 'Tumor Suppressor'] },
      { title: 'CK7', desc: 'Cytokeratin 7 expression marker', badgeText: 'CK7', tags: ['CK7', 'Cytokeratin', 'IHC'] },
      { title: 'CK20', desc: 'Cytokeratin 20 expression marker', badgeText: 'CK20', tags: ['CK20', 'Cytokeratin', 'IHC'] },
      { title: 'CD3', desc: 'T Cell Marker for lymphoma classification', badgeText: 'CD3', tags: ['CD3', 'T Cell', 'Lymphoma'] },
      { title: 'CD20', desc: 'B Cell Marker for lymphoma classification', badgeText: 'CD20', tags: ['CD20', 'B Cell', 'Lymphoma'] },
      { title: 'CD34', desc: 'Hematopoietic progenitor cell marker', badgeText: 'CD34', tags: ['CD34', 'Stem Cell', 'Vascular'] },
      { title: 'CD117 (c-KIT)', desc: 'Gastrointestinal stromal tumor marker', badgeText: 'CD117', tags: ['CD117', 'c-KIT', 'GIST'] },
      { title: 'TTF-1', desc: 'Thyroid transcription factor-1 for lung and thyroid tumors', badgeText: 'TTF1', tags: ['TTF-1', 'Lung', 'Thyroid'] },
      { title: 'PAX8', desc: 'Mullerian and renal marker for tumor classification', badgeText: 'PAX8', tags: ['PAX8', 'Renal', 'Gynecologic'] },
      { title: 'S100', desc: 'Neural crest and melanocytic marker', badgeText: 'S100', tags: ['S100', 'Melanoma', 'Neural'] },
      { title: 'Synaptophysin', desc: 'Neuroendocrine marker for tumor diagnosis', badgeText: 'SYN', tags: ['Synaptophysin', 'Neuroendocrine'] },
      { title: 'Chromogranin A', desc: 'Neuroendocrine marker for tumor identification', badgeText: 'CGA', tags: ['Chromogranin A', 'Neuroendocrine'] },
      { title: 'PD-L1', desc: 'Programmed death-ligand 1 immunotherapy marker', badgeText: 'PDL1', tags: ['PD-L1', 'Immunotherapy', 'Checkpoint'] },
      { title: 'Single Marker IHC Staining', desc: 'Targeted single antibody marker evaluation', badgeText: 'IHC1', tags: ['IHC', 'Antibody', 'Single Marker'] }
    ]
  },
  {
    name: 'Molecular Pathology',
    desc: 'Advanced molecular testing for genetic mutations, gene expression, and precise cancer diagnostics',
    iconBg: 'bg-violet-50 dark:bg-violet-950/50',
    iconColor: 'text-violet-600 dark:text-violet-400',
    badgeIcon: Dna,
    menuIcon: Dna,
    tests: [
      { title: 'PCR Analysis', desc: 'Detect specific DNA sequences', badgeText: 'PCR', tags: ['PCR', 'DNA', 'Molecular'] },
      { title: 'RT-PCR', desc: 'Detect and quantify RNA expression', badgeText: 'RTPCR', tags: ['RT-PCR', 'RNA', 'Expression'] },
      { title: 'qPCR', desc: 'Quantitative measurement of nucleic acids', badgeText: 'qPCR', tags: ['qPCR', 'Quantitative', 'PCR'] },
      { title: 'FISH (Fluorescence In Situ Hybridization)', desc: 'Detect chromosomal abnormalities', badgeText: 'FISH', tags: ['FISH', 'Chromosomal', 'Gene Amplification'] },
      { title: 'CISH (Chromogenic In Situ Hybridization)', desc: 'Chromogenic in situ hybridization for gene detection', badgeText: 'CISH', tags: ['CISH', 'In Situ Hybridization'] },
      { title: 'NGS (Next-Generation Sequencing)', desc: 'Comprehensive genomic profiling', badgeText: 'NGS', tags: ['NGS', 'Genomic', 'Sequencing'] },
      { title: 'BRCA1 / BRCA2 Mutation', desc: 'Detect BRCA gene mutations for hereditary cancer risk', badgeText: 'BRCA', tags: ['BRCA1', 'BRCA2', 'Hereditary Cancer'] },
      { title: 'EGFR Mutation', desc: 'Identify EGFR gene mutations for lung cancer therapy', badgeText: 'EGFR', tags: ['EGFR', 'Lung Cancer', 'Mutation'] },
      { title: 'KRAS / NRAS Mutation', desc: 'Detect KRAS and NRAS mutations for colorectal cancer', badgeText: 'RAS', tags: ['KRAS', 'NRAS', 'Colorectal', 'Mutation'] },
      { title: 'BRAF Mutation', desc: 'Detect BRAF mutations for melanoma and other cancers', badgeText: 'BRAF', tags: ['BRAF', 'Melanoma', 'Mutation'] },
      { title: 'ALK Rearrangement', desc: 'Detect ALK gene rearrangements in lung cancer', badgeText: 'ALK', tags: ['ALK', 'Rearrangement', 'Lung Cancer'] },
      { title: 'ROS1 Rearrangement', desc: 'Detect ROS1 gene rearrangements in lung cancer', badgeText: 'ROS1', tags: ['ROS1', 'Rearrangement', 'Lung Cancer'] },
      { title: 'MSI (Microsatellite Instability)', desc: 'Evaluate DNA mismatch repair deficiency', badgeText: 'MSI', tags: ['MSI', 'Microsatellite', 'Mismatch Repair'] },
      { title: 'Tumor Mutation Burden (TMB)', desc: 'Quantify mutations in tumor genome for immunotherapy', badgeText: 'TMB', tags: ['TMB', 'Tumor Mutation', 'Immunotherapy'] }
    ]
  },
  {
    name: 'Flow Cytometry',
    desc: 'Multi-parameter analysis of cells to identify, quantify, and characterize cell populations',
    iconBg: 'bg-cyan-50 dark:bg-cyan-950/50',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    badgeIcon: Virus,
    menuIcon: Virus,
    tests: [
      { title: 'Lymphocyte Immunophenotyping', desc: 'Evaluation of B, T, NK cell populations and subsets', badgeText: 'LIP', tags: ['Lymphocyte', 'Immunophenotyping', 'T Cell', 'B Cell'] },
      { title: 'Leukemia Immunophenotyping', desc: 'Immunophenotypic analysis for leukemia diagnosis and classification', badgeText: 'LIP', tags: ['Leukemia', 'Immunophenotyping', 'Flow Cytometry'] },
      { title: 'Minimal Residual Disease (MRD)', desc: 'Detection and quantification of residual disease after treatment', badgeText: 'MRD', tags: ['MRD', 'Residual Disease', 'Leukemia'] },
      { title: 'Multiple Myeloma Panel', desc: 'Analysis of plasma cells for multiple myeloma diagnosis and monitoring', badgeText: 'MMP', tags: ['Multiple Myeloma', 'Plasma Cell', 'Flow'] },
      { title: 'CD34+ Stem Cell Enumeration', desc: 'Enumeration of CD34+ cells in peripheral blood or marrow', badgeText: 'CD34', tags: ['CD34', 'Stem Cell', 'Enumeration'] },
      { title: 'HLA Typing (Flow Cytometry)', desc: 'HLA class I and II typing by flow cytometry', badgeText: 'HLA', tags: ['HLA Typing', 'Transplant', 'Flow'] },
      { title: 'PNH (Paroxysmal Nocturnal Hemoglobinuria) Screen', desc: 'Detection of GPI-deficient cell populations', badgeText: 'PNH', tags: ['PNH', 'GPI', 'Hemolytic Anemia'] },
      { title: 'Cell Activation Markers', desc: 'Assessment of activation markers on immune cells', badgeText: 'CAM', tags: ['Cell Activation', 'Immune Markers', 'Flow'] },
      { title: 'Apoptosis Analysis', desc: 'Detection and quantification of apoptotic cells', badgeText: 'APO', tags: ['Apoptosis', 'Cell Death', 'Flow'] },
      { title: 'Custom Flow Panel', desc: 'Customized panels as per clinical requirement', badgeText: 'CFP', tags: ['Custom Flow', 'Immunophenotyping', 'Flow'] }
    ]
  },
  {
    name: 'Special Stains',
    desc: 'Specialized staining techniques to identify microorganisms, tissue components, and cellular elements',
    iconBg: 'bg-amber-50 dark:bg-amber-950/50',
    iconColor: 'text-amber-600 dark:text-amber-400',
    badgeIcon: MicroscopeWithSpecimen,
    menuIcon: MicroscopeWithSpecimen,
    tests: [
      { title: 'Gram Stain', desc: 'Identify Gram-positive and Gram-negative bacteria', badgeText: 'GRAM', tags: ['Gram Stain', 'Bacteria', 'Microbiology'] },
      { title: 'Ziehl-Neelsen (AFB) Stain', desc: 'Detect acid-fast bacilli (e.g., Mycobacterium tuberculosis)', badgeText: 'ZN', tags: ['AFB', 'Ziehl-Neelsen', 'TB', 'Mycobacterium'] },
      { title: 'PAS (Periodic Acid Schiff) Stain', desc: 'Detect fungi, glycogen, and mucosubstances', badgeText: 'PAS', tags: ['PAS', 'Fungal', 'Glycogen', 'Special Stain'] },
      { title: 'GMS (Gomori Methenamine Silver) Stain', desc: 'Highlight fungal organisms in tissue', badgeText: 'GMS', tags: ['GMS', 'Fungi', 'Silver Stain'] },
      { title: 'Warthin-Starry Stain', desc: 'Detect Helicobacter pylori and spirochetes', badgeText: 'WS', tags: ['Warthin-Starry', 'H. Pylori', 'Spirochetes'] },
      { title: 'Oil Red O Stain', desc: 'Detect neutral fats and lipids in frozen sections', badgeText: 'ORO', tags: ['Oil Red O', 'Lipid', 'Fat Stain'] },
      { title: 'Toluidine Blue Stain', desc: 'Identify mast cells and granules in tissue', badgeText: 'TLB', tags: ['Toluidine Blue', 'Mast Cell', 'Granules'] },
      { title: 'Alcian Blue Stain', desc: 'Detect acidic mucosubstances and acidic glycoproteins', badgeText: 'ALB', tags: ['Alcian Blue', 'Mucin', 'Glycoprotein'] },
      { title: 'Trichrome Stain', desc: 'Differentiate collagen, muscle and cytoplasm in tissues', badgeText: 'TRI', tags: ['Trichrome', 'Collagen', 'Fibrosis'] },
      { title: 'Reticulin Stain', desc: 'Demonstrate reticular fibers in tissue', badgeText: 'RET', tags: ['Reticulin', 'Reticular Fibers', 'Framework'] }
    ]
  },
  {
    name: 'Frozen Section',
    desc: 'Intraoperative rapid diagnosis using frozen tissue sections to guide surgical decisions',
    iconBg: 'bg-blue-50 dark:bg-blue-950/50',
    iconColor: 'text-blue-600 dark:text-blue-400',
    badgeIcon: Biopsy,
    menuIcon: Biopsy,
    tests: [
      { title: 'General Frozen Section', desc: 'Rapid diagnosis for intraoperative decision making', badgeText: 'FROZEN', tags: ['Frozen Section', 'Intraoperative'] },
      { title: 'Brain Tumor Frozen Section', desc: 'Assessment of brain lesions and tumor margins', badgeText: 'BRAIN', tags: ['Brain', 'Neuro', 'Frozen'] },
      { title: 'Breast Lump Frozen Section', desc: 'Determine nature of lesion (benign vs malignant)', badgeText: 'BREAST', tags: ['Breast', 'Frozen'] },
      { title: 'Thyroid Nodule Frozen Section', desc: 'Evaluation of thyroid nodules during surgery', badgeText: 'THYROID', tags: ['Thyroid', 'Frozen'] },
      { title: 'Renal (Kidney) Frozen Section', desc: 'Assessment of renal masses and margins', badgeText: 'RENAL', tags: ['Renal', 'Kidney', 'Frozen'] },
      { title: 'Liver Lesion Frozen Section', desc: 'Intraoperative evaluation of liver lesions', badgeText: 'LIVER', tags: ['Liver', 'Frozen'] },
      { title: 'Lung Nodule Frozen Section', desc: 'Rapid diagnosis of pulmonary nodules and masses', badgeText: 'LUNG', tags: ['Lung', 'Pulmonary', 'Frozen'] },
      { title: 'Ovarian Mass Frozen Section', desc: 'Differentiation of benign and malignant masses', badgeText: 'OVARIAN', tags: ['Ovarian', 'Frozen'] },
      { title: 'Lymph Node Frozen Section', desc: 'Assessment of lymph node involvement', badgeText: 'LYMPH', tags: ['Lymph Node', 'Metastasis'] },
      { title: 'Margin Assessment Frozen Section', desc: 'Check surgical margins for tumor clearance', badgeText: 'MARGIN', tags: ['Margin', 'Surgical Clearance'] }
    ]
  },
  {
    name: 'Others',
    desc: 'Additional specialized tests and procedures for comprehensive diagnosis',
    iconBg: 'bg-slate-100 dark:bg-slate-800',
    iconColor: 'text-slate-600 dark:text-slate-300',
    badgeIcon: MoreHorizontal,
    menuIcon: MoreHorizontal,
    tests: [
      { title: 'Microbiology Culture & Sensitivity', desc: 'Identification of microorganisms and antibiotic susceptibility', badgeText: 'C&S', tags: ['Culture', 'Sensitivity', 'Microbiology'] },
      { title: 'AFB Culture & Sensitivity', desc: 'Detection of Mycobacterium tuberculosis and drug sensitivity', badgeText: 'AFB', tags: ['AFB Culture', 'TB', 'Drug Sensitivity'] },
      { title: 'Fungal Culture & Sensitivity', desc: 'Detection and identification of fungal pathogens', badgeText: 'FUNG', tags: ['Fungal Culture', 'Fungi', 'Sensitivity'] },
      { title: 'Viral Culture / Antigen Detection', desc: 'Identification of viral pathogens or their antigens', badgeText: 'VIRAL', tags: ['Viral Culture', 'Antigen', 'Virus'] },
      { title: 'HPV DNA Testing', desc: 'Detection of high-risk HPV genotypes', badgeText: 'HPV', tags: ['HPV', 'DNA Testing', 'Cervical'] },
      { title: 'Autoimmune Panel (Pathology)', desc: 'Detection of autoimmune markers and antibodies in tissue', badgeText: 'AIP', tags: ['Autoimmune', 'Panel', 'Antibodies'] },
      { title: 'Lipid / Fat Stain', desc: 'Detection of lipids and fatty changes in tissue', badgeText: 'LIP', tags: ['Lipid Stain', 'Fat', 'Tissue'] },
      { title: 'Parasitology Testing', desc: 'Detection of parasites and ova in samples', badgeText: 'PARA', tags: ['Parasitology', 'Parasite', 'Ova'] },
      { title: 'Enzyme Histochemistry', desc: 'Localization of enzyme activity in tissues', badgeText: 'ENZ', tags: ['Enzyme', 'Histochemistry', 'Tissue'] },
      { title: 'Iron Stain (Peris\' Prussian Blue)', desc: 'Detection of iron deposits in tissues', badgeText: 'IRON', tags: ['Iron Stain', 'Prussian Blue', 'Hemosiderin'] },
      { title: 'Custom / Other Pathology Report', desc: 'General unclassified pathology investigation summary', badgeText: 'OTHER', tags: ['Pathology', 'Custom', 'Other'] }
    ]
  }
];

// Stool Test Subcategories matching reference UI
const STOOL_TEST_SUBCATEGORIES: SubCategoryItem[] = [
  {
    name: 'Routine & Microscopic',
    desc: 'Basic stool analysis to evaluate general bowel health and detect infections or abnormalities.',
    iconBg: 'bg-amber-50 dark:bg-amber-950/50',
    iconColor: 'text-amber-600 dark:text-amber-400',
    badgeIcon: MedicalSample,
    menuIcon: MedicalSample,
    tests: [
      { title: 'Stool Routine Examination', desc: 'General assessment of stool characteristics', badgeText: 'STOOL', tags: ['Stool', 'Routine'] },
      { title: 'Stool Microscopic Examination', desc: 'Microscopic analysis for cells, parasites, and other elements', badgeText: 'SCOPE', tags: ['Microscopic', 'Stool'] },
      { title: 'Stool Physical Examination', desc: 'Evaluation of color, consistency, odor and mucus', badgeText: 'PHYS', tags: ['Physical', 'Appearance'] },
      { title: 'Stool Consistency & Appearance', desc: 'Assessment of stool form and texture', badgeText: 'FORM', tags: ['Consistency', 'Texture'] },
      { title: 'Mucus in Stool', desc: 'Detection of mucus in stool', badgeText: 'MUCUS', tags: ['Mucus', 'Bowel'] },
      { title: 'Pus Cells in Stool', desc: 'Detection of pus cells (WBC) in stool', badgeText: 'PUS', tags: ['Pus Cells', 'WBC', 'Infection'] },
      { title: 'RBC in Stool', desc: 'Detection of red blood cells in stool', badgeText: 'RBC', tags: ['RBC', 'Blood', 'Microscopic'] },
      { title: 'Yeast Cells in Stool', desc: 'Detection of yeast cells in stool', badgeText: 'YEAST', tags: ['Yeast', 'Fungal'] },
      { title: 'Vegetable Fibres in Stool', desc: 'Presence of undigested plant material', badgeText: 'FIBRE', tags: ['Plant Material', 'Digestion'] },
      { title: 'Starch Granules in Stool', desc: 'Detection of starch granules in stool', badgeText: 'STARCH', tags: ['Starch', 'Digestion'] }
    ]
  },
  {
    name: 'Chemical Examination',
    desc: 'Detects biochemical changes and helps in diagnosing various conditions',
    iconBg: 'bg-yellow-50 dark:bg-yellow-950/50',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    badgeIcon: BiochemistryLaboratory, menuIcon: BiochemistryLaboratory,
    tests: [
      { title: 'Protein', desc: 'Detects abnormal protein levels in stool', badgeText: 'PROT', tags: ['Protein', 'Stool'] },
      { title: 'Glucose', desc: 'Detects sugar in stool, possible diabetes indicator', badgeText: 'GLU', tags: ['Glucose', 'Stool'] },
      { title: 'Ketones', desc: 'Indicates fat breakdown and diabetic ketoacidosis', badgeText: 'KET', tags: ['Ketones', 'Stool'] },
      { title: 'Bilirubin', desc: 'Detects liver or bile duct related issues', badgeText: 'BIL', tags: ['Bilirubin', 'Stool'] },
      { title: 'Urobilinogen', desc: 'Assesses liver function and hemolysis', badgeText: 'URO', tags: ['Urobilinogen', 'Stool'] },
      { title: 'Nitrite', desc: 'Indicates bacterial urinary tract infection', badgeText: 'NIT', tags: ['Nitrite', 'Stool'] },
      { title: 'Leukocyte Esterase', desc: 'Detects white blood cells, indicates infection', badgeText: 'LE', tags: ['Leukocyte', 'Stool'] },
      { title: 'Blood', desc: 'Detects blood in stool, may indicate stones, infection or injury', badgeText: 'BLOOD', tags: ['Blood', 'Stool'] },
      { title: 'pH', desc: 'Measures acidity or alkalinity of stool', badgeText: 'pH', tags: ['pH', 'Stool'] },
      { title: 'Specific Gravity', desc: 'Measures stool concentration and kidney function', badgeText: 'SG', tags: ['Specific Gravity', 'Stool'] }
    ]
  },
  {
    name: 'Culture & Sensitivity',
    desc: 'Detects bacterial, fungal pathogens in stool and determines their antibiotic sensitivity',
    iconBg: 'bg-purple-50 dark:bg-purple-950/50',
    iconColor: 'text-purple-600 dark:text-purple-400',
    badgeIcon: DiabetesMeasure, menuIcon: DiabetesMeasure,
    tests: [
      { title: 'Stool Culture', desc: 'Isolation and identification of bacterial pathogens in stool', badgeText: 'CULT', tags: ['Culture', 'Stool'] },
      { title: 'Culture & Antibiotic Sensitivity', desc: 'Identifies bacteria and determines antibiotic susceptibility', badgeText: 'C/S', tags: ['Culture', 'Sensitivity'] },
      { title: 'Salmonella Culture', desc: 'Detection of Salmonella species in stool', badgeText: 'SALM', tags: ['Salmonella', 'Stool'] },
      { title: 'Shigella Culture', desc: 'Detection of Shigella species in stool', badgeText: 'SHIG', tags: ['Shigella', 'Stool'] },
      { title: 'Vibrio cholerae Culture', desc: 'Detection of Vibrio cholerae in stool', badgeText: 'VIB', tags: ['Vibrio', 'Cholera'] },
      { title: 'Campylobacter Culture', desc: 'Detection of Campylobacter species in stool', badgeText: 'CAMP', tags: ['Campylobacter', 'Stool'] },
      { title: 'E. coli O157:H7 Culture', desc: 'Detection of E. coli O157:H7 in stool', badgeText: 'ECOLI', tags: ['E. coli', 'O157:H7'] },
      { title: 'Clostridioides difficile Toxin Culture', desc: 'Detection of C. difficile and toxin production', badgeText: 'CDIFF', tags: ['C. difficile', 'Toxin'] },
      { title: 'Yeast / Fungal Culture', desc: 'Detection of yeast or fungal pathogens in stool', badgeText: 'YEAST', tags: ['Yeast', 'Fungal'] }
    ]
  },
  {
    name: 'Parasitology',
    desc: 'Detects parasitic infections in stool by identifying eggs, cysts, larvae and parasites',
    iconBg: 'bg-rose-50 dark:bg-rose-950/50',
    iconColor: 'text-rose-600 dark:text-rose-400',
    badgeIcon: Kidneys, menuIcon: Kidneys,
    tests: [
      { title: 'Ova & Parasite (O&P) Examination', desc: 'Microscopic detection of ova, cysts and parasites', badgeText: 'O&P', tags: ['Parasites', 'Ova', 'Cysts'] },
      { title: 'Giardia Antigen', desc: 'Detection of Giardia lamblia antigen in stool', badgeText: 'GIAR', tags: ['Giardia', 'Protozoa'] },
      { title: 'Entamoeba histolytica Antigen', desc: 'Detection of E. histolytica antigen in stool', badgeText: 'AMOEBA', tags: ['Entamoeba', 'Amoebiasis'] },
      { title: 'Cryptosporidium Antigen', desc: 'Detection of Cryptosporidium antigen in stool', badgeText: 'CRYPT', tags: ['Cryptosporidium', 'Protozoa'] },
      { title: 'Cyclospora Examination', desc: 'Detection of Cyclospora cayetanensis in stool', badgeText: 'CYCLO', tags: ['Cyclospora', 'Parasite'] },
      { title: 'Cystoisospora belli Examination', desc: 'Detection of Cystoisospora belli (Isospora belli) in stool', badgeText: 'CYSTO', tags: ['Cystoisospora', 'Parasite'] },
      { title: 'Helminth Ova Identification', desc: 'Identification of helminth eggs in stool', badgeText: 'HELM', tags: ['Helminth', 'Ova'] },
      { title: 'Protozoa Identification', desc: 'Microscopic identification of protozoan cysts and trophozoites', badgeText: 'PROTO', tags: ['Protozoa', 'Microscopic'] },
      { title: 'Stool Parasite Concentration Test', desc: 'Concentration techniques to improve parasite detection', badgeText: 'CONC', tags: ['Concentration', 'Parasite'] },
      { title: 'Modified Acid-Fast Stain', desc: 'Detection of coccidian parasites using special staining', badgeText: 'MAFS', tags: ['Acid-Fast', 'Coccidian'] }
    ]
  },
  {
    name: 'Blood & Occult Blood',
    desc: 'Detects hidden or visible blood and inflammatory cells in stool for early diagnosis of GI bleeding and related conditions',
    iconBg: 'bg-red-50 dark:bg-red-950/50',
    iconColor: 'text-red-600 dark:text-red-400',
    badgeIcon: BloodDrop,
    menuIcon: BloodDrop,
    tests: [
      { title: 'Fecal Occult Blood Test (FOBT)', desc: 'Detection of hidden blood in stool', badgeText: 'FOBT', tags: ['FOBT', 'Occult Blood'] },
      { title: 'Fecal Immunochemical Test (FIT)', desc: 'Immunoassay for human hemoglobin in stool', badgeText: 'FIT', tags: ['FIT', 'Hemoglobin'] },
      { title: 'Occult Blood (Guaiac)', desc: 'Chemical detection of occult blood in stool', badgeText: 'GUAIAC', tags: ['Guaiac', 'Occult Blood'] },
      { title: 'Fecal Hemoglobin', desc: 'Quantitative measurement of hemoglobin in stool', badgeText: 'FHb', tags: ['Fecal Hemoglobin', 'GI Bleed'] },
      { title: 'Fecal Transferrin', desc: 'Marker for intestinal inflammation and bleeding', badgeText: 'FTR', tags: ['Fecal Transferrin', 'Inflammation'] },
      { title: 'RBC in Stool', desc: 'Microscopic detection of red blood cells in stool', badgeText: 'RBC', tags: ['RBC', 'Stool'] },
      { title: 'WBC (Leukocytes) in Stool', desc: 'Microscopic detection of white blood cells in stool', badgeText: 'WBC', tags: ['WBC', 'Leukocytes', 'Stool'] }
    ]
  },
  {
    name: 'Calprotectin & Inflammatory Markers',
    desc: 'Evaluates intestinal inflammation and immune response to help diagnose IBD and other inflammatory conditions',
    iconBg: 'bg-blue-50 dark:bg-blue-950/50',
    iconColor: 'text-blue-600 dark:text-blue-400',
    badgeIcon: Endocrinology, menuIcon: Endocrinology,
    tests: [
      { title: 'Fecal Calprotectin', desc: 'Most reliable marker for intestinal inflammation and IBD activity', badgeText: 'CALPRO', tags: ['Calprotectin', 'IBD', 'Colitis'] },
      { title: 'Fecal Lactoferrin', desc: 'Marker of neutrophil activity and intestinal inflammation', badgeText: 'LACTO', tags: ['Lactoferrin', 'Inflammation'] },
      { title: 'Fecal Myeloperoxidase (MPO)', desc: 'Indicates neutrophil activation and inflammatory response', badgeText: 'MPO', tags: ['MPO', 'Neutrophil', 'Inflammation'] },
      { title: 'Fecal Eosinophil Protein X (EPX)', desc: 'Marker for eosinophilic inflammation in the gastrointestinal tract', badgeText: 'EPX', tags: ['Eosinophil', 'EPX', 'GI'] },
      { title: 'Fecal Neutrophil Elastase', desc: 'Elevated levels indicate intestinal inflammation and tissue damage', badgeText: 'FNE', tags: ['Neutrophil Elastase', 'Inflammation'] },
      { title: 'Inflammatory Cytokine Markers', desc: 'Panel for cytokines (e.g., IL-6, IL-8, TNF-a) associated with GI inflammation', badgeText: 'CYTO', tags: ['Cytokines', 'IL-6', 'TNF', 'Inflammation'] }
    ]
  },
  {
    name: 'Pancreatic Elastase & Digestive Markers',
    desc: 'Assesses pancreatic function and digestive efficiency to detect exocrine pancreatic insufficiency and maldigestion',
    iconBg: 'bg-cyan-50 dark:bg-cyan-950/50',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    badgeIcon: Gastroenterology,
    menuIcon: Gastroenterology,
    tests: [
      { title: 'Fecal Pancreatic Elastase-1', desc: 'Gold standard test for evaluating exocrine pancreatic function', badgeText: 'PE1', tags: ['Elastase', 'Pancreas', 'Digestion'] },
      { title: 'Fecal Chymotrypsin', desc: 'Evaluates pancreatic enzyme output and digestive capacity', badgeText: 'CHYM', tags: ['Chymotrypsin', 'Pancreas'] },
      { title: 'Fecal Trypsin', desc: 'Marker of pancreatic trypsin output and protein digestion', badgeText: 'TRYP', tags: ['Trypsin', 'Pancreas'] },
      { title: 'Fecal Digestive Enzyme Panel', desc: 'Comprehensive evaluation of key digestive enzymes in stool', badgeText: 'ENZ', tags: ['Digestive Enzymes', 'Panel'] },
      { title: 'Fecal Short-Chain Fatty Acids (SCFAs)', desc: 'Assesses gut fermentation and microbial metabolic activity', badgeText: 'SCFA', tags: ['SCFA', 'Gut Microbiome'] },
      { title: 'Stool pH (Digestive Evaluation)', desc: 'Indicates digestive efficiency and carbohydrate malabsorption', badgeText: 'pH', tags: ['pH', 'Digestion', 'Malabsorption'] }
    ]
  },
  {
    name: 'Fecal Fat & Malabsorption Tests',
    desc: 'Evaluates fat absorption and detects malabsorption disorders affecting the digestive system',
    iconBg: 'bg-indigo-50 dark:bg-indigo-950/50',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    badgeIcon: Nutrition, menuIcon: Nutrition,
    tests: [
      { title: 'Qualitative Fecal Fat', desc: 'Screening test to detect presence of excess fat in stool', badgeText: 'QUAL', tags: ['Fecal Fat', 'Qualitative'] },
      { title: 'Quantitative 72-Hour Fecal Fat', desc: 'Measures total fat excreted in stool over 72 hours', badgeText: 'FAT72', tags: ['Fecal Fat', 'Steatorrhea', '72hr'] },
      { title: 'Sudan Stain for Fat', desc: 'Microscopic stain to identify fat droplets in stool', badgeText: 'SUDAN', tags: ['Sudan Stain', 'Fat Globules'] },
      { title: 'Fecal Steatocrit', desc: 'Estimates fat content in stool using steatocrit method', badgeText: 'STEAT', tags: ['Steatocrit', 'Fat'] },
      { title: 'Fecal Reducing Substances', desc: 'Detects carbohydrate malabsorption by measuring reducing substances in stool', badgeText: 'RED', tags: ['Reducing Substances', 'Malabsorption'] },
      { title: 'D-Xylose Absorption Test', desc: 'Assesses carbohydrate absorption and small intestinal malabsorption', badgeText: 'DXYL', tags: ['D-Xylose', 'Absorption'] },
      { title: 'Alpha-1 Antitrypsin Clearance', desc: 'Detects protein-losing enteropathy by measuring A1AT clearance in stool', badgeText: 'A1AT', tags: ['Alpha-1 Antitrypsin', 'Enteropathy'] },
      { title: 'Fecal Bile Acids', desc: 'Evaluates bile acid malabsorption associated with chronic diarrhea', badgeText: 'BILE', tags: ['Bile Acids', 'Malabsorption'] }
    ]
  },
  {
    name: 'Viral & Antigen Detection',
    desc: 'Detects viral and bacterial antigens in stool for accurate diagnosis of infectious gastroenteritis and other GI infections',
    iconBg: 'bg-teal-50 dark:bg-teal-950/50',
    iconColor: 'text-teal-600 dark:text-teal-400',
    badgeIcon: Liver, menuIcon: Liver,
    tests: [
      { title: 'Rotavirus Antigen', desc: 'Detection of rotavirus antigen in stool', badgeText: 'ROTA', tags: ['Rotavirus', 'Gastroenteritis'] },
      { title: 'Adenovirus Antigen', desc: 'Detection of adenovirus antigen in stool', badgeText: 'ADENO', tags: ['Adenovirus', 'Gastroenteritis'] },
      { title: 'Norovirus PCR / Antigen', desc: 'Detection of norovirus by PCR or antigen test', badgeText: 'NORO', tags: ['Norovirus', 'PCR'] },
      { title: 'Astrovirus Antigen', desc: 'Detection of astrovirus antigen in stool', badgeText: 'ASTRO', tags: ['Astrovirus', 'Viral'] },
      { title: 'Sapovirus Antigen', desc: 'Detection of sapovirus antigen in stool', badgeText: 'SAPO', tags: ['Sapovirus', 'Viral'] },
      { title: 'Clostridioides difficile GDH Antigen', desc: 'Detection of C. difficile GDH antigen in stool', badgeText: 'CDIFF', tags: ['C. difficile', 'GDH'] },
      { title: 'H. pylori Stool Antigen', desc: 'Non-invasive detection of Helicobacter pylori antigen in stool', badgeText: 'HPYL', tags: ['H. Pylori', 'Gastric'] },
      { title: 'Multiplex Gastrointestinal Pathogen PCR Panel', desc: 'Simultaneous detection of multiple GI pathogens by PCR panel', badgeText: 'MPCR', tags: ['Multiplex PCR', 'GI Pathogens'] }
    ]
  },
  {
    name: 'Others',
    desc: 'Specialized and miscellaneous stool tests for comprehensive gastrointestinal evaluation',
    iconBg: 'bg-slate-100 dark:bg-slate-800',
    iconColor: 'text-slate-600 dark:text-slate-300',
    badgeIcon: MoreHorizontal,
    menuIcon: MoreHorizontal,
    tests: [
      { title: 'Fecal Secretory IgA', desc: 'Evaluates mucosal immune response in the gut', badgeText: 'SIgA', tags: ['Secretory IgA', 'Mucosal Immunity'] },
      { title: 'Alpha-1 Antitrypsin (Quantitative)', desc: 'Detects protein loss and enteric protein leakage', badgeText: 'A1AT', tags: ['Alpha-1 Antitrypsin', 'Protein Loss'] },
      { title: 'Fecal Lysozyme', desc: 'Marker of intestinal inflammation and neutrophil activity', badgeText: 'LYS', tags: ['Lysozyme', 'Inflammation'] },
      { title: 'Short-Chain Fatty Acids Profile', desc: 'Analyzes SCFAs for gut microbiota and metabolic health', badgeText: 'SCFA', tags: ['SCFA', 'Gut Microbiome'] },
      { title: 'Stool DNA Test (Molecular)', desc: 'Detects DNA markers for infections and genetic GI disorders', badgeText: 'DNA', tags: ['Stool DNA', 'Molecular'] },
      { title: 'Fecal Mucin', desc: 'Assesses mucus secretion and intestinal barrier function', badgeText: 'MUCIN', tags: ['Mucin', 'Intestinal Barrier'] },
      { title: 'Stool Consistency (WSFS Score)', desc: 'Bristol/WSFS scoring for gut motility assessment', badgeText: 'WSFS', tags: ['Bristol Scale', 'Stool Consistency'] },
      { title: 'Comprehensive Stool Panel', desc: 'Combined advanced stool tests for thorough GI evaluation', badgeText: 'PANEL', tags: ['Comprehensive', 'Stool Panel'] }
    ]
  }
];

// Endoscopy Subcategories matching reference UI screens
const ENDOSCOPY_SUBCATEGORIES: SubCategoryItem[] = [
  {
    name: 'Upper GI Endoscopy (OGD)',
    desc: 'Endoscopic examination of the upper gastrointestinal tract including esophagus, stomach and duodenum.',
    iconBg: 'bg-rose-50 dark:bg-rose-950/50',
    iconColor: 'text-rose-500 dark:text-rose-400',
    badgeIcon: Gastroenterology,
    menuIcon: Gastroenterology,
    tests: [
      { title: 'Diagnostic OGD', desc: 'General diagnostic endoscopy to evaluate symptoms like pain, acidity, vomiting, etc.', badgeText: 'OGD', tags: ['OGD', 'Upper GI', 'Diagnostic'] },
      { title: 'EGD for GERD', desc: 'Evaluation of esophageal inflammation, reflux esophagitis and grade assessment.', badgeText: 'GERD', tags: ['GERD', 'Reflux', 'Esophagus'] },
      { title: 'Peptic Ulcer Evaluation', desc: 'Assessment of gastric or duodenal ulcers, size, depth and healing status.', badgeText: 'ULCER', tags: ['Peptic Ulcer', 'Gastric', 'Duodenal'] },
      { title: 'H. Pylori Detection', desc: 'Endoscopic sampling for Helicobacter pylori detection (CLO test / biopsy).', badgeText: 'CLO', tags: ['H. Pylori', 'CLO Test', 'Biopsy'] },
      { title: 'Biopsy (Upper GI)', desc: 'Tissue sampling from suspicious lesions or abnormal areas for histopathology.', badgeText: 'BIOPSY', tags: ['Upper GI Biopsy', 'Histopathology'] },
      { title: 'Polyp Detection & Removal', desc: 'Identification and endoscopic removal of polyps in the upper GI tract.', badgeText: 'POLYP', tags: ['Polyp', 'Polypectomy', 'Upper GI'] },
      { title: 'GI Bleed Evaluation', desc: 'Identification of bleeding source in upper GI tract and treatment if required.', badgeText: 'BLEED', tags: ['GI Bleed', 'Hemostasis', 'Upper GI'] },
      { title: 'Surveillance Endoscopy', desc: "Follow-up endoscopy for known conditions (Barrett's esophagus, chronic gastritis, etc.).", badgeText: 'SURV', tags: ['Surveillance', 'Barretts', 'Gastritis'] },
      { title: 'Dilation Procedure', desc: 'Endoscopic dilation for esophageal strictures or narrowing.', badgeText: 'DILAT', tags: ['Esophageal Dilation', 'Stricture'] },
      { title: 'OGD Report (Interpretation)', desc: 'Comprehensive interpretation of OGD findings and observations.', badgeText: 'REPORT', tags: ['OGD Report', 'Interpretation'] }
    ]
  },
  {
    name: 'Colonoscopy',
    desc: 'Endoscopic examination of the colon (large intestine) and rectum to diagnose and treat various conditions.',
    iconBg: 'bg-pink-50 dark:bg-pink-950/50',
    iconColor: 'text-pink-500 dark:text-pink-400',
    badgeIcon: Colon,
    menuIcon: Colon,
    tests: [
      { title: 'Diagnostic Colonoscopy', desc: 'Examination of the entire colon to identify causes of symptoms like bleeding, pain, or changes in bowel habits.', badgeText: 'COLON', tags: ['Colonoscopy', 'Diagnostic', 'Large Bowel'] },
      { title: 'Polyp Detection & Removal (Polypectomy)', desc: 'Detection and endoscopic removal of polyps to prevent progression to colon cancer.', badgeText: 'POLYP', tags: ['Polyp Removal', 'Polypectomy', 'Colon'] },
      { title: 'Biopsy (Colonic)', desc: 'Tissue sampling from abnormal areas or lesions in the colon for histopathological examination.', badgeText: 'BIOPSY', tags: ['Colonic Biopsy', 'Histopathology'] },
      { title: 'GI Bleed Evaluation', desc: 'Identification of bleeding sources in the colon and management of lower GI bleeding.', badgeText: 'BLEED', tags: ['Lower GI Bleed', 'Hemostasis'] },
      { title: 'Colitis / IBD Evaluation', desc: "Assessment of inflammation, ulcers, and disease MoreHorizontal in conditions like Ulcerative Colitis and Crohn's Disease.", badgeText: 'IBD', tags: ['Colitis', 'IBD', 'Crohns', 'Ulcerative Colitis'] },
      { title: 'Diverticulosis Evaluation', desc: 'Diagnosis and assessment of diverticula and complications like diverticulitis.', badgeText: 'DIVERT', tags: ['Diverticulosis', 'Diverticulitis'] },
      { title: 'Hemostasis / Bleed Control', desc: 'Endoscopic treatment of bleeding lesions using clips, thermal therapy, or injection.', badgeText: 'HEMO', tags: ['Hemostasis', 'Clips', 'Bleed Control'] },
      { title: 'Stricture Dilatation', desc: 'Dilation of narrowed areas in the colon due to inflammatory or benign strictures.', badgeText: 'DILAT', tags: ['Stricture Dilation', 'Colonic Stricture'] },
      { title: 'Surveillance Colonoscopy', desc: 'Follow-up colonoscopy for high-risk patients (polyps, IBD, or family history of colorectal cancer).', badgeText: 'SURV', tags: ['Surveillance', 'Colorectal Screening'] },
      { title: 'Colonoscopy Report (Interpretation)', desc: 'Comprehensive interpretation of colonoscopic findings and recommendations.', badgeText: 'REPORT', tags: ['Colonoscopy Report', 'Interpretation'] }
    ]
  },
  {
    name: 'Sigmoidoscopy',
    desc: 'Endoscopic examination of the rectum and sigmoid colon to diagnose and manage lower bowel conditions.',
    iconBg: 'bg-purple-50 dark:bg-purple-950/50',
    iconColor: 'text-purple-600 dark:text-purple-400',
    badgeIcon: Gastroenterology,
    menuIcon: Gastroenterology,
    tests: [
      { title: 'Diagnostic Sigmoidoscopy', desc: 'Examination of the rectum and sigmoid colon to evaluate symptoms like bleeding, pain, or altered bowel habits.', badgeText: 'SIG', tags: ['Sigmoidoscopy', 'Diagnostic', 'Rectum'] },
      { title: 'Polyp Detection & Removal', desc: 'Identification and endoscopic removal of polyps in the rectum and sigmoid colon to prevent progression.', badgeText: 'POLYP', tags: ['Polyp Removal', 'Sigmoid'] },
      { title: 'Bleeding Evaluation', desc: 'Assessment and localization of bleeding sources in the rectum and sigmoid colon.', badgeText: 'BLEED', tags: ['Rectal Bleed', 'Sigmoid Bleed'] },
      { title: 'Inflammation Assessment', desc: "Evaluation of inflammatory conditions such as ulcerative proctitis and Crohn's disease.", badgeText: 'INFLAM', tags: ['Proctitis', 'Inflammation', 'IBD'] },
      { title: 'Biopsy (Recto-Sigmoid)', desc: 'Tissue sampling from abnormal mucosa or lesions for histopathological diagnosis.', badgeText: 'BIOPSY', tags: ['Biopsy', 'Recto-Sigmoid'] },
      { title: 'Fecal Impaction Evaluation', desc: 'Assessment and management of fecal impaction in the rectum or sigmoid colon.', badgeText: 'FECAL', tags: ['Fecal Impaction', 'Rectal'] },
      { title: 'Stricture / Obstruction Evaluation', desc: 'Evaluation of strictures, narrowing, or obstructions in the recto-sigmoid region.', badgeText: 'STRICT', tags: ['Stricture', 'Obstruction'] },
      { title: 'Surveillance Sigmoidoscopy', desc: 'Follow-up examination for patients with IBD, polyps, or previous colorectal lesions.', badgeText: 'SURV', tags: ['Surveillance', 'Sigmoidoscopy'] },
      { title: 'Therapeutic Interventions', desc: 'Endoscopic interventions like hemostasis, clip placement, or dilation when required.', badgeText: 'THERAP', tags: ['Therapeutic', 'Interventions'] },
      { title: 'Sigmoidoscopy Report (Interpretation)', desc: 'Comprehensive interpretation of sigmoidoscopy findings and recommendations.', badgeText: 'REPORT', tags: ['Sigmoidoscopy Report', 'Interpretation'] }
    ]
  },
  {
    name: 'ERCP',
    desc: 'Endoscopic Retrograde Cholangiopancreatography – diagnosis and treatment of bile duct, pancreatic duct and related conditions.',
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/50',
    iconColor: 'text-emerald-500 dark:text-emerald-400',
    badgeIcon: Hepatology,
    menuIcon: Hepatology,
    tests: [
      { title: 'Diagnostic ERCP', desc: 'Evaluation of bile duct and pancreatic duct abnormalities like stones, strictures, or blockages.', badgeText: 'ERCP', tags: ['ERCP', 'Diagnostic', 'Bile Duct'] },
      { title: 'Stone Extraction', desc: 'Endoscopic removal of gallstones or bile duct stones using balloon or basket catheters.', badgeText: 'STONE', tags: ['Stone Extraction', 'Gallstones', 'Bile Duct'] },
      { title: 'Stent Placement', desc: 'Placement of plastic or metal stents to relieve obstruction in bile or pancreatic ducts.', badgeText: 'STENT', tags: ['Stent Placement', 'Biliary Stent'] },
      { title: 'Dilation (Stricture)', desc: 'Endoscopic dilation of bile duct or pancreatic duct strictures to restore normal flow.', badgeText: 'DILAT', tags: ['Duct Dilation', 'Biliary Stricture'] },
      { title: 'Biopsy / Brush Cytology', desc: 'Tissue or cell sampling from bile duct or pancreatic duct for histopathological examination.', badgeText: 'CYTO', tags: ['Brush Cytology', 'Biliary Biopsy'] },
      { title: 'Sphincterotomy', desc: 'Cutting of the sphincter muscle to allow access for stone extraction or stent placement.', badgeText: 'SPHINC', tags: ['Sphincterotomy', 'Biliary Sphincter'] },
      { title: 'Leak / Bile Leak Management', desc: 'Endoscopic management of bile leaks using stenting or other therapeutic interventions.', badgeText: 'LEAK', tags: ['Bile Leak', 'Stenting'] },
      { title: 'Pancreatic Duct Evaluation', desc: 'Assessment of pancreatic duct abnormalities including pancreatitis, strictures and divisum.', badgeText: 'PANCR', tags: ['Pancreatic Duct', 'Pancreatitis'] },
      { title: 'Post-Cholecystectomy Evaluation', desc: 'ERCP to evaluate bile duct complications after gallbladder surgery.', badgeText: 'POST-OP', tags: ['Post-Cholecystectomy', 'Complications'] },
      { title: 'ERCP Report (Interpretation)', desc: 'Comprehensive interpretation of ERCP findings and recommendations.', badgeText: 'REPORT', tags: ['ERCP Report', 'Interpretation'] }
    ]
  },
  {
    name: 'Capsule Endoscopy',
    desc: 'Non-invasive endoscopic procedure using a swallowable capsule with camera to visualize the small intestine and detect abnormalities.',
    iconBg: 'bg-amber-50 dark:bg-amber-950/50',
    iconColor: 'text-amber-500 dark:text-amber-400',
    badgeIcon: Gastroenterology,
    menuIcon: Gastroenterology,
    tests: [
      { title: 'Diagnostic Capsule Endoscopy', desc: "Evaluation of small intestine for bleeding, ulcers, Crohn's disease, tumors and other abnormalities.", badgeText: 'CAPSULE', tags: ['Capsule Endoscopy', 'Small Bowel'] },
      { title: 'Small Bowel Bleeding Evaluation', desc: 'Detection and localization of obscure gastrointestinal bleeding sources.', badgeText: 'BLEED', tags: ['Small Bowel Bleed', 'Obscure Bleed'] },
      { title: "Crohn's Disease Assessment", desc: 'Assessment of inflammation, ulcers and mucosal damage in the small intestine.', badgeText: 'CROHN', tags: ['Crohns Disease', 'Mucosal Damage'] },
      { title: 'Small Bowel Tumor Detection', desc: 'Detection of polyps, tumors or mass lesions in the small intestine.', badgeText: 'TUMOR', tags: ['Small Bowel Tumor', 'Polyps'] },
      { title: 'Celiac Disease Evaluation', desc: 'Assessment of small intestinal mucosal damage in suspected celiac disease.', badgeText: 'CELIAC', tags: ['Celiac Disease', 'Villus Atrophy'] },
      { title: 'Transit Time Assessment', desc: 'Evaluation of gastric, small bowel and colonic transit times using capsule tracking.', badgeText: 'TRANSIT', tags: ['Transit Time', 'Motility'] },
      { title: 'Retained Capsule Evaluation', desc: 'Monitoring and assessment of retained capsule in patients with known strictures.', badgeText: 'RETAIN', tags: ['Retained Capsule', 'Stricture'] },
      { title: 'Pre-Procedure Assessment', desc: 'Patient assessment and bowel preparation review prior to capsule endoscopy.', badgeText: 'PRE-OP', tags: ['Pre-Procedure', 'Preparation'] },
      { title: 'Image Review & Analysis', desc: 'Comprehensive review of capsule images and video for abnormal findings.', badgeText: 'REVIEW', tags: ['Image Review', 'Video Analysis'] },
      { title: 'Capsule Endoscopy Report (Interpretation)', desc: 'Detailed interpretation and report of capsule endoscopy findings and recommendations.', badgeText: 'REPORT', tags: ['Capsule Report', 'Interpretation'] }
    ]
  },
  {
    name: 'Bronchoscopy',
    desc: 'Endoscopic examination of the airways and lungs to diagnose and manage respiratory conditions.',
    iconBg: 'bg-blue-50 dark:bg-blue-950/50',
    iconColor: 'text-blue-600 dark:text-blue-400',
    badgeIcon: Lungs,
    menuIcon: Lungs,
    tests: [
      { title: 'Diagnostic Bronchoscopy', desc: 'Examination of the airways to evaluate symptoms like chronic cough, hemoptysis, or persistent infections.', badgeText: 'BRONCHO', tags: ['Bronchoscopy', 'Airway', 'Lungs'] },
      { title: 'Biopsy / Brush Cytology', desc: 'Tissue or cell sampling from bronchial lesions or abnormal areas for histopathological diagnosis.', badgeText: 'BIOPSY', tags: ['Bronchial Biopsy', 'Brush Cytology'] },
      { title: 'Bronchoalveolar Lavage (BAL)', desc: 'Collection and analysis of fluid from the lungs to detect infections, inflammation, or malignancy.', badgeText: 'BAL', tags: ['BAL', 'Lavage', 'Lung Infection'] },
      { title: 'Endobronchial Ultrasound (EBUS)', desc: 'Ultrasound-guided evaluation and sampling of lymph nodes and mediastinal structures.', badgeText: 'EBUS', tags: ['EBUS', 'Mediastinal Node', 'Ultrasound'] },
      { title: 'Foreign Body Removal', desc: 'Detection and endoscopic removal of foreign bodies from the airway.', badgeText: 'REMOVAL', tags: ['Foreign Body', 'Airway Removal'] },
      { title: 'Therapeutic Bronchoscopy', desc: 'Treatment of airway blockages using interventions like debulking, dilation, or stent placement.', badgeText: 'THERAP', tags: ['Therapeutic Bronchoscopy', 'Airway'] },
      { title: 'Airway Stent Placement', desc: 'Placement of stents to keep airways open in cases of strictures, tumors, or compression.', badgeText: 'STENT', tags: ['Airway Stent', 'Tracheobronchial'] },
      { title: 'Image Review & Documentation', desc: 'Detailed review of bronchoscopic images and videos for accurate interpretation and reporting.', badgeText: 'REVIEW', tags: ['Bronchoscopy Review', 'Documentation'] },
      { title: 'Bronchoscopy Report (Interpretation)', desc: 'Comprehensive interpretation of findings and recommendations for further management.', badgeText: 'REPORT', tags: ['Bronchoscopy Report', 'Interpretation'] }
    ]
  },
  {
    name: 'Cystoscopy',
    desc: 'Endoscopic examination of the urinary bladder and urethra to diagnose and treat urological conditions.',
    iconBg: 'bg-cyan-50 dark:bg-cyan-950/50',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    badgeIcon: Urology,
    menuIcon: Urology,
    tests: [
      { title: 'Diagnostic Cystoscopy', desc: 'Examination of the bladder and urethra to evaluate symptoms like hematuria, pain, or recurrent infections.', badgeText: 'CYSTO', tags: ['Cystoscopy', 'Bladder', 'Urethra'] },
      { title: 'Bladder Tumor Evaluation', desc: 'Detection and assessment of tumors or abnormal growths in the bladder lining.', badgeText: 'TUMOR', tags: ['Bladder Tumor', 'Urothelial'] },
      { title: 'Bladder Stone Removal', desc: 'Endoscopic removal of bladder stones using specialized instruments.', badgeText: 'STONE', tags: ['Bladder Stone', 'Stone Removal'] },
      { title: 'Urethral Stricture Evaluation', desc: 'Identification and assessment of narrowing or blockage in the urethra.', badgeText: 'STRICT', tags: ['Urethral Stricture', 'Blockage'] },
      { title: 'Biopsy (Bladder / Urethra)', desc: 'Tissue sampling from suspicious areas for histopathological examination.', badgeText: 'BIOPSY', tags: ['Bladder Biopsy', 'Urethral Biopsy'] },
      { title: 'Therapeutic Cystoscopy', desc: 'Treatment of conditions like bleeding, lesions, or small growths within the bladder or urethra.', badgeText: 'THERAP', tags: ['Therapeutic Cystoscopy', 'Bladder'] },
      { title: 'Urethral Dilation', desc: 'Endoscopic dilation of urethral strictures to restore normal urine flow.', badgeText: 'DILAT', tags: ['Urethral Dilation', 'Urine Flow'] },
      { title: 'Image Review & Documentation', desc: 'Detailed review of cystoscopic images and video for accurate interpretation and reporting.', badgeText: 'REVIEW', tags: ['Cystoscopy Review', 'Documentation'] },
      { title: 'Post-Procedure Evaluation', desc: 'Assessment of treatment outcomes and follow-up recommendations.', badgeText: 'EVAL', tags: ['Post-Procedure', 'Outcome'] },
      { title: 'Cystoscopy Report (Interpretation)', desc: 'Comprehensive interpretation of cystoscopic findings and clinical recommendations.', badgeText: 'REPORT', tags: ['Cystoscopy Report', 'Interpretation'] }
    ]
  },
  {
    name: 'Laparoscopy',
    desc: 'Minimally invasive surgical procedure using a camera and small instruments to diagnose and treat conditions in the abdomen and pelvis.',
    iconBg: 'bg-violet-50 dark:bg-violet-950/50',
    iconColor: 'text-violet-600 dark:text-violet-400',
    badgeIcon: GeneralSurgery,
    menuIcon: GeneralSurgery,
    tests: [
      { title: 'Diagnostic Laparoscopy', desc: 'Examination of abdominal organs to diagnose conditions like pain, infertility, endometriosis, or unexplained symptoms.', badgeText: 'LAP', tags: ['Laparoscopy', 'Diagnostic', 'Abdomen'] },
      { title: 'Gynecological Laparoscopy', desc: 'Evaluation and treatment of conditions like ovarian cysts, endometriosis, fibroids, or ectopic pregnancy.', badgeText: 'GYNEC', tags: ['Gynecological', 'Endometriosis', 'Ovarian Cyst'] },
      { title: 'Cholecystectomy', desc: 'Laparoscopic removal of the gallbladder to treat gallstones or inflammation.', badgeText: 'CHOLE', tags: ['Cholecystectomy', 'Gallbladder'] },
      { title: 'Appendectomy', desc: 'Minimally invasive removal of the appendix for acute appendicitis.', badgeText: 'APPEND', tags: ['Appendectomy', 'Appendix'] },
      { title: 'Hernia Repair', desc: 'Laparoscopic repair of inguinal, umbilical, or ventral hernias using mesh or sutures.', badgeText: 'HERNIA', tags: ['Hernia Repair', 'Mesh Repair'] },
      { title: 'Bowel Resection', desc: 'Removal of a diseased or damaged section of the intestine using minimally invasive techniques.', badgeText: 'BOWEL', tags: ['Bowel Resection', 'Intestine'] },
      { title: 'Splenectomy', desc: 'Laparoscopic removal of the spleen for conditions like enlargement, trauma, or blood disorders.', badgeText: 'SPLEN', tags: ['Splenectomy', 'Spleen'] },
      { title: 'Nephrectomy', desc: 'Laparoscopic removal of a kidney partially or completely for tumors or severe damage.', badgeText: 'NEPHR', tags: ['Nephrectomy', 'Kidney'] },
      { title: 'Adhesiolysis', desc: 'Removal of internal scar tissue (adhesions) causing pain or organ obstructions.', badgeText: 'ADHES', tags: ['Adhesiolysis', 'Scar Tissue'] },
      { title: 'Laparoscopy Report (Interpretation)', desc: 'Comprehensive interpretation of laparoscopic findings and surgical observations.', badgeText: 'REPORT', tags: ['Laparoscopy Report', 'Interpretation'] }
    ]
  },
  {
    name: 'ENT Endoscopy',
    desc: 'Endoscopic examination of the ear, nose, throat, and related structures to diagnose and treat ENT conditions.',
    iconBg: 'bg-orange-50 dark:bg-orange-950/50',
    iconColor: 'text-orange-600 dark:text-orange-400',
    badgeIcon: EarsNoseAndThroat,
    menuIcon: EarsNoseAndThroat,
    tests: [
      { title: 'Nasal Endoscopy', desc: 'Examination of nasal cavity and sinuses to diagnose conditions like sinusitis, polyps, or nasal obstruction.', badgeText: 'NASAL', tags: ['Nasal Endoscopy', 'Sinusitis', 'Polyps'] },
      { title: 'Laryngeal Endoscopy', desc: 'Evaluation of the larynx and vocal cords to assess hoarseness, voice disorders, or laryngeal lesions.', badgeText: 'LARYNX', tags: ['Laryngeal Endoscopy', 'Vocal Cords'] },
      { title: 'Otoscopy', desc: 'Endoscopic examination of the ear canal and tympanic membrane for infections or injuries.', badgeText: 'OTO', tags: ['Otoscopy', 'Ear Canal', 'Tympanic'] },
      { title: 'Pharyngoscopy', desc: 'Visualization of the throat (pharynx) to detect infections, inflammation, or structural abnormalities.', badgeText: 'PHARYNX', tags: ['Pharyngoscopy', 'Throat'] },
      { title: 'Sinus Endoscopy', desc: 'Endoscopic assessment of the paranasal sinuses to diagnose chronic sinusitis or nasal polyps.', badgeText: 'SINUS', tags: ['Sinus Endoscopy', 'Paranasal'] },
      { title: 'Foreign Body Removal', desc: 'Endoscopic guided removal of foreign bodies from the nose, ear, or throat.', badgeText: 'REMOVAL', tags: ['Foreign Body', 'ENT Removal'] },
      { title: 'Biopsy', desc: 'Tissue sampling from suspicious lesions in ENT structures for histopathological analysis.', badgeText: 'BIOPSY', tags: ['ENT Biopsy', 'Histopathology'] },
      { title: 'Balloon Sinuplasty', desc: 'Minimally invasive procedure to dilate sinus passages and improve sinus drainage.', badgeText: 'SINU', tags: ['Balloon Sinuplasty', 'Sinus Drainage'] },
      { title: 'Therapeutic Endoscopy', desc: 'Endoscopic treatment for ENT conditions like polyp removal, cauterization, or stent placement.', badgeText: 'THERAP', tags: ['Therapeutic ENT', 'Polyp Removal'] },
      { title: 'ENT Endoscopy Report (Interpretation)', desc: 'Comprehensive interpretation of endoscopic findings and clinical recommendations.', badgeText: 'REPORT', tags: ['ENT Report', 'Interpretation'] }
    ]
  },
  {
    name: 'Others – Endoscopy',
    desc: 'Other specialized endoscopic procedures used for diagnostic or therapeutic purposes.',
    iconBg: 'bg-slate-100 dark:bg-slate-800',
    iconColor: 'text-slate-600 dark:text-slate-300',
    badgeIcon: MoreHorizontal,
    menuIcon: MoreHorizontal,
    tests: [
      { title: 'Enteroscopy', desc: 'Endoscopic examination of the small intestine using a long endoscope.', badgeText: 'ENTER', tags: ['Enteroscopy', 'Small Intestine'] },
      { title: 'EUS (Endoscopic Ultrasound)', desc: 'Combines endoscopy and ultrasound to visualize digestive tract and nearby structures.', badgeText: 'EUS', tags: ['EUS', 'Endoscopic Ultrasound'] },
      { title: 'Double Balloon Enteroscopy', desc: 'Advanced endoscopic technique for deep examination of the small intestine.', badgeText: 'DBE', tags: ['Double Balloon', 'Enteroscopy'] },
      { title: 'Narrow Band Imaging (NBI)', desc: 'Enhanced imaging technique to improve visualization of mucosal structures and blood vessels.', badgeText: 'NBI', tags: ['Narrow Band Imaging', 'NBI'] },
      { title: 'Endoscopic Mucosal Resection (EMR)', desc: 'Removal of superficial lesions from the gastrointestinal tract.', badgeText: 'EMR', tags: ['EMR', 'Mucosal Resection'] },
      { title: 'Endoscopic Submucosal Dissection (ESD)', desc: 'Advanced technique for removal of larger lesions in the GI tract.', badgeText: 'ESD', tags: ['ESD', 'Submucosal Dissection'] },
      { title: 'Peroral Endoscopic Myotomy (POEM)', desc: 'Minimally invasive procedure for treating achalasia.', badgeText: 'POEM', tags: ['POEM', 'Achalasia'] },
      { title: 'Endoscopic Retrograde Appendicitis (E.R.A.)', desc: 'Endoscopic approach for diagnosing and treating appendicitis.', badgeText: 'ERA', tags: ['ERA', 'Appendicitis'] },
      { title: 'Endoscopic Stent Placement', desc: 'Placement of stents to relieve blockages in the digestive tract.', badgeText: 'STENT', tags: ['Stent Placement', 'GI Stent'] },
      { title: 'Others – Endoscopy Procedures', desc: 'Other specialized endoscopic procedures not listed above.', badgeText: 'OTHER', tags: ['Endoscopy', 'Custom', 'Other'] }
    ]
  }
];

const XRAY_SUBCATEGORIES: SubCategoryItem[] = [
  {
    name: 'Chest',
    desc: 'X-ray examination of the chest, lungs, heart, ribs, and diaphragm',
    iconBg: 'bg-blue-50 dark:bg-blue-950/50',
    iconColor: 'text-blue-600 dark:text-blue-400',
    badgeIcon: Lungs,
    menuIcon: Lungs,
    tests: [
      { title: 'Chest (PA View)', desc: 'Standard posteroanterior view for lung and heart evaluation', badgeText: 'PA', tags: ['Chest', 'PA View'] },
      { title: 'Chest (AP View)', desc: 'Anteroposterior view for bedside or supine patients', badgeText: 'AP', tags: ['Chest', 'AP View'] },
      { title: 'Chest Lateral', desc: 'Side view of chest to locate lesions behind the heart', badgeText: 'LAT', tags: ['Chest', 'Lateral'] },
      { title: 'Ribs', desc: 'Evaluation of ribs for fractures or lesions', badgeText: 'RIBS', tags: ['Ribs', 'Chest'] },
      { title: 'Sternum', desc: 'Targeted view of the breastbone', badgeText: 'STERN', tags: ['Sternum', 'Chest'] },
      { title: 'Clavicles', desc: 'Collarbone fractures or dislocation assessment', badgeText: 'CLAV', tags: ['Clavicles', 'Chest'] },
      { title: 'Scapula', desc: 'Shoulder blade fracture or lesion visualization', badgeText: 'SCAP', tags: ['Scapula', 'Chest'] },
      { title: 'Whole Chest (Bilateral)', desc: 'Bilateral chest and thoracic cage view', badgeText: 'BILAT', tags: ['Bilateral', 'Chest'] },
      { title: 'Expiratory Chest', desc: 'Expiratory view to detect pneumothorax or foreign body', badgeText: 'EXP', tags: ['Expiratory', 'Chest'] },
      { title: 'Decubitus Chest', desc: 'Lying on side to detect free pleural fluid', badgeText: 'DECUB', tags: ['Decubitus', 'Chest'] },
      { title: 'Pneumothorax View', desc: 'Optimized view for air in the pleural space', badgeText: 'PTX', tags: ['Pneumothorax', 'Chest'] },
      { title: 'Lung Field View', desc: 'High definition view focused on lung parenchyma', badgeText: 'LUNG', tags: ['Lung Fields', 'Chest'] },
      { title: 'Mediastinum View', desc: 'Clear visualization of central mediastinal structures', badgeText: 'MEDIA', tags: ['Mediastinum', 'Chest'] },
      { title: 'Cardiac Silhouette View', desc: 'Cardiomegaly and heart chamber size assessment', badgeText: 'HEART', tags: ['Cardiac', 'Chest'] },
      { title: 'Diaphragm View', desc: 'Assessment of diaphragmatic movement and shape', badgeText: 'DIAPH', tags: ['Diaphragm', 'Chest'] },
      { title: 'Posteroanterior Oblique (Right)', desc: 'Right oblique view of the chest cage', badgeText: 'R-OBL', tags: ['Right Oblique', 'Chest'] },
      { title: 'Posteroanterior Oblique (Left)', desc: 'Left oblique view of the chest cage', badgeText: 'L-OBL', tags: ['Left Oblique', 'Chest'] },
      { title: 'Lordotic View', desc: 'Apical lordotic view for tuberculosis or lung apex masses', badgeText: 'LORD', tags: ['Lordotic', 'Chest'] },
      { title: 'Apical Lordotic View', desc: 'Detailed view of pulmonary apices', badgeText: 'APICAL', tags: ['Apical', 'Chest'] },
      { title: 'Lateral Decubitus', desc: 'Lateral projection with patient in horizontal position', badgeText: 'L-DEC', tags: ['Lateral Decubitus', 'Chest'] },
      { title: 'Erect View', desc: 'Standing view for free air under the diaphragm', badgeText: 'ERECT', tags: ['Erect', 'Chest'] },
      { title: 'Supine View', desc: 'Lying down view of chest structures', badgeText: 'SUPINE', tags: ['Supine', 'Chest'] },
      { title: 'Trauma Series', desc: 'Rapid chest series for trauma patient assessment', badgeText: 'TRAUM', tags: ['Trauma', 'Chest'] },
      { title: 'Post Operative View', desc: 'Check placement of tubes, lines, and lung expansion', badgeText: 'P-OP', tags: ['Post Operative', 'Chest'] },
      { title: 'Follow-up Chest', desc: 'Monitoring resolution of pneumonia, effusion or nodules', badgeText: 'F-UP', tags: ['Follow-up', 'Chest'] }
    ]
  },
  {
    name: 'Head & Neck',
    desc: 'X-ray scans of skull, PNS, cervical vertebrae, and jaw',
    iconBg: 'bg-indigo-50 dark:bg-indigo-950/50',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    badgeIcon: Skull,
    menuIcon: Skull,
    tests: [
      { title: 'Skull', desc: 'Evaluation of cranial vault bones for fracture or suture fusion', badgeText: 'SKULL', tags: ['Skull', 'Head'] },
      { title: 'Facial Bones', desc: 'Detailed assessment of orbit, maxilla, and zygoma structures', badgeText: 'FACIAL', tags: ['Facial', 'Head'] },
      { title: 'Nasal Bones', desc: 'Specialized view to detect nasal fractures', badgeText: 'NASAL', tags: ['Nasal', 'Head'] },
      { title: 'Sinuses (PNS)', desc: 'Water\'s and Caldwell views for sinusitis and sinus cavity disease', badgeText: 'PNS', tags: ['Sinuses', 'PNS'] },
      { title: 'Mandible', desc: 'Assessment of jawbone fractures or TMJ issues', badgeText: 'MAND', tags: ['Mandible', 'Jaw'] },
      { title: 'TM Joint (Jaw)', desc: 'Temporomandibular joint open and closed mouth views', badgeText: 'TMJ', tags: ['TMJ', 'Jaw'] },
      { title: 'Neck / Soft Tissue Neck', desc: 'Visualization of airway, epiglottis, and retropharyngeal space', badgeText: 'NECK', tags: ['Neck', 'Soft Tissue'] },
      { title: 'Cervical Spine', desc: 'Radiography of the C1-C7 cervical vertebrae', badgeText: 'C-SP', tags: ['Cervical Spine', 'Spine'] }
    ]
  },
  {
    name: 'Spine',
    desc: 'Complete spinal column radiography including cervical, dorsal, and lumbar vertebrae',
    iconBg: 'bg-violet-50 dark:bg-violet-950/50',
    iconColor: 'text-violet-600 dark:text-violet-400',
    badgeIcon: Orthopaedics,
    menuIcon: Orthopaedics,
    tests: [
      { title: 'Cervical Spine', desc: 'C1-C7 vertebrae views for pain or trauma assessment', badgeText: 'C-SPINE', tags: ['Cervical Spine', 'Spine'] },
      { title: 'Thoracic (Dorsal) Spine', desc: 'Assessment of upper back dorsal vertebrae', badgeText: 'D-SPINE', tags: ['Dorsal Spine', 'Spine'] },
      { title: 'Lumbar Spine', desc: 'Assessment of lower back vertebrae for stenosis or alignment', badgeText: 'L-SPINE', tags: ['Lumbar Spine', 'Spine'] },
      { title: 'Sacrum & Coccyx', desc: 'Targeted view of tailbone and lower spinal sacrum', badgeText: 'SACRUM', tags: ['Sacrum', 'Coccyx'] },
      { title: 'Whole Spine', desc: 'Panoramic view of the entire spinal column', badgeText: 'W-SP', tags: ['Whole Spine', 'Spine'] },
      { title: 'Scoliosis Series', desc: 'Spine views to measure curvature angle (Cobb angle)', badgeText: 'SCOLI', tags: ['Scoliosis', 'Spine'] },
      { title: 'Spine (Full Length) Standing', desc: 'Weight-bearing full spine alignment study', badgeText: 'STAND', tags: ['Standing', 'Spine'] },
      { title: 'Spine (Full Length) Flexion', desc: 'Assess stability of spinal vertebrae during bending', badgeText: 'FLEX', tags: ['Flexion', 'Spine'] },
      { title: 'Spine (Full Length) Extension', desc: 'Assess stability of spinal vertebrae during arching', badgeText: 'EXT', tags: ['Extension', 'Spine'] },
      { title: 'Spine (Full Length) Lateral', desc: 'Side-view evaluation of full spine curvature', badgeText: 'LAT', tags: ['Lateral', 'Spine'] }
    ]
  },
  {
    name: 'Upper Limb',
    desc: 'X-ray imaging of hand, wrist, forearm, elbow, humerus, scapula, and shoulder',
    iconBg: 'bg-rose-50 dark:bg-rose-950/50',
    iconColor: 'text-rose-600 dark:text-rose-400',
    badgeIcon: GeneralSurgery,
    menuIcon: GeneralSurgery,
    tests: [
      { title: 'Shoulder', desc: 'Radiography of shoulder joint, acromion and clavicle', badgeText: 'SHOULD', tags: ['Shoulder', 'Upper Limb'] },
      { title: 'Clavicle', desc: 'Collarbone fractures or dislocation assessment', badgeText: 'CLAV', tags: ['Clavicle', 'Upper Limb'] },
      { title: 'Scapula', desc: 'Shoulder blade fracture or lesion visualization', badgeText: 'SCAP', tags: ['Scapula', 'Upper Limb'] },
      { title: 'Humerus', desc: 'Assessment of upper arm bone', badgeText: 'HUMER', tags: ['Humerus', 'Upper Limb'] },
      { title: 'Elbow', desc: 'Assessment of elbow joint, olecranon, and epicondyles', badgeText: 'ELBOW', tags: ['Elbow', 'Upper Limb'] },
      { title: 'Forearm (Radius & Ulna)', desc: 'Radiography of forearm bones', badgeText: 'FORE', tags: ['Forearm', 'Upper Limb'] },
      { title: 'Wrist', desc: 'Carpal bones fracture or arthritis assessment', badgeText: 'WRIST', tags: ['Wrist', 'Upper Limb'] },
      { title: 'Hand', desc: 'Metacarpals and phalanges radiographic evaluation', badgeText: 'HAND', tags: ['Hand', 'Upper Limb'] },
      { title: 'Fingers', desc: 'Targeted view of index, middle, ring or pinky fingers', badgeText: 'FINGER', tags: ['Fingers', 'Upper Limb'] },
      { title: 'Thumb', desc: 'Dedicated view of the first digit bones', badgeText: 'THUMB', tags: ['Thumb', 'Upper Limb'] }
    ]
  },
  {
    name: 'Pelvis & Hip',
    desc: 'X-ray of the pelvic girdle, hip joints, and sacroiliac joints',
    iconBg: 'bg-pink-50 dark:bg-pink-950/50',
    iconColor: 'text-pink-600 dark:text-pink-400',
    badgeIcon: Gynecology,
    menuIcon: Gynecology,
    tests: [
      { title: 'Pelvis', desc: 'AP view of pelvic girdle and sacroiliac joints', badgeText: 'PELVIS', tags: ['Pelvis', 'Hip'] },
      { title: 'Hip (Right/Left/Bilateral)', desc: 'Evaluation of femoral head and acetabulum', badgeText: 'HIP', tags: ['Hip', 'Pelvis'] },
      { title: 'Sacroiliac (SI) Joint', desc: 'SI joint views for ankylosing spondylitis assessment', badgeText: 'SIJT', tags: ['SI Joint', 'Pelvis'] }
    ]
  },
  {
    name: 'Lower Limb',
    desc: 'X-ray imaging of foot, ankle, tibia, fibula, patella, knee, and femur',
    iconBg: 'bg-purple-50 dark:bg-purple-950/50',
    iconColor: 'text-purple-600 dark:text-purple-400',
    badgeIcon: Orthopaedics,
    menuIcon: Orthopaedics,
    tests: [
      { title: 'Femur', desc: 'Evaluation of thigh bone fractures or lesions', badgeText: 'FEMUR', tags: ['Femur', 'Lower Limb'] },
      { title: 'Knee', desc: 'Knee joint, patella, and tibia-femoral space evaluation', badgeText: 'KNEE', tags: ['Knee', 'Lower Limb'] },
      { title: 'Patella', desc: 'Skyline view to detect kneecap tracking or fractures', badgeText: 'PATEL', tags: ['Patella', 'Lower Limb'] },
      { title: 'Tibia & Fibula', desc: 'Assessment of shin bones', badgeText: 'TIB-FIB', tags: ['Tibia', 'Fibula', 'Lower Limb'] },
      { title: 'Ankle', desc: 'Mortise and lateral views of the ankle joint', badgeText: 'ANKLE', tags: ['Ankle', 'Lower Limb'] },
      { title: 'Foot', desc: 'Tarsal, metatarsal, and phalanges views', badgeText: 'FOOT', tags: ['Foot', 'Lower Limb'] },
      { title: 'Heel (Calcaneus)', desc: 'Axial and lateral views for calcaneal spur or fracture', badgeText: 'HEEL', tags: ['Heel', 'Calcaneus', 'Lower Limb'] },
      { title: 'Toes', desc: 'Radiography of lower limb phalanges', badgeText: 'TOES', tags: ['Toes', 'Lower Limb'] }
    ]
  },
  {
    name: 'Abdomen',
    desc: 'X-ray views of the abdominal cavity, KUB, and gastrointestinal gas patterns',
    iconBg: 'bg-amber-50 dark:bg-amber-950/50',
    iconColor: 'text-amber-600 dark:text-amber-400',
    badgeIcon: Gastroenterology,
    menuIcon: Gastroenterology,
    tests: [
      { title: 'Abdomen (KUB)', desc: 'Kidneys, ureters, and bladder scout film', badgeText: 'KUB', tags: ['Abdomen', 'KUB'] },
      { title: 'Abdomen Erect', desc: 'Erect view to detect air-fluid levels or free gas', badgeText: 'ERECT', tags: ['Abdomen', 'Erect'] },
      { title: 'Abdomen Supine', desc: 'Flat view of abdominal gas patterns and organs', badgeText: 'SUPINE', tags: ['Abdomen', 'Supine'] },
      { title: 'Abdomen Decubitus / Lateral', desc: 'Oblique or side-lying view for fluid or free air', badgeText: 'DECUB', tags: ['Abdomen', 'Lateral'] }
    ]
  },
  {
    name: 'Dental',
    desc: 'Orthopantomogram (OPG), IOPA, bitewing, and dental radiographic imaging',
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/50',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    badgeIcon: Tooth,
    menuIcon: Tooth,
    tests: [
      { title: 'Intraoral X-ray (IOPA)', desc: 'Periapical view of individual teeth roots and crown', badgeText: 'IOPA', tags: ['Dental', 'IOPA'] },
      { title: 'Bitewing', desc: 'Detection of interproximal cavities and bone loss', badgeText: 'BITE', tags: ['Dental', 'Bitewing'] },
      { title: 'Occlusal X-ray', desc: 'View of upper/lower jaw floor for impacted teeth or stones', badgeText: 'OCCL', tags: ['Dental', 'Occlusal'] },
      { title: 'OPG (Orthopantomogram)', desc: 'Panoramic x-ray showing all teeth, jawbones and sinuses', badgeText: 'OPG', tags: ['Dental', 'OPG'] },
      { title: 'Cephalometric X-ray', desc: 'Side view of face used in orthodontic treatment planning', badgeText: 'CEPH', tags: ['Dental', 'Cephalometric'] }
    ]
  },
  {
    name: 'Special X-ray Studies',
    desc: 'Contrast-based radiographic studies like mammogram, barium meal, and HSG',
    iconBg: 'bg-teal-50 dark:bg-teal-950/50',
    iconColor: 'text-teal-600 dark:text-teal-400',
    badgeIcon: Radiology,
    menuIcon: Radiology,
    tests: [
      { title: 'Mammogram (Breast X-ray)', desc: 'Low-dose screening for breast calcifications or masses', badgeText: 'MAMMO', tags: ['Mammogram', 'Breast'] },
      { title: 'Barium Swallow', desc: 'Esophagus assessment using barium contrast liquid', badgeText: 'SWAL', tags: ['Barium', 'Swallow'] },
      { title: 'Barium Meal Follow Through', desc: 'Stomach and small bowel contrast study', badgeText: 'BMFT', tags: ['Barium', 'BMFT'] },
      { title: 'Barium Enema', desc: 'Large intestine contrast radiography', badgeText: 'ENEMA', tags: ['Barium', 'Enema'] },
      { title: 'HSG (Hysterosalpingogram)', desc: 'Contrast study of uterus and fallopian tubes', badgeText: 'HSG', tags: ['HSG', 'Uterus'] },
      { title: 'IVP (Intravenous Pyelogram)', desc: 'Contrast tracking of urinary tract excretion', badgeText: 'IVP', tags: ['IVP', 'Urinary'] },
      { title: 'Bronchogram', desc: 'Radiography of bronchial tree with contrast agent', badgeText: 'BRONCH', tags: ['Bronchogram', 'Lungs'] },
      { title: 'MCU (Micturating Cystourethrogram)', desc: 'Study of bladder filling and voiding', badgeText: 'MCU', tags: ['MCU', 'Bladder'] }
    ]
  }
];

const USG_SUBCATEGORIES: SubCategoryItem[] = [
  {
    name: 'General Abdomen',
    desc: 'Ultrasound evaluation of abdominal organs and surrounding structures.',
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/50',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    badgeIcon: Gastroenterology,
    menuIcon: Gastroenterology,
    tests: [
      { title: 'Liver Ultrasound', desc: 'Assessment of liver size, parenchyma and focal lesions.', badgeText: 'LIVER', tags: ['USG', 'Liver', 'Abdomen'] },
      { title: 'Gallbladder Ultrasound', desc: 'Evaluation of gallbladder for stones, sludge and wall abnormalities.', badgeText: 'GB', tags: ['USG', 'Gallbladder', 'Abdomen'] },
      { title: 'Pancreas Ultrasound', desc: 'Assessment of pancreas for size, shape and structural changes.', badgeText: 'PANCR', tags: ['USG', 'Pancreas', 'Abdomen'] },
      { title: 'Spleen Ultrasound', desc: 'Evaluation of spleen for size, echotexture and lesions.', badgeText: 'SPLEEN', tags: ['USG', 'Spleen', 'Abdomen'] },
      { title: 'Kidneys Ultrasound', desc: 'Assessment of kidney size, parenchyma, stones and hydronephrosis.', badgeText: 'KIDNEY', tags: ['USG', 'Kidneys', 'Abdomen'] },
      { title: 'Urinary Bladder Ultrasound', desc: 'Evaluation of urinary bladder for wall thickness, stones and residual urine.', badgeText: 'BLAD', tags: ['USG', 'Bladder', 'Abdomen'] },
      { title: 'Biliary System Ultrasound', desc: 'Assessment of CBD and intrahepatic biliary radicles.', badgeText: 'BILI', tags: ['USG', 'Biliary', 'Abdomen'] },
      { title: 'Aorta & IVC Ultrasound', desc: 'Evaluation of abdominal aorta and inferior vena cava.', badgeText: 'AORTA', tags: ['USG', 'Aorta', 'Abdomen'] },
      { title: 'Retroperitoneal Ultrasound', desc: 'Assessment of retroperitoneal structures and organs.', badgeText: 'RETRO', tags: ['USG', 'Retroperitoneal', 'Abdomen'] },
      { title: 'Ascites & Fluid Assessment', desc: 'Detection and assessment of free fluid in peritoneal cavity.', badgeText: 'FLUID', tags: ['USG', 'Ascites', 'Abdomen'] }
    ]
  },
  {
    name: 'Obstetrics & Gynecology',
    desc: 'Ultrasound evaluation for pregnancy, fetal well-being and female pelvic health.',
    iconBg: 'bg-rose-50 dark:bg-rose-950/50',
    iconColor: 'text-rose-600 dark:text-rose-400',
    badgeIcon: Gynecology,
    menuIcon: Gynecology,
    tests: [
      { title: 'Early Pregnancy Scan (≤ 12 Weeks)', desc: 'Confirmation of intrauterine pregnancy, gestational age and viability.', badgeText: 'EARLY', tags: ['USG', 'Pregnancy', 'Obstetrics'] },
      { title: 'NT Scan (11–13⁺⁶ Weeks)', desc: 'Nuchal translucency assessment and first trimester anomaly screening.', badgeText: 'NT', tags: ['USG', 'NT Scan', 'Obstetrics'] },
      { title: 'Anomaly Scan (18–24 Weeks)', desc: 'Detailed fetal anomaly assessment and structural evaluation.', badgeText: 'ANOM', tags: ['USG', 'Anomaly', 'Obstetrics'] },
      { title: 'Growth Scan (28–36 Weeks)', desc: 'Monitoring fetal growth, estimated weight and well-being.', badgeText: 'GROWTH', tags: ['USG', 'Growth', 'Obstetrics'] },
      { title: 'Doppler Study', desc: 'Uterine, umbilical and middle cerebral artery Doppler assessment.', badgeText: 'DOPP', tags: ['USG', 'Doppler', 'Obstetrics'] },
      { title: 'Third Trimester Scan (> 36 Weeks)', desc: 'Fetal well-being, amniotic fluid, placenta and presentation assessment.', badgeText: 'THIRD', tags: ['USG', 'Third Trimester', 'Obstetrics'] },
      { title: 'Pelvic Ultrasound (Transabdominal)', desc: 'Evaluation of uterus, ovaries and adnexa via transabdominal approach.', badgeText: 'PELV-A', tags: ['USG', 'Pelvic', 'Gynecology'] },
      { title: 'Pelvic Ultrasound (Transvaginal)', desc: 'Detailed evaluation of uterus, ovaries and endometrium via transvaginal approach.', badgeText: 'PELV-V', tags: ['USG', 'TVS', 'Gynecology'] },
      { title: 'Follicular Study (For Ovulation)', desc: 'Monitoring follicular growth and ovulation assessment.', badgeText: 'FOLL', tags: ['USG', 'Follicular', 'Gynecology'] },
      { title: 'Infertility Evaluation', desc: 'Assessment of uterine and ovarian causes of infertility.', badgeText: 'INFERT', tags: ['USG', 'Infertility', 'Gynecology'] },
      { title: 'PCOS Evaluation', desc: 'Evaluation of polycystic ovaries and associated pelvic findings.', badgeText: 'PCOS', tags: ['USG', 'PCOS', 'Gynecology'] },
      { title: 'Placenta Evaluation', desc: 'Assessment of placental location, maturity and abnormalities.', badgeText: 'PLAC', tags: ['USG', 'Placenta', 'Obstetrics'] }
    ]
  },
  {
    name: 'Small Parts',
    desc: 'High-resolution ultrasound for superficial organs and soft tissue structures.',
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/50',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    badgeIcon: Sonography,
    menuIcon: Sonography,
    tests: [
      { title: 'Thyroid Ultrasound', desc: 'Evaluation of thyroid gland for nodules, enlargement and other abnormalities.', badgeText: 'THYR', tags: ['USG', 'Thyroid', 'Small Parts'] },
      { title: 'Neck Ultrasound', desc: 'Assessment of cervical lymph nodes, cysts and masses.', badgeText: 'NECK', tags: ['USG', 'Neck', 'Small Parts'] },
      { title: 'Breast Ultrasound', desc: 'Evaluation of breast lumps, cysts, fibroadenoma and other lesions.', badgeText: 'BREAST', tags: ['USG', 'Breast', 'Small Parts'] },
      { title: 'Scrotal Ultrasound', desc: 'Assessment of testes, epididymis, varicocele, hydrocele and scrotal masses.', badgeText: 'SCROTAL', tags: ['USG', 'Scrotal', 'Small Parts'] },
      { title: 'Prostate Ultrasound (TVS)', desc: 'Evaluation of prostate size, volume and abnormalities (Transrectal).', badgeText: 'PROST', tags: ['USG', 'Prostate', 'Small Parts'] },
      { title: 'Parotid Ultrasound', desc: 'Assessment of parotid gland for stones, cysts and masses.', badgeText: 'PAROT', tags: ['USG', 'Parotid', 'Small Parts'] },
      { title: 'Salivary Gland Ultrasound', desc: 'Evaluation of submandibular and sublingual glands for swellings and stones.', badgeText: 'SALIV', tags: ['USG', 'Salivary', 'Small Parts'] },
      { title: 'Soft Tissue Ultrasound', desc: 'Evaluation of soft tissue lumps, cysts, abscesses and collections.', badgeText: 'SOFT', tags: ['USG', 'Soft Tissue', 'Small Parts'] },
      { title: 'Hernia Ultrasound', desc: 'Detection and assessment of inguinal, umbilical and ventral hernias.', badgeText: 'HERNIA', tags: ['USG', 'Hernia', 'Small Parts'] },
      { title: 'Lump / Mass Ultrasound', desc: 'Characterization of superficial lumps and masses for benign or malignant nature.', badgeText: 'LUMP', tags: ['USG', 'Lump', 'Small Parts'] }
    ]
  },
  {
    name: 'Vascular Studies',
    desc: 'Ultrasound evaluation of blood vessels and circulatory system.',
    iconBg: 'bg-red-50 dark:bg-red-950/50',
    iconColor: 'text-red-600 dark:text-red-400',
    badgeIcon: Cardiology,
    menuIcon: Cardiology,
    tests: [
      { title: 'Carotid Doppler', desc: 'Evaluation of carotid arteries for stenosis, plaque and blood flow.', badgeText: 'CAROT', tags: ['USG', 'Doppler', 'Vascular'] },
      { title: 'Venous Doppler – Upper Limb', desc: 'Assessment of venous flow, DVT, reflux and obstruction in upper limb.', badgeText: 'V-UPP', tags: ['USG', 'Venous', 'Vascular'] },
      { title: 'Venous Doppler – Lower Limb', desc: 'Assessment of venous flow, DVT, reflux and obstruction in lower limb.', badgeText: 'V-LOW', tags: ['USG', 'Venous', 'Vascular'] },
      { title: 'Renal Doppler', desc: 'Evaluation of renal artery stenosis and renal vascularity.', badgeText: 'RENAL', tags: ['USG', 'Doppler', 'Vascular'] },
      { title: 'Mesenteric Doppler', desc: 'Assessment of mesenteric arteries for stenosis and blood flow.', badgeText: 'MESEN', tags: ['USG', 'Doppler', 'Vascular'] },
      { title: 'Aortic Doppler', desc: 'Evaluation of abdominal aorta for aneurysm and blood flow.', badgeText: 'AORTA', tags: ['USG', 'Doppler', 'Vascular'] },
      { title: 'Peripheral Arterial Doppler', desc: 'Assessment of peripheral arterial disease and limb ischemia.', badgeText: 'ART-P', tags: ['USG', 'Doppler', 'Vascular'] },
      { title: 'Arterial Doppler – Upper Limb', desc: 'Evaluation of arterial flow and blockage in upper limb.', badgeText: 'A-UPP', tags: ['USG', 'Arterial', 'Vascular'] },
      { title: 'Arteriovenous Fistula Doppler', desc: 'Assessment of AV fistula maturity, flow volume and patency.', badgeText: 'AVF', tags: ['USG', 'Fistula', 'Vascular'] },
      { title: 'Portal & Hepatic Doppler', desc: 'Evaluation of portal vein, hepatic veins and liver vascular flow.', badgeText: 'PORTAL', tags: ['USG', 'Doppler', 'Vascular'] }
    ]
  },
  {
    name: 'Cardiac',
    desc: 'Ultrasound evaluation of the heart and related structures.',
    iconBg: 'bg-pink-50 dark:bg-pink-950/50',
    iconColor: 'text-pink-600 dark:text-pink-400',
    badgeIcon: HeartCardiogram,
    menuIcon: HeartCardiogram,
    tests: [
      { title: 'Echocardiography (Adult)', desc: 'Assessment of cardiac chambers, valves, wall motion and ejection fraction.', badgeText: 'ECHO-A', tags: ['USG', 'ECHO', 'Cardiac'] },
      { title: 'Echocardiography (Pediatric)', desc: 'Evaluation of congenital heart diseases and cardiac function in children.', badgeText: 'ECHO-P', tags: ['USG', 'ECHO', 'Cardiac'] },
      { title: 'Doppler Echocardiography', desc: 'Assessment of blood flow across heart valves and chambers.', badgeText: 'D-ECHO', tags: ['USG', 'Doppler', 'Cardiac'] },
      { title: 'Valve Assessment', desc: 'Evaluation of valvular stenosis, regurgitation and structural abnormalities.', badgeText: 'VALVE', tags: ['USG', 'Valve', 'Cardiac'] },
      { title: 'Pericardial Effusion Study', desc: 'Detection and assessment of fluid around the pericardium.', badgeText: 'EFFUS', tags: ['USG', 'Pericardial', 'Cardiac'] },
      { title: 'Stress Echocardiography', desc: 'Evaluation of heart function under stress (exercise or dobutamine).', badgeText: 'STRESS', tags: ['USG', 'Stress', 'Cardiac'] },
      { title: 'Congenital Heart Disease Assessment', desc: 'Detailed evaluation of structural heart defects and anomalies.', badgeText: 'CHD', tags: ['USG', 'Congenital', 'Cardiac'] },
      { title: 'Transesophageal Echocardiography (TEE)', desc: 'Detailed imaging of heart structures using esophageal probe.', badgeText: 'TEE', tags: ['USG', 'TEE', 'Cardiac'] },
      { title: 'Cardiac Function Assessment', desc: 'Measurement of systolic and diastolic function parameters.', badgeText: 'FUNC', tags: ['USG', 'Function', 'Cardiac'] },
      { title: 'Pulmonary Hypertension Assessment', desc: 'Estimation of pulmonary artery pressure and right heart function.', badgeText: 'PHTN', tags: ['USG', 'Hypertension', 'Cardiac'] }
    ]
  },
  {
    name: 'Musculoskeletal',
    desc: 'Ultrasound evaluation of muscles, tendons, joints and related structures.',
    iconBg: 'bg-amber-50 dark:bg-amber-950/50',
    iconColor: 'text-amber-600 dark:text-amber-400',
    badgeIcon: Orthopaedics,
    menuIcon: Orthopaedics,
    tests: [
      { title: 'Shoulder Joint', desc: 'Evaluation of rotator cuff tears, tendinitis, bursitis and joint effusion.', badgeText: 'SHOUL', tags: ['USG', 'Shoulder', 'Joint'] },
      { title: 'Elbow Joint', desc: 'Assessment of tendons, ligaments, bursitis and joint effusion.', badgeText: 'ELBOW', tags: ['USG', 'Elbow', 'Joint'] },
      { title: 'Wrist & Hand', desc: 'Evaluation of tendons, carpal tunnel, ganglion and soft tissue lesions.', badgeText: 'WRIST', tags: ['USG', 'Wrist', 'Joint'] },
      { title: 'Hip Joint', desc: 'Assessment of joint effusion, synovitis, tendon pathology and soft tissue structures.', badgeText: 'HIP', tags: ['USG', 'Hip', 'Joint'] },
      { title: 'Knee Joint', desc: 'Evaluation of meniscus, ligaments, tendons, bursitis and joint effusion.', badgeText: 'KNEE', tags: ['USG', 'Knee', 'Joint'] },
      { title: 'Ankle & Foot', desc: 'Assessment of tendons, plantar fasciitis, ligament injuries and soft tissue abnormalities.', badgeText: 'ANKLE', tags: ['USG', 'Ankle', 'Joint'] },
      { title: 'Muscle Injury', desc: 'Evaluation of muscle strains, tears, hematoma and myositis.', badgeText: 'MUSC', tags: ['USG', 'Muscle', 'Injury'] },
      { title: 'Tendon Evaluation', desc: 'Assessment of tendonitis, partial or complete tears and thickness.', badgeText: 'TEND', tags: ['USG', 'Tendon', 'Joint'] },
      { title: 'Ligament Injury', desc: 'Evaluation of ligament sprains, partial tears and joint instability.', badgeText: 'LIGAM', tags: ['USG', 'Ligament', 'Injury'] },
      { title: 'Soft Tissue Mass', desc: 'Detection and assessment of soft tissue lumps, cysts and tumors.', badgeText: 'MASS', tags: ['USG', 'Soft Tissue', 'Joint'] }
    ]
  },
  {
    name: 'Pediatric',
    desc: 'Ultrasound evaluation for pediatric organs and conditions.',
    iconBg: 'bg-blue-50 dark:bg-blue-950/50',
    iconColor: 'text-blue-600 dark:text-blue-400',
    badgeIcon: Pediatrics,
    menuIcon: Pediatrics,
    tests: [
      { title: 'Pediatric Kidney (Renal)', desc: 'Evaluation of kidney size, structure, hydronephrosis and congenital anomalies.', badgeText: 'KIDN', tags: ['USG', 'Kidney', 'Pediatric'] },
      { title: 'Pediatric Urinary Bladder', desc: 'Assessment of bladder wall, capacity and residual urine.', badgeText: 'BLAD', tags: ['USG', 'Bladder', 'Pediatric'] },
      { title: 'Pediatric Liver', desc: 'Evaluation of liver size, texture, biliary system and focal lesions.', badgeText: 'LIVER', tags: ['USG', 'Liver', 'Pediatric'] },
      { title: 'Pediatric Spleen', desc: 'Assessment of spleen size, structure and related abnormalities.', badgeText: 'SPLE', tags: ['USG', 'Spleen', 'Pediatric'] },
      { title: 'Appendix', desc: 'Evaluation for appendicitis and other appendiceal pathologies.', badgeText: 'APPX', tags: ['USG', 'Appendix', 'Pediatric'] },
      { title: 'Intestinal Ultrasound', desc: 'Assessment of bowel wall thickness and intestinal abnormalities.', badgeText: 'BOWEL', tags: ['USG', 'Bowel', 'Pediatric'] },
      { title: 'Pyloric Stenosis', desc: 'Evaluation of pyloric muscle thickness and length in infants.', badgeText: 'PYLOR', tags: ['USG', 'Pyloric', 'Pediatric'] },
      { title: 'Hip Joint (DDH Screening)', desc: 'Screening for developmental dysplasia of the hip in infants.', badgeText: 'HIP', tags: ['USG', 'Hip', 'Pediatric'] },
      { title: 'Scrotal Ultrasound', desc: 'Evaluation of testes, epididymis, spermatic cord and scrotal pathologies.', badgeText: 'SCROT', tags: ['USG', 'Scrotal', 'Pediatric'] },
      { title: 'Thyroid', desc: 'Assessment of thyroid size, structure and congenital abnormalities.', badgeText: 'THYR', tags: ['USG', 'Thyroid', 'Pediatric'] }
    ]
  },
  {
    name: 'Neonatal',
    desc: 'Ultrasound evaluation for newborn and neonatal conditions.',
    iconBg: 'bg-teal-50 dark:bg-teal-950/50',
    iconColor: 'text-teal-600 dark:text-teal-400',
    badgeIcon: Pediatrics,
    menuIcon: Pediatrics,
    tests: [
      { title: 'Neonatal Cranial Ultrasound', desc: 'Assessment of brain structures for hemorrhage, ventriculomegaly and other anomalies.', badgeText: 'CRAN', tags: ['USG', 'Cranial', 'Neonatal'] },
      { title: 'Neonatal Cardiac Ultrasound', desc: 'Evaluation of congenital heart defects and cardiac function in newborns.', badgeText: 'CARD', tags: ['USG', 'Cardiac', 'Neonatal'] },
      { title: 'Neonatal Lung Ultrasound', desc: 'Assessment of lung aeration, respiratory distress and related conditions.', badgeText: 'LUNG', tags: ['USG', 'Lung', 'Neonatal'] },
      { title: 'Neonatal Abdominal Ultrasound', desc: 'Evaluation of abdominal organs, bowel obstruction and NEC screening.', badgeText: 'ABDOM', tags: ['USG', 'Abdominal', 'Neonatal'] },
      { title: 'Neonatal Renal Ultrasound', desc: 'Assessment of kidney size, structure and urinary tract anomalies.', badgeText: 'RENAL', tags: ['USG', 'Renal', 'Neonatal'] },
      { title: 'Neonatal Spine Ultrasound', desc: 'Screening for spinal canal anomalies and tethered cord.', badgeText: 'SPINE', tags: ['USG', 'Spine', 'Neonatal'] },
      { title: 'Hip Ultrasound (Neonatal DDH Screening)', desc: 'Screening for developmental dysplasia of the hip in newborns.', badgeText: 'HIP', tags: ['USG', 'Hip', 'Neonatal'] },
      { title: 'Neck Ultrasound (Thyroid)', desc: 'Evaluation of congenital thyroid abnormalities and masses.', badgeText: 'NECK', tags: ['USG', 'Neck', 'Neonatal'] },
      { title: 'Soft Tissue Ultrasound', desc: 'Assessment of superficial lumps, cysts and soft tissue abnormalities.', badgeText: 'SOFT', tags: ['USG', 'Soft Tissue', 'Neonatal'] },
      { title: 'Umbilical / Vascular Ultrasound', desc: 'Evaluation of umbilical vessels and related vascular abnormalities.', badgeText: 'UMBIL', tags: ['USG', 'Umbilical', 'Neonatal'] }
    ]
  },
  {
    name: 'Other Ultrasound',
    desc: 'Miscellaneous ultrasound evaluations for various organs and specialized areas.',
    iconBg: 'bg-slate-100 dark:bg-slate-800',
    iconColor: 'text-slate-600 dark:text-slate-300',
    badgeIcon: MoreHorizontal,
    menuIcon: MoreHorizontal,
    tests: [
      { title: 'Ophthalmic Ultrasound', desc: 'Evaluation of eye structures including globe, retina and optic nerve.', badgeText: 'EYE', tags: ['USG', 'Ophthalmic', 'Other'] },
      { title: 'Salivary Gland Ultrasound', desc: 'Assessment of parotid and submandibular glands for masses and inflammation.', badgeText: 'SALIV', tags: ['USG', 'Salivary', 'Other'] },
      { title: 'Superficial Soft Tissue Ultrasound', desc: 'Evaluation of subcutaneous masses, cysts, lipomas and soft tissue lesions.', badgeText: 'SOFT', tags: ['USG', 'Soft Tissue', 'Other'] },
      { title: 'Peripheral Nerve Ultrasound', desc: 'Assessment of nerve entrapment, injury and neuropathies.', badgeText: 'NERVE', tags: ['USG', 'Nerve', 'Other'] },
      { title: 'Scrotal & Testicular Ultrasound', desc: 'Evaluation of testes, epididymis, scrotal masses and other scrotal pathologies.', badgeText: 'TESTIS', tags: ['USG', 'Scrotal', 'Other'] },
      { title: 'Brachial Plexus Ultrasound', desc: 'Imaging of brachial plexus for traumatic injury and neuropathies.', badgeText: 'BRACH', tags: ['USG', 'Brachial', 'Other'] },
      { title: 'Lymph Node Ultrasound', desc: 'Evaluation of superficial lymph nodes for size, structure and pathology.', badgeText: 'LYMPH', tags: ['USG', 'Lymph', 'Other'] },
      { title: 'Breast Ultrasound', desc: 'Assessment of breast lumps, cysts, fibroadenomas and other abnormalities.', badgeText: 'BREAST', tags: ['USG', 'Breast', 'Other'] },
      { title: 'Parathyroid Ultrasound', desc: 'Localization of parathyroid adenomas in cases of hyperparathyroidism.', badgeText: 'PTH', tags: ['USG', 'Parathyroid', 'Other'] },
      { title: 'Guided Procedure Ultrasound', desc: 'Image-guided aspirations, biopsies, drainages and injections.', badgeText: 'GUIDE', tags: ['USG', 'Guided', 'Other'] }
    ]
  }
];

type CategoryBlueprint = {
  name: string;
  desc: string;
  tests: string[];
};

// Transcribed from the supplied report-picker reference screens.  Keeping this
// data explicit prevents the UI from silently falling back to placeholder
// “General” / “Specialized” categories for the remaining report types.
const CATEGORY_BLUEPRINTS: Partial<Record<string, CategoryBlueprint[]>> = {
  urine: [
    { name: 'Routine & Microscopic', desc: 'Basic urine tests to evaluate general health, kidney function and detect infections', tests: ['Routine Urine Examination (RUE)', 'Urine Microscopy', 'Urine pH', 'Urine Specific Gravity', 'Urine Color', 'Urine Appearance', 'Urine Sugar (Glucose)', 'Urine Protein (Albumin)', 'Urine Ketones', 'Urine Bilirubin'] },
    { name: 'Chemical Examination', desc: 'Detects biochemical changes and helps in diagnosing various conditions', tests: ['Protein', 'Glucose', 'Ketones', 'Bilirubin', 'Urobilinogen', 'Nitrite', 'Leukocyte Esterase', 'Blood', 'pH', 'Specific Gravity'] },
    { name: '24 Hour Urine Tests', desc: 'Measures substances excreted in urine over a 24-hour period for better assessment', tests: ['24-Hour Urine Protein', 'Creatinine Clearance', '24-Hour Urine Microalbumin', '24-Hour Urine Calcium', '24-Hour Urine Sodium', '24-Hour Urine Potassium', '24-Hour Urine Uric Acid', '24-Hour Urine Cortisol', '24-Hour Urine Catecholamines', '24-Hour Urine Metanephrines', '24-Hour Urine Oxalate', '24-Hour Urine Copper'] },
    { name: 'Microalbumin Tests', desc: 'Early detection of kidney damage and monitoring kidney health', tests: ['Urine Microalbumin', 'Albumin / Creatinine Ratio (ACR)', 'Spot Urine Albumin', 'Timed Urine Albumin', 'Urine Creatinine', 'Protein / Creatinine Ratio (PCR)'] },
    { name: 'Urine Culture & Sensitivity', desc: 'Detection of urinary pathogens and antibiotic sensitivity', tests: ['Urine Culture', 'Culture & Antibiotic Sensitivity (C/S)', 'Colony Count (CFU/mL)', 'Organism Identification', 'Antibiotic Susceptibility Panel', 'Yeast / Fungal Culture', 'Mycobacterial (TB) Urine Culture'] },
    { name: 'Hormones in Urine', desc: 'Urinary hormone and endocrine investigations', tests: ['Urine hCG', '24-Hour Urine Cortisol', 'Urine Free Cortisol', 'Urine Catecholamines', 'Metanephrines', 'VMA (Vanillylmandelic Acid)', '5-HIAA (5-Hydroxyindole Acetic Acid)', 'Urine Aldosterone', 'Urine Estrogens', 'Urine Progesterone Metabolites'] },
    { name: 'Drug & Toxicology Screen', desc: 'Detects drugs, medications, and toxic substances in urine for screening and monitoring', tests: ['Urine Drug Screen (Multi-panel)', 'Amphetamines', 'Cocaine', 'Cannabis (THC)', 'Opiates', 'Benzodiazepines', 'Barbiturates', 'Methadone', 'Buprenorphine', 'Phencyclidine (PCP)', 'Tramadol', 'Fentanyl', 'Nicotine / Cotinine', 'Alcohol Metabolites (EtG / EtS)', 'Other Toxins'] },
    { name: 'Stone Risk Profile', desc: 'Urinary metabolic assessment for renal stone risk', tests: ['Urine Calcium', 'Urine Oxalate', 'Urine Citrate', 'Uric Acid', 'Magnesium', 'Phosphate', 'Sodium', 'Cystine', 'Urine pH', 'Supersaturation Profile', 'Crystal Analysis', 'Stone Risk Score'] },
    { name: 'Specialized / Advanced Tests', desc: 'Specialized urine diagnostic investigations', tests: ['Urine Bence Jones Protein', 'Urine Osmolality', 'Urine Electrolytes', 'Urine Amino Acid Analysis', 'Urine Porphyrins', 'Urine Heavy Metals', 'Urine Organic Acids', 'Urine Protein Electrophoresis (UPEP)', 'Urine Immunofixation', 'Urine Cytology'] },
    { name: 'Pediatric Urine Tests', desc: 'Urine investigations tailored for infants, children, and adolescents', tests: ['Pediatric Routine Urine Exam', 'Urine Calcium / Creatinine Ratio', 'Urine Protein / Creatinine Ratio', 'Urine pH (Pediatric Reference)', 'Urine Specific Gravity (Pediatric Reference)', 'Urine Culture (Pediatric Reference)', 'Urine Glucose', 'Urine Ketones', 'Urine Blood (RBC) Microscopy', 'Urine Electrolytes (Pediatric Reference)'] },
    { name: 'Others', desc: 'Miscellaneous and rare urine investigations for special clinical needs', tests: ['Urine AFB (Smear)', 'Urine AFB (Culture)', 'Urine Eosinophils', 'Urine Crystal Analysis', 'Urine Cytochemistry', 'Urine Parasitology', 'Urine Dipstick (Strip Test)', 'Urine Total Protein', 'Urine Ammonia', 'Other Rare Tests'] },
  ],
  xray: [
    { name: 'Chest', desc: 'Radiographs of the chest and lungs', tests: ['Chest X-Ray PA View', 'Chest X-Ray AP View', 'Chest X-Ray Lateral View'] },
    { name: 'Head & Neck', desc: 'X-ray studies of the skull, face and neck', tests: ['X-Ray Skull', 'X-Ray PNS', 'X-Ray Soft Tissue Neck'] },
    { name: 'Spine', desc: 'Cervical, thoracic and lumbar spine radiographs', tests: ['X-Ray Cervical Spine', 'X-Ray Thoracic Spine', 'X-Ray Lumbar Spine'] },
    { name: 'Upper Limb', desc: 'X-ray studies of shoulder, arm, elbow and hand', tests: ['X-Ray Shoulder', 'X-Ray Elbow', 'X-Ray Wrist & Hand'] },
    { name: 'Pelvis & Hip', desc: 'Pelvic and hip joint radiographs', tests: ['X-Ray Pelvis', 'X-Ray Hip', 'X-Ray Sacroiliac Joints'] },
    { name: 'Lower Limb', desc: 'X-ray studies of knee, leg, ankle and foot', tests: ['X-Ray Knee', 'X-Ray Ankle', 'X-Ray Foot'] },
    { name: 'Abdomen', desc: 'Abdominal radiographic examinations', tests: ['X-Ray Abdomen Erect', 'X-Ray Abdomen Supine'] },
    { name: 'Dental', desc: 'Dental and maxillofacial radiographs', tests: ['Dental OPG', 'Intraoral Periapical X-Ray'] },
    { name: 'Special X-ray Studies', desc: 'Contrast and specialized X-ray examinations', tests: ['Mammogram (Breast X-ray)', 'Barium Swallow', 'Barium Meal Follow Through', 'Barium Enema', 'HSG (Hysterosalpingogram)', 'IVP (Intravenous Pyelogram)', 'Bronchogram', 'MCU (Micturating Cystourethrogram)'] },
  ],
  usg: [
    { name: 'General Abdomen', desc: 'Ultrasound assessment of abdominal organs', tests: ['Whole Abdomen Ultrasound', 'Upper Abdomen Ultrasound', 'KUB Ultrasound'] },
    { name: 'Obstetrics & Gynecology', desc: 'Pregnancy, fetal well-being and female pelvic ultrasound', tests: ['Early Pregnancy Scan (≤ 12 Weeks)', 'NT Scan (11–13+6 Weeks)', 'Anomaly Scan (18–24 Weeks)', 'Growth Scan (28–36 Weeks)', 'Doppler Study', 'Third Trimester Scan (> 36 Weeks)', 'Pelvic Ultrasound (Transabdominal)', 'Pelvic Ultrasound (Transvaginal)', 'Follicular Study (For Ovulation)', 'Infertility Evaluation', 'PCOS Evaluation', 'Placenta Evaluation'] },
    { name: 'Small Parts', desc: 'Targeted ultrasound of superficial structures', tests: ['Thyroid Ultrasound', 'Breast Ultrasound', 'Scrotal Ultrasound'] },
    { name: 'Vascular Studies', desc: 'Doppler ultrasound of arteries and veins', tests: ['Carotid Doppler', 'Venous Doppler', 'Arterial Doppler'] },
    { name: 'Cardiac', desc: 'Ultrasound-based cardiac studies', tests: ['Echocardiography', 'Fetal Echocardiography'] },
    { name: 'Musculoskeletal', desc: 'Ultrasound of joints, tendons and soft tissues', tests: ['Shoulder Ultrasound', 'Knee Ultrasound', 'Soft Tissue Ultrasound'] },
    { name: 'Pediatric', desc: 'Ultrasound examinations for children', tests: ['Pediatric Abdomen Ultrasound', 'Pediatric Hip Ultrasound'] },
    { name: 'Neonatal', desc: 'Ultrasound studies for newborns', tests: ['Neonatal Cranial Ultrasound', 'Neonatal Abdomen Ultrasound'] },
  ],
  mri: [
    { name: 'Brain', desc: 'Detailed MRI evaluation of brain for various neurological conditions', tests: ['MRI Brain – Plain', 'MRI Brain – With Contrast', 'MR Angiography (MRA) Brain', 'MR Venography (MRV) Brain', 'MRI Brain – Functional (fMRI)', 'Diffusion MRI (DWI)', 'MR Spectroscopy (MRS)', 'MRI Pituitary (Sellar Region)', 'MRI IAC (Internal Acoustic Canal)', 'Pediatric Brain MRI'] },
    { name: 'Spine', desc: 'Comprehensive MRI evaluation of the spine for degenerative, traumatic and inflammatory conditions', tests: ['MRI Cervical Spine', 'MRI Thoracic Spine', 'MRI Lumbar Spine', 'MRI Whole Spine (Screening)', 'MRI Spine – With Contrast', 'MRI Spinal Canal', 'MRI Neurogram (Brachial Plexus)', 'MRI Neurogram (Lumbosacral Plexus)', 'MRI Sacroiliac Joint', 'MRI Coccyx'] },
    { name: 'Musculoskeletal', desc: 'MRI evaluation of bones, joints, muscles, ligaments and soft tissues', tests: ['MRI Shoulder', 'MRI Elbow', 'MRI Wrist', 'MRI Hand', 'MRI Hip', 'MRI Knee', 'MRI Ankle', 'MRI Foot', 'MRI Whole Body', 'MRI Soft Tissue'] },
    { name: 'Abdomen', desc: 'Detailed MRI evaluation of abdominal organs and structures', tests: ['MRI Liver', 'MRI Biliary System (MRCP)', 'MRI Pancreas', 'MRI Kidneys', 'MRI Adrenal Glands', 'MRI Spleen', 'MRI Stomach', 'MRI Small Bowel', 'MRI Colon', 'MRI Abdominal Angiography (MRA)'] },
    { name: 'Pelvis', desc: 'Comprehensive MRI evaluation of pelvic organs and structures', tests: ['MRI Female Pelvis', 'MRI Male Pelvis', 'MRI Urinary Bladder', 'MRI Rectum', 'MRI Cervix', 'MRI Pelvic Floor', 'MRI Sacrum & Coccyx', 'MRI Hip Joints', 'MRI Soft Tissue Pelvis', 'MR Pelvic Angiography (MRA)'] },
    { name: 'Cardiac', desc: 'Advanced MRI evaluation of the heart and surrounding structures', tests: ['MRI Cardiac Function Study', 'MRI Myocardial Perfusion', 'MRI Viability Study (LGE)', 'MRI Valvular Heart Disease', 'MRI Congenital Heart Disease', 'MRI Aorta', 'MRI Pericardium', 'MRI Cardiac Angiography (MRA)', 'T1 / T2 Mapping', '4D Flow MRI'] },
    { name: 'Breast', desc: 'Dedicated MRI evaluation of breast tissue and related abnormalities', tests: ['MRI Breast (Screening)', 'MRI Breast – Diagnostic', 'MRI Breast – Bilateral', 'MRI Breast – Lesion Characterization', 'MRI Breast – Implant Evaluation', 'MRI Breast – Ductal Assessment', 'MRI Breast – Treatment Response', 'MRI Breast – Post Treatment', 'MRI Axilla (For Breast)', 'MRI Breast – Pre Operative Mapping'] },
    { name: 'Vascular', desc: 'Comprehensive MRI evaluation of blood vessels and vascular structures', tests: ['MR Angiography (MRA) – Head & Neck', 'MR Venography (MRV) – Head', 'MR Angiography (MRA) – Renal', 'MR Angiography (MRA) – Aorta', 'MR Angiography (MRA) – Peripheral', 'MR Venography (MRV) – Extremities', 'MR Angiography (MRA) – Hepatic', 'MR Angiography (MRA) – Pelvic', 'MR Angiography (MRA) – Mesenteric', 'MR Venography (MRV) – Abdominal'] },
    { name: 'Neck', desc: 'Detailed MRI evaluation of the neck structures and soft tissues', tests: ['MRI Soft Tissue Neck', 'MRI Neck – Lump / Mass', 'MRI Carotid Angiography (MRA) – Neck', 'MRI Neck – Lymph Nodes', 'MRI Cervical Spine (Upper Neck)', 'MRI Thyroid', 'MRI Paranasal Sinuses (PNS)', 'MRI Salivary Glands', 'MRI Larynx', 'MRI Pharynx'] },
    { name: 'Other MRI', desc: 'Specialized MRI studies and advanced imaging protocols', tests: ['MRI Whole Body Screening', 'MRI Fetal', 'MRCP (MR Cholangiopancreatography)', 'MRI Inner Ear (IAC Protocol)', 'MRI Orbit', 'MRI Extremities', 'MRI Guided Intervention', 'MRI Neurography', 'MRI Cartilage Mapping', 'MRI Functional (fMRI / DWI / PWI)'] },
  ],
  ct: [
    { name: 'Head & Brain CT', desc: 'CT scans of the head and brain help detect injuries, bleeding, tumors, infections, and other neurological conditions', tests: ['CT Brain (Plain)', 'CT Brain (Contrast Enhanced)', 'CT Head Injury (Trauma)', 'CT Brain Angiography (CTA)', 'CT Venography (CTV)', 'CT Skull (Bone Window)', 'CT Temporal Bone', 'CT PNS (Paranasal Sinuses)', 'CT Orbits', 'CT Sellar / Suprasellar Region', 'CT Face', 'Others \u2013 Head & Brain CT Scan'] },
    { name: 'Neck CT', desc: 'CT scans of the neck to evaluate soft tissues, blood vessels, airway, and bone structures for various conditions', tests: ['CT Neck Soft Tissue (Contrast)', 'CT Neck Soft Tissue (Non-Contrast)', 'CT Thyroid', 'CT Salivary Glands', 'CT Airway', 'CT Cervical Spine', 'CT Neck Vessels (CTA)', 'CT Neck Lymph Nodes', 'CT TMJ', 'Others \u2013 Neck CT'] },
    { name: 'Chest CT', desc: 'CT scans of the chest to evaluate lungs, heart, blood vessels, and structures within the thorax for various conditions', tests: ['CT Chest (High Resolution \u2013 HRCT)', 'CT Chest (Non-Contrast)', 'CT Chest (Contrast)', 'CT Pulmonary Angiography (CTPA)', 'CT Chest for Lung Nodule', 'CT Chest for Infection', 'CT Chest for Emphysema / COPD', 'CT Mediastinum', 'CT Chest Trauma', 'Others \u2013 Chest CT'] },
    { name: 'Abdomen CT', desc: 'CT scans of the abdomen to evaluate organs, detect abnormalities, and assess a wide range of digestive and abdominal conditions', tests: ['CT Abdomen (Non-Contrast)', 'CT Abdomen (Contrast)', 'CT Liver', 'CT Pancreas', 'CT Kidneys (KUB)', 'CT Spleen', 'CT Gallbladder & Biliary System', 'CT Enterography', 'CT Abdomen Angiography (CTA)', 'Others \u2013 Abdomen CT'] },
    { name: 'Pelvis CT', desc: 'CT scans of the pelvic region to evaluate pelvic organs, bones, blood vessels, and detect abnormalities, injuries, and diseases', tests: ['CT Pelvis (Non-Contrast)', 'CT Pelvis (Contrast)', 'CT Urography (CT Urogram)', 'CT Urinary Bladder', 'CT Prostate', 'CT Ovaries', 'CT Uterus', 'CT Pelvic Bones', 'CT Pelvic Angiography (CTA)', 'Others \u2013 Pelvis CT'] },
    { name: 'Spine CT', desc: 'CT scans of the spine to evaluate vertebrae, discs, spinal canal, and surrounding structures for injuries, abnormalities, and spinal conditions', tests: ['CT Cervical Spine', 'CT Thoracic Spine', 'CT Lumbar Spine', 'CT Sacrum & Coccyx', 'CT Spine (Whole)', 'CT Spinal Canal', 'CT Facet Joints', 'CT Vertebral Fracture Assessment', 'CT Post-Surgical Spine', 'Others \u2013 Spine CT'] },
    { name: 'Musculoskeletal CT', desc: 'CT scans of bones, joints, muscles, and connective tissues to evaluate injuries, fractures, arthritis, and other musculoskeletal conditions', tests: ['CT Shoulder', 'CT Elbow', 'CT Wrist & Hand', 'CT Hip', 'CT Knee', 'CT Ankle & Foot', 'CT Long Bones', 'CT Joint (General)', 'CT Soft Tissue', 'CT Bone Mineral Density (Quantitative)', 'CT 3D Reconstruction', 'Others \u2013 Musculoskeletal CT'] },
    { name: 'CT Angiography (CTA)', desc: 'CT angiography scans to visualize blood vessels and evaluate blood flow, blockages, aneurysms, and vascular conditions', tests: ['CT Cerebral Angiography', 'CT Neck Angiography', 'CT Coronary Angiography', 'CT Aorta Angiography', 'CT Abdominal Angiography', 'CT Pelvic Angiography', 'CT Lower Extremity Angiography', 'CT Upper Extremity Angiography', 'CT Pulmonary Angiography (CTPA)', 'Others \u2013 CTA'] },
    { name: 'Cardiac CT', desc: 'CT scans of the heart to assess coronary arteries, cardiac structure, function, and detect blockages, calcium scoring, and other cardiac conditions', tests: ['CT Coronary Angiography', 'CT Calcium Scoring', 'CT Cardiac Morphology', 'CT Ventricular Function', 'CT Aorta (Thoracic)', 'CT Cardiac Valves', 'CT Myocardial Perfusion', 'CT Congenital Heart Disease', 'CT Pericardium', 'CT Pulmonary Vein Mapping', 'CT Post-Operative Assessment', 'Others \u2013 Cardiac CT'] },
    { name: 'Whole Body CT', desc: 'Comprehensive CT scans of the entire body to detect a wide range of diseases, abnormalities, and conditions in one comprehensive study', tests: ['CT Whole Body Scan (Non-Contrast)', 'CT Whole Body Scan (Contrast)', 'CT Whole Body Cancer Screening', 'CT Whole Body Trauma Scan', 'CT Whole Body Health Check', 'CT Whole Body Metastasis Scan', 'CT Whole Body Bone Survey', 'CT Whole Body Organ Evaluation', 'CT Whole Body Genetic Screening', 'Others \u2013 Whole Body CT'] },
    { name: 'Pediatric CT', desc: 'Specialized CT scans for infants, children, and adolescents to diagnose a wide range of conditions with low-dose protocols and pediatric expertise', tests: ['CT Brain (Pediatric)', 'CT Chest (Pediatric)', 'CT Abdomen (Pediatric)', 'CT Pelvis (Pediatric)', 'CT Spine (Pediatric)', 'CT Musculoskeletal (Pediatric)', 'CT Cardiac (Pediatric)', 'CT Whole Body (Pediatric)', 'Low Dose Pediatric CT', 'Others \u2013 Pediatric CT'] },
    { name: 'Others \u2013 CT Scan', desc: 'Other specialized CT scans for specific clinical needs and advanced diagnostic requirements not listed in the above categories', tests: ['CT Temporal Bone', 'CT Orbits', 'CT PNS (Sinuses)', 'CT Dental / Dentascan', 'High Resolution CT (HRCT)', 'CT Lung Screening', 'CT Colonography', 'CT Liver Study', 'CT Pancreatic Protocol', 'CT Adrenal Protocol', 'Dual Energy CT (DECT)', 'Other Specialized CT'] },
  ],
  ecg: [
    { name: 'Basic ECG', desc: 'Standard electrocardiogram for heart rhythm and electrical activity analysis', tests: ['Resting ECG (12 Lead)', '3 Lead ECG', '5 Lead ECG', 'Single Lead ECG', 'Pre-Operative ECG', 'Routine Health Check ECG', 'Post-Treatment ECG', 'Drug Therapy ECG', 'ECG Report (Interpretation)', 'Follow-up / Comparison ECG'] },
    { name: 'Advanced ECG', desc: 'Specialized ECG studies for in-depth cardiac evaluation and diagnosis', tests: ['Signal-Averaged ECG (SAECG)', 'High-Resolution ECG', 'Vector ECG', 'Paced Rhythm ECG', 'Long QT / Short QT Assessment', 'ST Segment Analysis', 'T-Wave Alternans (TWA)', 'Heart Rate Variability (HRV) ECG', 'Arrhythmia Analysis (ECG)', 'ECG Trend Analysis'] },
    { name: 'Holter Monitoring', desc: 'Continuous ECG monitoring over 24\u201348 hours or longer to detect intermittent cardiac abnormalities', tests: ['24 Hour Holter Monitoring', '48 Hour Holter Monitoring', '7 Day Holter Monitoring', 'Event Triggered Holter Monitoring', 'Night-time Holter Monitoring', 'Arrhythmia Detection (24\u201348h)', 'ST Segment Analysis', 'PVC / PAC Burden Analysis', 'Heart Rate Variability (HRV)', 'Holter Report (Interpretation)'] },
    { name: 'Stress / Exercise Test', desc: 'Evaluates heart function during physical stress or exercise to detect ischemia and exercise tolerance', tests: ['Treadmill Test (TMT)', 'Cycle Stress Test', 'Stress ECG', 'Stress Echocardiography', 'Pharmacologic Stress Test', 'Nuclear Stress Test', 'Cardiopulmonary Exercise Test (CPET)', 'Stress Test Report (Interpretation)', 'Exercise Tolerance Test (ETT)', 'Pre-Operative Stress Evaluation'] },
    { name: 'Ambulatory BP Monitoring', desc: '24-hour ambulatory blood pressure monitoring to assess blood pressure patterns and variability', tests: ['24 Hour ABPM', 'Daytime ABPM', 'Nighttime ABPM', 'Day & Night ABPM', 'ABPM with HR Monitoring', 'ABPM Summary Report', 'Systolic / Diastolic Analysis', 'BP Variability Analysis', 'Hypertension Assessment', 'ABPM Report (Interpretation)'] },
    { name: 'Echocardiography (Echo)', desc: 'Ultrasound imaging of the heart to assess structure, function and blood flow', tests: ['2D Echocardiography', '3D Echocardiography', 'M-Mode Echocardiography', 'Doppler Echocardiography', 'Tissue Doppler Imaging (TDI)', 'Speckle Tracking / Strain Imaging', 'Contrast Echocardiography', 'Stress Echocardiography (Dobutamine / Exercise)', 'Valvular Heart Disease Evaluation', 'Echo Report (Interpretation)'] },
    { name: 'Doppler / Color Doppler', desc: 'Ultrasound imaging with Doppler technique to evaluate blood flow and vascular conditions', tests: ['Carotid Doppler', 'Lower Limb Venous Doppler', 'Lower Limb Arterial Doppler', 'Renal Doppler', 'Obstetric Doppler', 'Cardiac Doppler', 'Transcranial Doppler (TCD)', 'Mesenteric Doppler', 'Thyroid Doppler', 'Doppler Report (Interpretation)'] },
    { name: 'Transesophageal Echo (TEE)', desc: 'Advanced ultrasound of the heart using an esophageal probe for detailed imaging', tests: ['TEE \u2013 Complete Study', 'TEE \u2013 Mitral Valve Assessment', 'TEE \u2013 Aortic Valve Assessment', 'TEE \u2013 Tricuspid Valve Assessment', 'TEE \u2013 ASD / PFO Assessment', 'TEE \u2013 Aorta Assessment', 'TEE \u2013 Thrombus Detection', 'TEE \u2013 Prosthetic Valve Evaluation', 'TEE \u2013 Endocarditis Evaluation', 'TEE Report (Interpretation)'] },
    { name: 'Fetal Echocardiography', desc: 'Ultrasound evaluation of the fetal heart to detect structural and functional cardiac abnormalities', tests: ['Fetal Echo \u2013 Complete Study', 'Fetal Echo \u2013 4 Chamber View', 'Fetal Echo \u2013 Outflow Tract View', 'Fetal Echo \u2013 3 Vessel View', 'Fetal Echo \u2013 3 Vessel Trachea View', 'Fetal Echo \u2013 Doppler Assessment', 'Fetal Echo \u2013 Congenital Heart Disease Screening', 'Fetal Cardiac Functional Assessment', 'Fetal Echo Follow-up Study', 'Fetal Echo Report (Interpretation)'] },
    { name: 'Others \u2013 Cardiac Tests', desc: 'Other specialized cardiac tests for comprehensive heart health evaluation', tests: ['Event Monitor', 'Implantable Loop Recorder (ILR)', 'Tilt Table Test', 'Electrophysiology Study (EPS)', 'Cardiac Stress Echocardiography', 'Myocardial Perfusion Scan (Nuclear)', 'Cardiac Biomarker Test', '6 Minute Walk Test', 'Pulse Oximetry', 'Ankle Brachial Index (ABI)', 'Central Venous Pressure (CVP) Monitoring', 'Cardiac Report (Interpretation)'] },
  ],
  endoscopy: [
    { name: 'Upper GI Endoscopy (OGD)', desc: 'Endoscopic examination of the upper gastrointestinal tract including esophagus, stomach and duodenum', tests: ['Diagnostic OGD', 'EGD for GERD', 'Peptic Ulcer Evaluation', 'H. Pylori Detection', 'Biopsy (Upper GI)', 'Polyp Detection & Removal', 'GI Bleed Evaluation', 'Surveillance Endoscopy', 'Dilation Procedure', 'OGD Report (Interpretation)'] },
    { name: 'Colonoscopy', desc: 'Endoscopic examination of the colon (large intestine) and rectum to diagnose and treat various conditions', tests: ['Diagnostic Colonoscopy', 'Polyp Detection & Removal (Polypectomy)', 'Biopsy (Colonic)', 'GI Bleed Evaluation', 'Colitis / IBD Evaluation', 'Diverticulosis Evaluation', 'Hemostasis / Bleed Control', 'Stricture Dilation', 'Surveillance Colonoscopy', 'Colonoscopy Report (Interpretation)'] },
    { name: 'Sigmoidoscopy', desc: 'Endoscopic examination of the rectum and sigmoid colon to diagnose and manage lower bowel conditions', tests: ['Diagnostic Sigmoidoscopy', 'Polyp Detection & Removal', 'Bleeding Evaluation', 'Inflammation Assessment', 'Biopsy (Recto-Sigmoid)', 'Fecal Impaction Evaluation', 'Stricture / Obstruction Evaluation', 'Surveillance Sigmoidoscopy', 'Therapeutic Interventions', 'Sigmoidoscopy Report (Interpretation)'] },
    { name: 'ERCP', desc: 'Endoscopic Retrograde Cholangiopancreatography \u2013 diagnosis and treatment of bile duct, pancreatic duct and related conditions', tests: ['Diagnostic ERCP', 'Stone Extraction', 'Stent Placement', 'Dilation (Stricture)', 'Biopsy / Brush Cytology', 'Sphincterotomy', 'Leak / Bile Leak Management', 'Pancreatic Duct Evaluation', 'Post-Cholecystectomy Evaluation', 'ERCP Report (Interpretation)'] },
    { name: 'Capsule Endoscopy', desc: 'Non-invasive endoscopic procedure using a swallowable capsule with camera to visualize the small intestine and detect abnormalities', tests: ['Diagnostic Capsule Endoscopy', 'Small Bowel Bleeding Evaluation', 'Crohn\u2019s Disease Assessment', 'Small Bowel Tumor Detection', 'Celiac Disease Evaluation', 'Transit Time Assessment', 'Retained Capsule Evaluation', 'Pre-Procedure Assessment', 'Image Review & Analysis', 'Capsule Endoscopy Report (Interpretation)'] },
    { name: 'Bronchoscopy', desc: 'Endoscopic examination of the airways and lungs to diagnose and manage respiratory conditions', tests: ['Diagnostic Bronchoscopy', 'Biopsy / Brush Cytology', 'Bronchoalveolar Lavage (BAL)', 'Endobronchial Ultrasound (EBUS)', 'Foreign Body Removal', 'Therapeutic Bronchoscopy', 'Airway Stent Placement', 'Image Review & Documentation', 'Bronchoscopy Report (Interpretation)'] },
    { name: 'Cystoscopy', desc: 'Endoscopic examination of the urinary bladder and urethra to diagnose and treat urological conditions', tests: ['Diagnostic Cystoscopy', 'Bladder Tumor Evaluation', 'Bladder Stone Removal', 'Urethral Stricture Evaluation', 'Biopsy (Bladder / Urethra)', 'Therapeutic Cystoscopy', 'Urethral Dilation', 'Image Review & Documentation', 'Post-Procedure Evaluation', 'Cystoscopy Report (Interpretation)'] },
    { name: 'Laparoscopy', desc: 'Minimally invasive surgical procedure using a camera and small instruments to diagnose and treat conditions in the abdomen and pelvis', tests: ['Diagnostic Laparoscopy', 'Gynecological Laparoscopy', 'Cholecystectomy', 'Appendectomy', 'Hernia Repair', 'Bowel Resection', 'Splenectomy', 'Nephrectomy', 'Adhesiolysis', 'Laparoscopy Report (Interpretation)'] },
    { name: 'ENT Endoscopy', desc: 'Endoscopic examination of the ear, nose, throat, and related structures to diagnose and treat ENT conditions', tests: ['Nasal Endoscopy', 'Laryngeal Endoscopy', 'Otoscopy', 'Pharyngoscopy', 'Sinus Endoscopy', 'Foreign Body Removal', 'Biopsy', 'Balloon Sinuplasty', 'Therapeutic Endoscopy', 'ENT Endoscopy Report (Interpretation)'] },
    { name: 'Others \u2013 Endoscopy', desc: 'Other specialized endoscopic procedures used for diagnostic or therapeutic purposes', tests: ['Enteroscopy', 'EUS (Endoscopic Ultrasound)', 'Double Balloon Enteroscopy', 'Narrow Band Imaging (NBI)', 'Endoscopic Mucosal Resection (EMR)', 'Endoscopic Submucosal Dissection (ESD)', 'Peroral Endoscopic Myotomy (POEM)', 'Endoscopic Retrograde Appendicitis (E.R.A.)', 'Endoscopic Stent Placement', 'Others \u2013 Endoscopy Procedures'] },
  ],
  genetic: [
    { name: 'Carrier Screening', desc: 'Genetic testing to identify if an individual carries gene mutations that may be passed on to their children', tests: ['Thalassemia Carrier Screening', 'Cystic Fibrosis (CF) Carrier Screening', 'Spinal Muscular Atrophy (SMA) Carrier Screening', 'Hemoglobinopathy Carrier Screening', 'Fragile X Syndrome Carrier Screening', 'Duchenne Muscular Dystrophy (DMD) Carrier Screening', 'Family Planning Carrier Panel', 'Expanded Carrier Screening (ECS)', 'Consanguinity Carrier Screening', 'Carrier Screening Report (Interpretation)'] },
    { name: 'Pharmacogenomics', desc: 'Genetic testing to understand how your genes affect your response to medications and help personalize drug therapy for better safety and effectiveness', tests: ['Medication Response Screening', 'Psychiatric Medication Response', 'Pain Management Genetics', 'Cardiovascular Drug Response', 'Clopidogrel (Plavix\u00ae) Response', 'Warfarin Sensitivity Test', 'Oncology Drug Response', 'Multiple Drug Pathway Panel', 'Adverse Drug Reaction Risk', 'Pharmacogenomics Report (Interpretation)'] },
    { name: 'Oncology / Cancer Genetics', desc: 'Genetic testing to identify inherited cancer risk, guide treatment decisions, and monitor cancer progression', tests: ['Hereditary Cancer Panel', 'BRCA1 / BRCA2 Testing', 'Tumor Genetic Profiling', 'Targeted Therapy Guidance', 'Immunotherapy Biomarker Testing', 'Risk Assessment & Counseling', 'Minimal Residual Disease (MRD) Testing', 'Pharmacogenomic Oncology Panel', 'Liquid Biopsy (ctDNA Analysis)', 'Oncology Genetics Report (Interpretation)'] },
    { name: 'Prenatal & Reproductive Genetics', desc: 'Genetic testing for a healthy pregnancy, fertility assessment, and inherited reproductive conditions', tests: ['NIPT (Non-Invasive Prenatal Testing)', 'First Trimester Screening', 'NT Scan + PAPP-A Assessment', 'Amniocentesis (Fetal Karyotype)', 'CVS (Chorionic Villus Sampling)', 'Preimplantation Genetic Testing (PGT-A / PGT-M)', 'Semen DNA Fragmentation Test', 'Recurrent Pregnancy Loss (RPL) Panel', 'Thalassemia & Hemoglobinopathy Screening (Couple Study)', 'Karyotype Analysis (Couple)'] },
    { name: 'Cardiovascular Genetics', desc: 'Genetic testing to assess inherited risk for heart disease, arrhythmias, and lipid disorders for early prevention and personalized care', tests: ['Hereditary Cardiac Disease Panel', 'Arrhythmia & Channelopathy Panel', 'Sudden Cardiac Death Risk Panel', 'Familial Hypercholesterolemia Panel', 'Lipoprotein(a) Risk Assessment', 'Atherosclerosis Genetic Risk Panel', 'Antiplatelet Therapy Genetic Panel', 'Hypertension Genetic Panel', 'Thrombophilia Genetic Panel', 'Cardiovascular Genetics Report (Interpretation)'] },
    { name: 'Neurology Genetics', desc: 'Genetic testing to identify inherited neurological disorders, guide diagnosis, and inform management and family planning', tests: ['Epilepsy Genetic Panel', 'Neuromuscular Disorders Panel', 'Hereditary Spastic Paraplegia Panel', 'Ataxia & Cerebellar Disorders Panel', 'Alzheimer\u2019s Disease Genetic Risk Panel', 'Parkinson\u2019s Disease Genetic Panel', 'Mitochondrial Disorder Panel', 'Leukodystrophy Genetic Panel', 'Fragile X Syndrome Testing', 'Neurology Genetics Report (Interpretation)'] },
    { name: 'Metabolic Genetics', desc: 'Genetic testing to detect inborn errors of metabolism and related disorders for early diagnosis and management', tests: ['Newborn Screening (Extended NBS)', 'Phenylketonuria (PKU) Genetic Testing', 'Maple Syrup Urine Disease (MSUD) Panel', 'Organic Acidemia Panel', 'Urea Cycle Disorder Panel', 'Lysosomal Storage Disorders Panel', 'Mitochondrial Disorders Genetic Panel', 'Galactosemia Genetic Testing', 'Peroxisomal Disorder Panel', 'Metabolic Genetics Report (Interpretation)'] },
    { name: 'Infectious Disease Genetics', desc: 'Genetic testing to identify inherited susceptibility, treatment response, and complications related to infectious diseases', tests: ['HIV Drug Resistance Genotyping', 'Hepatitis B Virus (HBV) Genotyping', 'Hepatitis C Virus (HCV) Genotyping', 'Tuberculosis (TB) Genetic Susceptibility', 'Leprosy (Hansen\u2019s Disease) Genetic Panel', 'Malaria (Plasmodium) Genetic Susceptibility', 'Cryptococcosis Susceptibility Panel', 'COVID-19 Genetic Susceptibility Panel', 'Pharmacogenetics for Anti-infective Drugs', 'Infectious Disease Genetics Report (Interpretation)'] },
    { name: 'Nutrigenomics', desc: 'Genetic testing to understand how your genes influence nutrition, diet response, and risk of lifestyle-related conditions', tests: ['Nutrient Response Genetic Panel', 'Weight Management Genetic Panel', 'Carbohydrate Sensitivity Panel', 'Fat Metabolism Genetic Panel', 'Protein Metabolism Genetic Panel', 'Detoxification & Antioxidant Genetic Panel', 'Lactose Intolerance Genetic Test', 'Celiac Disease Genetic Risk Panel', 'Taste & Flavor Perception Genetic Panel', 'Nutrigenomics Report (Interpretation)'] },
    { name: 'Wellness & Ancestry Genetics', desc: 'Genetic insights for your well-being, lifestyle, traits, and ancestry', tests: ['Health Risk Assessment', 'Nutrigenomics Profile', 'Fitness & Performance Genetic Test', 'Skin & Hair Genetic Test', 'Sleep & Stress Genetic Test', 'Vitamin & Mineral Predisposition', 'Detoxification & Toxicity Genetic Test', 'Longevity & Healthy Aging Test', 'Ancestry & Ethnicity Analysis', 'Trait & Personality Genetic Test'] },
    { name: 'Others \u2013 Genetic Test', desc: 'Specialized genetic tests for rare conditions, advanced diagnostics, and research', tests: ['Whole Exome Sequencing (WES)', 'Whole Genome Sequencing (WGS)', 'Mitochondrial DNA Analysis', 'Chromosomal Microarray (CMA)', 'FISH (Test)', 'Newborn Genetic Screening', 'Research Genetic Panels', 'PhD / Academic Genetic Testing', 'Plant & Animal Genetic Testing', 'Other Specialized Genetic Tests'] },
  ],
  checkup: [
    { name: 'General Health Checkup', desc: 'Comprehensive health checkup packages to evaluate your overall health and detect potential health issues early', tests: ['Basic Health Checkup', 'Comprehensive Health Checkup', 'Executive Health Checkup', 'Full Body Checkup', 'Annual Health Checkup', 'Preventive Health Checkup', 'Wellness Checkup', 'Advanced Health Screening', 'Lifestyle Checkup', 'Pre-Disease Screening', 'Personalized Health Checkup', 'Others \u2013 General Health Checkup'] },
    { name: 'Cardiac Health Checkup', desc: 'Specialized checkup packages to assess heart health, detect cardiovascular risks, and support early diagnosis', tests: ['Basic Cardiac Checkup', 'Advanced Cardiac Checkup', 'Coronary Artery Disease Screening', 'Blood Pressure Checkup', 'Cholesterol & Lipid Profile', 'Cardiac Risk Assessment', 'ECG Screening (Checkup)', 'Stress Test (Treadmill Test)', 'Echocardiography Checkup', 'Holter Monitoring (24/48 Hrs)', 'Arrhythmia Evaluation', 'Others \u2013 Cardiac Checkup'] },
    { name: 'Diabetic Checkup', desc: 'Comprehensive tests and evaluations to monitor blood sugar levels, assess risk factors, and detect diabetes-related complications early', tests: ['Blood Sugar (Fasting & PP)', 'HbA1c Test', 'Oral Glucose Tolerance Test (OGTT)', 'Lipid Profile', 'Kidney Function Test', 'Diabetic Retinopathy Screening', 'Neuropathy Screening', 'Foot Examination', 'Urine Microalbumin Test', 'Blood Pressure Monitoring', 'BMI & Body Composition', 'Others \u2013 Diabetic Checkup'] },
    { name: "Women\u2019s Health Checkup", desc: 'Specialized health checkup packages designed for women at every stage of life to support hormonal balance, reproductive health, and overall well-being', tests: ["Basic Women\u2019s Health Checkup", 'Hormonal Profile Checkup', 'PCOS / PCOD Screening', 'Thyroid Profile for Women', 'Iron Deficiency Screening', 'Vitamin D & B12 Checkup', 'Reproductive Health Checkup', 'Pap Smear Test', 'Menstrual Health Assessment', 'Bone Density Test (BMD)', 'Breast Health Screening', "Others \u2013 Women\u2019s Health Checkup"] },
    { name: "Men\u2019s Health Checkup", desc: 'Comprehensive health checks tailored for men to assess overall well-being, hormonal balance, and detect potential health issues early', tests: ["Basic Men\u2019s Health Checkup", 'Hormone Profile (Testosterone)', 'Prostate Health Screening (PSA)', 'Semen Analysis', 'Muscle & Fitness Assessment', 'Heart Health Checkup', 'Metabolic Health Assessment', 'Hair & Scalp Analysis', 'Bone Health Checkup', 'Vitamin & Mineral Profile', 'Liver Function Test', "Others \u2013 Men\u2019s Health Checkup"] },
    { name: 'Thyroid Checkup', desc: 'Comprehensive thyroid testing to assess thyroid function, detect imbalances, and identify potential thyroid disorders early', tests: ['Thyroid Profile (T3, T4, TSH)', 'Free T3, Free T4, TSH', 'Thyroid Antibody Panel (TPO, TgAb)', 'Reverse T3 (rT3)', 'Total T3', 'Total T4', 'Free T3', 'Free T4', 'Thyroid Ultrasound (USG)', 'Thyroglobulin Test', 'Iodine Level (Serum/Urine)', 'Others \u2013 Thyroid Checkup'] },
    { name: 'Liver Health Checkup', desc: 'Comprehensive liver function tests and assessments to evaluate liver health, detect diseases early, and monitor liver related conditions', tests: ['Liver Function Test (LFT)', 'SGOT (AST)', 'SGPT (ALT)', 'Alkaline Phosphatase (ALP)', 'Gamma GT (GGT)', 'Bilirubin (Total & Direct)', 'Total Protein & Albumin', 'A/G Ratio', 'Prothrombin Time (PT)', 'Hepatitis B Screening (HBsAg)', 'Hepatitis C Screening (Anti-HCV)', 'Others \u2013 Liver Checkup'] },
    { name: 'Kidney Health Checkup', desc: 'Comprehensive kidney function tests to assess kidney health, detect early kidney disease, and monitor fluid, electrolyte, and waste balance', tests: ['Kidney Function Test (KFT)', 'Serum Creatinine', 'Blood Urea Nitrogen (BUN)', 'eGFR (Estimated Glomerular Filtration Rate)', 'Urine Routine Examination', 'Urine Albumin Creatinine Ratio (ACR)', 'Serum Uric Acid', 'Electrolyte Profile (Na, K, Cl, HCO3)', 'Serum Phosphorus', 'Serum Calcium', 'Kidney Ultrasound (USG)', 'Others \u2013 Kidney Checkup'] },
    { name: 'Bone & Joint Checkup', desc: 'Comprehensive tests and assessments to evaluate bone strength, joint health, inflammation, and detect early signs of bone or joint disorders', tests: ['Bone Density Test (BMD)', 'Calcium Test', 'Vitamin D Test', 'Rheumatoid Factor (RF)', 'Uric Acid Test', 'CRP (C-Reactive Protein)', 'ESR (Erythrocyte Sedimentation Rate)', 'Alkaline Phosphatase (ALP)', 'Joint X-Ray', 'Arthritis Profile (ANA, RF, CCP)', 'Vitamin B12 Test', 'Others \u2013 Bone & Joint Checkup'] },
    { name: 'Senior Citizen Checkup', desc: 'Specialized health assessments for seniors to monitor age-related conditions, maintain wellness, and improve quality of life', tests: ['Comprehensive Geriatric Assessment', 'Cardiac Health Screening', 'Diabetes & Metabolic Screening', 'Bone Health Assessment', 'Cognitive Health Evaluation', 'Respiratory Health Checkup', 'Muscle & Mobility Assessment', 'Eye Health Screening', 'Hearing Evaluation', 'Digestive Health Checkup', 'Kidney Health Monitoring', 'Others \u2013 Senior Citizen Checkup'] },
    { name: 'Child Health Checkup', desc: 'Comprehensive health evaluations for children to monitor growth, development, nutrition, and detect early health issues', tests: ['Growth & Development Assessment', 'Nutrition Assessment', 'Complete Blood Count (CBC)', 'Iron Profile', 'Vitamin D Test', 'Calcium Test', 'Lead Level Test', 'Thyroid Function Test (TSH)', 'Vision Screening', 'Hearing Screening', 'Immunization Status Check', 'Others \u2013 Child Health Checkup'] },
    { name: 'Pre-Employment Checkup', desc: 'Essential health screenings for employees to ensure fitness for work, safety, and overall workplace well-being', tests: ['Medical History Assessment', 'Physical Examination', 'Complete Blood Count (CBC)', 'Blood Sugar (FBS/PPBS)', 'Urine Routine Examination', 'Liver Function Test (LFT)', 'Kidney Function Test (KFT)', 'Chest X-Ray', 'ECG Screening', 'Hearing Test', 'Vision Test', 'Others \u2013 Pre-Employment Checkup'] },
    { name: 'Others \u2013 Health Checkup', desc: 'Specialized and advanced health screening packages for comprehensive wellness and preventive care', tests: ['Full Body Checkup (Advanced)', 'Executive Health Checkup', 'Wellness Checkup', 'Aarogya Checkup (Preventive)', 'Basic Health Screening', 'Master Health Checkup', 'Women Wellness Checkup', 'Men Wellness Checkup', 'Heart Health Checkup', 'Respiratory Health Checkup', 'Digestive Health Checkup', 'Others \u2013 Specialized Checkups'] },
  ],
};

const SUB_ICON_MAP: Record<string, Record<string, React.ComponentType<any>>> = {
  urine: {
    'Routine & Microscopic': UrineSample,
    'Chemical Examination': BiochemistryLaboratory,
    '24 Hour Urine Tests': Nephrology,
    'Microalbumin Tests': Kidneys,
    'Urine Culture & Sensitivity': Bacteria,
    'Hormones in Urine': Endocrinology,
    'Drug & Toxicology Screen': LabSearch,
    'Stone Risk Profile': Urology,
    'Specialized / Advanced Tests': MicroscopeWithSpecimen,
    'Pediatric Urine Tests': Pediatrics,
  },
  mri: {
    'Brain': Neurology,
    'Spine': Orthopaedics,
    'Musculoskeletal': Orthopaedics,
    'Abdomen': Gastroenterology,
    'Pelvis': Gynecology,
    'Cardiac': HeartCardiogram,
    'Breast': Oncology,
    'Vascular': Cardiology,
    'Neck': EarsNoseAndThroat,
    'Other MRI': MoreHorizontal,
  },
  ct: {
    'Head & Brain CT': Neurology,
    'Neck CT': EarsNoseAndThroat,
    'Chest CT': Lungs,
    'Abdomen CT': Gastroenterology,
    'Pelvis CT': Gynecology,
    'Spine CT': Orthopaedics,
    'Musculoskeletal CT': Orthopaedics,
    'CT Angiography (CTA)': Cardiology,
    'Cardiac CT': HeartCardiogram,
    'Whole Body CT': Radiology,
    'Pediatric CT': Pediatrics,
    'Others \u2013 CT Scan': MoreHorizontal,
  },
  ecg: {
    'Basic ECG': HeartCardiogram,
    'Advanced ECG': HeartCardiogram,
    'Holter Monitoring': Cardiology,
    'Stress / Exercise Test': Heart,
    'Ambulatory BP Monitoring': Stethoscope,
    'Echocardiography (Echo)': Sonography,
    'Doppler / Color Doppler': Cardiology,
    'Transesophageal Echo (TEE)': Cardiology,
    'Fetal Echocardiography': Gynecology,
    'Others \u2013 Cardiac Tests': MoreHorizontal,
  },
  genetic: {
    'Carrier Screening': Dna,
    'Pharmacogenomics': BiochemistryLaboratory,
    'Oncology / Cancer Genetics': Oncology,
    'Prenatal & Reproductive Genetics': Gynecology,
    'Cardiovascular Genetics': HeartCardiogram,
    'Neurology Genetics': Neurology,
    'Metabolic Genetics': BiochemistryLaboratory,
    'Infectious Disease Genetics': Virus,
    'Nutrigenomics': Nutrition,
    'Wellness & Ancestry Genetics': Dna,
    'Others \u2013 Genetic Test': MoreHorizontal,
  },
  checkup: {
    'General Health Checkup': Stethoscope,
    'Cardiac Health Checkup': HeartCardiogram,
    'Diabetic Checkup': DiabetesMeasure,
    'Women\u0027s Health Checkup': Gynecology,
    'Men\u0027s Health Checkup': Urology,
    'Thyroid Checkup': Thyroid,
    'Liver Health Checkup': Hepatology,
    'Kidney Health Checkup': Nephrology,
    'Bone & Joint Checkup': Orthopaedics,
    'Senior Citizen Checkup': Stethoscope,
    'Child Health Checkup': Pediatrics,
    'Pre-Employment Checkup': LabSearch,
    'Others \u2013 Health Checkup': MoreHorizontal,
  },
};

function makeCategorySubcategories(catId: string): SubCategoryItem[] {
  const catObj = MAIN_CATEGORIES.find((category) => category.id === catId) || MAIN_CATEGORIES[0];
  const blueprints = CATEGORY_BLUEPRINTS[catId] || [];
  const categoryIconMap = SUB_ICON_MAP[catId] || {};
  // Reference groups occasionally use either “Other …” or “Others”. Keep the
  // first definition only, so a category can never display duplicate catch-alls.
  const uniqueBlueprints = blueprints.filter(
    (blueprint, index) => blueprints.findIndex((candidate) => candidate.name.toLowerCase() === blueprint.name.toLowerCase()) === index,
  );
  const subcategories = [
    ...uniqueBlueprints.map((blueprint) => {
      const subIcon = categoryIconMap[blueprint.name] || catObj.icon;
      return {
        ...blueprint,
        iconBg: catObj.iconBg,
        iconColor: catObj.iconColor,
        badgeIcon: subIcon,
        menuIcon: subIcon,
        tests: blueprint.tests.map((title) => ({ title, desc: `${title} diagnostic report`, badgeText: title.split(/\s|\(/)[0].slice(0, 8).toUpperCase(), tags: [catObj.name, blueprint.name, title] })),
      };
    }),
  ];
  if (!uniqueBlueprints.some((blueprint) => /^other\b/i.test(blueprint.name))) {
    subcategories.push({
      name: 'Others', desc: `Unlisted ${catObj.name} diagnostic reports and custom patient files`,
      iconBg: 'bg-slate-100 dark:bg-slate-800', iconColor: 'text-slate-600 dark:text-slate-300', badgeIcon: MoreHorizontal, menuIcon: MoreHorizontal,
      tests: [{ title: `Custom / Other ${catObj.name} Report`, desc: `General unclassified ${catObj.name} investigation summary`, badgeText: 'OTHER', tags: [catObj.name, 'Custom', 'Other'] }],
    });
  }
  return subcategories;
}

function getCategorySubData(catId: string): SubCategoryItem[] {
  if (catId === 'blood') return BLOOD_TEST_SUBCATEGORIES;
  if (catId === 'pathology') return PATHOLOGY_SUBCATEGORIES;
  if (catId === 'stool') return STOOL_TEST_SUBCATEGORIES;
  if (catId === 'endoscopy') return ENDOSCOPY_SUBCATEGORIES;
  if (catId === 'xray') return XRAY_SUBCATEGORIES;
  if (catId === 'usg') return USG_SUBCATEGORIES;

  return makeCategorySubcategories(catId);
}

export { getCategorySubData };

interface SelectReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (selection: ReportSelection) => void;
}

export default function SelectReportModal({ isOpen, onClose, onSelect }: SelectReportModalProps) {
  const [selectedMainCat, setSelectedMainCat] = useState<string>('blood');
  const [selectedSubCatIndex, setSelectedSubCatIndex] = useState<number>(0);
  const [selectedTestTitle, setSelectedTestTitle] = useState<string>('Complete Blood Count (CBC)');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [customCategory, setCustomCategory] = useState<string>('');
  const [customSubCategory, setCustomSubCategory] = useState<string>('');
  const [customTestTitle, setCustomTestTitle] = useState<string>('');

  useEffect(() => {
    if (!isOpen) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentMainCatObj = MAIN_CATEGORIES.find((c) => c.id === selectedMainCat) || MAIN_CATEGORIES[0];
  const subCategoriesList = getCategorySubData(selectedMainCat);
  const activeSubCat = subCategoriesList[selectedSubCatIndex] || subCategoriesList[0];

  const filteredTests = activeSubCat.tests.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleConfirmSelect = (testItem?: { title: string; tags: string[] }) => {
    const defaultTest = testItem || activeSubCat.tests.find((t) => t.title === selectedTestTitle) || activeSubCat.tests[0];

    const finalMainCategory = customCategory.trim()
      ? customCategory.trim()
      : (selectedMainCat === 'others' ? 'Others' : currentMainCatObj.name);

    const finalSubCategoryName = customSubCategory.trim()
      ? customSubCategory.trim()
      : activeSubCat.name;

    const finalTestTitle = customTestTitle.trim()
      ? customTestTitle.trim()
      : (defaultTest?.title || selectedTestTitle || 'Custom Report');

    onSelect({
      mainCategory: finalMainCategory,
      subCategory: `${finalSubCategoryName} - ${finalTestTitle}`,
      testItem: finalTestTitle,
      tags: defaultTest?.tags || [finalMainCategory, finalSubCategoryName, finalTestTitle, 'Custom'],
    });
    onClose();
  };

  const HeaderIcon = activeSubCat.badgeIcon || MoreHorizontal;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex flex-col justify-end sm:justify-center items-center p-2 sm:p-5 overflow-y-auto overscroll-contain">
      <div className="bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl max-w-[96vw] xl:max-w-[1440px] w-full h-[92vh] max-h-[95vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header bar matching "Add Report" reference UI */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-6 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2]" />
            </button>
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#0B132B] dark:text-white font-sans">
                Add Report
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Select the type of report you want to upload
              </p>
            </div>
          </div>

          {/* Search box on right */}
          <div className="relative hidden md:flex items-center w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none stroke-[2]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subcategory..."
              className="w-full pl-9 pr-4 h-9 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all font-sans leading-none"
            />
          </div>
        </div>

        {/* Non-scrolling Flex Content Body */}
        <div className="flex-1 flex flex-col min-h-0 p-4 sm:p-5 space-y-4 overflow-hidden">
          
          {/* STEP 1: Choose Main Category Horizontal Row matching UI reference */}
          <div className="space-y-2.5 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#0B132B] text-white text-[11px] font-bold flex items-center justify-center">1</span>
              <h3 className="text-xs font-bold text-[#0B132B] dark:text-slate-100 tracking-wide uppercase">
                Choose Main Category
              </h3>
            </div>

            {/* One continuous, horizontally scrollable category rail. */}
            <div className="w-full max-w-full overflow-x-auto overscroll-x-contain scroll-smooth snap-x snap-mandatory px-2 py-1 pb-3">
              <div className="flex min-w-max gap-3">
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
                    className={`relative flex h-[112px] w-[140px] shrink-0 snap-start flex-col items-center justify-center py-3 px-2 rounded-xl border transition-all duration-200 select-none ${
                      isActive
                        ? `${cat.iconBg} ${cat.textColor} border-current ring-2 ring-current/20 shadow-xs font-bold scale-[1.02]`
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 hover:bg-slate-50/80 font-medium'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-1.5 transition-colors ${
                      isActive ? 'bg-white dark:bg-slate-800 shadow-2xs ' + cat.iconColor : cat.color
                    }`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="w-full text-center text-[10px] font-bold leading-tight whitespace-normal break-words">
                      {cat.name}
                    </span>
                  </button>
                );
              })}
              </div>
            </div>
          </div>

          {/* STEP 2: Choose Subcategory & Grid matching UI reference */}
          <div className="flex-1 min-h-0 flex flex-col space-y-3 pt-2 border-t border-slate-200/80 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#0B132B] text-white text-[11px] font-bold flex items-center justify-center">2</span>
                <h3 className="text-xs font-bold text-[#0B132B] dark:text-slate-100 tracking-wide uppercase">
                  Choose Subcategory – <span className={currentMainCatObj.textColor}>{currentMainCatObj.name}</span>
                </h3>
              </div>

              {/* Search box on mobile */}
              <div className="relative md:hidden flex items-center w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none stroke-[2]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search subcategory..."
                  className="w-full pl-9 pr-4 h-9 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all font-sans leading-none"
                />
              </div>
            </div>

            {/* Split layout: Subcategory Menu (Left) + Subcategory Test Cards (Right) */}
            <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-4 pt-1">
              
              {/* Left Subcategory Vertical List with individual colorful icons */}
              <div className="md:col-span-3 lg:col-span-3 xl:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-1.5 space-y-0.5 shadow-2xs h-full max-h-[160px] md:max-h-none overflow-y-auto overscroll-contain">
                {subCategoriesList.map((sub, idx) => {
                  const isActive = selectedSubCatIndex === idx;
                  const MenuIcon = sub.menuIcon || MoreHorizontal;
                  return (
                    <button
                      key={`${selectedMainCat}-${sub.name}-${idx}`}
                      onClick={() => {
                        setSelectedSubCatIndex(idx);
                        if (sub.tests.length > 0) setSelectedTestTitle(sub.tests[0].title);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-[11px] font-semibold flex items-center justify-between transition-all ${
                        isActive
                          ? `${sub.iconBg} ${sub.iconColor} font-bold shadow-2xs border border-current/20`
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="truncate flex items-center gap-2">
                        <MenuIcon className={`w-5 h-5 shrink-0 ${sub.iconColor}`} />
                        {sub.name}
                      </span>
                      <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${isActive ? `${sub.iconColor} translate-x-0.5` : 'text-slate-400'}`} />
                    </button>
                  );
                })}
              </div>

              {/* Right Cards Area */}
              <div className="md:col-span-9 lg:col-span-9 xl:col-span-10 space-y-3 h-full overflow-y-auto overscroll-contain pr-1">
                
                {/* Active Subcategory Banner Card */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3 shadow-2xs flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${activeSubCat.iconBg} ${activeSubCat.iconColor} border border-slate-200/80 dark:border-slate-800 flex items-center justify-center shrink-0 shadow-2xs`}>
                    <HeaderIcon className="w-5 h-5 stroke-[2] stroke-current fill-none" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0B132B] dark:text-white font-sans">
                      {activeSubCat.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                      {activeSubCat.desc}
                    </p>
                  </div>
                </div>

                {/* Test Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {filteredTests.map((test) => {
                    const isSelected = selectedTestTitle === test.title;
                    return (
                      <div
                        key={test.title}
                        onClick={() => setSelectedTestTitle(test.title)}
                        className={`bg-white dark:bg-slate-900 border rounded-xl p-3 cursor-pointer transition-all flex flex-col items-center justify-center text-center space-y-2 min-h-[140px] relative group hover:shadow-md ${
                          isSelected
                            ? `border-current ring-2 ring-current/20 ${activeSubCat.iconBg} ${activeSubCat.iconColor}`
                            : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                        }`}
                      >
                        {/* Custom SVG Test Badge graphic matching reference UI */}
                        <TestBadgeIcon
                          title={test.title}
                          badgeText={test.badgeText}
                          iconBg={activeSubCat.iconBg}
                          iconColor={activeSubCat.iconColor}
                          fallbackIcon={activeSubCat.badgeIcon}
                        />

                        <div className="text-center space-y-0.5 w-full">
                          <h5 className="text-[11px] font-bold text-[#0B132B] dark:text-white leading-snug">
                            {test.title}
                          </h5>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 line-clamp-2 font-medium leading-tight">
                            {test.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Custom Category & Subcategory Input Section for 'Others' */}
                {(selectedMainCat === 'others' ||
                  activeSubCat.name.toLowerCase().includes('other') ||
                  selectedTestTitle.toLowerCase().includes('other') ||
                  selectedTestTitle.toLowerCase().includes('custom')) && (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-3 mt-3">
                    <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold">
                        <MoreHorizontal className="w-4 h-4 stroke-[2]" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#0B132B] dark:text-white font-sans">
                          Specify Custom Category & Subcategory Report Details
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                          Type your custom category, subcategory, and specific test name below
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                          Custom Category
                        </label>
                        <input
                          type="text"
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                          placeholder={selectedMainCat === 'others' ? 'e.g. Dentistry, Ophthalmology' : currentMainCatObj.name}
                          className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:bg-white dark:focus:bg-slate-900 transition-all font-sans"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                          Custom Subcategory
                        </label>
                        <input
                          type="text"
                          value={customSubCategory}
                          onChange={(e) => setCustomSubCategory(e.target.value)}
                          placeholder={`e.g. ${activeSubCat.name}`}
                          className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:bg-white dark:focus:bg-slate-900 transition-all font-sans"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                          Specific Test / Report Title
                        </label>
                        <input
                          type="text"
                          value={customTestTitle}
                          onChange={(e) => setCustomTestTitle(e.target.value)}
                          placeholder="e.g. OCT Retinal Scan, Dental OPG"
                          className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:bg-white dark:focus:bg-slate-900 transition-all font-sans"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer Bar with Next button matching reference */}
        <div className="bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500 font-medium truncate max-w-md">
            Selected: <span className="font-bold text-[#0B132B] dark:text-white">
              {customCategory.trim() || (selectedMainCat === 'others' ? 'Others' : currentMainCatObj.name)} → {customSubCategory.trim() || activeSubCat.name} ({customTestTitle.trim() || selectedTestTitle})
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
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

