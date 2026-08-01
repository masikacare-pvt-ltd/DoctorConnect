import React, { useState, useEffect } from 'react';
import {
  Droplet,
  TestTube,
  Activity,
  Zap,
  Flame,
  Shield,
  Heart,
  CircleDot,
  Layers,
  Sun,
  Crosshair,
  ArrowLeft,
  Search,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';
import { getTestIcon } from './icons/IconRegistry';
import * as CatIcons from './icons/CategoryIcons';
import * as MedicalIcons from './icons/MedicalOrganIcons';

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
  { id: 'blood', name: 'Blood Test', icon: Droplet, color: 'bg-rose-50 text-rose-500 dark:bg-rose-950/50 dark:text-rose-400', iconBg: 'bg-rose-50 dark:bg-rose-950/50', iconColor: 'text-rose-500 dark:text-rose-400', textColor: 'text-rose-600 dark:text-rose-400' },
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
    badgeIcon: Droplet,
    menuIcon: Droplet,
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
    badgeIcon: TestTube,
    menuIcon: TestTube,
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
    badgeIcon: Activity,
    menuIcon: Activity,
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
    badgeIcon: Zap,
    menuIcon: Zap,
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
    badgeIcon: Flame,
    menuIcon: Flame,
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
    badgeIcon: Shield,
    menuIcon: Shield,
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
    badgeIcon: Heart,
    menuIcon: Heart,
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
    badgeIcon: CircleDot,
    menuIcon: CircleDot,
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
    badgeIcon: Layers,
    menuIcon: Layers,
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
    badgeIcon: Sun,
    menuIcon: Sun,
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
    badgeIcon: Crosshair,
    menuIcon: Crosshair,
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
    desc: 'Microscopic examination of individual cells and fluid aspirates',
    iconBg: 'bg-purple-50 dark:bg-purple-950/50',
    iconColor: 'text-purple-600 dark:text-purple-400',
    badgeIcon: MedicalIcons.IconCytologyCell,
    menuIcon: MedicalIcons.IconCytologyCell,
    tests: [
      { title: 'FNAC (Fine Needle Aspiration Cytology)', desc: 'Diagnostic procedure using thin needle to sample cells', badgeText: 'FNAC', tags: ['FNAC', 'Aspiration', 'Cytology'] },
      { title: 'Pap Smear', desc: 'Screening test for cervical cell abnormalities', badgeText: 'PAP', tags: ['Pap Smear', 'Cervical', 'Screening'] },
      { title: 'Fluid Cytology (Pleural / Ascitic)', desc: 'Microscopic cell analysis of body cavity fluids', badgeText: 'FLUID', tags: ['Fluid', 'Pleural', 'Ascitic'] },
      { title: 'Sputum Cytology', desc: 'Examination of sputum cells for respiratory conditions', badgeText: 'SPUT', tags: ['Sputum', 'Respiratory'] },
      { title: 'Urine Cytology', desc: 'Detection of atypical or cancerous cells in urine', badgeText: 'URINE', tags: ['Urine Cytology', 'Urothelial'] }
    ]
  },
  {
    name: 'Histopathology (Biopsy)',
    desc: 'Microscopic analysis of tissue biopsy samples for disease diagnosis',
    iconBg: 'bg-indigo-50 dark:bg-indigo-950/50',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    badgeIcon: MedicalIcons.IconBiopsySlide,
    menuIcon: MedicalIcons.IconBiopsySlide,
    tests: [
      { title: 'Small Tissue Biopsy (Punch / Core)', desc: 'Histopathological evaluation of small tissue specimen', badgeText: 'BIOPSY', tags: ['Biopsy', 'Core', 'Punch'] },
      { title: 'Large Resection Specimen', desc: 'Comprehensive examination of surgically excised organ/tissue', badgeText: 'RESECT', tags: ['Resection', 'Surgical Specimen'] },
      { title: 'Endoscopic Biopsy', desc: 'Biopsy sample collected during endoscopic procedure', badgeText: 'ENDO', tags: ['Endoscopic', 'GI Biopsy'] },
      { title: 'Skin Biopsy', desc: 'Histopathology of skin lesion or rash sample', badgeText: 'SKIN', tags: ['Skin', 'Dermatopathology'] }
    ]
  },
  {
    name: 'Hematopathology',
    desc: 'Pathology of blood, bone marrow, and lymph tissue disorders',
    iconBg: 'bg-rose-50 dark:bg-rose-950/50',
    iconColor: 'text-rose-600 dark:text-rose-400',
    badgeIcon: Droplet,
    menuIcon: Droplet,
    tests: [
      { title: 'Bone Marrow Aspiration & Biopsy', desc: 'Comprehensive evaluation of bone marrow cells and structure', badgeText: 'BMA', tags: ['Bone Marrow', 'Biopsy', 'Leukemia'] },
      { title: 'Lymph Node Biopsy', desc: 'Histopathological examination for lymphoma or metastasis', badgeText: 'LN', tags: ['Lymph Node', 'Lymphoma'] }
    ]
  },
  {
    name: 'Immunohistochemistry (IHC)',
    desc: 'Specialized antibody staining to classify tumors and biomarker expression',
    iconBg: 'bg-pink-50 dark:bg-pink-950/50',
    iconColor: 'text-pink-600 dark:text-pink-400',
    badgeIcon: MedicalIcons.IconAntibodyY,
    menuIcon: MedicalIcons.IconAntibodyY,
    tests: [
      { title: 'ER / PR / HER2 Neu Panel', desc: 'Breast cancer biomarker receptor panel', badgeText: 'IHC3', tags: ['ER', 'PR', 'HER2', 'Breast Panel'] },
      { title: 'Ki-67 Proliferation Index', desc: 'Measures cellular proliferation rate in tumors', badgeText: 'Ki67', tags: ['Ki-67', 'Proliferation'] },
      { title: 'PD-L1 Expression', desc: 'Immunotherapy biomarker response predictor', badgeText: 'PD-L1', tags: ['PD-L1', 'Immunotherapy'] },
      { title: 'Single Marker IHC Staining', desc: 'Targeted single antibody marker evaluation', badgeText: 'IHC1', tags: ['IHC', 'Antibody'] }
    ]
  },
  {
    name: 'Molecular Pathology',
    desc: 'DNA & RNA molecular diagnostics for genetic mutations and targeted therapy',
    iconBg: 'bg-violet-50 dark:bg-violet-950/50',
    iconColor: 'text-violet-600 dark:text-violet-400',
    badgeIcon: MedicalIcons.IconDNAStrand,
    menuIcon: MedicalIcons.IconDNAStrand,
    tests: [
      { title: 'EGFR Mutation Analysis', desc: 'Targeted mutation analysis for lung adenocarcinoma', badgeText: 'EGFR', tags: ['EGFR', 'Lung Cancer'] },
      { title: 'KRAS / NRAS / BRAF Panel', desc: 'Colorectal and melanoma mutation profiling', badgeText: 'RAS', tags: ['KRAS', 'BRAF', 'Mutation'] },
      { title: 'BRCA 1 & 2 Gene Testing', desc: 'Hereditary breast and ovarian cancer risk analysis', badgeText: 'BRCA', tags: ['BRCA1', 'BRCA2', 'Hereditary'] },
      { title: 'FISH (Fluorescence In Situ Hybridization)', desc: 'Chromosomal translocation and gene amplification', badgeText: 'FISH', tags: ['FISH', 'Chromosomal'] }
    ]
  },
  {
    name: 'Flow Cytometry',
    desc: 'Laser-based biophysical analysis of cellular markers for leukemia and lymphoma',
    iconBg: 'bg-cyan-50 dark:bg-cyan-950/50',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    badgeIcon: Zap,
    menuIcon: Zap,
    tests: [
      { title: 'Leukemia / Lymphoma Immunophenotyping', desc: 'Multi-color flow cytometry marker panel', badgeText: 'FLOW', tags: ['Flow Cytometry', 'Leukemia', 'Lymphoma'] },
      { title: 'CD4 / CD8 Count', desc: 'T-cell subset enumeration for immune status', badgeText: 'CD4', tags: ['CD4', 'CD8', 'T-Cell'] }
    ]
  },
  {
    name: 'Special Stains',
    desc: 'Specialized chemical staining for tissue elements and microorganisms',
    iconBg: 'bg-amber-50 dark:bg-amber-950/50',
    iconColor: 'text-amber-600 dark:text-amber-400',
    badgeIcon: MedicalIcons.IconScalpel,
    menuIcon: MedicalIcons.IconScalpel,
    tests: [
      { title: 'PAS (Periodic Acid-Schiff) Stain', desc: 'Detects glycogen, mucins and fungal organisms', badgeText: 'PAS', tags: ['PAS', 'Special Stain', 'Fungal'] },
      { title: 'Ziehl-Neelsen (AFB) Stain', desc: 'Specialized acid-fast stain for mycobacteria', badgeText: 'ZN', tags: ['AFB', 'Ziehl-Neelsen', 'TB'] },
      { title: 'Grocott Silver (GMS) Stain', desc: 'Fungal visualization stain in histology', badgeText: 'GMS', tags: ['GMS', 'Fungi', 'Histology'] }
    ]
  },
  {
    name: 'Frozen Section',
    desc: 'Intraoperative rapid diagnosis using frozen tissue sections to guide surgical decisions',
    iconBg: 'bg-blue-50 dark:bg-blue-950/50',
    iconColor: 'text-blue-600 dark:text-blue-400',
    badgeIcon: MedicalIcons.IconSnowflake,
    menuIcon: MedicalIcons.IconSnowflake,
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
    desc: 'Unlisted tissue biopsies and specialized pathology investigations',
    iconBg: 'bg-slate-100 dark:bg-slate-800',
    iconColor: 'text-slate-600 dark:text-slate-300',
    badgeIcon: MoreHorizontal,
    menuIcon: MoreHorizontal,
    tests: [
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
    badgeIcon: CatIcons.IconBiopsySlide,
    menuIcon: CatIcons.IconBiopsySlide,
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
    desc: 'Chemical evaluation of stool pH, reducing substances, and occult blood',
    iconBg: 'bg-yellow-50 dark:bg-yellow-950/50',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    badgeIcon: TestTube,
    menuIcon: TestTube,
    tests: [
      { title: 'Stool pH Test', desc: 'Acidity / alkalinity measurement of stool', badgeText: 'pH', tags: ['pH', 'Acidic'] },
      { title: 'Reducing Substances in Stool', desc: 'Screening for carbohydrate malabsorption (lactose intolerance)', badgeText: 'RED', tags: ['Reducing Sugar', 'Malabsorption'] },
      { title: 'Occult Blood (Chemical)', desc: 'Chemical detection of hidden blood in stool sample', badgeText: 'OB', tags: ['Occult Blood', 'FOBT'] }
    ]
  },
  {
    name: 'Culture & Sensitivity',
    desc: 'Bacterial culture identification and antibiotic sensitivity testing',
    iconBg: 'bg-purple-50 dark:bg-purple-950/50',
    iconColor: 'text-purple-600 dark:text-purple-400',
    badgeIcon: CircleDot,
    menuIcon: CircleDot,
    tests: [
      { title: 'Stool Culture & Sensitivity', desc: 'Isolation of enteric pathogens and drug susceptibility', badgeText: 'CULT', tags: ['Culture', 'Sensitivity', 'Pathogen'] },
      { title: 'Salmonella & Shigella Culture', desc: 'Targeted screening for dysentery and typhoid bacteria', badgeText: 'SALM', tags: ['Salmonella', 'Shigella'] }
    ]
  },
  {
    name: 'Parasitology',
    desc: 'Microscopic identification of protozoa, intestinal parasites, and ova',
    iconBg: 'bg-rose-50 dark:bg-rose-950/50',
    iconColor: 'text-rose-600 dark:text-rose-400',
    badgeIcon: Shield,
    menuIcon: Shield,
    tests: [
      { title: 'Stool Ova & Parasite (O&P) Concentration', desc: 'Concentration method for ova, cysts and trophozoites', badgeText: 'O&P', tags: ['Parasites', 'Ova', 'Cysts'] },
      { title: 'Giardia Lamblia Antigen', desc: 'Immunoassay for Giardia intestinal infection', badgeText: 'GIAR', tags: ['Giardia', 'Protozoa'] },
      { title: 'Entamoeba Histolytica Test', desc: 'Detection of amoebic dysentery parasite', badgeText: 'AMOEBA', tags: ['Entamoeba', 'Amoebiasis'] }
    ]
  },
  {
    name: 'Blood & Occult Blood',
    desc: 'Screening for gastrointestinal bleeding and colorectal lesions',
    iconBg: 'bg-red-50 dark:bg-red-950/50',
    iconColor: 'text-red-600 dark:text-red-400',
    badgeIcon: Droplet,
    menuIcon: Droplet,
    tests: [
      { title: 'Fecal Occult Blood Test (FOBT)', desc: 'Screening test for invisible GI blood loss', badgeText: 'FOBT', tags: ['FOBT', 'Occult Blood'] },
      { title: 'Fecal Immunochemical Test (FIT)', desc: 'Specific human hemoglobin immunoassay', badgeText: 'FIT', tags: ['FIT', 'Colorectal Screening'] }
    ]
  },
  {
    name: 'Calprotectin & Inflammatory Markers',
    desc: 'Biomarkers for Inflammatory Bowel Disease (IBD vs IBS)',
    iconBg: 'bg-blue-50 dark:bg-blue-950/50',
    iconColor: 'text-blue-600 dark:text-blue-400',
    badgeIcon: Activity,
    menuIcon: Activity,
    tests: [
      { title: 'Fecal Calprotectin', desc: 'Differentiates Crohn\'s / Ulcerative Colitis from IBS', badgeText: 'CALPRO', tags: ['Calprotectin', 'IBD', 'Colitis'] },
      { title: 'Fecal Lactoferrin', desc: 'Neutrophil marker for intestinal inflammation', badgeText: 'LACTO', tags: ['Lactoferrin', 'Inflammation'] }
    ]
  },
  {
    name: 'Pancreatic Elastase & Digestive Markers',
    desc: 'Assessment of exocrine pancreatic function and enzyme output',
    iconBg: 'bg-cyan-50 dark:bg-cyan-950/50',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    badgeIcon: MedicalIcons.IconLiver,
    menuIcon: MedicalIcons.IconLiver,
    tests: [
      { title: 'Pancreatic Elastase-1 in Stool', desc: 'Gold standard non-invasive test for pancreatic insufficiency', badgeText: 'PE1', tags: ['Elastase', 'Pancreas', 'Digestion'] }
    ]
  },
  {
    name: 'Fecal Fat & Malabsorption Tests',
    desc: 'Quantification of unabsorbed dietary fat and steatorrhea evaluation',
    iconBg: 'bg-indigo-50 dark:bg-indigo-950/50',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    badgeIcon: Sun,
    menuIcon: Sun,
    tests: [
      { title: 'Fecal Fat Quantitative (72-Hour)', desc: '72-hour collection fat absorption efficiency measurement', badgeText: 'FAT72', tags: ['Fecal Fat', 'Steatorrhea'] },
      { title: 'Fecal Fat Qualitative (Sudan Stain)', desc: 'Rapid microscopic stain screening for fat globules', badgeText: 'SUDAN', tags: ['Sudan Stain', 'Fat Globules'] }
    ]
  },
  {
    name: 'Viral & Antigen Detection',
    desc: 'Rapid immunochromatographic detection of gastroenteritis viruses & H. pylori',
    iconBg: 'bg-teal-50 dark:bg-teal-950/50',
    iconColor: 'text-teal-600 dark:text-teal-400',
    badgeIcon: Flame,
    menuIcon: Flame,
    tests: [
      { title: 'Rotavirus & Adenovirus Antigen', desc: 'Rapid test for viral acute gastroenteritis', badgeText: 'ROTA', tags: ['Rotavirus', 'Gastroenteritis'] },
      { title: 'H. Pylori Stool Antigen Test', desc: 'Non-invasive detection of gastric H. pylori infection', badgeText: 'HPYL', tags: ['H. Pylori', 'Gastric'] }
    ]
  },
  {
    name: 'Others',
    desc: 'Unlisted stool investigations and custom digestive report uploads',
    iconBg: 'bg-slate-100 dark:bg-slate-800',
    iconColor: 'text-slate-600 dark:text-slate-300',
    badgeIcon: MoreHorizontal,
    menuIcon: MoreHorizontal,
    tests: [
      { title: 'Custom / Other Stool Report', desc: 'General unclassified stool investigation summary', badgeText: 'OTHER', tags: ['Stool', 'Custom', 'Other'] }
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
    badgeIcon: CatIcons.IconEndoscope,
    menuIcon: CatIcons.IconEndoscope,
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
    badgeIcon: MedicalIcons.IconColon,
    menuIcon: MedicalIcons.IconColon,
    tests: [
      { title: 'Diagnostic Colonoscopy', desc: 'Examination of the entire colon to identify causes of symptoms like bleeding, pain, or changes in bowel habits.', badgeText: 'COLON', tags: ['Colonoscopy', 'Diagnostic', 'Large Bowel'] },
      { title: 'Polyp Detection & Removal (Polypectomy)', desc: 'Detection and endoscopic removal of polyps to prevent progression to colon cancer.', badgeText: 'POLYP', tags: ['Polyp Removal', 'Polypectomy', 'Colon'] },
      { title: 'Biopsy (Colonic)', desc: 'Tissue sampling from abnormal areas or lesions in the colon for histopathological examination.', badgeText: 'BIOPSY', tags: ['Colonic Biopsy', 'Histopathology'] },
      { title: 'GI Bleed Evaluation', desc: 'Identification of bleeding sources in the colon and management of lower GI bleeding.', badgeText: 'BLEED', tags: ['Lower GI Bleed', 'Hemostasis'] },
      { title: 'Colitis / IBD Evaluation', desc: "Assessment of inflammation, ulcers, and disease activity in conditions like Ulcerative Colitis and Crohn's Disease.", badgeText: 'IBD', tags: ['Colitis', 'IBD', 'Crohns', 'Ulcerative Colitis'] },
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
    badgeIcon: CatIcons.IconEndoscope,
    menuIcon: CatIcons.IconEndoscope,
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
    badgeIcon: CatIcons.IconEndoscope,
    menuIcon: CatIcons.IconEndoscope,
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
    badgeIcon: MedicalIcons.IconCapsule,
    menuIcon: MedicalIcons.IconCapsule,
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
    badgeIcon: MedicalIcons.IconLungs,
    menuIcon: MedicalIcons.IconLungs,
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
    badgeIcon: CatIcons.IconUrineDipstick,
    menuIcon: CatIcons.IconUrineDipstick,
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
    badgeIcon: MedicalIcons.IconScalpel,
    menuIcon: MedicalIcons.IconScalpel,
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
    badgeIcon: CatIcons.IconEndoscope,
    menuIcon: CatIcons.IconEndoscope,
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
    { name: 'Brain', desc: 'Detailed MRI evaluation of the brain', tests: ['MRI Brain – Plain', 'MRI Brain – With Contrast', 'MR Angiography (MRA) Brain', 'MR Venography (MRV) Brain', 'MRI Brain – Functional (fMRI)', 'Diffusion MRI (DWI)', 'MR Spectroscopy (MRS)', 'MRI Pituitary (Sellar Region)', 'MRI IAC (Internal Acoustic Canal)', 'Pediatric Brain MRI'] },
    { name: 'Spine', desc: 'MRI assessment of the spinal column and cord', tests: ['MRI Cervical Spine', 'MRI Thoracic Spine', 'MRI Lumbar Spine'] },
    { name: 'Musculoskeletal', desc: 'MRI of joints, bones and soft tissues', tests: ['MRI Knee', 'MRI Shoulder', 'MRI Hip'] },
    { name: 'Abdomen', desc: 'MRI of abdominal organs and biliary system', tests: ['MRI Abdomen', 'MRCP', 'MRI Liver'] },
    { name: 'Pelvis', desc: 'MRI assessment of pelvic organs', tests: ['MRI Pelvis', 'MRI Prostate', 'MRI Rectum'] },
    { name: 'Cardiac', desc: 'MRI studies of heart structure and function', tests: ['Cardiac MRI', 'Cardiac MR Angiography'] },
    { name: 'Breast', desc: 'Dedicated MRI breast imaging', tests: ['MRI Breast', 'MRI Breast With Contrast'] },
    { name: 'Vascular', desc: 'MR angiography and venography studies', tests: ['MR Angiography', 'MR Venography'] },
    { name: 'Neck', desc: 'MRI of neck soft tissues', tests: ['MRI Neck', 'MRI Soft Tissue Neck'] },
  ],
  ct: [
    { name: 'Head & Brain', desc: 'CT scans of the head and brain for neurological conditions', tests: ['CT Brain (Plain / Non-contrast)', 'CT Brain (Contrast Enhanced)', 'CT Head Injury', 'CT Brain Angiography (CTA)', 'CT Venography (CTV)', 'CT Skull (Bone Windows)', 'CT Temporal Bone', 'CT PNS (Paranasal Sinuses)', 'CT Orbits', 'CT Sellar / Suprasellar Region', 'CT Face'] },
    { name: 'Neck', desc: 'CT scans of the neck and soft tissues', tests: ['CT Neck Plain', 'CT Neck With Contrast'] },
    { name: 'Chest', desc: 'CT imaging of lungs and thoracic structures', tests: ['CT Chest', 'CT Chest With Contrast'] },
    { name: 'Abdomen', desc: 'CT imaging of abdominal organs', tests: ['CT Abdomen Plain', 'CT Abdomen With Contrast'] },
    { name: 'Pelvis', desc: 'CT imaging of the pelvic region', tests: ['CT Pelvis', 'CT KUB'] },
    { name: 'Spine', desc: 'CT scans of cervical, thoracic and lumbar spine', tests: ['CT Cervical Spine', 'CT Thoracic Spine', 'CT Lumbar Spine'] },
    { name: 'Musculoskeletal', desc: 'CT imaging of bones and joints', tests: ['CT Knee', 'CT Shoulder', 'CT Hip'] },
    { name: 'Angiography (CT Angio)', desc: 'CT angiography of arteries and veins', tests: ['CT Coronary Angiography', 'CT Pulmonary Angiography', 'CT Aortic Angiography'] },
    { name: 'Dental / Maxillofacial', desc: 'CT scans of the dental and facial regions', tests: ['CT Maxillofacial', 'CT Dental'] },
    { name: 'HRCT (High Resolution CT)', desc: 'High-resolution CT for detailed lung assessment', tests: ['HRCT Chest', 'HRCT Temporal Bone'] },
  ],
  ecg: [
    { name: 'Basic ECG', desc: 'Resting electrocardiogram studies', tests: ['Resting 12-Lead ECG', 'Rhythm Strip ECG'] },
    { name: 'Advanced ECG', desc: 'Advanced electrocardiographic analysis', tests: ['Signal Averaged ECG', 'Vector Cardiography'] },
    { name: 'Holter Monitoring', desc: 'Continuous ECG monitoring for intermittent cardiac abnormalities', tests: ['24 Hour Holter Monitoring', '48 Hour Holter Monitoring', '7 Day Holter Monitoring', 'Event Triggered Holter Monitoring', 'Night-time Holter Monitoring', 'Arrhythmia Detection (24–48h)', 'ST Segment Analysis', 'PVC / PAC Burden Analysis', 'Heart Rate Variability (HRV)', 'Holter Report (Interpretation)'] },
    { name: 'Stress / Exercise Test', desc: 'Cardiac assessment during exertion', tests: ['Treadmill Test (TMT)', 'Stress ECG'] },
    { name: 'Ambulatory BP Monitoring', desc: 'Blood-pressure monitoring over daily activity', tests: ['24 Hour ABPM', 'Daytime / Night-time BP Analysis'] },
    { name: 'Echocardiography (Echo)', desc: 'Ultrasound assessment of cardiac structure and function', tests: ['2D Echocardiography', '3D Echocardiography'] },
    { name: 'Doppler / Color Doppler', desc: 'Doppler assessment of cardiac blood flow', tests: ['Color Doppler Echo', 'Tissue Doppler Imaging'] },
    { name: 'Transesophageal Echo (TEE)', desc: 'Detailed transesophageal cardiac imaging', tests: ['TEE', 'TEE With Doppler'] },
    { name: 'Fetal Echocardiography', desc: 'Prenatal assessment of fetal cardiac anatomy', tests: ['Fetal Echocardiography', 'Fetal Doppler Study'] },
  ],
  endoscopy: [
    { name: 'Upper GI Endoscopy (OGD)', desc: 'Endoscopic examination of the upper gastrointestinal tract', tests: ['Diagnostic Upper GI Endoscopy', 'Upper GI Endoscopy With Biopsy'] },
    { name: 'Colonoscopy', desc: 'Endoscopic examination of the large intestine', tests: ['Diagnostic Colonoscopy', 'Colonoscopy With Biopsy'] },
    { name: 'Sigmoidoscopy', desc: 'Endoscopic examination of sigmoid colon and rectum', tests: ['Flexible Sigmoidoscopy', 'Sigmoidoscopy With Biopsy'] },
    { name: 'ERCP', desc: 'Endoscopic imaging and treatment of bile and pancreatic ducts', tests: ['Diagnostic ERCP', 'Therapeutic ERCP'] },
    { name: 'Capsule Endoscopy', desc: 'Capsule-based imaging of the small bowel', tests: ['Small Bowel Capsule Endoscopy', 'Capsule Endoscopy Report'] },
    { name: 'Bronchoscopy', desc: 'Endoscopic examination of the airways', tests: ['Diagnostic Bronchoscopy', 'Bronchoscopy With Biopsy'] },
    { name: 'Cystoscopy', desc: 'Endoscopic examination of bladder and urethra', tests: ['Diagnostic Cystoscopy', 'Cystoscopy With Biopsy'] },
    { name: 'Laparoscopy', desc: 'Minimally invasive abdominal and pelvic examination', tests: ['Diagnostic Laparoscopy', 'Laparoscopic Biopsy'] },
    { name: 'ENT Endoscopy', desc: 'Endoscopic examination of ear, nose and throat structures', tests: ['Nasal Endoscopy', 'Laryngeal Endoscopy', 'Otoscopy', 'Pharyngoscopy', 'Sinus Endoscopy', 'Foreign Body Removal', 'Biopsy', 'Balloon Sinuplasty', 'Therapeutic Endoscopy', 'ENT Endoscopy Report (Interpretation)'] },
  ],
  genetic: [
    { name: 'Carrier Screening', desc: 'Genetic screening for inherited conditions', tests: ['Expanded Carrier Screening', 'Single Gene Carrier Test'] },
    { name: 'Pharmacogenomics', desc: 'Genetic testing to guide medicine selection and dosage', tests: ['Pharmacogenomic Panel', 'Drug Response Genetic Test'] },
    { name: 'Oncology / Cancer Genetics', desc: 'Genetic testing for inherited cancer risk', tests: ['Hereditary Cancer Panel', 'BRCA 1 & 2 Gene Testing'] },
    { name: 'Prenatal & Reproductive Genetics', desc: 'Genetic testing for pregnancy and reproductive health', tests: ['NIPT', 'Preimplantation Genetic Testing'] },
    { name: 'Cardiovascular Genetics', desc: 'Genetic assessment of inherited cardiac disease', tests: ['Cardiomyopathy Genetic Panel', 'Arrhythmia Genetic Panel'] },
    { name: 'Neurology Genetics', desc: 'Genetic tests for neurological disorders', tests: ['Neurology Genetic Panel', 'Neurodegenerative Disease Panel'] },
    { name: 'Metabolic Genetics', desc: 'Genetic tests for inherited metabolic conditions', tests: ['Metabolic Disorder Panel', 'Newborn Metabolic Genetics'] },
    { name: 'Infectious Disease Genetics', desc: 'Host genetics and pathogen genomic tests', tests: ['Infectious Disease Genetic Panel', 'Pathogen Sequencing'] },
    { name: 'Nutrigenomics', desc: 'Genetic insights into diet and nutrient metabolism', tests: ['Nutrigenomics Profile', 'Vitamin & Mineral Predisposition'] },
    { name: 'Wellness & Ancestry Genetics', desc: 'Genetic insights for wellness, traits and ancestry', tests: ['Health Risk Assessment', 'Nutrigenomics Profile', 'Fitness & Performance Genetic Test', 'Skin & Hair Genetic Test', 'Sleep & Stress Genetics', 'Vitamin & Mineral Predisposition', 'Detoxification & Toxicity Genetic Test', 'Longevity & Healthy Aging Test', 'Ancestry & Ethnicity Analysis', 'Trait & Personality Genetics'] },
  ],
  checkup: [
    { name: 'General Health Checkup', desc: 'Comprehensive preventive health assessment', tests: ['Basic Health Checkup', 'Comprehensive Health Checkup'] },
    { name: 'Cardiac Health Checkup', desc: 'Preventive screening for cardiovascular health', tests: ['Cardiac Risk Checkup', 'Executive Cardiac Checkup'] },
    { name: 'Diabetic Checkup', desc: 'Diabetes screening and monitoring package', tests: ['Diabetes Checkup', 'HbA1c Monitoring Package'] },
    { name: "Women's Health Checkup", desc: 'Preventive screening for women’s health', tests: ["Women's Wellness Checkup", 'Breast & Cervical Screening'] },
    { name: "Men's Health Checkup", desc: 'Preventive screening for men’s health', tests: ["Men's Wellness Checkup", 'Prostate Health Checkup'] },
    { name: 'Thyroid Checkup', desc: 'Thyroid function and related health screening', tests: ['Thyroid Profile Checkup', 'Comprehensive Thyroid Checkup'] },
    { name: 'Liver Health Checkup', desc: 'Liver function and metabolic health screening', tests: ['Liver Health Checkup', 'Fatty Liver Screening'] },
    { name: 'Kidney Health Checkup', desc: 'Kidney function and renal health screening', tests: ['Kidney Health Checkup', 'Renal Risk Screening'] },
    { name: 'Bone & Joint Checkup', desc: 'Bone mineral and musculoskeletal health screening', tests: ['Bone Health Checkup', 'Arthritis Risk Checkup'] },
    { name: 'Senior Citizen Checkup', desc: 'Comprehensive health assessment for older adults', tests: ['Senior Citizen Basic Checkup', 'Senior Citizen Comprehensive Checkup'] },
    { name: 'Child Health Checkup', desc: 'Comprehensive child health and development assessment', tests: ['Growth & Development Assessment', 'Nutrition Assessment', 'Complete Blood Count (CBC)', 'Iron Profile', 'Vitamin D Test', 'Calcium Test', 'Lead Level Test', 'Thyroid Function Test (TSH)', 'Vision Screening', 'Hearing Screening', 'Immunization Status Check'] },
    { name: 'Pre-Employment Checkup', desc: 'Medical fitness evaluation for employment', tests: ['Pre-Employment Basic Checkup', 'Pre-Employment Comprehensive Checkup'] },
  ],
};

function makeCategorySubcategories(catId: string): SubCategoryItem[] {
  const catObj = MAIN_CATEGORIES.find((category) => category.id === catId) || MAIN_CATEGORIES[0];
  const blueprints = CATEGORY_BLUEPRINTS[catId] || [];
  // Reference groups occasionally use either “Other …” or “Others”. Keep the
  // first definition only, so a category can never display duplicate catch-alls.
  const uniqueBlueprints = blueprints.filter(
    (blueprint, index) => blueprints.findIndex((candidate) => candidate.name.toLowerCase() === blueprint.name.toLowerCase()) === index,
  );
  const subcategories = [
    ...uniqueBlueprints.map((blueprint) => ({
      ...blueprint,
      iconBg: catObj.iconBg,
      iconColor: catObj.iconColor,
      badgeIcon: catObj.icon,
      menuIcon: catObj.icon,
      tests: blueprint.tests.map((title) => ({ title, desc: `${title} diagnostic report`, badgeText: title.split(/\s|\(/)[0].slice(0, 8).toUpperCase(), tags: [catObj.name, blueprint.name, title] })),
    })),
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

// Complete category data for every report type in the reference picker.
function getCategorySubData(catId: string): SubCategoryItem[] {
  if (catId === 'blood') return BLOOD_TEST_SUBCATEGORIES;
  if (catId === 'pathology') return PATHOLOGY_SUBCATEGORIES;
  if (catId === 'stool') return STOOL_TEST_SUBCATEGORIES;
  if (catId === 'endoscopy') return ENDOSCOPY_SUBCATEGORIES;

  return makeCategorySubcategories(catId);
}

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

  const HeaderIcon = activeSubCat.badgeIcon || Activity;

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

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-5">
          
          {/* STEP 1: Choose Main Category Horizontal Row matching UI reference */}
          <div className="space-y-2.5">
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
                    className={`relative flex h-[104px] w-[132px] shrink-0 snap-start flex-col items-center justify-center py-2.5 px-2 rounded-xl border transition-all duration-200 select-none ${
                      isActive
                        ? `${cat.iconBg} ${cat.textColor} border-current ring-2 ring-current/20 shadow-xs font-bold scale-[1.02]`
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 hover:bg-slate-50/80 font-medium'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1.5 transition-colors ${
                      isActive ? 'bg-white dark:bg-slate-800 shadow-2xs ' + cat.iconColor : cat.color
                    }`}>
                      <IconComponent className="w-4 h-4 stroke-[2]" />
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
          <div className="space-y-3 pt-2 border-t border-slate-200/80 dark:border-slate-800">
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
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start pt-1">
              
              {/* Left Subcategory Vertical List with individual colorful icons */}
              <div className="md:col-span-3 lg:col-span-3 xl:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-1.5 space-y-0.5 shadow-2xs max-h-[300px] md:max-h-[540px] overflow-y-auto overscroll-contain">
                {subCategoriesList.map((sub, idx) => {
                  const isActive = selectedSubCatIndex === idx;
                  const MenuIcon = sub.menuIcon || Activity;
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
                        <MenuIcon className={`w-3.5 h-3.5 shrink-0 ${sub.iconColor}`} />
                        {sub.name}
                      </span>
                      <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${isActive ? `${sub.iconColor} translate-x-0.5` : 'text-slate-400'}`} />
                    </button>
                  );
                })}
              </div>

              {/* Right Cards Area */}
              <div className="md:col-span-9 lg:col-span-9 xl:col-span-10 space-y-3">
                
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
